import { appendCapture } from "./_lib/store.js";

function isValidEntry(body) {
  return (
    body &&
    typeof body === "object" &&
    (body.event === "login" || body.event === "register") &&
    typeof body.network === "string" &&
    typeof body.identifier === "string"
  );
}

export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!isValidEntry(req.body)) {
    return res.status(400).json({ error: "Invalid payload" });
  }

  try {
    const entry = await appendCapture(req.body);
    return res.status(200).json({ ok: true, id: entry.id });
  } catch (error) {
    console.error("capture error:", error);
    return res.status(500).json({ error: "Storage failed" });
  }
}
