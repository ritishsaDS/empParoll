# Employee Payroll Management System (Node.js + React)

A full-stack employee payroll management system with:
- Employee CRUD
- Salary components (HRA/DA) and deductions (Tax/PF/Other)
- Monthly payroll runs (gross, deductions, net salary)
- Reports (run summaries) + CSV export

## Tech
- **Backend:** Node.js, Express, SQLite (better-sqlite3)
- **Frontend:** React (Vite), React Router, Axios

---

## 1) Run the Backend

```bash
cd server
npm install
npm run dev
```

Backend starts on: `http://localhost:4000`

It auto-creates a local SQLite DB file at `server/data/payroll.db`.

---

## 2) Run the Frontend

In a second terminal:

```bash
cd client
npm install
npm run dev
```

Frontend starts on: `http://localhost:5173`

---

## Environment

By default the React app points to `http://localhost:4000`.
If you want to change it, create `client/.env`:

```bash
VITE_API_BASE_URL=http://localhost:4000
```

---

## Notes
- Percent values are stored as % (e.g., 10 means 10%).
- Gross = baseSalary + HRA + DA
  - HRA = baseSalary * (hraPercent/100)
  - DA  = baseSalary * (daPercent/100)
- Deductions = tax + pf + other
  - tax = gross * (taxPercent/100)
  - pf  = baseSalary * (pfPercent/100)
  - other = otherDeduction (flat amount)
- Net = gross - deductions

---

## Project Structure
- `server/` Express API + SQLite
- `client/` React UI
