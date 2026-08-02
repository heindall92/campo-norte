# ESTADO — fuente única de verdad entre agentes

> **Lee este archivo antes de tocar nada y actualízalo antes de terminar.**
> Aquí trabajan varios agentes (Claude Code, Cursor) en hilos que no comparten
> memoria. El chat no es memoria: este archivo sí. Si el chat y el repo se
> contradicen, **manda el repo**.

**Última actualización:** 2026-08-01 · por Claude Code · commit `473416e`

---

## 1 · Dónde está cada cosa

| Rama | Commit | Qué contiene |
|---|---|---|
| `main` | `c31b394` | Producción. **No tiene** nada de lo de abajo. |
| `claude/mobile-30mps-demo-1pxs98` | `473416e` | Todo el trabajo nuevo: vista móvil + lazo de leads. |

La rama de trabajo tiene 8 commits por delante de `main`:

```
473416e  lazo de leads: ingesta real, scoring en servidor, cron diario
0ed3f94  módulos en el centro de la barra + alta desde la cabecera
bc72248  pantallas móviles nativas de Clientes, Reservas y Leads
c519d58  inicio móvil con números reales del Hub + ecosistema
44b3d12  brief de implementación de la demo móvil
9685295  arreglo de altura de la demo en iframe
8ff0d51  versión desplegable de la demo móvil
7760135  demo interactiva de la vista móvil
```

`main` sigue intacto a propósito: nada se mergea hasta que el dueño lo pida.

---

## 2 · Qué está IMPLEMENTADO y verificado

Cada punto está en la rama, con tests o comprobación en navegador.

### Vista móvil
- Inicio: próxima salida, 4 KPI (leads semana, ocupación, saldo pendiente,
  margen) y «Prioridad de hoy» — **todo derivado del Data Hub**, nada fijo.
- Pantallas nativas de **Clientes**, **Reservas** y **Leads** con sus fichas
  desplegables (llamar / WhatsApp por `WhatsAppSecureLink`, cambio de estado,
  itinerario, contactos de logística, scoring con IA).
- Botón de **módulos en el centro de la barra** (acción, no pestaña) y **«+» en
  la cabecera** de Clientes y Reservas, que abre los formularios reales
  (`ClientFormModal` / `ReservationFormModal`).
- Piezas compartidas: `MobileBits.tsx`, `MobileSheet.tsx`.

### Lazo de leads (funciona solo)
- `POST /api/leads/ingest` — valida, deduplica por email, cruza con la cartera,
  puntúa en servidor, asigna responsable, escribe en Supabase y en la bitácora.
  Auth: clave compartida, HMAC del cuerpo, o mismo origen (formulario propio).
- `GET /api/cron/rescore` — repuntúa, marca leads calientes y avisa si la
  ingesta lleva >26 h muda. Agnóstico del reloj. Declarado diario en
  `vercel.json`.
- `/captura` — página pública de captura (el formulario que sí controlamos; el
  de 30mps.com no lo controla el cliente).
- **Decaimiento temporal**: la cola se ordena por `score × e^(−ln2·días/14)`
  **sin reescribir el score guardado**. Visible en móvil y escritorio con la
  etiqueta «enfriado a N».
- **Bug corregido**: el pipeline pasaba `null` en vez del cliente que coincidía,
  así que un repetidor puntuaba como desconocido (hasta −44 puntos).
- Esquema nuevo: `mps_lead_outcomes` (¿reservó?) y `mps_run_log` (ejecuciones
  reales), con RLS.

**Verificación:** `npm run lint`, `npm test` (43 tests, 11 ejecutan la función
de servidor en Node contra un doble de Supabase) y `npm run build`, todo limpio.

---

## 3 · Qué está DECIDIDO pero NO implementado

No lo des por hecho: si lo tocas, lo estás construyendo desde cero.

- **Selector de modo de priorización** (4 modos, decisión cerrada):
  | Modo | Pregunta de negocio | Matemática |
  |---|---|---|
  | Urgencia (por defecto) | ¿A quién se me está enfriando? | `score × e^(−λ·días)` — **ya implementado como orden por defecto** |
  | Dinero esperado | ¿Qué llamada deja más margen? | `p × ticket(ruta) × margen − coste` |
  | Encaje e intención | ¿Cliente ideal *y* con prisa? | dos ejes, decisión por cuadrante |
  | Se parece a quien reservó | ¿Recuerda a mis clientes buenos? | coseno con los k vecinos convertidos |

  Reglas del selector: preferencia por usuario (como el de inactividad),
  **solo reordena, nunca reescribe el score guardado**, y cada ficha explica por
  qué está en esa posición.

- **Fuera de alcance hasta tener datos de desenlace**: regresión logística,
  Naive Bayes por canal, cualquier modelo entrenado. Sin `mps_lead_outcomes`
  con filas reales, darían números bonitos y falsos.

---

## 4 · Qué NO se toca

1. **`main`** — nadie mergea sin que el dueño lo pida.
2. **La regla de oro** — ninguna automatización escribe al viajero. WhatsApp
   siempre por `WhatsAppSecureLink`, con la persona escribiendo el mensaje.
3. **`SUPABASE_SERVICE_ROLE_KEY`** — jamás en una variable `VITE_`, en el
   navegador ni en el repositorio.
4. **Datos inventados presentados como reales.** Si un dato no se puede
   calcular, no se muestra (ejemplo: las plazas de una reserva sin expedición
   que coincida). La cabecera declara si el Hub es semilla o Supabase.
5. **Un solo motor de scoring**: `src/lib/ai/lead-scoring-core.ts`. Si el
   servidor y la pantalla pudieran dar números distintos, el CRM no vale.

---

## 5 · Reparto por archivos (no por «pantallas»)

Para no pisarse, el reparto es por rutas, no por temas:

| Zona | Archivos |
|---|---|
| **Motor y servidor** | `api/**`, `src/lib/ai/**`, `src/lib/leads/**`, `src/lib/data/**`, `supabase/schema.sql` |
| **UI móvil** | `src/components/Mobile*.tsx` |
| **UI escritorio** | `src/components/MpsCrmApp.tsx`, `OpsPanels.tsx`, paneles |
| **Superficie compartida** | `src/App.tsx`, `src/index.css`, `src/lib/i18n.ts` |

Quien toque la **superficie compartida** relee el archivo antes de editar: son
los tres sitios donde es fácil pisarse.

---

## 6 · Siguiente tarea (UNA)

> **Encender Supabase y verificar el lazo en el preview de Vercel.**
> Es configuración, no código: seguir [`docs/LAZO-LEADS.md`](./LAZO-LEADS.md)
> (crear proyecto gratis, ejecutar `supabase/schema.sql`, pegar las variables en
> Vercel, redesplegar) y comprobar con el `curl` de ingesta y con `/captura`
> desde el móvil que el lead entra, se puntúa y aparece en el CRM.

Cuando eso esté verde, la siguiente será el **selector de 4 modos** de la
sección 3.

---

## 7 · Cómo pasar el testigo

Al cambiar de agente, pega esto:

```
Lee @docs/ESTADO.md y trabaja en la rama claude/mobile-30mps-demo-1pxs98.
No reescribas lo que ya está implementado (sección 2).
Tarea única: [una cosa de la sección 6].
Antes de decir que está: npm run lint && npm test && npm run build.
Al terminar: actualiza docs/ESTADO.md (fecha, commit, secciones 1, 2 y 6) y
dime el commit y la URL de preview.
```

**Regla de cierre:** ningún agente dice «hecho» sin que pasen lint, tests y
build, y sin haber actualizado este archivo. Lo que no está aquí, no ha pasado.
