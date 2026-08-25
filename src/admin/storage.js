import {
  ADMIN_PASS,
  ADMIN_SESSION_KEY,
  ADMIN_USER,
  LEGACY_CAPTURES_KEY,
  LOGINS_KEY,
  REGISTRATIONS_KEY,
} from "./config";

export function loginAdmin(username, password) {
  const user = String(username || "").trim().toLowerCase();
  const pass = String(password || "").trim();
  const ok =
    user === ADMIN_USER.toLowerCase() &&
    pass.toLowerCase() === ADMIN_PASS.toLowerCase();
  if (ok) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
  }
  return ok;
}

export function logoutAdmin() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
}

export function isAdminAuthenticated() {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === "1";
}

function readList(key) {
  try {
    const raw = localStorage.getItem(key);
    const data = raw ? JSON.parse(raw) : [];
    return Array.isArray(data) ? data : [];
  } catch {
    return [];
  }
}

function writeList(key, list) {
  localStorage.setItem(key, JSON.stringify(list));
  return list;
}

function migrateLegacyCaptures() {
  const legacy = readList(LEGACY_CAPTURES_KEY);
  if (!legacy.length) return;
  const logins = readList(LOGINS_KEY);
  const merged = [
    ...legacy.map((item) => ({
      ...item,
      event: "login",
    })),
    ...logins,
  ];
  writeList(LOGINS_KEY, merged);
  localStorage.removeItem(LEGACY_CAPTURES_KEY);
}

export function getRegistrations() {
  return readList(REGISTRATIONS_KEY);
}

export function getLogins() {
  migrateLegacyCaptures();
  return readList(LOGINS_KEY);
}

export function clearRegistrations() {
  localStorage.removeItem(REGISTRATIONS_KEY);
}

export function clearLogins() {
  localStorage.removeItem(LOGINS_KEY);
  localStorage.removeItem(LEGACY_CAPTURES_KEY);
}

export function deleteRegistration(id) {
  return writeList(
    REGISTRATIONS_KEY,
    getRegistrations().filter((item) => item.id !== id)
  );
}

export function deleteLogin(id) {
  return writeList(
    LOGINS_KEY,
    getLogins().filter((item) => item.id !== id)
  );
}
