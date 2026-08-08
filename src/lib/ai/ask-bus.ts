/**
 * Canal para la IA contextual.
 *
 * El patrón que importa (docs/GAP-DEMO-ANATOMIA.md §7): la IA se invoca
 * DESDE la tarjeta o la fila que estás mirando, con el contexto ya cargado,
 * en vez de obligarte a ir a un chat y reescribir de qué hablabas.
 *
 * Implementación deliberadamente mínima: una pregunta pendiente en memoria
 * más un evento de ventana. Sin estado global, sin contexto de React, sin
 * dependencias entre paneles que no se conocen entre sí.
 */

export const ASK_EVENT = "mps-ask-assistant";

let pending: string | null = null;

/**
 * Encola una pregunta y avisa al panel del asistente.
 * Quien llama no necesita saber si el panel está montado.
 */
export function requestAsk(question: string): void {
  const text = question.trim();
  if (!text) return;
  pending = text;
  if (typeof window === "undefined") return;
  // Lleva al usuario al asistente reutilizando el canal de navegación que ya
  // usa la app; si el rol no tiene acceso, el listener lo ignora y la
  // pregunta se queda encolada sin romper nada.
  window.dispatchEvent(new CustomEvent("mps-navigate", { detail: "conocimiento" }));
  window.dispatchEvent(new CustomEvent(ASK_EVENT, { detail: text }));
}

/**
 * Recoge la pregunta pendiente y la borra.
 *
 * Se consume una sola vez a propósito: si el panel se remonta (cambio de
 * pestaña, rotación en móvil) no debe relanzar sola la última pregunta.
 */
export function consumePendingAsk(): string | null {
  const text = pending;
  pending = null;
  return text;
}

/** Suscripción al canal. Devuelve la función para darse de baja. */
export function onAskRequested(handler: (question: string) => void): () => void {
  if (typeof window === "undefined") return () => {};
  const listener = (e: Event) => {
    const detail = (e as CustomEvent<string>).detail;
    if (typeof detail === "string" && detail.trim()) handler(detail);
  };
  window.addEventListener(ASK_EVENT, listener);
  return () => window.removeEventListener(ASK_EVENT, listener);
}

/* ------------------------------------------------------------------ *
 * Redacción de preguntas
 * ------------------------------------------------------------------ *
 * Centralizado para que una tarjeta KPI y una fila de la cola de atención
 * no acaben preguntando lo mismo de dos maneras distintas.
 */

export function askAboutTopic(topic: string): string {
  return `Explícame la situación de ${topic}: qué muestran los números, qué lo explica y qué harías esta semana.`;
}

export function askAboutLead(name: string, reason: string): string {
  return `El lead ${name} aparece en la cola de acción porque: ${reason}. ¿Qué le digo y con qué prioridad frente al resto?`;
}

export function askAboutReservation(trip: string, reason: string): string {
  return `La reserva ${trip} requiere atención: ${reason}. ¿Qué pasos doy y en qué orden?`;
}

export function askAboutInvoice(number: string, reason: string): string {
  return `La factura ${number} requiere atención: ${reason}. ¿Cómo lo resuelvo sin incumplir la normativa?`;
}
