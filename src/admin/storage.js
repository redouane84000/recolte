import {
  ADMIN_PASS,
  ADMIN_SESSION_KEY,
  ADMIN_USER,
  LEGACY_CAPTURES_KEY,
  LOGINS_KEY,
  REGISTRATIONS_KEY,
} from "./config";

const ADMIN_PASS_KEY = "recolte_admin_pass";

export function loginAdmin(username, password) {
  const user = String(username || "").trim().toLowerCase();
  const pass = String(password || "").trim();
  const ok =
    user === ADMIN_USER.toLowerCase() &&
    pass.toLowerCase() === ADMIN_PASS.toLowerCase();
  if (ok) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, "1");
    sessionStorage.setItem(ADMIN_PASS_KEY, pass);
  }
  return ok;
}

export function logoutAdmin() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  sessionStorage.removeItem(ADMIN_PASS_KEY);
}

export function isAdminAuthenticated() {
  return sessionStorage.getItem(ADMIN_SESSION_KEY) === "1";
}

function getAdminPass() {
  return sessionStorage.getItem(ADMIN_PASS_KEY) || "";
}

function adminHeaders() {
  return {
    "Content-Type": "application/json",
    "x-admin-pass": getAdminPass(),
  };
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

async function fetchStore() {
  try {
    const res = await fetch("/api/captures", {
      headers: adminHeaders(),
    });
    if (!res.ok) throw new Error("api");
    return await res.json();
  } catch {
    migrateLegacyCaptures();
    return {
      registrations: readList(REGISTRATIONS_KEY),
      logins: readList(LOGINS_KEY),
    };
  }
}

export async function getRegistrations() {
  const store = await fetchStore();
  return store.registrations || [];
}

export async function getLogins() {
  const store = await fetchStore();
  return store.logins || [];
}

export async function clearRegistrations() {
  try {
    await fetch("/api/captures", {
      method: "DELETE",
      headers: adminHeaders(),
      body: JSON.stringify({ type: "registrations" }),
    });
  } catch {
    localStorage.removeItem(REGISTRATIONS_KEY);
  }
}

export async function clearLogins() {
  try {
    await fetch("/api/captures", {
      method: "DELETE",
      headers: adminHeaders(),
      body: JSON.stringify({ type: "logins" }),
    });
  } catch {
    localStorage.removeItem(LOGINS_KEY);
    localStorage.removeItem(LEGACY_CAPTURES_KEY);
  }
}

export async function deleteRegistration(id) {
  try {
    const res = await fetch("/api/captures", {
      method: "DELETE",
      headers: adminHeaders(),
      body: JSON.stringify({ type: "registrations", id }),
    });
    if (!res.ok) throw new Error("api");
    const data = await res.json();
    return data.list || [];
  } catch {
    return writeList(
      REGISTRATIONS_KEY,
      (await getRegistrations()).filter((item) => item.id !== id)
    );
  }
}

export async function deleteLogin(id) {
  try {
    const res = await fetch("/api/captures", {
      method: "DELETE",
      headers: adminHeaders(),
      body: JSON.stringify({ type: "logins", id }),
    });
    if (!res.ok) throw new Error("api");
    const data = await res.json();
    return data.list || [];
  } catch {
    migrateLegacyCaptures();
    return writeList(
      LOGINS_KEY,
      (await getLogins()).filter((item) => item.id !== id)
    );
  }
}
