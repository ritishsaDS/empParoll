import React, { useEffect, useMemo, useState } from "react";
import Modal from "../components/Modal.jsx";
import Toast from "../components/Toast.jsx";
import { api } from "../api.js";

/**
 * EmployeesPage.jsx (MongoDB-ready)
 * - Uses emp._id
 * - No focus loss (Field outside component)
 * - Professional UI (header, stats, search, table hover, empty/loading states)
 */

// Keep numeric inputs as strings while typing
const emptyEmployee = {
  name: "",
  email: "",
  department: "",
  designation: "",
  baseSalary: "",
  hraPercent: "",
  daPercent: "",
  taxPercent: "",
  pfPercent: "",
  otherDeduction: "",
};

function money(n) {
  const num = Number(n || 0);
  return num.toLocaleString(undefined, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}

// Field must be outside component (stable identity → no remount/focus jump)
const Field = React.memo(function Field({
  label,
  name,
  type = "text",
  step,
  min,
  max,
  placeholder,
  form,
  setForm,
}) {
  const value = form?.[name] ?? "";

  return (
    <label className="grid2 gap-2">
      <span className="text-sm text-white/70">{label}</span>

      <input
        className="input"
        name={name}
        placeholder={placeholder}
        type={type}
        step={step}
        min={min}
        max={max}
        value={value}
        onChange={(e) =>
          setForm((prev) => ({
            ...prev,
            [name]: e.target.value,
          }))
        }
      />
    </label>
  );
});

export default function EmployeesPage() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(false);
  const [q, setQ] = useState("");
  const [toast, setToast] = useState("");

  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ ...emptyEmployee });
  const [saving, setSaving] = useState(false);

  async function load() {
    setLoading(true);
    try {
      const { data } = await api.get("/employees");
      setEmployees(Array.isArray(data) ? data : []);
    } catch (e) {
      setToast(
        e?.response?.data?.error?.message ||
          e?.response?.data?.error ||
          "Failed to load employees"
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    if (!s) return employees;
    return employees.filter((e) =>
      [e.name, e.email, e.department, e.designation]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(s))
    );
  }, [employees, q]);

  function openCreate() {
    setEditing(null);
    setForm({ ...emptyEmployee });
    setOpen(true);
  }

  function openEdit(emp) {
    setEditing(emp);
    setForm({
      name: emp.name || "",
      email: emp.email || "",
      department: emp.department || "",
      designation: emp.designation || "",
      baseSalary: emp.baseSalary != null ? String(emp.baseSalary) : "",
      hraPercent: emp.hraPercent != null ? String(emp.hraPercent) : "",
      daPercent: emp.daPercent != null ? String(emp.daPercent) : "",
      taxPercent: emp.taxPercent != null ? String(emp.taxPercent) : "",
      pfPercent: emp.pfPercent != null ? String(emp.pfPercent) : "",
      otherDeduction:
        emp.otherDeduction != null ? String(emp.otherDeduction) : "",
    });
    setOpen(true);
  }

  async function save() {
    if (!form.name.trim()) {
      setToast("Name is required");
      return;
    }

    const payload = {
      ...form,
      baseSalary: Number(form.baseSalary || 0),
      hraPercent: Number(form.hraPercent || 0),
      daPercent: Number(form.daPercent || 0),
      taxPercent: Number(form.taxPercent || 0),
      pfPercent: Number(form.pfPercent || 0),
      otherDeduction: Number(form.otherDeduction || 0),
    };

    setSaving(true);
    try {
      if (editing?._id) {
        await api.put(`/employees/${editing._id}`, payload);
        setToast("Employee updated");
      } else {
        await api.post("/employees", payload);
        setToast("Employee added");
      }
      setOpen(false);
      await load();
    } catch (e) {
      const msg =
        e?.response?.data?.error?.fieldErrors
          ? "Validation failed. Check values."
          : e?.response?.data?.error || "Save failed";
      setToast(typeof msg === "string" ? msg : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function remove(emp) {
    if (!confirm(`Delete ${emp.name}?`)) return;
    try {
      await api.delete(`/employees/${emp._id}`);
      setToast("Deleted");
      await load();
    } catch {
      setToast("Delete failed");
    }
  }

  return (
    <div className="card pro-page">
      {/* Header */}
      <div className="pro-header">
        <div className="pro-title-wrap">
          <div className="pro-title-row">
            <div className="pro-badge">👥</div>
            <div>
              <div className="pro-title">Employees</div>
              <div className="pro-subtitle">
                Manage employees and salary rules in one place.
              </div>
            </div>
          </div>

          <div className="pro-stats">
            <div className="pro-stat">
              <div className="pro-stat-label">Total Employees</div>
              <div className="pro-stat-value">{employees.length}</div>
            </div>
          
          </div>
        </div>

        <div className="pro-actions">
          <div className="pro-search">
            <span className="pro-search-icon">🔎</span>
            <input
              className="input pro-search-input"
              placeholder="Search by name, email, department..."
              value={q}
              onChange={(e) => setQ(e.target.value)}
            />
          </div>

          <button type="button" className="btn pro-primary" onClick={openCreate}>
            + Add Employee
          </button>
        </div>
      </div>

      <div style={{ height: 14 }} />

      {/* Content */}
      {loading ? (
        <div className="pro-empty">
          <div className="pro-empty-icon">⏳</div>
          <div className="pro-empty-title">Loading employees…</div>
          <div className="pro-empty-text">
            Please wait while we fetch the latest records.
          </div>
        </div>
      ) : filtered.length === 0 ? (
        <div className="pro-empty">
          <div className="pro-empty-icon">📭</div>
          <div className="pro-empty-title">No employees found</div>
          <div className="pro-empty-text">
            Try a different keyword or add your first employee to get started.
          </div>
          <div style={{ height: 10 }} />
          <button type="button" className="btn pro-primary" onClick={openCreate}>
            + Add Employee
          </button>
        </div>
      ) : (
        <div className="pro-table-wrap">
          <table className="pro-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Designation</th>
                <th className="t-right">Base</th>
                <th className="t-right">HRA%</th>
                <th className="t-right">DA%</th>
                <th className="t-right">Tax%</th>
                <th className="t-right">PF%</th>
                <th className="t-right">Other</th>
                <th className="t-right">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filtered.map((emp) => (
                <tr key={emp._id}>
                  <td>
                    <div className="pro-emp">
                      <div className="pro-avatar">
                        {(emp.name || "?").slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <div className="pro-emp-name">{emp.name}</div>
                        <div className="pro-emp-email">{emp.email || "—"}</div>
                      </div>
                    </div>
                  </td>

                  <td>{emp.department || "—"}</td>
                  <td>{emp.designation || "—"}</td>

                  <td className="t-right">{money(emp.baseSalary)}</td>
                  <td className="t-right">{emp.hraPercent ?? 0}</td>
                  <td className="t-right">{emp.daPercent ?? 0}</td>
                  <td className="t-right">{emp.taxPercent ?? 0}</td>
                  <td className="t-right">{emp.pfPercent ?? 0}</td>
                  <td className="t-right">{money(emp.otherDeduction)}</td>

                  <td className="t-right">
                    <div className="pro-row-actions">
                      <button
                        type="button"
                        className="btn secondary"
                        onClick={() => openEdit(emp)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="btn danger"
                        onClick={() => remove(emp)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
<div style={{ height: 14 }} />
      {/* Modal */}
      {open ? (
        <Modal
          title={editing ? "Edit Employee" : "Add Employee"}
          subtitle="Enter employee details. Salary fields affect payroll calculations."
          onClose={() => setOpen(false)}
        >
         

          <div className="grid2">
            <Field label="Name *" name="name" form={form} setForm={setForm} />
            <Field label="Email" name="email" form={form} setForm={setForm} />
            <Field
              label="Department"
              name="department"
              form={form}
              setForm={setForm}
            />
            <Field
              label="Designation"
              name="designation"
              form={form}
              setForm={setForm}
            />
            <Field
              label="Base Salary"
              name="baseSalary"
              type="number"
              step="0.01"
              min="0"
              form={form}
              setForm={setForm}
            />
            <Field
              label="HRA (%)"
              name="hraPercent"
              type="number"
              step="0.01"
              min="0"
              max="100"
              form={form}
              setForm={setForm}
            />
            <Field
              label="DA (%)"
              name="daPercent"
              type="number"
              step="0.01"
              min="0"
              max="100"
              form={form}
              setForm={setForm}
            />
            <Field
              label="Tax (%)"
              name="taxPercent"
              type="number"
              step="0.01"
              min="0"
              max="100"
              form={form}
              setForm={setForm}
            />
            <Field
              label="PF (%)"
              name="pfPercent"
              type="number"
              step="0.01"
              min="0"
              max="100"
              form={form}
              setForm={setForm}
            />
            <Field
              label="Other Deduction (flat)"
              name="otherDeduction"
              type="number"
              step="0.01"
              min="0"
              form={form}
              setForm={setForm}
            />
          </div>

          <div style={{ height: 14 }} />

          <div className="row" style={{ justifyContent: "flex-end", gap: 10 }}>
            <button
              type="button"
              className="btn secondary"
              onClick={() => setOpen(false)}
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn pro-primary"
              onClick={save}
              disabled={saving}
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </Modal>
      ) : null}

      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
