
import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: String,
  department: String,
  designation: String,

  baseSalary: { type: Number, default: 0 },
  hraPercent: { type: Number, default: 0 },
  daPercent: { type: Number, default: 0 },
  taxPercent: { type: Number, default: 0 },
  pfPercent: { type: Number, default: 0 },
  otherDeduction: { type: Number, default: 0 },

}, { timestamps: true });

export default mongoose.model("Employee", employeeSchema);
