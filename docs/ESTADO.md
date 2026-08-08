# ESTADO — fuente única de verdad entre agentes

> **Lee este archivo antes de tocar nada y actualízalo antes de terminar.**
> Aquí trabajan varios agentes (Claude Code, Cursor) en hilos que no comparten
> memoria. El chat no es memoria: este archivo sí. Si el chat y el repo se
> contradicen, **manda el repo**.

**Última actualización:** 2026-08-08 · por Claude Code · tip `feat/aurora-patterns`

---

## 1 · Dónde está cada cosa

| Rama | Commit | Qué contiene |
|---|---|---|
| `main` | `545aa04` | Producción. Móvil + lazo + **selector 4 modos**. |
| `feat/aurora-patterns` | `32a50d4` | **Patrones de demo Aurora**: tokens 3 capas, KPI, cola de atención, tesorería. Sin fusionar. |
| Producción | — | https://30mps.vercel.app |
| Supabase | `gkskudxjuafsidqiiqpg` | **30mps** (eu-west-1). Lazo verificado. |

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

### Patrones Aurora (rama `feat/aurora-patterns` — NO fusionada)

Análisis en `docs/GAP-DEMO.md` y `docs/GAP-DEMO-ANATOMIA.md`.
Referencia conceptual: no hay código, marca ni assets de terceros.

| Fase | Qué | Archivos |
|---|---|---|
| 1 | Tokens 3 capas (paleta → semántica → componente) + formateadores | `src/index.css`, `src/lib/format.ts` |
| 2 | Primitivas: KPI, sparkline, badge, "EN ESTA VISTA", tabla jerárquica | `src/components/ui/**` |
| 3 | Cola "Requiere tu atención" (vista derivada) | `src/lib/attention.ts`, `AttentionPanel.tsx` |
| 4 | Tesorería adaptada (cobrado/pendiente/comprometido + gráficas) | `src/lib/treasury.ts`, `TreasuryPanel.tsx` |
| 5 | Integración: sección `tesoreria` + atención en el cuadro de mando | `MpsCrmApp.tsx`, `roles.ts`, `i18n.ts` |

**Verificación:** lint, `npm test` (**68**), `npm run build` — limpios.
**Pendiente:** validación visual con sesión iniciada en el preview de Vercel.

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

> **Validar `feat/aurora-patterns` en el preview de Vercel** con sesión
> iniciada: cuadro de mando (cola de atención) y sección Tesorería, en
> escritorio y en móvil. Después decidir fusión.

Después, en cola: endurecer Auth Supabase (desactivar alta pública y promover
el primer admin en `mps_profiles`).

### Plan B — repo público (fecha límite 2026-08-22)

Si no hay contacto ni entrevista de 30 MPS, se generaliza y se publica:
quitar marca, temática moto/4x4 y los PDF del business case ajeno; dejar un
CRM genérico con motor de leads reutilizable. Los tokens de la fase 1 son
justo lo que abarata ese rebrand: se edita la capa 1, no 44 componentes.

---

## 7 · Cómo pasar el testigo

```
Lee @docs/ESTADO.md.
Tarea única: [sección 6].
Si tocas código: npm run lint && npm test && npm run build.
Al terminar: actualiza docs/ESTADO.md.
```
