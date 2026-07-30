/**
 * Proxy Vercel → Ollama Cloud (https://ollama.com/api/chat).
 * El API key viaja en Authorization desde el CRM (Ajustes) o OLLAMA_API_KEY en el entorno.
 */
export default async function handler(
  req: { method?: string; headers: Record<string, string | string[] | undefined>; body: unknown },
  res: {
    status: (code: number) => { json: (body: unknown) => void; end: (s?: string) => void };
    setHeader: (k: string, v: string) => void;
  },
) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    res.status(204).end();
    return;
  }
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed" });
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
