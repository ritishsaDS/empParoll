import React, { useEffect, useState } from "react";
import Toast from "../components/Toast.jsx";
import { api, API_BASE_URL, getToken } from "../api.js";

function monthName(m){
  const d = new Date(2020, m-1, 1);
  return d.toLocaleString(undefined, { month: "long" });
}
function money(n){
  const num = Number(n || 0);
  return num.toLocaleString(undefined, { maximumFractionDigits: 2, minimumFractionDigits: 2 });
}

async function downloadCsv(runId) {
  const token = getToken();
  const url = `${API_BASE_URL}/api/reports/run/${runId}.csv`;

  const res = await fetch(url, {
    headers: {
      Authorization: `Bearer ${token}`, // ✅ required (protected API)
    },
  });

  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || "CSV download failed");
  }

  const blob = await res.blob();
  const a = document.createElement("a");
  a.href = URL.createObjectURL(blob);
  a.download = `payroll_report_${runId}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(a.href);
}

export default function ReportsPage(){
  const [runs, setRuns] = useState([]);
  const [selectedRunId, setSelectedRunId] = useState("");
  const [summary, setSummary] = useState(null);
  const [toast, setToast] = useState("");

  const selectedRun = runs.find(r => r._id === selectedRunId) || null;

  async function loadRuns(){
    try{
      const { data } = await api.get("/payroll/runs");
      setRuns(data);
      if (data.length) setSelectedRunId(data[0]._id); // ✅ Mongo id
    }catch{
      setToast("Failed to load runs");
    }
  }

  async function loadSummary(run){
    if(!run) return;
    try{
      const { data } = await api.get(`/reports/summary?month=${run.month}&year=${run.year}`);
      setSummary(data);
    }catch(e){
      setSummary(null);
      setToast(e?.response?.data?.error || "Failed to load summary");
    }
  }

  useEffect(()=>{ loadRuns(); }, []);
  useEffect(()=>{ if(selectedRun) loadSummary(selectedRun); }, [selectedRunId]);

  return (
    <div className="card">
      <div className="row" style={{justifyContent:"space-between", alignItems:"center"}}>
        <div>
          <div style={{fontSize:22, fontWeight:900}}>Reports</div>
          <small className="muted">Department breakdown + export CSV for payroll runs.</small>
        </div>

        <div className="row" style={{alignItems:"center", gap: 10}}>
          <select
            value={selectedRunId}
            onChange={(e)=> setSelectedRunId(e.target.value)} // ✅ string _id
          >
            {runs.length === 0 && <option value="">No runs</option>}
            {runs.map(r => (
              <option key={r._id} value={r._id}>
                {monthName(r.month)} {r.year} (…{String(r._id).slice(-6)})
              </option>
            ))}
          </select>

          {selectedRun && (
            <button
              className="btn secondary"
              type="button"
              onClick={async () => {
                try {
                  await downloadCsv(selectedRun._id);
                } catch (err) {
                  setToast(err?.message || "Download failed");
                }
              }}
            >
              Download CSV
            </button>
          )}
        </div>
      </div>

      <div style={{height:14}} />

      {!summary ? (
        <small className="muted">Select a run to view summary.</small>
      ) : (
        <>
          <div className="row">
            <div className="card" style={{flex:1}}>
              <div style={{fontWeight:800}}>Overall totals</div>
              <div style={{height:8}} />
              <div className="row">
                <div style={{flex:1}}>
                  <small className="muted">Employees</small>
                  <div style={{fontSize:18, fontWeight:900}}>{summary.totals.employeeCount}</div>
                </div>
                <div style={{flex:1}}>
                  <small className="muted">Gross</small>
                  <div style={{fontSize:18, fontWeight:900}}>{money(summary.totals.totalGross)}</div>
                </div>
                <div style={{flex:1}}>
                  <small className="muted">Deductions</small>
                  <div style={{fontSize:18, fontWeight:900}}>{money(summary.totals.totalDeductions)}</div>
                </div>
                <div style={{flex:1}}>
                  <small className="muted">Net</small>
                  <div style={{fontSize:18, fontWeight:900}}>{money(summary.totals.totalNet)}</div>
                </div>
              </div>
            </div>
          </div>

          <div style={{height:14}} />

          <div style={{overflowX:"auto"}}>
            <table>
              <thead>
                <tr>
                  <th>Department</th>
                  <th>Employees</th>
                  <th>Total Gross</th>
                  <th>Total Deductions</th>
                  <th>Total Net</th>
                </tr>
              </thead>
              <tbody>
                {summary.byDepartment.map((d, idx) => (
                  <tr key={idx}>
                    <td style={{fontWeight:800}}>{d.department || "Unassigned"}</td>
                    <td>{d.employeeCount}</td>
                    <td>{money(d.totalGross)}</td>
                    <td>{money(d.totalDeductions)}</td>
                    <td style={{fontWeight:900}}>{money(d.totalNet)}</td>
                  </tr>
                ))}
                {summary.byDepartment.length === 0 && (
                  <tr><td colSpan="5"><small className="muted">No data.</small></td></tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      <Toast message={toast} onClose={()=>setToast("")} />
    </div>
  );
}
