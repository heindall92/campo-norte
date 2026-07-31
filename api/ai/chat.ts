/**
 * Proxy unificado → Ollama Cloud | OpenAI | Claude | Gemini.
 * Body: { provider, model, messages, format?, apiKey?, ollamaMode?, ollamaBaseUrl? }
 * Keys también vía env: OLLAMA_API_KEY, OPENAI_API_KEY, ANTHROPIC_API_KEY, GEMINI_API_KEY
 *
 * Seguridad: solo acepta peticiones desde el origen de la app (ver api/_lib/guard.ts).
 * Sin ese control, cualquiera con la URL podría gastar las API keys del servidor.
 */

import { applyCors, checkPayload, guard } from "../_lib/guard";

type Msg = { role: string; content: string };

function envKey(provider: string): string | undefined {
  switch (provider) {
    case "ollama":
      return process.env.OLLAMA_API_KEY;
    case "openai":
      return process.env.OPENAI_API_KEY;
    case "claude":
      return process.env.ANTHROPIC_API_KEY;
    case "gemini":
      return process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;
    default:
      return undefined;
  }
}

function splitSystem(messages: Msg[]) {
  const system = messages
    .filter((m) => m.role === "system")
    .map((m) => m.content)
    .join("\n");
  const rest = messages.filter((m) => m.role !== "system");
  return { system, rest };
}

async function callOllama(opts: {
  model: string;
  messages: Msg[];
  format: unknown;
  apiKey: string;
}) {
  const res = await fetch("https://ollama.com/api/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${opts.apiKey}`,
    },
    body: JSON.stringify({
      model: opts.model,
      messages: opts.messages,
      stream: false,
      ...(opts.format ? { format: opts.format } : {}),
    }),
  });
  const text = await res.text();
  let data: Record<string, unknown> = {};
  try {
    data = JSON.parse(text) as Record<string, unknown>;
  } catch {
    data = { raw: text };
  }
  if (!res.ok) {
    return { status: res.status, body: { error: text.slice(0, 400), ...data } };
  }
  const message = data.message as { content?: string } | undefined;
  return {
    status: 200,
    body: {
      content: message?.content ?? (data.response as string) ?? "",
      model: (data.model as string) ?? opts.model,
      provider: "ollama",
    },
  };
}

async function callOpenAI(opts: {
  model: string;
  messages: Msg[];
  format: unknown;
  apiKey: string;
}) {
  const body: Record<string, unknown> = {
    model: opts.model,
    messages: opts.messages,
    temperature: 0.2,
  };
  if (opts.format) {
    body.response_format = { type: "json_object" };
  }
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${opts.apiKey}`,
    },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
    model?: string;
    error?: { message?: string };
  };
  if (!res.ok) {
    return {
      status: res.status,
      body: { error: data.error?.message || JSON.stringify(data).slice(0, 400) },
    };
  }
  return {
    status: 200,
    body: {
      content: data.choices?.[0]?.message?.content ?? "",
      model: data.model ?? opts.model,
      provider: "openai",
    },
  };
}

async function callClaude(opts: {
  model: string;
  messages: Msg[];
  format: unknown;
  apiKey: string;
}) {
  const { system, rest } = splitSystem(opts.messages);
  const res = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": opts.apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: opts.model,
      max_tokens: 4096,
      temperature: 0.2,
      system: system || undefined,
      messages: rest.map((m) => ({
        role: m.role === "assistant" ? "assistant" : "user",
        content: m.content,
      })),
    }),
  });
  const data = (await res.json()) as {
    content?: { type: string; text?: string }[];
    model?: string;
    error?: { message?: string };
  };
  if (!res.ok) {
    return {
      status: res.status,
      body: { error: data.error?.message || JSON.stringify(data).slice(0, 400) },
    };
  }
  const text = (data.content || [])
    .filter((c) => c.type === "text")
    .map((c) => c.text || "")
    .join("\n");
  return {
    status: 200,
    body: {
      content: text,
      model: data.model ?? opts.model,
      provider: "claude",
    },
  };
}

async function callGemini(opts: {
  model: string;
  messages: Msg[];
  format: unknown;
  apiKey: string;
}) {
  const { system, rest } = splitSystem(opts.messages);
  const contents = rest.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${encodeURIComponent(opts.model)}:generateContent?key=${encodeURIComponent(opts.apiKey)}`;
  const body: Record<string, unknown> = {
    contents,
    generationConfig: {
      temperature: 0.2,
      ...(opts.format ? { responseMimeType: "application/json" } : {}),
    },
  };
  if (system) {
    body.systemInstruction = { parts: [{ text: system }] };
  }
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = (await res.json()) as {
    candidates?: { content?: { parts?: { text?: string }[] } }[];
    error?: { message?: string };
  };
  if (!res.ok) {
    return {
      status: res.status,
      body: { error: data.error?.message || JSON.stringify(data).slice(0, 400) },
    };
  }
  const text =
    data.candidates?.[0]?.content?.parts?.map((p) => p.text || "").join("") ?? "";
  return {
    status: 200,
    body: {
      content: text,
      model: opts.model,
      provider: "gemini",
    },
  };
}

export default async function handler(
  req: {
    method?: string;
    headers: Record<string, string | string[] | undefined>;
    body: {
      provider?: string;
      model?: string;
      messages?: Msg[];
      format?: unknown;
      apiKey?: string;
    };
  },
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

  const provider = (req.body?.provider || "ollama") as string;
  const model = req.body?.model || "";
  const messages = Array.isArray(req.body?.messages) ? req.body.messages : [];
  const format = req.body?.format ?? null;

  const payloadError = checkPayload(messages);
  if (payloadError) {
    res.status(413).json({ error: payloadError });
    return;
  }

  // Producción Vercel: solo keys en env del servidor (no confiar en body.apiKey del navegador).
  // Demo/local: ALLOW_CLIENT_AI_KEYS=true (o no-production) permite body.apiKey.
  const isVercelProd = process.env.VERCEL_ENV === "production";
  const allowClientKeys =
    process.env.ALLOW_CLIENT_AI_KEYS === "true" ||
    (!isVercelProd && process.env.ALLOW_CLIENT_AI_KEYS !== "false");
  const clientKey = allowClientKeys ? String(req.body?.apiKey || "").trim() : "";
  const apiKey = (envKey(provider) || clientKey).trim();

  if (!model || !messages.length) {
    res.status(400).json({ error: "Faltan model o messages" });
    return;
  }
  if (!apiKey && provider !== "ollama") {
    res.status(401).json({
      error: `Falta API key para ${provider}. En producción configura ${provider === "claude" ? "ANTHROPIC_API_KEY" : provider === "openai" ? "OPENAI_API_KEY" : provider === "gemini" ? "GEMINI_API_KEY" : "OLLAMA_API_KEY"} en Vercel.`,
    });
    return;
  }
  if (provider === "ollama" && !apiKey) {
    res.status(401).json({
      error: "Falta OLLAMA_API_KEY en el servidor (o key en Ajustes solo en demo local)",
    });
    return;
  }

  try {
    let result: { status: number; body: Record<string, unknown> };
    if (provider === "openai") {
      result = await callOpenAI({ model, messages, format, apiKey });
    } else if (provider === "claude") {
      result = await callClaude({ model, messages, format, apiKey });
    } else if (provider === "gemini") {
      result = await callGemini({ model, messages, format, apiKey });
    } else {
      result = await callOllama({ model, messages, format, apiKey });
    }
    res.status(result.status).json(result.body);
  } catch (err) {
    res.status(502).json({
      error: err instanceof Error ? err.message : "Error al contactar el proveedor IA",
    });
  }
}
