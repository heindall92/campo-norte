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

const es: PitchSlide[] = [
  {
    kicker: "Business Case · 30 MPS Adventures",
    title: "De artesanal a escalable, sin dejar de ser 30 MPS",
    subtitle: "Propuesta de IA y automatización para llegar al millón en 2027",
    blocks: [
      {
        type: "text",
        text: "Yoandy Ramírez Delgado · Growth Builder · perfil freelance",
      },
      {
        type: "bullets",
        items: [
          "yoandyramirez.com",
          "linkedin.com/in/yoandyrd92",
          "github.com/heindall92",
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
          "El producto es 5★ — el cuello es sistema, no calidad de viaje",
          "Datos dispersos: Excel, inbox del CEO y Brevo",
          "Sin atribución, sin margen por ruta, demasiada dependencia del fundador",
        ],
      },
    ],
  },
  {
    kicker: "Perfil",
    title: "La tecnología que construyo tiene que sobrevivir sin mí.",
    blocks: [
      {
        type: "cards",
        items: [
          {
            title: "Trayectoria",
            body: "+4 años Técnico en Sistemas y Redes (homologado ES) · Máster Ciberseguridad & IA — Evolve Academy (2026) · eJPTv2 · Google IT · Cisco · IBM · HTB Level 8 · Top 0,31 % Sherlocks",
            tone: "brand",
          },
          {
            title: "Por qué importa para 30 MPS",
            body: "Sistemas seguros, auditables y transferibles. Entrego código, documentación y manual — sin crear dependencia. Perfil freelance / part-time alineado con vuestra operativa.",
            tone: "good",
          },
        ],
      },
      {
        type: "text",
        text: "Lepe, Huelva · remoto · disponibilidad inmediata",
      },
    ],
  },
  {
    kicker: "Diagnóstico",
    title: "La matemática del millón",
    blocks: [
      {
        type: "table",
        headers: ["Dato", "Hoy", "2027"],
        rows: [
          ["Facturación", "800.000 €", "1.000.000 €"],
          ["Viajeros", "150", "168"],
          ["Salidas", "10", "14"],
          ["Ticket medio", "5.300 €", "5.950 €"],
          ["Margen / expedición", "no medido", "30 %"],
        ],
      },
      {
        type: "metrics",
        items: [
          { label: "El gap", value: "200.000 €", hint: "+25 % en dos años" },
        ],
      },
    ],
  },
  {
    kicker: "Los 200.000 €, en tres partes",
    title: "Las tres palancas",
    blocks: [
      {
        type: "cards",
        items: [
          {
            title: "80–110 k €",
            body: "4 salidas nuevas sobre rutas existentes. Depende de saber qué rutas se llenan.",
            tone: "brand",
          },
          {
            title: "45–70 k €",
            body: "Reactivar 8–12 clientes dormidos. Depende de saber quién es reactivable.",
            tone: "good",
          },
          {
            title: "40–60 k €",
            body: "Precio +5–8 % en rutas de mayor demanda. Depende de saber el margen real por salida.",
            tone: "warn",
          },
        ],
      },
    ],
  },
  {
    kicker: "Cuellos de botella",
    title: "La raíz",
    blocks: [
      {
        type: "steps",
        items: [
          "01 · Sin atribución de origen — prioridad máxima",
          "02 · Sin margen por ruta",
          "03 · Todo pasa por el fundador",
          "04 · Activo dormido — solo funciona si 01 y 02 están resueltos",
        ],
      },
      {
        type: "quote",
        text: "Para crecer un 25 % no hace falta un modelo. Hace falta medir.",
      },
    ],
  },
  {
    kicker: "Priorización",
    title: "Impacto / esfuerzo",
    blocks: [
      {
        type: "matrix",
        cells: [
          {
            quadrant: "hi-lo",
            title: "Alto impacto · bajo esfuerzo",
            body: "Núcleo de datos + atribución ★ · Quick win: origen y ocupación",
          },
          {
            quadrant: "hi-hi",
            title: "Alto impacto · alto esfuerzo",
            body: "Margen por ruta + simulador · Reactivación priorizada (scoring)",
          },
          {
            quadrant: "lo-lo",
            title: "Bajo impacto · bajo esfuerzo",
            body: "Asistente interno RAG",
          },
          {
            quadrant: "lo-hi",
            title: "Bajo impacto · alto esfuerzo",
            body: "Motor de contenido interno",
          },
        ],
      },
      {
        type: "text",
        text: "Fases 1 a 3 en los primeros 90 días. 4 y 5, con el tiempo liberado.",
      },
    ],
  },
  {
    kicker: "Solución A · 3–4 semanas",
    title: "Un solo sitio donde vive el negocio",
    blocks: [
      {
        type: "text",
        text: "Tres tablas vivas: Contactos, Salidas, Reservas. Cada lead entra con su origen. Airtable / Postgres · n8n · Looker · WordPress + UTM.",
      },
      {
        type: "metrics",
        items: [
          { label: "Leads con origen (60 días)", value: "≥ 90 %" },
          { label: "Cierre mensual de datos", value: "< 30 min" },
          { label: "Rutina semanal", value: "10 min" },
        ],
      },
    ],
  },
  {
    kicker: "Solución B · 2–3 semanas",
    title: "Margen por ruta, con simulador",
    blocks: [
      {
        type: "quote",
        text: "Si subo el precio un 6 % y pierdo una plaza, ¿gano o pierdo? Respuesta en 30 segundos.",
      },
      {
        type: "bullets",
        items: [
          "Punto de equilibrio en plazas",
          "Margen de la plaza marginal",
          "Margen proyectado por salida",
          "100 % salidas nuevas con margen proyectado · < 5 pts desviación real vs proyectado",
        ],
      },
    ],
  },
  {
    kicker: "Solución C · 4–6 semanas",
    title: "La lista de los diez de hoy",
    blocks: [
      {
        type: "text",
        text: "Cada semana: diez personas a las que merece la pena escribir, con el motivo delante. Scoring híbrido: reglas legibles + modelo que solo lee y clasifica.",
      },
      {
        type: "quote",
        text: "El sistema prepara. La persona escribe. El borrador se envía desde el correo de Miguel, con su firma y su tono. Sin excepciones.",
      },
    ],
  },
  {
    kicker: "Quick win · 2–3 semanas · 0 € en licencias",
    title: "Origen y ocupación desde el día uno",
    blocks: [
      {
        type: "steps",
        items: [
          "01 · Formulario único con UTM y «¿cómo nos conociste?»",
          "02 · Registro de leads y reservas: 12 campos mínimos",
          "03 · Panel v0 con los seis números, a diario",
          "04 · Retro-carga de 12 meses de reservas",
        ],
      },
      {
        type: "quote",
        text: "El entregable es vuestro, no mío: sirve incluso si mañana no seguís conmigo.",
      },
    ],
  },
  {
    kicker: "Riesgos y traspaso",
    title: "Qué pasa cuando me voy",
    blocks: [
      {
        type: "cards",
        items: [
          {
            title: "RGPD",
            body: "Minimización y contexto pseudonimizado. Nunca la ficha íntegra a un modelo.",
            tone: "brand",
          },
          {
            title: "Dependencia",
            body: "Todo en CSV exportable. Migrar es un día de trabajo, no un rescate.",
            tone: "good",
          },
          {
            title: "Sobreingeniería",
            body: "Nada que no se opere en 10 minutos por semana sin perfil técnico.",
            tone: "warn",
          },
          {
            title: "Deriva de marca",
            body: "Ningún sistema escribe al cliente. Sin «solo esta vez».",
            tone: "brand",
          },
        ],
      },
      {
        type: "text",
        text: "Manual de una página por sistema, vídeo de 5 minutos por flujo, traspaso grabado. Todo en cuentas de 30 MPS desde el primer día.",
      },
    ],
  },
  {
    kicker: "Para arrancar",
    title: "Lo que necesito en la primera semana",
    blocks: [
      {
        type: "cards",
        items: [
          {
            title: "Datos",
            body: "Export Brevo (2 años) · histórico de reservas en Excel · lista completa de leads",
          },
          {
            title: "Accesos",
            body: "WordPress (lectura) · Google Analytics · Brevo · hosting/dominio si hay UTM",
          },
          {
            title: "Personas",
            body: "1 sesión Miguel (2 h, sem. 1) · 1 sesión Laura sobre reservas (1 h)",
          },
          {
            title: "Decisiones",
            body: "Confirmar herramienta (Airtable u otra) · validar las 3 asunciones del modelo de margen",
          },
        ],
      },
    ],
    footer: "Todo en cuentas de 30 MPS desde el primer día. Si el proyecto no continúa, los sistemas y los datos son vuestros.",
  },
  {
    kicker: "Primeros 90 días",
    title: "Roadmap, y lo que os pregunto hoy",
    blocks: [
      {
        type: "steps",
        items: [
          "Sem. 1 · Sesiones Miguel y Laura · inventario · supuestos",
          "2–3 · Quick win: origen + registro + panel v0",
          "3–5 · Modelo de margen por ruta + simulador",
          "5–8 · CRM ligero completo · procedimientos escritos",
          "8–12 · Scoring de leads · primera cola de reactivación",
        ],
      },
      {
        type: "bullets",
        items: [
          "¿Hay techo operativo antes de 14 salidas?",
          "¿Qué rutas se llenan solas?",
          "¿Cuánto entra por recomendación?",
          "¿Quién será el dueño interno del sistema?",
          "¿Qué parte del proceso de reserva consume más tiempo a Laura hoy?",
          "¿Existe seguimiento post-viaje o se hace ad hoc?",
          "¿Cuál es el canal con más leads de los últimos 12 meses?",
          "¿Hay alguna ruta descartada por no saber si era rentable?",
        ],
      },
    ],
  },
  {
    kicker: "Cierre",
    title: "Este documento es un mapa, no un destino.",
    subtitle: "El objetivo no es que me necesitéis. Es que el sistema os sobreviva a todos.",
    blocks: [
      {
        type: "quote",
        text: "No propongo sustituir el trato humano. Propongo automatizar lo que ocurre detrás del escenario.",
      },
      {
        type: "text",
        text: "Yoandy Ramírez Delgado · Growth Builder · perfil freelance · 30 MPS Adventures",
      },
    ],
    footer: "yoandyramirez.com · linkedin.com/in/yoandyrd92 · github.com/heindall92",
  },
];

const en: PitchSlide[] = [
  {
    kicker: "Business Case · 30 MPS Adventures",
    title: "From craft to scalable — without stopping being 30 MPS",
    subtitle: "AI & automation proposal to reach €1M by 2027",
    blocks: [
      { type: "text", text: "Yoandy Ramírez Delgado · Growth Builder · freelance profile" },
      {
        type: "bullets",
        items: ["yoandyramirez.com", "linkedin.com/in/yoandyrd92", "github.com/heindall92"],
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
          "5★ product — the bottleneck is system, not trip quality",
          "Scattered data: sheets, CEO inbox and Brevo",
          "No attribution, no margin by route, too much founder dependency",
        ],
      },
    ],
  },
  {
    kicker: "Profile",
    title: "The tech I build must survive without me.",
    blocks: [
      {
        type: "cards",
        items: [
          {
            title: "Background",
            body: "+4 years Systems & Networks (ES-homologated) · Cybersecurity & AI Master — Evolve (2026) · eJPTv2 · Google IT · Cisco · IBM · HTB Level 8",
            tone: "brand",
          },
          {
            title: "Why it matters for 30 MPS",
            body: "Secure, auditable, transferable systems. I deliver code, docs and a one-page runbook — no lock-in. Freelance / part-time fit.",
            tone: "good",
          },
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
          ["Margin / trip", "unmeasured", "30%"],
        ],
      },
      {
        type: "metrics",
        items: [{ label: "The gap", value: "€200,000", hint: "+25% in two years" }],
      },
    ],
  },
  {
    kicker: "€200k in three parts",
    title: "The three levers",
    blocks: [
      {
        type: "cards",
        items: [
          {
            title: "€80–110k",
            body: "4 new departures on existing routes — needs to know which fill.",
            tone: "brand",
          },
          {
            title: "€45–70k",
            body: "Reactivate 8–12 dormant clients — needs who is reactivatable.",
            tone: "good",
          },
          {
            title: "€40–60k",
            body: "Price +5–8% on high-demand routes — needs real margin per departure.",
            tone: "warn",
          },
        ],
      },
    ],
  },
  {
    kicker: "Bottlenecks",
    title: "The root",
    blocks: [
      {
        type: "steps",
        items: [
          "01 · No origin attribution — top priority",
          "02 · No margin by route",
          "03 · Everything runs through the founder",
          "04 · Dormant asset — only works if 01 and 02 are fixed",
        ],
      },
      {
        type: "quote",
        text: "To grow 25% you don’t need a model. You need to measure.",
      },
    ],
  },
  {
    kicker: "Prioritization",
    title: "Impact / effort",
    blocks: [
      {
        type: "matrix",
        cells: [
          {
            quadrant: "hi-lo",
            title: "High impact · low effort",
            body: "Data core + attribution ★ · Quick win: origin & occupancy",
          },
          {
            quadrant: "hi-hi",
            title: "High impact · high effort",
            body: "Margin by route + simulator · Prioritized reactivation",
          },
          {
            quadrant: "lo-lo",
            title: "Low impact · low effort",
            body: "Internal RAG assistant",
          },
          {
            quadrant: "lo-hi",
            title: "Low impact · high effort",
            body: "Internal content engine",
          },
        ],
      },
    ],
  },
  {
    kicker: "Solution A · 3–4 weeks",
    title: "One place where the business lives",
    blocks: [
      {
        type: "text",
        text: "Three live tables: Contacts, Departures, Bookings. Every lead enters with its origin.",
      },
      {
        type: "metrics",
        items: [
          { label: "Leads with origin (60 days)", value: "≥ 90%" },
          { label: "Monthly data close", value: "< 30 min" },
          { label: "Weekly routine", value: "10 min" },
        ],
      },
    ],
  },
  {
    kicker: "Solution B · 2–3 weeks",
    title: "Margin by route, with a simulator",
    blocks: [
      {
        type: "quote",
        text: "If I raise price 6% and lose one seat, do I win or lose? Answer in 30 seconds.",
      },
      {
        type: "bullets",
        items: [
          "Break-even seats",
          "Marginal seat margin",
          "Projected margin per departure",
        ],
      },
    ],
  },
  {
    kicker: "Solution C · 4–6 weeks",
    title: "Today’s list of ten",
    blocks: [
      {
        type: "text",
        text: "Every week: ten people worth writing to, with the reason in front. Hybrid scoring: readable rules + a model that only reads and ranks.",
      },
      {
        type: "quote",
        text: "The system prepares. The person writes — from Miguel’s mailbox, tone and signature. No exceptions.",
      },
    ],
  },
  {
    kicker: "Quick win · 2–3 weeks · €0 licenses",
    title: "Origin and occupancy from day one",
    blocks: [
      {
        type: "steps",
        items: [
          "01 · Single form with UTM and “how did you find us?”",
          "02 · Lead & booking register: 12 minimum fields",
          "03 · v0 panel with the six daily numbers",
          "04 · Backfill 12 months of bookings",
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
            body: "Minimization and pseudonymized context. Never the full record to a model.",
            tone: "brand",
          },
          {
            title: "Lock-in",
            body: "Everything CSV-exportable. Migration is a day of work, not a rescue.",
            tone: "good",
          },
          {
            title: "Over-engineering",
            body: "Nothing that can’t run in 10 minutes/week without a technical profile.",
            tone: "warn",
          },
          {
            title: "Brand drift",
            body: "No system writes to the customer. No “just this once”.",
            tone: "brand",
          },
        ],
      },
    ],
  },
  {
    kicker: "To start",
    title: "What I need in week one",
    blocks: [
      {
        type: "cards",
        items: [
          { title: "Data", body: "Brevo export (2 years) · booking history · full lead list" },
          { title: "Access", body: "WordPress read · GA · Brevo · hosting/domain if UTM" },
          { title: "People", body: "1 session Miguel (2h) · 1 session Laura on bookings (1h)" },
          { title: "Decisions", body: "Confirm tool · validate 3 margin-model assumptions" },
        ],
      },
    ],
  },
  {
    kicker: "First 90 days",
    title: "Roadmap — and what I ask today",
    blocks: [
      {
        type: "steps",
        items: [
          "Wk 1 · Sessions · data inventory · assumptions",
          "2–3 · Quick win: origin + register + v0 panel",
          "3–5 · Margin model + simulator",
          "5–8 · Light CRM complete · written procedures",
          "8–12 · Lead scoring · first reactivation queue",
        ],
      },
    ],
  },
  {
    kicker: "Close",
    title: "This document is a map, not a destination.",
    subtitle: "The goal is not that you need me. It is that the system outlives all of us.",
    blocks: [
      {
        type: "quote",
        text: "I don’t propose replacing human care. I propose automating what happens backstage.",
      },
      {
        type: "text",
        text: "Yoandy Ramírez Delgado · Growth Builder · 30 MPS Adventures",
      },
    ],
  },
];

export const PITCH_SLIDES: Record<Lang, PitchSlide[]> = { es, en };
