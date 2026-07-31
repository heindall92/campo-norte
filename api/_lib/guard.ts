/**
 * Guard compartido de los endpoints /api/* — 30 MPS Growth OS.
 *
 * Objetivo: que el proxy de IA sea utilizable SOLO desde la propia app,
 * y nunca como pasarela abierta que consuma las API keys del servidor.
 *
 * Tres capas:
 *  1. Origen permitido (mismo sitio + localhost dev + ALLOWED_ORIGINS).
 *  2. Rate limit por IP (best-effort: memoria de la instancia caliente).
 *  3. Límite de tamaño del prompt (evita usarlo como LLM gratis).
 */

export interface GuardRequest {
  method?: string;
  headers: Record<string, string | string[] | undefined>;
}

export interface GuardResult {
  ok: boolean;
  status: number;
  error?: string;
  /** Origen a devolver en Access-Control-Allow-Origin (nunca "*"). */
  allowOrigin?: string;
}

function header(req: GuardRequest, name: string): string {
  const raw = req.headers[name] ?? req.headers[name.toLowerCase()];
  if (Array.isArray(raw)) return raw[0] ?? "";
  return typeof raw === "string" ? raw : "";
}

function originOf(url: string): string {
  try {
    return new URL(url).origin;
  } catch {
    return "";
  }
}

/** Orígenes aceptados: despliegue actual + dominios propios + dev local. */
export function allowedOrigins(): string[] {
  const list = new Set<string>();

  // Vercel expone el host del despliegue en runtime.
  const vercelUrl = process.env.VERCEL_URL;
  if (vercelUrl) list.add(`https://${vercelUrl}`);
  const branchUrl = process.env.VERCEL_BRANCH_URL;
  if (branchUrl) list.add(`https://${branchUrl}`);
  const prodUrl = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (prodUrl) list.add(`https://${prodUrl}`);

  // Dominios extra declarados a mano (coma-separados).
  for (const raw of (process.env.ALLOWED_ORIGINS ?? "").split(",")) {
    const o = originOf(raw.trim()) || raw.trim();
    if (o) list.add(o);
  }

  // Desarrollo local.
  if (process.env.VERCEL_ENV !== "production") {
    list.add("http://localhost:5173");
    list.add("http://127.0.0.1:5173");
    list.add("http://localhost:4173");
    list.add("http://localhost:8080");
  }

  return [...list];
}

/**
 * Rate limit por IP en memoria.
 * Limitación conocida: en serverless cada instancia tiene su contador, así que
 * el techo real es (límite × instancias calientes). Suficiente para frenar
 * abuso casual; para producción seria, mover a Upstash/Redis.
 */
const HITS = new Map<string, number[]>();
const WINDOW_MS = 60_000;
const MAX_PER_WINDOW = Number(process.env.AI_RATE_LIMIT ?? 20);

function clientIp(req: GuardRequest): string {
  const fwd = header(req, "x-forwarded-for");
  if (fwd) return fwd.split(",")[0]!.trim();
  return header(req, "x-real-ip") || "unknown";
}

function rateLimited(req: GuardRequest): boolean {
  const ip = clientIp(req);
  const now = Date.now();
  const recent = (HITS.get(ip) ?? []).filter((t) => now - t < WINDOW_MS);
  recent.push(now);
  HITS.set(ip, recent);

  // Poda para no crecer sin límite en instancias de larga vida.
  if (HITS.size > 5_000) {
    for (const [k, v] of HITS) {
      if (!v.some((t) => now - t < WINDOW_MS)) HITS.delete(k);
    }
  }
  return recent.length > MAX_PER_WINDOW;
}

/** Tope de payload: nadie usa este proxy para resumir un libro. */
export const MAX_MESSAGES = 40;
export const MAX_CHARS = 24_000;

export function checkPayload(messages: { content?: string }[]): string | null {
  if (messages.length > MAX_MESSAGES) {
    return `Demasiados mensajes (máx. ${MAX_MESSAGES})`;
  }
  const total = messages.reduce((n, m) => n + (m.content?.length ?? 0), 0);
  if (total > MAX_CHARS) {
    return `Prompt demasiado largo (máx. ${MAX_CHARS} caracteres)`;
  }
  return null;
}

/**
 * Verifica origen + rate limit. Devuelve el origen a reflejar en CORS.
 *
 * Nota: los navegadores envían `Origin` en toda petición POST, también en
 * same-origin. Una petición sin `Origin` ni `Referer` es un cliente no-navegador
 * (curl, script) y se rechaza: es exactamente el vector que quema las API keys.
 */
export function guard(req: GuardRequest): GuardResult {
  const origin = header(req, "origin");
  const referer = header(req, "referer");
  const candidate = origin || originOf(referer);

  if (!candidate) {
    return {
      ok: false,
      status: 403,
      error: "Origen no permitido: este endpoint solo acepta peticiones desde la app.",
    };
  }

  const allowed = allowedOrigins();
  // Sin VERCEL_URL ni ALLOWED_ORIGINS (p. ej. self-host) no podemos comparar:
  // en ese caso exigimos al menos que haya origen y lo reflejamos.
  const permissive = allowed.length === 0;

  if (!permissive && !allowed.includes(candidate)) {
    return {
      ok: false,
      status: 403,
      error: "Origen no permitido.",
    };
  }

  if (rateLimited(req)) {
    return {
      ok: false,
      status: 429,
      error: "Demasiadas peticiones. Espera un minuto.",
      allowOrigin: candidate,
    };
  }

  return { ok: true, status: 200, allowOrigin: candidate };
}

/** Cabeceras CORS restringidas al origen concreto (nunca "*"). */
export function applyCors(
  res: { setHeader: (k: string, v: string) => void },
  allowOrigin?: string,
): void {
  if (allowOrigin) {
    res.setHeader("Access-Control-Allow-Origin", allowOrigin);
    res.setHeader("Vary", "Origin");
  }
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  res.setHeader("X-Content-Type-Options", "nosniff");
}
