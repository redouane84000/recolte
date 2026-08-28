import { isAdminAuthorized } from "./_lib/auth.js";
import {
  clearCaptures,
  deleteCapture,
  getCaptures,
} from "./_lib/store.js";

export default async function handler(req, res) {
  if (!isAdminAuthorized(req)) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    if (req.method === "GET") {
      const store = await getCaptures();
      return res.status(200).json(store);
    }

    if (req.method === "DELETE") {
      const { type, id } = req.body || {};

      if (id && (type === "registrations" || type === "logins")) {
        const list = await deleteCapture(type, id);
        return res.status(200).json({ ok: true, list });
      }

      if (type === "registrations" || type === "logins") {
        const store = await clearCaptures(type);
        return res.status(200).json({ ok: true, store });
      }

      return res.status(400).json({ error: "Invalid delete payload" });
    }

    res.setHeader("Allow", "GET, DELETE");
    return res.status(405).json({ error: "Method not allowed" });
  } catch (error) {
    console.error("captures error:", error);
    return res.status(500).json({ error: "Storage failed" });
  }
}
