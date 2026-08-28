import { head, put } from "@vercel/blob";
import { STORE_BLOB_PATH } from "./config.js";

const EMPTY_STORE = { registrations: [], logins: [] };

async function readStore() {
  try {
    const meta = await head(STORE_BLOB_PATH);
    if (!meta?.downloadUrl) return { ...EMPTY_STORE };

    const response = await fetch(meta.downloadUrl);
    if (!response.ok) return { ...EMPTY_STORE };

    const data = await response.json();
    return {
      registrations: Array.isArray(data.registrations) ? data.registrations : [],
      logins: Array.isArray(data.logins) ? data.logins : [],
    };
  } catch {
    return { ...EMPTY_STORE };
  }
}

async function writeStore(store) {
  await put(STORE_BLOB_PATH, JSON.stringify(store), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
  });
}

export async function appendCapture(entry) {
  const store = await readStore();
  const list = entry.event === "register" ? store.registrations : store.logins;
  list.unshift(entry);
  await writeStore(store);
  return entry;
}

export async function getCaptures() {
  return readStore();
}

export async function clearCaptures(type) {
  const store = await readStore();
  if (type === "registrations") store.registrations = [];
  if (type === "logins") store.logins = [];
  await writeStore(store);
  return store;
}

export async function deleteCapture(type, id) {
  const store = await readStore();
  const key = type === "registrations" ? "registrations" : "logins";
  store[key] = store[key].filter((item) => item.id !== id);
  await writeStore(store);
  return store[key];
}
