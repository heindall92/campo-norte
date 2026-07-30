/**
 * Flags de entorno para demo vs producción.
 *
 * Seguridad:
 * - Keys IA en producción → solo env del servidor (no localStorage).
 * - Login demo → permitido para el pitch; ciérralo con VITE_STRICT_AUTH=true
 *   o con Supabase Auth antes del despliegue real.
 */

/** Build de producción (Vite). */
export function isProdBuild(): boolean {
  return import.meta.env.PROD === true;
}

/**
 * ¿Se pueden pegar API keys en Ajustes / localStorage?
 * Demo/local: sí. Producción: no, salvo VITE_ALLOW_CLIENT_AI_KEYS=true.
 */
export function allowClientAiKeys(): boolean {
  if (import.meta.env.VITE_ALLOW_CLIENT_AI_KEYS === "true") return true;
  if (import.meta.env.VITE_ALLOW_CLIENT_AI_KEYS === "false") return false;
  return !isProdBuild();
}

/**
 * ¿Login demo con usuarios embebidos (sin Supabase)?
 * - `VITE_STRICT_AUTH=true` → nunca (despliegue real).
 * - `VITE_ALLOW_DEMO_AUTH=false` → nunca.
 * - Resto → sí (pitch / local). Preferible pasar a Supabase Auth.
 */
export function allowLocalDemoAuth(): boolean {
  if (import.meta.env.VITE_STRICT_AUTH === "true") return false;
  if (import.meta.env.VITE_ALLOW_DEMO_AUTH === "false") return false;
  if (import.meta.env.VITE_ALLOW_DEMO_AUTH === "true") return true;
  // Pitch: sigue funcionando en Vercel sin Supabase.
  // Antes de producción real: VITE_STRICT_AUTH=true o configura Supabase.
  return true;
}
