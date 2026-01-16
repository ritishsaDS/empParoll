import express from "express";
import cors from "cors";
import { stringify } from "csv-stringify/sync";
import { connectDB } from "./db.js";
import { employeeSchema, payrollRunSchema } from "./validators.js";
import { calcPayrollForEmployee } from "./payroll.js";
import { ENV } from "./config/env.js";

import Employee from "./models/Employee.js";
import PayrollRun from "./models/PayrollRun.js";
import PayrollItem from "./models/PayrollItem.js";

await connectDB();

const app = express();
const allowedOrigins = [
  ENV.CORS_ORIGIN,
  "http://localhost:4000",
  "http://127.0.0.1:5173",
];
app.use(cors({
  origin: true, // ✅ reflect request origin
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

app.options("*", cors());
app.use(express.json());

// Health
app.get("/api/health", (req, res) => res.json({ ok: true }));

// ============================
// Employees CRUD (Mongo)
// ============================
app.get("/api/employees", async (req, res) => {
  const rows = await Employee.find().sort({ createdAt: -1 });
  res.json(rows);
});

app.post("/api/employees", async (req, res) => {
  const parsed = employeeSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const created = await Employee.create(parsed.data);
  res.status(201).json(created);
});

app.put("/api/employees/:id", async (req, res) => {
  const parsed = employeeSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const updated = await Employee.findByIdAndUpdate(req.params.id, parsed.data, { new: true });
  if (!updated) return res.status(404).json({ error: "Employee not found" });
  res.json(updated);
});

app.delete("/api/employees/:id", async (req, res) => {
  const deleted = await Employee.findByIdAndDelete(req.params.id);
  if (!deleted) return res.status(404).json({ error: "Employee not found" });
  res.json({ ok: true });
});

// ============================
// Payroll run (monthly) (Mongo)
// ============================
app.post("/api/payroll/run", async (req, res) => {
  const parsed = payrollRunSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.flatten() });

  const { month, year } = parsed.data;

  const employees = await Employee.find().sort({ createdAt: 1 });
  if (employees.length === 0) return res.status(400).json({ error: "No employees found. Add employees first." });

  // Find or create run
  let run = await PayrollRun.findOne({ month, year });
  if (!run) {
    run = await PayrollRun.create({ month, year });
  } else {
    // Re-run: clear old items
    await PayrollItem.deleteMany({ runId: run._id });
  }

  // Insert payroll items
  const itemsToInsert = employees.map((emp) => {
    const calc = calcPayrollForEmployee(emp);
    return {
      runId: run._id,
      employeeId: emp._id,
      gross: calc.gross,
      deductions: calc.deductions,
      net: calc.net,
      breakdown: calc.breakdown,
    };
  });

  await PayrollItem.insertMany(itemsToInsert);

  // Fetch items with employee details (like your JOIN)
  const items = await PayrollItem.find({ runId: run._id })
    .populate("employeeId")
    .sort({ "employeeId.name": 1 });

  // Shape response similar to old one
  const shaped = items.map((i) => ({
    _id: i._id,
    runId: i.runId,
    employeeId: i.employeeId?._id,
    gross: i.gross,
    deductions: i.deductions,
    net: i.net,
    breakdown: i.breakdown,
    name: i.employeeId?.name,
    department: i.employeeId?.department,
    designation: i.employeeId?.designation,
    email: i.employeeId?.email,
  }));

  res.json({ run, items: shaped });
});

app.get("/api/payroll/runs", async (req, res) => {
  const runs = await PayrollRun.find().sort({ year: -1, month: -1, createdAt: -1 });
  res.json(runs);
});

app.get("/api/payroll/runs/:id", async (req, res) => {
  const run = await PayrollRun.findById(req.params.id);
  if (!run) return res.status(404).json({ error: "Run not found" });

  const items = await PayrollItem.find({ runId: run._id })
    .populate("employeeId")
    .sort({ "employeeId.name": 1 });

  const shaped = items.map((i) => ({
    _id: i._id,
    runId: i.runId,
    employeeId: i.employeeId?._id,
    gross: i.gross,
    deductions: i.deductions,
    net: i.net,
    breakdown: i.breakdown,
    name: i.employeeId?.name,
    department: i.employeeId?.department,
    designation: i.employeeId?.designation,
    email: i.employeeId?.email,
  }));

  res.json({ run, items: shaped });
});

// ============================
// Reports (Mongo)
// ============================
app.get("/api/reports/summary", async (req, res) => {
  const month = Number(req.query.month);
  const year = Number(req.query.year);
  if (!month || !year) return res.status(400).json({ error: "month and year are required" });

  const run = await PayrollRun.findOne({ month, year });
  if (!run) return res.status(404).json({ error: "Payroll run not found for month/year" });

  const byDepartment = await PayrollItem.aggregate([
    { $match: { runId: run._id } },
    { $lookup: { from: "employees", localField: "employeeId", foreignField: "_id", as: "emp" } },
    { $unwind: "$emp" },
    {
      $group: {
        _id: { $ifNull: ["$emp.department", "Unassigned"] },
        employeeCount: { $sum: 1 },
        totalGross: { $sum: "$gross" },
        totalDeductions: { $sum: "$deductions" },
        totalNet: { $sum: "$net" },
      },
    },
    {
      $project: {
        _id: 0,
        department: "$_id",
        employeeCount: 1,
        totalGross: 1,
        totalDeductions: 1,
        totalNet: 1,
      },
    },
    { $sort: { totalNet: -1 } },
  ]);

  const totalsAgg = await PayrollItem.aggregate([
    { $match: { runId: run._id } },
    {
      $group: {
        _id: null,
        employeeCount: { $sum: 1 },
        totalGross: { $sum: "$gross" },
        totalDeductions: { $sum: "$deductions" },
        totalNet: { $sum: "$net" },
      },
    },
  ]);

  const totals = totalsAgg[0] || { employeeCount: 0, totalGross: 0, totalDeductions: 0, totalNet: 0 };

  res.json({ run, totals, byDepartment });
});

app.get("/api/reports/run/:id.csv", async (req, res) => {
  const run = await PayrollRun.findById(req.params.id);
  if (!run) return res.status(404).json({ error: "Run not found" });

  const items = await PayrollItem.find({ runId: run._id })
    .populate("employeeId")
    .sort({ "employeeId.name": 1 });

  const records = items.map((i) => {
    const e = i.employeeId;
    const b = i.breakdown || {};
    return {
      employeeId: e?._id?.toString() || "",
      name: e?.name || "",
      email: e?.email || "",
      department: e?.department || "",
      designation: e?.designation || "",
      base: b.base ?? 0,
      hra: b.hra ?? 0,
      da: b.da ?? 0,
      gross: i.gross,
      tax: b.tax ?? 0,
      pf: b.pf ?? 0,
      other: b.other ?? 0,
      deductions: i.deductions,
      net: i.net,
      month: run.month,
      year: run.year,
    };
  });

  const csv = stringify(records, { header: true });
  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", `attachment; filename="payroll_${run.year}_${String(run.month).padStart(2, "0")}.csv"`);
  res.send(csv);
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Payroll server running on http://localhost:${PORT}`));
