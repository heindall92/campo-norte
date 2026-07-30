import type { Lang } from "@/lib/i18n";

export type PitchBlock =
  | { type: "quote"; text: string }
  | { type: "text"; text: string }
  | { type: "bullets"; items: string[] }
  | { type: "metrics"; items: { label: string; value: string; hint?: string }[] }
  | { type: "table"; headers: string[]; rows: string[][] }
  | { type: "cards"; items: { title: string; body: string; tone?: "brand" | "good" | "warn" }[] }
  | { type: "steps"; items: string[] }
  | { type: "matrix"; cells: { title: string; body: string; quadrant: "hi-lo" | "hi-hi" | "lo-lo" | "lo-hi" }[] };

export type PitchSlide = {
  kicker?: string;
  title: string;
  subtitle?: string;
  blocks: PitchBlock[];
  footer?: string;
};

/**
 * Deck alineado con el CRM real (menú lateral):
 * Data Hub · Dashboard · Leads · Clientes · Reservas · Facturas ·
 * Content · Knowledge · Ecosistema · Propuesta · Presentación · Ajustes
 */
const es: PitchSlide[] = [
  {
    kicker: "Business Case · 30 MPS Adventures",
    title: "De artesanal a escalable, sin dejar de ser 30 MPS",
    subtitle:
      "Propuesta de IA y automatización para el gap a 1M € — y el Growth OS ya desplegado para demostrarlo en vivo.",
    blocks: [
      {
        type: "text",
        text: "Yoandy Ramírez Delgado · Growth Builder · perfil freelance",
      },
      {
        type: "bullets",
        items: [
          "CRM en producción: 30mps.vercel.app",
          "Login · Data Hub · Dashboard · Leads · Clientes · Reservas · Veri*FACTU · Content · Knowledge · n8n",
          "yoandyramirez.com · linkedin.com/in/yoandyrd92 · github.com/heindall92",
        ],
      },
    ],
    footer: "Ningún sistema habla nunca con un cliente. Los sistemas preparan; las personas firman.",
  },
  {
    kicker: "La tesis",
    title: "No es un problema de marketing. Es un problema de memoria y de tiempo.",
    blocks: [
      {
        type: "quote",
        text: "Ningún sistema habla nunca con un cliente. Los sistemas preparan; las personas firman.",
      },
      {
        type: "bullets",
        items: [
          "Producto 5★ — el cuello es sistema, no calidad de viaje",
          "Datos dispersos: Excel, inbox del CEO y Brevo → sin origen ni margen vivo",
          "Miguel demasiado operativo: triaje, seguimiento y contenido en su cabeza",
        ],
      },
    ],
  },
  {
    kicker: "Diagnóstico",
    title: "La matemática del millón",
    subtitle: "Las mismas cifras del business case — visibles también en Dashboard del CRM.",
    blocks: [
      {
        type: "table",
        headers: ["Dato", "Hoy", "2027"],
        rows: [
          ["Facturación", "800.000 €", "1.000.000 €"],
          ["Viajeros", "150", "168"],
          ["Salidas", "10", "14"],
          ["Ticket medio", "5.300 €", "5.950 €"],
          ["Margen / expedición", "no medido → medible en CRM", "30 %"],
        ],
      },
      {
        type: "metrics",
        items: [
          { label: "El gap", value: "200.000 €", hint: "+25 % en dos años" },
          { label: "Dónde mirarlo", value: "Dashboard", hint: "Menú · Dashboard ejecutivo" },
        ],
      },
    ],
  },
  {
    kicker: "Las tres palancas",
    title: "Los 200.000 €, en tres partes — y qué módulo las ataca",
    blocks: [
      {
        type: "cards",
        items: [
          {
            title: "80–110 k € · ocupaciones",
            body: "4 salidas nuevas. En el CRM: Dashboard (ocupación/margen) + Reservas & logística (plazas, prep, estado).",
            tone: "brand",
          },
          {
            title: "45–70 k € · dormidos",
            body: "8–12 reactivaciones. En el CRM: Customer Intelligence (segmento dormido/VIP, LTV) + botones Llamar / WhatsApp.",
            tone: "good",
          },
          {
            title: "40–60 k € · precio",
            body: "+5–8 % en rutas con demanda. En el CRM: margen por expedición en Dashboard + Knowledge (por qué importa el margen).",
            tone: "warn",
          },
        ],
      },
    ],
  },
  {
    kicker: "Cuellos de botella → CRM",
    title: "La raíz — y el botón que la abre",
    blocks: [
      {
        type: "table",
        headers: ["Problema", "Prioridad", "Módulo del CRM", "Qué hace el operador"],
        rows: [
          ["Sin origen de leads", "P0", "Data Hub + Leads", "Ver origen/UTM · import CSV · editar estado"],
          ["Sin margen / BI", "P1", "Dashboard", "Gap 200k · mapa ‘Sin origen’ · margen por ruta"],
          ["CEO demasiado operativo", "P0", "Notificaciones + Ecosistema", "Cola de eventos · flujos n8n · aviso interno"],
          ["Clientes dormidos", "P1", "Clientes 360º", "Prioridad reactivación · WhatsApp / llamar"],
          ["Sin scoring", "P1", "Lead Intelligence", "Score explicado · “La IA solo clasifica”"],
          ["Facturación / gestoría", "P1", "Facturas Veri*FACTU", "REAV 05 · PDF · export gestoría"],
        ],
      },
    ],
    footer: "Para crecer un 25 % no hace falta un modelo de moda. Hace falta medir — y el CRM ya mide.",
  },
  {
    kicker: "Growth OS · ya en producción",
    title: "Una plataforma, no tres proyectos sueltos",
    subtitle: "Stack real del demo: React + Vite · Data Hub local/Supabase · Vercel · login equipo.",
    blocks: [
      {
        type: "steps",
        items: [
          "Fase 1 · Data Hub + CRM + UTM → menú Data Hub (import/export, cobertura de origen)",
          "Fase 2 · Dashboard ejecutivo → gap, procedencia, margen/ocupación",
          "Fase 3 · Lead scoring explicable → Lead Intelligence (alta, estado, origen)",
          "Fase 4 · Customer Intelligence → Clientes 360º + Llamar/WhatsApp/Editar/Borrar",
          "Fase 5 · Knowledge interno → Knowledge Assistant (18 Q&A + fuentes)",
          "Fase 6 · Content Factory → borradores; humano copia a Brevo/WhatsApp",
        ],
      },
      {
        type: "quote",
        text: "Tubería automática de datos → aviso interno → seguimiento humano. Nunca mensaje automático al viajero.",
      },
    ],
  },
  {
    kicker: "Tour demo · 90 segundos",
    title: "Qué pulsar en la reunión con Miguel",
    blocks: [
      {
        type: "steps",
        items: [
          "1 · Login (miguel@30mps.com) → panel usuario + campana de notificaciones",
          "2 · Data Hub → cobertura de origen + import CSV (Quick Win vivo)",
          "3 · Dashboard → gap 200k € y “Sin origen” como cuello #1",
          "4 · Lead Intelligence → score con razones auditables",
          "5 · Clientes → Laura Vidal VIP / LTV · botón WhatsApp (humano)",
          "6 · Reservas → cards recogidas · estado · prep logística",
          "7 · Facturas → frase 10 s Veri*FACTU + export gestoría",
          "8 · Content Factory → “Namibia no se cuenta. Se conduce.” · Copiar",
          "9 · Ecosistema CRM → 12/12 flujos OK · canvas n8n",
          "10 · Presentación (esta) · Propuesta CEO · /legal si preguntan RGPD",
        ],
      },
    ],
  },
  {
    kicker: "Solución A · Data Hub (vivo)",
    title: "Un solo sitio donde vive el negocio",
    blocks: [
      {
        type: "text",
        text: "En el CRM: menú Data Hub. Persistencia local o Postgres/Supabase. Misma fuente que Leads, Clientes, Reservas y Facturas.",
      },
      {
        type: "metrics",
        items: [
          { label: "Campos Quick Win", value: "12+", hint: "ID · origen · campaña · destino · estado · score · owner…" },
          { label: "Acciones", value: "Import / Export", hint: "CSV leads/clientes · backup JSON" },
          { label: "Meta negocio", value: "≥ 90 %", hint: "leads con origen a 60 días" },
        ],
      },
      {
        type: "bullets",
        items: [
          "Botones: Importar leads CSV · Importar clientes · Backup JSON · Recargar · Reset semilla",
          "Cola operativa: leads sin origen · score ≥ 80 · reservas en prep · dormidos/VIP",
        ],
      },
    ],
  },
  {
    kicker: "Solución B · Dashboard + Reservas (vivo)",
    title: "Margen, ocupación y logística — para decidir precio y salidas",
    blocks: [
      {
        type: "quote",
        text: "Si subo el precio un 6 % y pierdo una plaza, ¿gano o pierdo? El Dashboard y Reservas dan el contexto; la decisión sigue siendo humana.",
      },
      {
        type: "bullets",
        items: [
          "Dashboard: YTD · ritmo · gap a 1M · mapa de procedencia · margen % por expedición",
          "Reservas: crear / editar / duplicar / eliminar · estado · checklist prep · lodges/comidas/contactos",
          "Cards siempre recogidas al entrar — el operador las despliega",
          "Cada cambio genera notificación (CONFIRMADA / MODIFICADA / ELIMINADA)",
        ],
      },
    ],
  },
  {
    kicker: "Solución C · Leads + Clientes (vivo)",
    title: "La lista de los diez de hoy",
    blocks: [
      {
        type: "text",
        text: "Lead Intelligence prioriza con score + razones. Customer Intelligence saca VIP, dormidos, embajadores y en riesgo con LTV.",
      },
      {
        type: "cards",
        items: [
          {
            title: "Lead Intelligence",
            body: "Añadir lead · cambiar estado/origen · ver score explicado. Frase clave: «La IA solo clasifica».",
            tone: "brand",
          },
          {
            title: "Customer Intelligence",
            body: "Alta/edición popup · Editar · WhatsApp · Llamar · Eliminar. La llamada la hace una persona.",
            tone: "good",
          },
        ],
      },
      {
        type: "quote",
        text: "El sistema prepara. La persona escribe — desde el correo o WhatsApp de Miguel/Laura. Sin bots al viajero.",
      },
    ],
  },
  {
    kicker: "Dinero · cumplimiento",
    title: "Facturas · Veri*FACTU · REAV clave 05",
    blocks: [
      {
        type: "text",
        text: "Frase para Miguel (10 s): este módulo prepara las facturas para la gestoría con el régimen fiscal de agencias de viajes. Cumple Veri*FACTU (2027).",
      },
      {
        type: "bullets",
        items: [
          "Botón Exportar a gestoría (CSV) · PDF empresarial",
          "Medios: Stripe · Bizum · SEPA · PayPal · depósito · efectivo",
          "Flujo n8n A-06 en OK: export operativo; remisión AEAT por fases hasta 01/01/2027",
        ],
      },
    ],
  },
  {
    kicker: "Contenido · conocimiento · automatización",
    title: "Lo que libera tiempo al equipo — sin tocar al cliente",
    blocks: [
      {
        type: "cards",
        items: [
          {
            title: "Content Factory",
            body: "Editar → Guardar → Copiar → pegar en Brevo/WhatsApp. Voz 30 MPS: «Namibia no se cuenta. Se conduce.»",
            tone: "brand",
          },
          {
            title: "Knowledge Assistant",
            body: "18 preguntas · respuesta + fuentes + «por qué importa». Si no hay dato: «no está en el sistema».",
            tone: "good",
          },
          {
            title: "Ecosistema CRM",
            body: "12 flujos · canvas n8n · plantillas · import/export JSON. WEBHOOK → SET → CRM → IF → aviso interno.",
            tone: "warn",
          },
        ],
      },
    ],
  },
  {
    kicker: "Priorización",
    title: "Impacto / esfuerzo — con el CRM ya entregado",
    blocks: [
      {
        type: "matrix",
        cells: [
          {
            quadrant: "hi-lo",
            title: "Hecho · Quick Win",
            body: "Data Hub + origen + Dashboard + CRM operativo (este panel)",
          },
          {
            quadrant: "hi-hi",
            title: "Siguiente · valor",
            body: "Brevo lectura real · webhooks web · scoring afinado con datos vivos",
          },
          {
            quadrant: "lo-lo",
            title: "Hecho · Knowledge/Content",
            body: "RAG interno demo + Content Factory editables",
          },
          {
            quadrant: "lo-hi",
            title: "Más adelante",
            body: "Motor multimedia / ML ocupación — solo con Hub limpio",
          },
        ],
      },
    ],
  },
  {
    kicker: "Riesgos y traspaso",
    title: "Qué pasa cuando me voy — y qué ya está en el producto",
    blocks: [
      {
        type: "cards",
        items: [
          {
            title: "RGPD",
            body: "Minimización · /legal · aviso cookies técnicas · nunca ficha íntegra a un modelo.",
            tone: "brand",
          },
          {
            title: "Dependencia",
            body: "Export CSV/JSON del Hub. Repo + licencia comercial. Migrar ≠ rescate.",
            tone: "good",
          },
          {
            title: "Sobreingeniería",
            body: "Operable en minutos: login, menú, notificaciones, cards recogidas.",
            tone: "warn",
          },
          {
            title: "Deriva de marca",
            body: "Sin envío automático al cliente. Badge permanente: «Sin mensajes al cliente».",
            tone: "brand",
          },
        ],
      },
    ],
  },
  {
    kicker: "Primeros 90 días · siguientes",
    title: "Roadmap part-time — sobre lo que ya corre",
    blocks: [
      {
        type: "steps",
        items: [
          "Hecho · Growth OS demo en Vercel (login, Hub, CRM, Veri*FACTU, n8n, legal)",
          "Sem. 1 · Sesión Miguel + Laura · Brevo/Excel reales → import al Hub",
          "2–4 · UTM web + webhook formulario → leads vivos",
          "4–8 · Afinar scoring y cola dormidos con datos reales",
          "8–12 · DPA Supabase/Vercel · formación · traspaso grabado",
        ],
      },
      {
        type: "bullets",
        items: [
          "¿Quién será el dueño interno del Hub?",
          "¿Qué rutas se llenan solas?",
          "¿Cuánto entra por recomendación?",
          "¿Qué parte del booking consume más a Laura?",
        ],
      },
    ],
  },
  {
    kicker: "Cierre",
    title: "Este CRM es el mapa… y también el terreno.",
    subtitle: "El objetivo no es que me necesitéis. Es que el sistema os sobreviva a todos.",
    blocks: [
      {
        type: "quote",
        text: "No propongo sustituir el trato humano. Propongo automatizar lo que ocurre detrás del escenario — y aquí está funcionando.",
      },
      {
        type: "text",
        text: "Yoandy Ramírez Delgado · Growth Builder · 30 MPS Growth OS · 30mps.vercel.app",
      },
    ],
    footer: "yoandyramirez.com · linkedin.com/in/yoandyrd92 · github.com/heindall92",
  },
];

const en: PitchSlide[] = [
  {
    kicker: "Business Case · 30 MPS Adventures",
    title: "From craft to scalable — without stopping being 30 MPS",
    subtitle: "AI & automation for the €1M gap — with the Growth OS already live to prove it.",
    blocks: [
      { type: "text", text: "Yoandy Ramírez Delgado · Growth Builder · freelance" },
      {
        type: "bullets",
        items: [
          "Live CRM: 30mps.vercel.app",
          "Login · Hub · Dashboard · Leads · Clients · Bookings · Veri*FACTU · Content · Knowledge · n8n",
        ],
      },
    ],
    footer: "No system ever speaks to a customer. Systems prepare; people close.",
  },
  {
    kicker: "Thesis",
    title: "Not a marketing problem. A memory and time problem.",
    blocks: [
      {
        type: "quote",
        text: "No system ever speaks to a customer. Systems prepare; people close.",
      },
      {
        type: "bullets",
        items: [
          "5★ product — bottleneck is system, not trip quality",
          "Scattered data: sheets, CEO inbox, Brevo",
          "Founder too operational",
        ],
      },
    ],
  },
  {
    kicker: "Diagnosis",
    title: "The math of the million",
    blocks: [
      {
        type: "table",
        headers: ["Metric", "Today", "2027"],
        rows: [
          ["Revenue", "€800,000", "€1,000,000"],
          ["Travelers", "150", "168"],
          ["Departures", "10", "14"],
          ["Avg. ticket", "€5,300", "€5,950"],
          ["Margin / trip", "unmeasured → measurable in CRM", "30%"],
        ],
      },
      {
        type: "metrics",
        items: [
          { label: "Gap", value: "€200,000", hint: "+25% in two years" },
          { label: "Where", value: "Dashboard", hint: "Menu · Executive dashboard" },
        ],
      },
    ],
  },
  {
    kicker: "Three levers",
    title: "€200k in three parts — and which CRM module attacks each",
    blocks: [
      {
        type: "cards",
        items: [
          {
            title: "€80–110k · occupancy",
            body: "Dashboard (margin/occupancy) + Bookings & logistics.",
            tone: "brand",
          },
          {
            title: "€45–70k · dormant",
            body: "Customer Intelligence + Call / WhatsApp buttons.",
            tone: "good",
          },
          {
            title: "€40–60k · price",
            body: "Margin by expedition on Dashboard + Knowledge why it matters.",
            tone: "warn",
          },
        ],
      },
    ],
  },
  {
    kicker: "Bottlenecks → CRM",
    title: "The root — and the button that opens it",
    blocks: [
      {
        type: "table",
        headers: ["Problem", "Pri", "CRM module", "Operator action"],
        rows: [
          ["No lead origin", "P0", "Data Hub + Leads", "See UTM · CSV import · edit status"],
          ["No margin / BI", "P1", "Dashboard", "€200k gap · Unknown origin · margin %"],
          ["CEO overload", "P0", "Notifications + n8n", "Event queue · internal alerts"],
          ["Dormant clients", "P1", "Clients 360°", "Priority · WhatsApp / call"],
          ["No scoring", "P1", "Lead Intelligence", "Explainable score"],
          ["Invoicing pack", "P1", "Veri*FACTU", "REAV 05 · PDF · tax export"],
        ],
      },
    ],
  },
  {
    kicker: "Growth OS · live",
    title: "One platform — not three loose projects",
    blocks: [
      {
        type: "steps",
        items: [
          "Phase 1 · Data Hub + CRM + UTM",
          "Phase 2 · Executive dashboard",
          "Phase 3 · Explainable lead scoring",
          "Phase 4 · Customer Intelligence",
          "Phase 5 · Knowledge assistant",
          "Phase 6 · Content Factory (human publish)",
        ],
      },
    ],
  },
  {
    kicker: "Demo tour · 90 seconds",
    title: "What to click in the meeting with Miguel",
    blocks: [
      {
        type: "steps",
        items: [
          "1 · Login → user menu + notification bell",
          "2 · Data Hub → origin coverage + CSV import",
          "3 · Dashboard → €200k gap + Unknown origin",
          "4 · Lead Intelligence → explained score",
          "5 · Clients → VIP LTV · WhatsApp (human)",
          "6 · Bookings → collapsed cards · status · prep",
          "7 · Invoices → 10s Veri*FACTU line + tax export",
          "8 · Content Factory → copy to Brevo",
          "9 · CRM ecosystem → 12/12 OK flows",
          "10 · This Presentación · CEO proposal · /legal",
        ],
      },
    ],
  },
  {
    kicker: "Solution A · live",
    title: "One place where the business lives",
    blocks: [
      {
        type: "metrics",
        items: [
          { label: "Quick Win fields", value: "12+" },
          { label: "Actions", value: "Import / Export" },
          { label: "Target", value: "≥ 90%", hint: "leads with origin in 60 days" },
        ],
      },
    ],
  },
  {
    kicker: "Solution B · live",
    title: "Margin, occupancy and logistics",
    blocks: [
      {
        type: "bullets",
        items: [
          "Dashboard: gap, origin map, margin %",
          "Bookings: CRUD · status · prep checklist",
          "Cards start collapsed · every change notifies",
        ],
      },
    ],
  },
  {
    kicker: "Solution C · live",
    title: "Today’s list of ten",
    blocks: [
      {
        type: "cards",
        items: [
          {
            title: "Lead Intelligence",
            body: "Add lead · status/origin · explained score. AI only ranks.",
            tone: "brand",
          },
          {
            title: "Customer Intelligence",
            body: "Edit · WhatsApp · Call · Delete. Humans dial.",
            tone: "good",
          },
        ],
      },
    ],
  },
  {
    kicker: "Money · compliance",
    title: "Invoices · Veri*FACTU · REAV key 05",
    blocks: [
      {
        type: "text",
        text: "10s pitch: prepares invoices for the tax advisor under the travel-agency scheme. Ready for Veri*FACTU (2027).",
      },
    ],
  },
  {
    kicker: "Content · knowledge · automation",
    title: "What frees team time — without touching the customer",
    blocks: [
      {
        type: "cards",
        items: [
          {
            title: "Content Factory",
            body: "Edit → Save → Copy → paste into Brevo/WhatsApp.",
            tone: "brand",
          },
          {
            title: "Knowledge",
            body: "18 Q&As · sources · “not in the system”.",
            tone: "good",
          },
          {
            title: "n8n ecosystem",
            body: "12 flows · canvas · never auto-message the traveler.",
            tone: "warn",
          },
        ],
      },
    ],
  },
  {
    kicker: "Prioritization",
    title: "Impact / effort — with the CRM already shipped",
    blocks: [
      {
        type: "matrix",
        cells: [
          {
            quadrant: "hi-lo",
            title: "Done · Quick Win",
            body: "Hub + origin + Dashboard + live CRM",
          },
          {
            quadrant: "hi-hi",
            title: "Next · value",
            body: "Live Brevo read · web form webhooks · scoring on real data",
          },
          {
            quadrant: "lo-lo",
            title: "Done · Knowledge/Content",
            body: "Internal Q&A + editable drafts",
          },
          {
            quadrant: "lo-hi",
            title: "Later",
            body: "ML occupancy — only with a clean Hub",
          },
        ],
      },
    ],
  },
  {
    kicker: "Risks & handover",
    title: "What happens when I leave",
    blocks: [
      {
        type: "cards",
        items: [
          {
            title: "GDPR",
            body: "/legal · technical cookie notice · never full record to a model.",
            tone: "brand",
          },
          {
            title: "Lock-in",
            body: "CSV/JSON export · commercial license · migration ≠ rescue.",
            tone: "good",
          },
          {
            title: "Over-engineering",
            body: "Operable in minutes: login, menu, notifications.",
            tone: "warn",
          },
          {
            title: "Brand drift",
            body: "No auto customer messages — permanent badge.",
            tone: "brand",
          },
        ],
      },
    ],
  },
  {
    kicker: "Next 90 days",
    title: "Part-time roadmap on top of what already runs",
    blocks: [
      {
        type: "steps",
        items: [
          "Done · Growth OS on Vercel",
          "Wk 1 · Miguel + Laura · real Brevo/Excel → Hub",
          "2–4 · Web UTM + form webhook",
          "4–8 · Score + dormant queue on live data",
          "8–12 · DPAs · training · recorded handover",
        ],
      },
    ],
  },
  {
    kicker: "Close",
    title: "This CRM is the map… and the terrain.",
    subtitle: "The goal is not that you need me. It is that the system outlives all of us.",
    blocks: [
      {
        type: "quote",
        text: "I don’t propose replacing human care. I propose automating what happens backstage — and it’s running here.",
      },
      {
        type: "text",
        text: "Yoandy Ramírez Delgado · Growth Builder · 30mps.vercel.app",
      },
    ],
  },
];

export const PITCH_SLIDES: Record<Lang, PitchSlide[]> = { es, en };
