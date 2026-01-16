import { z } from "zod";

export const employeeSchema = z.object({
  name: z.string().min(1),
  email: z.string().email().optional().or(z.literal("")).transform(v => v || undefined),
  department: z.string().optional().or(z.literal("")).transform(v => v || undefined),
  designation: z.string().optional().or(z.literal("")).transform(v => v || undefined),
  baseSalary: z.coerce.number().nonnegative(),
  hraPercent: z.coerce.number().min(0).max(100).default(0),
  daPercent: z.coerce.number().min(0).max(100).default(0),
  taxPercent: z.coerce.number().min(0).max(100).default(0),
  pfPercent: z.coerce.number().min(0).max(100).default(0),
  otherDeduction: z.coerce.number().nonnegative().default(0),
});

export const payrollRunSchema = z.object({
  month: z.coerce.number().int().min(1).max(12),
  year: z.coerce.number().int().min(2000).max(2100),
});
