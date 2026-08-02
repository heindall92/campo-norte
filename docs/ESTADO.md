# ESTADO — fuente única de verdad entre agentes

> **Lee este archivo antes de tocar nada y actualízalo antes de terminar.**
> Aquí trabajan varios agentes (Claude Code, Cursor) en hilos que no comparten
> memoria. El chat no es memoria: este archivo sí. Si el chat y el repo se
> contradicen, **manda el repo**.

**Última actualización:** 2026-08-02 · por Cursor · tip `main` `3bffb3b` (cambios
locales del selector de 4 modos **sin commit** aún)

---

## 1 · Dónde está cada cosa

| Rama | Commit | Qué contiene |
|---|---|---|
| `main` | `3bffb3b` | Producción desplegada. Móvil + lazo de leads. |
| Producción | — | https://30mps.vercel.app |
| Supabase | `gkskudxjuafsidqiiqpg` | **30mps** (eu-west-1). Lazo verificado. |
| Working tree | (sin commit) | Selector de 4 modos de priorización. |

---

## 2 · Qué está IMPLEMENTADO y verificado

### Vista móvil
- Inicio, Clientes / Reservas / Leads, fichas in-place, módulos en barra.

### Lazo de leads
- Ingesta + cron + `/captura` + decay. **Verde en prod** con Supabase.

### Selector de 4 modos (nuevo — lint/test/build OK)
- Motor: `src/lib/ai/lead-priority.ts` — solo reordena; **nunca** reescribe score.
- Preferencia por usuario en `user-prefs.leadPriorityMode` (localStorage).
- UI: desplegable en Leads (móvil + escritorio); Prioridad de hoy respeta el modo.
- Cada fila muestra **por qué** está en esa posición.
- Decaimiento temporal se aplica en todos los modos (corrección, no opción).

| Modo | Pregunta | Qué hace |
|---|---|---|
| Urgencia (default) | ¿Quién se enfría? | `score × e^(−λ·días)` |
| Dinero esperado | ¿Más margen? | `p × ticket(ruta) × margen − coste` × decay |
| Encaje e intención | ¿Ideal y con prisa? | cuadrante fit×intent × decay |
| Se parece a quien reservó | ¿Como mis buenos? | coseno k=5 convertidores × decay |

**Verificación:** `npm run lint`, `npm test` (47), `npm run build` — limpios.

---

## 3 · Qué está DECIDIDO pero NO implementado

- Modelos entrenados (regresión / Naive Bayes) — fuera hasta `mps_lead_outcomes`
  con filas reales.
- Auth endurecido: desactivar alta pública; promover primer admin.

---

## 4 · Qué NO se toca

1. Merge a `main` / push / deploy sin pedirlo el dueño.
2. Regla de oro — nada escribe al viajero solo.
3. `SUPABASE_SERVICE_ROLE_KEY` jamás en `VITE_` / navegador / repo.
4. Un solo motor de scoring: `lead-scoring-core.ts`.

---

## 5 · Reparto por archivos

| Zona | Archivos |
|---|---|
| **Motor modos** | `src/lib/ai/lead-priority.ts`, `src/lib/data/stats.ts`, `src/lib/user-prefs.ts`, `src/lib/use-lead-priority-mode.ts` |
| **UI selector** | `LeadPriorityModeSelect.tsx`, `MobileLeadsScreen.tsx`, `MobileHomeSummary.tsx`, `MpsCrmApp.tsx` (LeadsPanel) |
| **Lazo / API** | `api/**`, `src/lib/leads/**`, `supabase/schema.sql` |

---

## 6 · Siguiente tarea (UNA)

> **Commit + redeploy** del selector de 4 modos (cuando el dueño lo pida), o
> endurecer Auth Supabase (signup off + primer admin).

---

## 7 · Cómo pasar el testigo

```
Lee @docs/ESTADO.md.
Tarea única: [sección 6].
Si tocas código: npm run lint && npm test && npm run build.
Al terminar: actualiza docs/ESTADO.md.
```
