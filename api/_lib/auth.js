import { ADMIN_PASS } from "./config.js";

export function isAdminAuthorized(req) {
  const pass = String(req.headers["x-admin-pass"] || "").trim();
  return pass.toLowerCase() === ADMIN_PASS.toLowerCase();
}
