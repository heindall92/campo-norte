/**
 * Proxy Vercel → Ollama Cloud (https://ollama.com/api/chat).
 * El API key viaja en Authorization desde el CRM (Ajustes) o OLLAMA_API_KEY en el entorno.
 *
 * Seguridad: mismo guard que /api/ai/chat. Sin él, con OLLAMA_API_KEY configurada
 * este endpoint era una pasarela anónima contra la cuenta de Ollama del servidor.
 */

import { applyCors, checkPayload, guard } from "../_lib/guard";

export default async function handler(
  req: { method?: string; headers: Record<string, string | string[] | undefined>; body: unknown },
  res: {
    status: (code: number) => { json: (body: unknown) => void; end: (s?: string) => void };
    setHeader: (k: string, v: string) => void;
  },
) {
  const verdict = guard(req);
  applyCors(res, verdict.allowOrigin);

  if (req.method === "OPTIONS") {
    res.status(verdict.ok ? 204 : verdict.status).end();
    return;
  }
  if (!verdict.ok) {
    res.status(verdict.status).json({ error: verdict.error });
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
    return;
  }

  const bodyMessages = (req.body as { messages?: { content?: string }[] } | null)?.messages;
  const payloadError = checkPayload(Array.isArray(bodyMessages) ? bodyMessages : []);
  if (payloadError) {
    res.status(413).json({ error: payloadError });
    return;
  }

  const authHeader = req.headers.authorization;
  const auth =
    typeof authHeader === "string" && authHeader.startsWith("Bearer ")
      ? authHeader
      : process.env.OLLAMA_API_KEY
        ? `Bearer ${process.env.OLLAMA_API_KEY}`
        : null;

  if (!auth) {
    res.status(401).json({
      error: "Falta Authorization Bearer o variable OLLAMA_API_KEY",
    });
    return;
  }

  try {
    const upstream = await fetch("https://ollama.com/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: auth,
      },
      body: JSON.stringify(req.body ?? {}),
    });
    const text = await upstream.text();
    let data: unknown = text;
    try {
      data = JSON.parse(text);
    } catch {
      /* keep text */
    }
    res.status(upstream.status).json(data);
  } catch (err) {
    res.status(502).json({
      error: err instanceof Error ? err.message : "Error al contactar Ollama Cloud",
    });
  }
}
