
import mongoose from "mongoose";

const payrollItemSchema = new mongoose.Schema(
  {
    runId: { type: mongoose.Schema.Types.ObjectId, ref: "PayrollRun", required: true, index: true },
    employeeId: { type: mongoose.Schema.Types.ObjectId, ref: "Employee", required: true, index: true },

    gross: { type: Number, required: true },
    deductions: { type: Number, required: true },
    net: { type: Number, required: true },

    breakdown: {
      base: Number,
      hra: Number,
      da: Number,
      tax: Number,
      pf: Number,
      other: Number,
    },
  },
  { timestamps: true }
);

payrollItemSchema.index({ runId: 1, employeeId: 1 }, { unique: true });

export default mongoose.model("PayrollItem", payrollItemSchema);
