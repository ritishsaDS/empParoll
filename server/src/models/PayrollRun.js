
import mongoose from "mongoose";

const payrollRunSchema = new mongoose.Schema(
  {
    month: { type: Number, required: true, min: 1, max: 12 },
    year: { type: Number, required: true, min: 2000, max: 2100 },
  },
  { timestamps: true }
);

payrollRunSchema.index({ month: 1, year: 1 }, { unique: true });

export default mongoose.model("PayrollRun", payrollRunSchema);
