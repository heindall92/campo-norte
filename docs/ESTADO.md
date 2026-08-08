# ESTADO — fuente única de verdad entre agentes

> **Lee este archivo antes de tocar nada y actualízalo antes de terminar.**
> Aquí trabajan varios agentes (Claude Code, Cursor) en hilos que no comparten
> memoria. El chat no es memoria: este archivo sí. Si el chat y el repo se
> contradicen, **manda el repo**.

**Última actualización:** 2026-08-08 · por Cursor · tip `feat/aurora-patterns` (= `cursor/aurora-patterns-2ebf`) · fase 10 económica/equipo

---

## 1 · Dónde está cada cosa

| Rama | Commit | Qué contiene |
|---|---|---|
| `main` | `1c360c2` | Producción. Móvil + lazo + selector 4 modos + analytics demo. |
| `feat/aurora-patterns` | tip | **Patrones Aurora 1–9**. Preview Vercel. Sin fusionar. |
| `cursor/aurora-patterns-2ebf` | tip | Espejo del tip de `feat/aurora-patterns` (PR Cloud #6). |
| Producción | — | https://30mps.vercel.app |
| Preview Aurora | — | https://30mps-git-feat-aurora-patterns-heindall92.vercel.app |
| Supabase | `gkskudxjuafsidqiiqpg` | **30mps** (eu-west-1). Lazo verificado. |

### Acceso al preview (móvil / pitch)

- URL: https://30mps-git-feat-aurora-patterns-heindall92.vercel.app
- App login demo: `miguel@30mps.com` / `30mps2026` (también laura@ · david@ · ramon@, misma pass).
- Fallback demo activo aunque haya `VITE_SUPABASE_*` (Hub semilla local).
- Si Vercel pide login de la plataforma (Deployment Protection), autenticarse en Vercel; eso es del hosting, no de la app.
- Cerrar demo en prod real: `VITE_STRICT_AUTH=true` o `VITE_ALLOW_DEMO_AUTH=false`.

---

## 2 · Qué está IMPLEMENTADO y verificado

### Vista móvil
- Inicio, Clientes / Reservas / Leads, fichas in-place, módulos en barra.
- Tesorería, **Aprobaciones** y **Equipo** en «Más módulos» (`MobileCrmShell`).

### Lazo de leads
- Ingesta + cron + `/captura` + decay. **Verde en prod** con Supabase.

### Selector de 4 modos (lint/test/build OK)
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

### Patrones Aurora (rama — NO fusionada)

Análisis en `docs/GAP-DEMO.md` y `docs/GAP-DEMO-ANATOMIA.md`.
Referencia conceptual: no hay código, marca ni assets de terceros.

| Fase | Qué | Archivos |
|---|---|---|
| 1 | Tokens 3 capas (paleta → semántica → componente) + formateadores | `src/index.css`, `src/lib/format.ts` |
| 2 | Primitivas: KPI, sparkline, badge, "EN ESTA VISTA", tabla jerárquica | `src/components/ui/**` |
| 3 | Cola "Requiere tu atención" (vista derivada) | `src/lib/attention.ts`, `AttentionPanel.tsx` |
| 4 | Tesorería adaptada (cobrado/pendiente/comprometido + gráficas) | `src/lib/treasury.ts`, `TreasuryPanel.tsx` |
| 5 | Integración: sección `tesoreria` + atención en el cuadro de mando | `MpsCrmApp.tsx`, `roles.ts`, `i18n.ts` |
| 6 | IA contextual cableada + prompts sugeridos (3→6) | `src/lib/ai/ask-bus.ts`, `MpsCrmApp.tsx` |
| 7 | **Bandeja de Aprobaciones** (regla de oro hecha interfaz) | `src/lib/approvals.ts`, `ApprovalsPanel.tsx` |
| 8 | Calendario fiscal AEAT (303/111/390/200) con importe estimado | `src/lib/fiscal-calendar.ts`, `FiscalCalendarPanel.tsx` |
| 9 | Heurística: ruta genérica (sin Mongolia hardcode), cap relación + cola estricta, umbral lead 2 días | `lead-scoring-core.ts`, `attention.ts` |
| 10 | Dashboard/tesorería económicos + conexiones equipo (estructura Aurora, estética 30mps) | `ClosingProjection`, `CashFlowChart`, `team-ops.ts`, `TeamOpsPanel` |

**Verificación automática:** lint, `npm test` (**99**), `npm run build` — limpios.

**Decisiones de alcance (no son olvidos):**
- Runway/burn rate de empresa fuera: sin gasto bancario real. El “por pagar” operativo sí existe: coste de equipo estimado.
- Modelos 111 y 200 sin importe: dependen de nóminas/contabilidad que no hay.
- Laboral RRHH genérico / equity fuera: en su lugar, **Equipo** = tour leader ↔ expedición ↔ dieta×días.
- Aprobar en la bandeja cambia estado (localStorage); no publica al viajero (regla de oro).
- Marca/assets de la demo Aurora: no se copian. Solo estructura, colores semánticos de gráficas y conexiones.

**Bugs corregidos en esta rama:**
- Fase 8: vencimientos fiscales en UTC (evita −1 día al serializar ISO en ES).
- Tesorería y Aprobaciones en `MORE_SECTIONS` móvil.
- ask-bus: consumir `pending` también al recibir el evento (evita relanzar al remontar).

**Validación visual (local, demo auth, 2026-08-08):**
- Escritorio — cola de atención / Tesorería: **PASS**.
- Móvil — Prioridad de hoy: **PARCIAL** (condensada; intencional).
- Móvil — Tesorería: **PASS**. Aprobaciones: entrada añadida tras revisión fases 6–9.

**Pendiente humano:** recorrer preview Vercel (demo login ya sirve) y decidir fusión.

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
| **Aurora — tokens/UI** | `src/index.css`, `src/lib/format.ts`, `src/components/ui/**` |
| **Aurora — atención** | `src/lib/attention.ts`, `AttentionPanel.tsx` |
| **Aurora — tesorería** | `src/lib/treasury.ts`, `TreasuryPanel.tsx` |
| **Aurora — móvil nav** | `MobileCrmShell.tsx` (Más módulos: tesorería, aprobaciones) |
| **Aurora — integración** | `MpsCrmApp.tsx`, `roles.ts`, `i18n.ts` |
| **Aurora — IA contextual** | `src/lib/ai/ask-bus.ts` |
| **Aurora — aprobaciones** | `src/lib/approvals.ts`, `ApprovalsPanel.tsx` |
| **Aurora — fiscal** | `src/lib/fiscal-calendar.ts`, `FiscalCalendarPanel.tsx` |
| **Aurora — scoring** | `src/lib/ai/lead-scoring-core.ts` |
| **Aurora — gráficas/econ** | `ClosingProjection.tsx`, `CashFlowChart.tsx`, tokens `--chart-in/out/forecast` |
| **Aurora — equipo** | `src/lib/team-ops.ts`, `TeamOpsPanel.tsx` |

---

## 6 · Siguiente tarea (UNA)

> **Decidir fusión de Aurora** tras validar el preview Vercel (demo:
> miguel@ / 30mps2026). No fusionar ni desplegar hasta que lo pida el dueño.

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
