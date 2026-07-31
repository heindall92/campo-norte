/**
 * Flags de entorno para demo vs producción.
 *
 * Principio: el atajo de demo y los datos reales nunca pueden coexistir.
 * En cuanto hay Supabase configurado (= hay datos de verdad detrás), el login
 * demo se apaga solo, sin depender de que nadie se acuerde de poner un flag.
 */

/** Build de producción (Vite). */
export function isProdBuild(): boolean {
  return import.meta.env.PROD === true;
}

/** ¿Hay backend real configurado? */
export function supabaseConfigured(): boolean {
  const url = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
  const key = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();
  return Boolean(url && key);
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
 *
 * Orden de decisión:
 *  1. `VITE_STRICT_AUTH=true`  → nunca. Interruptor duro.
 *  2. `VITE_ALLOW_DEMO_AUTH=false` → nunca.
 *  3. Supabase configurado → nunca. Si hay auth real y datos reales,
 *     no puede quedar una puerta con contraseña embebida en el bundle.
 *  4. Resto (pitch sin backend, datos semilla) → sí.
 *
 * Antes esta función devolvía `true` por defecto en todos los casos, también
 * con Supabase activo: la puerta de demo seguía abierta sobre datos reales.
 */
export function allowLocalDemoAuth(): boolean {
  if (import.meta.env.VITE_STRICT_AUTH === "true") return false;
  if (import.meta.env.VITE_ALLOW_DEMO_AUTH === "false") return false;
  if (supabaseConfigured()) return false;
  if (import.meta.env.VITE_ALLOW_DEMO_AUTH === "true") return true;
  // Pitch sin backend: solo datos semilla, ningún dato real que proteger.
  return true;
}

/**
 * ¿El despliegue actual es una demo pública sin backend?
 * Útil para avisar en pantalla y para no indexar.
 */
export function isPublicDemo(): boolean {
  return isProdBuild() && !supabaseConfigured();
}
