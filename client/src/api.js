import axios from "axios";

export const API_BASE_URL = "https://empparoll-1.onrender.com";

export const api = axios.create({
  baseURL: `${API_BASE_URL}/api`,
  headers: { "Content-Type": "application/json" }
});
export function getToken() {
  return localStorage.getItem("payroll_token") || "";
}
