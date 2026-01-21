import React, { useEffect, useState } from "react";
import {
  NavLink,
  Routes,
  Route,
  Navigate,
  useLocation,
  useNavigate,
} from "react-router-dom";

import LandingPage from "./pages/LandingPage.tsx";
import PayrollPage from "./pages/PayrollPage.jsx";
import ReportsPage from "./pages/ReportsPage.jsx";
import EmployeesPage from "./pages/EmployeesPage.jsx";
import LoginPage from "./pages/LoginPage.tsx";
import DashboardPage  from "./pages/DashboardPage.tsx";


import Logo from "./assets/progression.png";

function readSessionUser() {
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const userRaw = localStorage.getItem("user");
  if (!isLoggedIn || !userRaw) return null;

  try {
    return JSON.parse(userRaw);
  } catch {
    return null;
  }
}

export default function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const [user, setUser] = useState(() => readSessionUser());

  useEffect(() => {
    setUser(readSessionUser());
  }, [location.pathname]);

  const isLoggedIn = !!user;
  const isAuthPage = location.pathname === "/login";

  return (
    <>
      {/* ✅ Header */}
      <div className="nav">
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          <img
            src={Logo}
            alt="Payroll Logo"
            style={{ width: 32, height: 32, objectFit: "contain" }}
          />
          <div style={{ fontWeight: 800 }}>Payroll</div>
          <small className="muted">Employee payroll management</small>
        </div>

        <div style={{ display: "flex", gap: 6 }}>
        
          <NavLink to="/dash" className={({ isActive }) => (isActive ? "active" : "")}>
            Dashboard
          </NavLink>

          {isLoggedIn && !isAuthPage && (
            <>
              <NavLink to="/employees" className={({ isActive }) => (isActive ? "active" : "")}>
                Employees
              </NavLink>
              <NavLink to="/payroll" className={({ isActive }) => (isActive ? "active" : "")}>
                Run Payroll
              </NavLink>
              <NavLink to="/reports" className={({ isActive }) => (isActive ? "active" : "")}>
                Reports
              </NavLink>
            </>
          )}

          <button
            className="btn secondary"
            type="button"
            onClick={() => {
              if (isLoggedIn) {
                // ✅ logout
                localStorage.removeItem("isLoggedIn");
                localStorage.removeItem("user");
                localStorage.removeItem("token");
                setUser(null);
                navigate("/login", { replace: true });
              } else {
                // ✅ go to login
                navigate("/login");
              }
            }}
          >
            {isLoggedIn && !isAuthPage ? "Logout" : "Login"}
          </button>
        </div>
      </div>

      {/* ✅ Single routing block */}
      <div className="container">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />

          <Route
            path="/dashboard"
            element={<DashboardPage />}
          />
  <Route
            path="/dash"
            element={ <DashboardPage /> }
          />
          <Route
            path="/employees"
            element={isLoggedIn ? <EmployeesPage /> : <Navigate to="/login" replace />}
          />
          <Route
            path="/payroll"
            element={isLoggedIn ? <PayrollPage /> : <Navigate to="/login" replace />}
          />
            
          <Route
            path="/reports"
            element={isLoggedIn ? <ReportsPage /> : <Navigate to="/login" replace />}
          />

          <Route
            path="/login"
            element={isLoggedIn ? <Navigate to="/dashboard" replace /> : <LoginPage />}
          />

          <Route path="*" element={<div className="card">Not found</div>} />
        </Routes>
      </div>
    </>
  );
}
