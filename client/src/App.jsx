import React from "react";
import { NavLink, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage.tsx";
import PayrollPage from "./pages/PayrollPage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";
import EmployeesPage from "./pages/EmployeesPage.jsx";
import Logo from "./assets/progression.png";

export default function App(){
  return (
    <>
      <div className="nav">
        <div style={{display:"flex", gap:10, alignItems:"center"}}>
           <img
      src={Logo}
      alt="Payroll Logo"
      style={{
        width: 32,
        height: 32,
        objectFit: "contain",
      }}
    />
          <div style={{fontWeight:800}}>Payroll</div>
          
          <small className="muted">Employee payroll management</small>

        </div>
        <div style={{display:"flex", gap:6}}>
          <NavLink to="/dashboard" className={({isActive}) => isActive ? "active" : ""}>Dashboard</NavLink>
          <NavLink to="/employees" className={({isActive}) => isActive ? "active" : ""}>Employees</NavLink>

          <NavLink to="/payroll" className={({isActive}) => isActive ? "active" : ""}>Run Payroll</NavLink>
          <NavLink to="/reports" className={({isActive}) => isActive ? "active" : ""}>Reports</NavLink>
        </div>
      </div>

      <div className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<LandingPage />} />

          <Route path="/employees" element={<EmployeesPage />} />
          <Route path="/payroll" element={<PayrollPage />} />
          <Route path="/reports" element={<ReportsPage />} />
          <Route path="*" element={<div className="card">Not found</div>} />
        </Routes>
      </div>
    </>
  );
}
