export type Lang = "es" | "en";

type Dict = Record<string, string>;

const es: Dict = {
  brand_sub: "Adventures · Growth OS",
  internal_only: "Solo equipo interno",
  demo_badge: "Demo · datos ficticios",
  live_badge_local: "Hub local · datos vivos",
  live_badge_local_seed: "Hub local · semilla editable",
  live_badge_supabase: "Hub Postgres · Supabase",
  no_client_msgs: "Sin mensajes al cliente",
  nav_dashboard: "Dashboard ejecutivo",
  nav_leads: "Lead Intelligence",
  nav_clients: "Customer Intelligence",
  nav_reservations: "Reservas & logística",
  nav_invoices: "Facturas · Veri*FACTU",
  nav_content: "Content Factory",
  nav_knowledge: "Knowledge Assistant",
  nav_automations: "Ecosistema CRM",
  nav_pitch: "Propuesta CEO",
  nav_slides: "Presentación",
  nav_hub: "Data Hub",
  nav_settings: "Ajustes",
  dash_title: "De {from} a {to}",
  dash_sub:
    "Una pantalla para decidir: ocupación, margen, origen y embudo. La tech ordena; las personas cierran.",
  ytd: "YTD (demo)",
  pace: "Ritmo anualizado",
  gap: "Gap a 1M",
  travelers: "Viajeros / salidas",
  revenue_attr: "Ingresos y atribución",
  revenue_attr_sub: "% de reservas con origen conocido",
  origin_title: "Mapa de procedencia",
  origin_sub: "Incluye ‘Sin origen’ — el cuello de botella #1",
  margin_title: "Margen y ocupación por expedición",
  margin_sub: "Objetivo de margen ~{pct}% por salida",
  expedition: "Expedición",
  vehicle: "Vehículo",
  occupancy: "Ocupación",
  revenue: "Ingresos",
  margin: "Margen",
  unknown_origin: "Sin origen",
  leads_queue: "Leads en cola",
  score_avg: "Score medio",
  without_origin: "Sin origen",
  inbox: "Lead Intelligence",
  inbox_sub: "Prioriza el tiempo comercial. Nada escribe al cliente.",
  detail: "Score explicado",
  detail_sub: "Razones auditables — sin black-box obligatorio",
  human_action: "Acción humana",
  human_action_body:
    "Avisar al responsable y seguimiento manual. La IA solo clasifica.",
  reactivation: "Customer Intelligence",
  reactivation_sub: "VIP · dormidos · embajadores · en riesgo — listas para llamar",
  client: "Cliente",
  segment: "Segmento",
  trips: "Viajes",
  last_trip: "Último viaje",
  priority: "Prioridad",
  why: "Por qué",
  content_note: "Content Factory → Brevo / WhatsApp / interno",
  content_note_body:
    "Plantillas editables de email, guiones WhatsApp y mensajes de equipo. Copias para envío humano; nada se dispara solo al cliente.",
  knowledge_q: "Preguntas internas argumentadas",
  knowledge_a: "Respuesta con fuentes y por qué importa",
  sources: "Fuentes",
  copy_brevo: "Copiar borrador",
  copied: "Copiado",
  automations_title: "Editor de flujos · estilo n8n",
  automations_sub:
    "Arrastrar y soltar · crear/editar/exportar · nodos con values, form y API. Nunca escribe al cliente.",
  footer: "Growth OS · realismo > brillo · part-time · Brevo sigue siendo el canal",
  slides_prev: "Anterior",
  slides_next: "Siguiente",
  slides_of: "de",
  lang: "Idioma",
  theme: "Tema",
  theme_light: "Claro",
  theme_dark: "Oscuro",
  hub_title: "Data Hub",
  hub_sub: "Memoria única viva: web + Brevo + hojas + reservas + facturas → ficha lead/cliente (persistente)",
};

const en: Dict = {
  brand_sub: "Adventures · Growth OS",
  internal_only: "Internal team only",
  demo_badge: "Demo · fictional data",
  live_badge_local: "Local Hub · live data",
  live_badge_local_seed: "Local Hub · editable seed",
  live_badge_supabase: "Postgres Hub · Supabase",
  no_client_msgs: "No customer-facing messages",
  nav_dashboard: "Executive dashboard",
  nav_leads: "Lead Intelligence",
  nav_clients: "Customer Intelligence",
  nav_reservations: "Bookings & logistics",
  nav_invoices: "Invoices · Veri*FACTU",
  nav_content: "Content Factory",
  nav_knowledge: "Knowledge Assistant",
  nav_automations: "CRM ecosystem",
  nav_pitch: "CEO proposal",
  nav_slides: "Pitch deck",
  nav_hub: "Data Hub",
  nav_settings: "Settings",
  dash_title: "From {from} to {to}",
  dash_sub:
    "One screen to decide: occupancy, margin, origin and funnel. Tech ranks; people close.",
  ytd: "YTD (demo)",
  pace: "Annualized pace",
  gap: "Gap to €1M",
  travelers: "Travelers / departures",
  revenue_attr: "Revenue & attribution",
  revenue_attr_sub: "% of bookings with known origin",
  origin_title: "Origin map",
  origin_sub: "Includes ‘Unknown’ — bottleneck #1",
  margin_title: "Margin & occupancy by expedition",
  margin_sub: "Target margin ~{pct}% per departure",
  expedition: "Expedition",
  vehicle: "Vehicle",
  occupancy: "Occupancy",
  revenue: "Revenue",
  margin: "Margin",
  unknown_origin: "Unknown",
  leads_queue: "Leads in queue",
  score_avg: "Avg. score",
  without_origin: "No origin",
  inbox: "Lead Intelligence",
  inbox_sub: "Prioritizes sales time. Nothing messages the customer.",
  detail: "Explained score",
  detail_sub: "Auditable reasons — no mandatory black box",
  human_action: "Human action",
  human_action_body: "Notify owner and follow up manually. AI only ranks.",
  reactivation: "Customer Intelligence",
  reactivation_sub: "VIP · dormant · ambassadors · at risk — lists to call",
  client: "Client",
  segment: "Segment",
  trips: "Trips",
  last_trip: "Last trip",
  priority: "Priority",
  why: "Why",
  content_note: "Content Factory → Brevo / WhatsApp / internal",
  content_note_body:
    "Editable email templates, WhatsApp scripts and team messages. Copy for human send; nothing auto-fires to the customer.",
  copy_brevo: "Copy draft",
  copied: "Copied",
  knowledge_q: "Argued internal questions",
  knowledge_a: "Answer with sources and why it matters",
  sources: "Sources",
  automations_title: "Flow editor · n8n-style",
  automations_sub:
    "Drag and drop · create/edit/export · nodes with values, form and API. Never messages the customer.",
  footer: "Growth OS · realism > shine · part-time · Brevo remains the email channel",
  slides_prev: "Previous",
  slides_next: "Next",
  slides_of: "of",
  lang: "Language",
  theme: "Theme",
  theme_light: "Light",
  theme_dark: "Dark",
  hub_title: "Data Hub",
  hub_sub: "Live single memory: web + Brevo + sheets + bookings + invoices → lead/client record (persistent)",
};

export const I18N: Record<Lang, Dict> = { es, en };

export function t(lang: Lang, key: string, vars?: Record<string, string | number>) {
  let s = I18N[lang][key] ?? I18N.es[key] ?? key;
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      s = s.replace(`{${k}}`, String(v));
    }
  }
  return s;
}

export type Slide = { title: string; body: string; bullets?: string[] };

export const SLIDES: Record<Lang, Slide[]> = {
  es: [
    {
      title: "Qué quiere realmente Miguel",
      body: "No otra herramienta suelta. Una infraestructura de crecimiento que reduzca su dependencia operativa sin masificar ni perder el trato humano que diferencia a 30 MPS.",
      bullets: [
        "CEO demasiado operativo hoy (triaje, seguimiento, contenido)",
        "Producto 5★ — el cuello es sistema, no calidad de viaje",
        "Sencillo, medible, mantenible part-time (Growth Builder)",
      ],
    },
    {
      title: "La regla de oro",
      body: "Todas las soluciones son internas. Nunca interacción automática con el viajero. La tecnología trabaja detrás; la confianza la cierran personas.",
      bullets: [
        "Brevo sigue siendo el canal de email (envío humano)",
        "WhatsApp = guion + clic humano, no bot",
        "Knowledge y Content Factory solo para el equipo",
      ],
    },
    {
      title: "30 MPS Growth OS",
      body: "Una plataforma por fases — no tres proyectos sueltos. Convierte Excel + correo + Brevo en decisiones y acción comercial priorizada.",
      bullets: [
        "Data Hub · Dashboard · Lead + Customer Intelligence",
        "Reservas/logística · Facturas Veri*FACTU · Ecosistema n8n",
        "Knowledge + Content Factory editables",
      ],
    },
    {
      title: "Diagnóstico (dolor medible)",
      body: "El producto funciona. Falta memoria única, origen de leads y reactivación de dormidos.",
      bullets: [
        ">70 % reservas sin origen atribuido (brief)",
        "Datos en hojas, inbox del CEO y Brevo",
        "~55–65 % clientes con un solo viaje (palanca #1)",
        "Sin cuadro de mando vivo ni CRM de verdad",
      ],
    },
    {
      title: "Arquitectura en una imagen",
      body: "Web + Brevo + hojas → n8n/Make → Data Hub → CRM / Score / CI / Reservas / Facturas → aviso interno → seguimiento humano.",
      bullets: [
        "Tubería automática de datos",
        "Conversación siempre humana",
        "Editor de flujos estilo n8n vinculado a módulos CRM",
      ],
    },
    {
      title: "Fase 1 · Data Hub (quick win)",
      body: "Cada lead/cliente con origen, campaña, destino, estado, score y owner. En 2–4 semanas el cuello #1 (origen) ya es visible.",
      bullets: [
        "Airtable/Postgres + n8n + lectura Brevo",
        "UTM obligatorios en captación",
        "Meta 6 meses: 95 % leads con origen",
      ],
    },
    {
      title: "Customer + Reservas + Dinero",
      body: "Fichas 360º, logística real (lodges, comidas, contactos) y cobros multi-canal. La promesa «lo organizamos todo» hecha sistema editable.",
      bullets: [
        "Clientes: alta/edición popup · LTV · pago · docs",
        "Reservas: crear/editar/eliminar · prep checklist",
        "Stripe · Bizum · SEPA · PayPal · depósito · efectivo",
      ],
    },
    {
      title: "Facturas · Veri*FACTU · gestoría",
      body: "Facturación estilo agencia ES: REAV clave 05, PDF empresarial, export CSV listo para asesor. Citas legales contraíbles (LGT, RD 1007/2023, HAC/1177/2024, RD-ley 15/2025).",
      bullets: [
        "Mención REAV · base = margen · hash demo",
        "Deadline IS 01/01/2027 — construir ahora",
        "Un extracto, no cuatro Excels",
      ],
    },
    {
      title: "Lead scoring + Content + Knowledge",
      body: "Priorizar tiempo comercial con score explicable. Content Factory con plantillas editables (email, WhatsApp, internos). Knowledge con preguntas argumentadas y fuentes.",
      bullets: [
        "Top-N a llamar — la IA no escribe al cliente",
        "Copiar plantilla → pegar en Brevo/WhatsApp",
        "RAG interno: ops, margen, legal, clientes, stack",
      ],
    },
    {
      title: "Ecosistema CRM (n8n-like)",
      body: "Editor visual libre: plantillas, nodos CRM, conectar a mano, import/export JSON. Automatizaciones que se vinculan a Hub, leads, clientes, reservas, facturas y contenido.",
      bullets: [
        "Crear / editar / duplicar / activar / exportar",
        "Values · form · API · vínculo a módulo CRM",
        "Nunca nodo de envío automático al viajero",
      ],
    },
    {
      title: "Roadmap 4 meses (part-time)",
      body: "Realista con 8–12 h/semana. Mes 4 = KPIs, formación y traspaso.",
      bullets: [
        "Mes 1 · Data Hub + CRM + dashboard",
        "Mes 2 · Scoring + Customer Intelligence + reservas",
        "Mes 3 · Veri*FACTU + RAG + Content Factory",
        "Mes 4 · Optimización · formación · entrega",
      ],
    },
    {
      title: "KPIs de negocio (6 meses)",
      body: "No hablamos de modelos de moda. Hablamos de resultado para el gap a 1M €.",
      bullets: [
        "95 % leads/reservas con origen",
        "−60 % tiempo admin. CEO (baseline medible)",
        "~15 % dormidos reactivados (10–15 reservas/año)",
        "Mejor ocupación, margen ~30 %, LTV y ROI canal",
        "Dashboard diario + export gestoría semanal",
      ],
    },
    {
      title: "Mensaje de cierre",
      body: "No propongo sustituir el trato humano. Propongo automatizar lo que ocurre detrás del escenario para que Miguel y el equipo dediquen más tiempo a la confianza y la experiencia premium.",
      bullets: [
        "IA = información y eficiencia",
        "Personas = confianza 30 MPS",
        "Growth Builder construye los pilares — y se puede traspasar",
      ],
    },
  ],
  en: [
    {
      title: "What Miguel really wants",
      body: "Not another loose tool. Growth infrastructure that cuts founder dependency without massifying or losing the human care that defines 30 MPS.",
      bullets: [
        "CEO too operational today (triage, follow-up, content)",
        "5★ product — the bottleneck is system, not trip quality",
        "Simple, measurable, maintainable part-time (Growth Builder)",
      ],
    },
    {
      title: "The golden rule",
      body: "All solutions are internal. Never automatic interaction with the traveler. Tech works backstage; people close trust.",
      bullets: [
        "Brevo stays the email channel (human send)",
        "WhatsApp = script + human click, not a bot",
        "Knowledge and Content Factory are team-only",
      ],
    },
    {
      title: "30 MPS Growth OS",
      body: "One phased platform — not three loose projects. Turns sheets + inbox + Brevo into decisions and prioritized sales action.",
      bullets: [
        "Data Hub · Dashboard · Lead + Customer Intelligence",
        "Bookings/logistics · Veri*FACTU invoices · n8n ecosystem",
        "Editable Knowledge + Content Factory",
      ],
    },
    {
      title: "Diagnosis (measurable pain)",
      body: "The product works. Missing: single memory, lead origin and dormant reactivation.",
      bullets: [
        ">70 % bookings without attributed origin (brief)",
        "Data in sheets, CEO inbox and Brevo",
        "~55–65 % one-trip clients (lever #1)",
        "No live dashboard or real CRM",
      ],
    },
    {
      title: "Architecture in one picture",
      body: "Web + Brevo + sheets → n8n/Make → Data Hub → CRM / Score / CI / Bookings / Invoices → internal alert → human follow-up.",
      bullets: [
        "Automated data pipeline",
        "Conversation always human",
        "n8n-style flow editor linked to CRM modules",
      ],
    },
    {
      title: "Phase 1 · Data Hub (quick win)",
      body: "Every lead/client with origin, campaign, destination, status, score and owner. In 2–4 weeks bottleneck #1 (origin) is visible.",
      bullets: [
        "Airtable/Postgres + n8n + Brevo read",
        "Mandatory UTMs on capture",
        "6-month goal: 95 % leads with origin",
      ],
    },
    {
      title: "Customers + Bookings + Money",
      body: "360° records, real logistics (lodges, meals, contacts) and multi-rail payments. “We organise everything” as an editable system.",
      bullets: [
        "Clients: popup create/edit · LTV · payment · docs",
        "Bookings: create/edit/delete · prep checklist",
        "Stripe · Bizum · SEPA · PayPal · deposit · cash",
      ],
    },
    {
      title: "Invoices · Veri*FACTU · tax pack",
      body: "Spanish travel-agency invoicing: REAV key 05, business PDF, CSV export for the advisor. Collapsible legal citations (LGT, RD 1007/2023, HAC/1177/2024, RD-ley 15/2025).",
      bullets: [
        "REAV mention · base = margin · demo hash",
        "IS deadline 01/01/2027 — build now",
        "One extract, not four spreadsheets",
      ],
    },
    {
      title: "Lead scoring + Content + Knowledge",
      body: "Prioritize sales time with explainable score. Content Factory with editable templates (email, WhatsApp, internal). Knowledge with argued Q&A and sources.",
      bullets: [
        "Top-N to call — AI never messages the client",
        "Copy template → paste into Brevo/WhatsApp",
        "Internal RAG: ops, margin, legal, clients, stack",
      ],
    },
    {
      title: "CRM ecosystem (n8n-like)",
      body: "Free visual editor: templates, CRM nodes, manual connect, import/export JSON. Automations linked to Hub, leads, clients, bookings, invoices and content.",
      bullets: [
        "Create / edit / duplicate / enable / export",
        "Values · form · API · CRM module link",
        "Never an auto-send node to the traveler",
      ],
    },
    {
      title: "4-month roadmap (part-time)",
      body: "Realistic at 8–12 h/week. Month 4 = KPIs, training and handover.",
      bullets: [
        "Month 1 · Data Hub + CRM + dashboard",
        "Month 2 · Scoring + Customer Intelligence + bookings",
        "Month 3 · Veri*FACTU + RAG + Content Factory",
        "Month 4 · Optimization · training · handover",
      ],
    },
    {
      title: "Business KPIs (6 months)",
      body: "We don’t talk trendy models. We talk outcomes for the gap to €1M.",
      bullets: [
        "95 % leads/bookings with origin",
        "−60 % CEO admin time (measurable baseline)",
        "~15 % dormants reactivated (10–15 bookings/year)",
        "Better occupancy, ~30 % margin, LTV and channel ROI",
        "Daily dashboard + weekly tax-advisor export",
      ],
    },
    {
      title: "Closing message",
      body: "I don’t propose replacing human care. I propose automating what happens backstage so Miguel and the team spend more time on trust and the premium experience.",
      bullets: [
        "AI = insight and efficiency",
        "People = 30 MPS trust",
        "Growth Builder builds the pillars — and can hand them over",
      ],
    },
  ],
};

