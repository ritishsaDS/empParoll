import mongoose from "mongoose";
import { ENV } from "./config/env.js";

export async function connectDB() {
  await mongoose.connect(process.env.MONGO_URI, {
    dbName: "payroll_db",
  });
  console.log("MongoDB connected");
}
