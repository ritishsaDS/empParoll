import React, { useMemo, useState } from "react";
import Toast from "../components/Toast.jsx";
import { api } from "../api.js";

function monthName(m) {
  const d = new Date(2020, m - 1, 1);
  return d.toLocaleString(undefined, { month: "long" });
}
function money(n) {
  const num = Number(n || 0);
  return num.toLocaleString(undefined, {
    maximumFractionDigits: 2,
    minimumFractionDigits: 2,
  });
}

function kpi(label, value) {
  return (
    <div className="pro-kpi">
      <div className="pro-kpi-label">{label}</div>
      <div className="pro-kpi-value">{value}</div>
    </div>
  );
}

export default function PayrollPage() {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth() + 1);
  const [year, setYear] = useState(now.getFullYear());

  const [running, setRunning] = useState(false);
  const [run, setRun] = useState(null);
  const [items, setItems] = useState([]);
  const [toast, setToast] = useState("");

  async function runPayroll() {
    setRunning(true);
    try {
      const { data } = await api.post("/payroll/run", { month, year });
      setRun(data.run);
      setItems(Array.isArray(data.items) ? data.items : []);
      setToast(`Payroll generated for ${monthName(month)} ${year}`);
    } catch (e) {
      setToast(e?.response?.data?.error || "Failed to run payroll");
    } finally {
      setRunning(false);
    }
  }

  const totals = useMemo(() => {
    return items.reduce(
      (acc, r) => ({
        gross: acc.gross + Number(r.gross || 0),
        deductions: acc.deductions + Number(r.deductions || 0),
        net: acc.net + Number(r.net || 0),
      }),
      { gross: 0, deductions: 0, net: 0 }
    );
  }, [items]);

  const titleRun = run ? `${monthName(run.month)} ${run.year}` : `${monthName(month)} ${year}`;

  return (
    <div className="card pro-page">
      {/* Header */}
      <div className="pro-header">
        <div className="pro-title-wrap">
          <div className="pro-title-row">
            <div className="pro-badge">🧾</div>
            <div>
              <div className="pro-title">Run Payroll</div>
              <div className="pro-subtitle">
                Calculate salary, deductions and net pay for all employees.
              </div>
            </div>
          </div>
        </div>

        <div className="pro-actions">
          <div className="pro-controls">
            <select
              className="input pro-select"
              value={month}
              onChange={(e) => setMonth(Number(e.target.value))}
            >
              {Array.from({ length: 12 }).map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {monthName(i + 1)}
                </option>
              ))}
            </select>

            <input
              className="input pro-year"
              type="number"
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
            />

            <button
              type="button"
              className="btn pro-primary"
              onClick={runPayroll}
              disabled={running}
            >
              {running ? "Running..." : "Run Payroll"}
            </button>
          </div>
        </div>
      </div>

      <div style={{ height: 14 }} />

      {/* KPI Totals */}
      {run ? (
        <div className="pro-kpi-wrap">
          <div className="pro-kpi-card">
            <div className="pro-kpi-head">
              <div className="pro-kpi-title">Payroll Totals</div>
              <div className="pro-kpi-chip">{titleRun}</div>
            </div>

            <div className="pro-kpi-grid">
              {kpi("Gross", money(totals.gross))}
              {kpi("Deductions", money(totals.deductions))}
              {kpi("Net Pay", money(totals.net))}
            </div>

            <div className="pro-tip">
              Tip: Go to <b>Reports</b> to export CSV for this payroll run.
            </div>
          </div>
        </div>
      ) : (
        <div className="pro-empty">
          <div className="pro-empty-icon">⚡</div>
          <div className="pro-empty-title">Ready to generate payroll</div>
          <div className="pro-empty-text">
            Select month and year, then click <b>Run Payroll</b>.
          </div>
        </div>
      )}

      <div style={{ height: 14 }} />

      {/* Table */}
      {items.length === 0 ? (
        <div className="pro-empty">
          <div className="pro-empty-icon">📊</div>
          <div className="pro-empty-title">No payroll results yet</div>
          <div className="pro-empty-text">
            Run payroll to see employee-wise salary breakdown.
          </div>
        </div>
      ) : (
        <div className="pro-table-wrap">
          <table className="pro-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th className="t-right">Base</th>
                <th className="t-right">HRA</th>
                <th className="t-right">DA</th>
                <th className="t-right">Gross</th>
                <th className="t-right">Tax</th>
                <th className="t-right">PF</th>
                <th className="t-right">Other</th>
                <th className="t-right">Deductions</th>
                <th className="t-right">Net</th>
              </tr>
            </thead>

            <tbody>
              {items.map((r, idx) => (
                <tr key={r._id || r.employeeId || idx}>
                  <td>
                    <div className="pro-emp">
                      <div className="pro-avatar">
                        {(r.name || "?").slice(0, 1).toUpperCase()}
                      </div>
                      <div>
                        <div className="pro-emp-name">{r.name}</div>
                        <div className="pro-emp-email">{r.designation || "—"}</div>
                      </div>
                    </div>
                  </td>

                  <td>{r.department || "—"}</td>

                  <td className="t-right">{money(r.breakdown?.base)}</td>
                  <td className="t-right">{money(r.breakdown?.hra)}</td>
                  <td className="t-right">{money(r.breakdown?.da)}</td>

                  <td className="t-right" style={{ fontWeight: 900 }}>
                    {money(r.gross)}
                  </td>

                  <td className="t-right">{money(r.breakdown?.tax)}</td>
                  <td className="t-right">{money(r.breakdown?.pf)}</td>
                  <td className="t-right">{money(r.breakdown?.other)}</td>

                  <td className="t-right">{money(r.deductions)}</td>
                  <td className="t-right" style={{ fontWeight: 900 }}>
                    {money(r.net)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Toast message={toast} onClose={() => setToast("")} />
    </div>
  );
}
