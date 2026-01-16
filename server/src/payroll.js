export function calcPayrollForEmployee(emp) {
  const base = Number(emp.baseSalary || 0);

  const hra = base * (Number(emp.hraPercent || 0) / 100);
  const da  = base * (Number(emp.daPercent || 0) / 100);
  const gross = base + hra + da;

  const tax = gross * (Number(emp.taxPercent || 0) / 100);
  const pf  = base * (Number(emp.pfPercent || 0) / 100);
  const other = Number(emp.otherDeduction || 0);

  const deductions = tax + pf + other;
  const net = gross - deductions;

  const round2 = (n) => Math.round((n + Number.EPSILON) * 100) / 100;

  return {
    gross: round2(gross),
    deductions: round2(deductions),
    net: round2(net),
    breakdown: {
      base: round2(base),
      hra: round2(hra),
      da: round2(da),
      tax: round2(tax),
      pf: round2(pf),
      other: round2(other),
    },
  };
}
