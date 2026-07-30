# 30 MPS Adventures — Growth OS / CRM interno

> **Confidencial** · Growth Builder (Evolve) · Business case IA y automatización

Plataforma para **Miguel Checa** (Fundador / Managing Director de [30 MPS Adventures](https://30mps.com)): CRM operativo + Data Hub + cuadro de mando, reservas/logística, facturación ES y automatizaciones internas.

**Regla de oro:** nada habla automáticamente con el viajero. La tecnología trabaja detrás; la confianza la cierran personas.

Repo: [`heindall92/30mps`](https://github.com/heindall92/30mps) (**privado** · licencia comercial de pago).

**Licencia:** ver [`LICENSE`](./LICENSE) y [`NOTICE`](./NOTICE). Uso sin contrato/pago = no autorizado.

---

## Arranque

```bash
npm install
npm run dev        # http://localhost:5173
```

Producción estática:

```bash
npm run build
npm run preview    # o: python3 serve.py  → http://0.0.0.0:8080
```

---

## Legal · privacidad · cookies

Ruta pública: [`/legal`](https://30mps.vercel.app/legal) (Aviso legal · Privacidad · Cookies).

- Demo mañana: no crítico (solo equipo interno + datos semilla).
- Producción real: validar textos con asesoría, firmar DPA Vercel/Supabase y mantener registro art. 30 RGPD.

---

## Auth · notificaciones · panel usuario

1. **Login** al entrar (Supabase Auth si hay `.env.local`; si no, cuentas demo del equipo).
2. **Header derecha:** campana de notificaciones + avatar/menú admin (Ajustes / Cerrar sesión).
3. **Eventos:** crear/editar/borrar leads, clientes, reservas, facturas, import CSV, WhatsApp/llamada → alimentan la bandeja de notificaciones.
4. **Reservas:** selector de estado + acciones editar / WhatsApp / llamar / borrar.

Demo local: `miguel@30mps.com` / `30mps2026`

---

## Data Hub (Fase 1 — datos reales)

El CRM ya **persiste** leads, clientes, reservas y facturas.

| Modo | Cuándo | Dónde viven los datos |
|---|---|---|
| **Local** (por defecto) | Sin `.env` | `localStorage` del navegador (sobrevive al refresh) |
| **Supabase / Postgres** | `VITE_DATA_MODE=supabase` | Tablas `mps_*` en tu proyecto Supabase |

### Local → empezar ya

1. Abre la app → sección **Data Hub**
2. Edita leads/clientes/reservas (se guardan solos)
3. **Importar CSV** desde Excel/Brevo export (plantillas en `public/templates/`)
4. **Backup JSON** / restaurar cuando quieras

### Conectar Postgres (Supabase)

1. Crea un proyecto en [Supabase](https://supabase.com)
2. Ejecuta el SQL de [`supabase/schema.sql`](./supabase/schema.sql)
3. Copia [`.env.example`](./.env.example) → `.env.local` y rellena:

```bash
VITE_DATA_MODE=supabase
VITE_SUPABASE_URL=https://xxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJ...
```

4. Reinicia `npm run dev`

Sin credenciales válidas, el Hub cae a modo local con aviso.

### Ollama / OpenAI / Claude / Gemini (Fase 3 + 4 + 5)

1. En el CRM → **Ajustes → IA · proveedores API**
2. Elige **Ollama**, **OpenAI**, **Claude** o **Gemini**, pega la API key, modelo y **Guardar**
3. Links de keys: [Ollama](https://ollama.com/settings) · [OpenAI](https://platform.openai.com/api-keys) · [Claude](https://console.anthropic.com/settings/keys) · [Gemini](https://aistudio.google.com/apikey)
4. **Lead Intelligence** → «Clasificar con IA»
5. **Customer Intelligence** → «Analizar cartera con IA»
6. **Knowledge Assistant** → consulta RAG
7. **Automatizaciones** → flujo A-01 orquestado

Sin API key, el CRM usa **heurística / retrieval local**. La IA **nunca** escribe al viajero.

### CSV de importación

- Leads: `id;name;email;origin;campaign;status;score;interest_route;vehicle;owner;created_at`
- Clientes: `id;name;email;phone;city;country;dni;segment;status;ltv;owner;notes`

Orígenes válidos: `web_form` · `instagram` · `referral` · `brevo_click` · `feria` · `unknown`

---

## Despliegue (Vercel)

```bash
npm i -g vercel
vercel           # preview
vercel --prod    # producción
```

Añade las variables `VITE_*` en el proyecto Vercel si usas Supabase.

- **Framework:** Vite  
- **Build:** `npm run build`  
- **Output:** `dist`

---

## Módulos

| Módulo | Para qué |
|---|---|
| **Data Hub** | Memoria única, import/export, sync local o Postgres |
| Cuadro de mando | Origen de leads (desde Hub), margen/ocupación |
| Leads + scoring | Cola priorizada; **Clasificar con IA** (Ollama o heurística); nunca habla al cliente |
| Clientes 360º | VIP / dormidos / embajadores / en riesgo / alto valor · **cola «contactar este mes»** · avisos internos |
| Ajustes · IA | **Ollama · OpenAI · Claude · Gemini** vía API · scoring / CI / Knowledge / flujos |
| Reservas · logística | CRUD persistente + prep viaje |
| Facturas · Veri*FACTU | REAV 05, PDF, export gestoría desde Hub |
| Ecosistema CRM | **A-01 orquestado** (form→Ollama→aviso) + canvas n8n/Make + export JSON |
| Content Factory | Plantillas (aún seed local) |
| Knowledge / Pitch | **RAG**: preguntar + base documental + Hub vivo · Ollama opcional |

---

## Documentos

| Archivo | Uso |
|---|---|
| [`PROPUESTA.md`](./PROPUESTA.md) | Versión ejecutiva |
| [`PROPUESTA-EXTENDIDA.md`](./PROPUESTA-EXTENDIDA.md) | Informe completo |
| [`supabase/schema.sql`](./supabase/schema.sql) | Schema Data Hub |

---

## Stack

- React 19 · Vite 8 · TypeScript · Tailwind CSS 4  
- Recharts · jsPDF · Lucide · Supabase JS (opcional)  
- Data Hub: localStorage → Postgres vía Supabase  

**Siguiente (Fase 2+):** webhooks formulario/n8n → Hub · Brevo lectura · scoring IA · Auth equipo.

---

## Rol Growth Builder

Growth Operations · Content Engine (apoyo) · AI & Automation — sin gestionar clientes finales ni vender viajes. La IA informa y prioriza; el equipo contacta.
