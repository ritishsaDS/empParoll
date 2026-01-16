import dotenv from "dotenv";
dotenv.config(); // 👈 MUST BE FIRST

export const ENV = {
  PORT: process.env.PORT || 4000,
  MONGO_URI: process.env.MONGO_URI,
  CORS_ORIGIN: process.env.CORS_ORIGIN || "http://localhost:4000",
  JWT_SECRET: process.env.JWT_SECRET || "dev_secret",
};
