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
  nav_dashboard: "Cuadro de mando",
  nav_leads: "Inteligencia de leads",
  nav_clients: "Inteligencia de clientes",
  nav_reservations: "Reservas y logística",
  nav_invoices: "Facturas · Veri*FACTU",
  nav_content: "Fábrica de contenido",
  nav_knowledge: "Asistente de conocimiento",
  nav_automations: "Ecosistema CRM",
  nav_pitch: "Propuesta Miguel",
  nav_slides: "Presentación",
  nav_hub: "Base de datos",
  nav_settings: "Ajustes",
  dash_title: "De {from} a {to}",
  dash_sub:
    "Ritmo hacia 1M €, de dónde vienen los interesados, ocupación y margen por salida — números vivos del negocio.",
  ytd: "Acumulado año (demo)",
  pace: "Ritmo anualizado",
  gap: "Falta para 1M €",
  travelers: "Viajeros / salidas",
  revenue_attr: "Ingresos y origen",
  revenue_attr_sub: "% de reservas con origen conocido",
  origin_title: "Mapa de procedencia",
  origin_sub: "Incluye ‘Sin origen’ — el cuello de botella nº 1",
  margin_title: "Margen y ocupación por expedición",
  margin_sub: "Objetivo de margen ~{pct}% por salida",
  expedition: "Expedición",
  vehicle: "Vehículo",
  occupancy: "Ocupación",
  revenue: "Ingresos",
  margin: "Margen",
  unknown_origin: "Sin origen",
  leads_queue: "Interesados en cola",
  score_avg: "Puntuación media",
  without_origin: "Sin origen",
  inbox: "Inteligencia de leads",
  inbox_sub: "Prioriza el tiempo comercial. Nada escribe al cliente.",
  detail: "Puntuación explicada",
  detail_sub: "Razones claras — sin caja negra obligatoria",
  human_action: "Acción humana",
  human_action_body:
    "Avisar al responsable y seguimiento manual. La IA solo clasifica.",
  reactivation: "Inteligencia de clientes",
  reactivation_sub: "VIP · dormidos · embajadores · en riesgo — listas para llamar",
  client: "Cliente",
  segment: "Segmento",
  trips: "Viajes",
  last_trip: "Último viaje",
  priority: "Prioridad",
  why: "Por qué",
  content_note: "Fábrica de contenido → newsletter / WhatsApp / interno",
  content_note_body:
    "Plantillas editables de email, guiones WhatsApp y mensajes de equipo. Copias para envío humano; nada se dispara solo al cliente.",
  knowledge_q: "Preguntas internas argumentadas",
  knowledge_a: "Respuesta con fuentes y por qué importa",
  sources: "Fuentes",
  copy_brevo: "Copiar borrador",
  copied: "Copiado",
  automations_title: "Editor de flujos · estilo n8n",
  automations_sub:
    "Arrastrar y soltar · crear/editar/exportar · nodos con valores, formulario y API. Nunca escribe al cliente.",
  footer: "Growth OS · realismo > brillo · media jornada · la newsletter sigue siendo el canal",
  slides_prev: "Anterior",
  slides_next: "Siguiente",
  slides_of: "de",
  lang: "Idioma",
  theme: "Tema",
  theme_light: "Claro",
  theme_dark: "Oscuro",
  hub_title: "Base de datos",
  hub_sub: "Memoria única viva: web + newsletter + hojas + reservas + facturas → ficha lead/cliente (persistente)",
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
  nav_pitch: "Miguel proposal",
  nav_slides: "Pitch deck",
  nav_hub: "Data Hub",
  nav_settings: "Settings",
  dash_title: "From {from} to {to}",
  dash_sub:
    "Pace to €1M, where prospects come from, occupancy and margin per departure — live business numbers.",
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
      title: "Qué quiere Miguel de verdad",
      body: "No otra herramienta más. Un sistema interno que le quite trabajo repetitivo sin masificar ni perder el trato humano de 30 MPS.",
      bullets: [
        "Hoy pierde horas ordenando leads, siguiendo y pensando contenido",
        "El viaje es 5★ — el cuello es el día a día, no la calidad",
        "Sencillo, medible y mantenible a media jornada",
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
      title: "Una sola plataforma",
      body: "Por fases — no tres proyectos sueltos. Convierte Excel + correo + newsletter en una lista clara de a quién llamar y qué decidir.",
      bullets: [
        "Base del negocio · pantalla diaria · leads y clientes priorizados",
        "Reservas · facturas para gestoría · avisos internos",
        "Memoria de la casa + borradores de contenido",
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
      title: "Cómo fluye (en una frase)",
      body: "Web + newsletter + Excel → entra al sistema → se ordena → avisa al equipo → una persona hace el seguimiento.",
      bullets: [
        "Los datos se mueven solos",
        "La conversación con el cliente siempre es humana",
        "Las automatizaciones avisan dentro; nunca fuera",
      ],
    },
    {
      title: "Fase 1 · Orden (2–4 semanas)",
      body: "Cada interesado con origen, destino, estado y responsable. En pocas semanas ya se ve el agujero nº 1.",
      bullets: [
        "Importar Excel / newsletter al mismo sitio",
        "Saber de dónde vino cada lead",
        "Meta a 6 meses: 95 % con origen conocido",
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
      title: "Prioridad · contenido · memoria",
      body: "Lista de a quién llamar, con razones claras. Borradores editables. Preguntas internas con fuentes.",
      bullets: [
        "Top a llamar — la IA no escribe al cliente",
        "Copiar borrador → pegar en newsletter / WhatsApp",
        "Si no hay dato: «no está en el sistema»",
      ],
    },
    {
      title: "Automatizaciones internas",
      body: "Flujos que el equipo puede ver: formulario → sistema → aviso. Nunca un envío automático al viajero.",
      bullets: [
        "Crear / editar / activar / exportar",
        "Vinculados a leads, clientes, reservas y contenido",
        "Cero nodos de mensaje al cliente",
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
      body: "No hablamos de tecnología. Hablamos de resultado de negocio en medio año.",
      bullets: [
        "Saber el origen del 95 % de los leads",
        "Reducir un 60 % el tiempo administrativo del CEO",
        "Reactivar un 15 % de clientes inactivos",
        "Incrementar la ocupación media por expedición",
        "Mejorar el margen por ruta",
        "Disponer de un dashboard actualizado diariamente",
      ],
    },
    {
      title: "Cierre (entrevista)",
      body: "No vengo a sustituir el trato humano. Vengo a quitar lo repetitivo de detrás para que Miguel y el equipo dediquen más tiempo a la confianza y la experiencia premium.",
      bullets: [
        "El sistema informa y prioriza",
        "Las personas construyen la confianza 30 MPS",
        "Se construye para quedaroslo — y poder traspasarlo",
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
      body: "We don’t talk technology. We talk business outcomes in six months.",
      bullets: [
        "Know the origin of 95% of leads",
        "Cut CEO administrative time by 60%",
        "Reactivate 15% of inactive clients",
        "Raise average occupancy per expedition",
        "Improve margin per route",
        "Have a dashboard updated daily",
      ],
    },
    {
      title: "Closing message",
      body: "I don’t propose replacing human care. I propose organizing what happens backstage so Miguel and the team spend more time on trust and the premium experience.",
      bullets: [
        "The system informs and prioritizes",
        "People build 30 MPS trust",
        "Growth Builder builds the pillars — and can hand them over",
      ],
    },
  ],
};

