/**
 * 30 MPS Adventures — supuestos explícitos del business case (demo interna).
 * Cifras del anexo: ficticias (brief). SUPUESTO = no viene en el documento.
 * Confidencial · proceso de selección Evolve / Growth Builder.
 */

export const MPS_ANNEX = {
  revenueCurrent: 800_000,
  revenueTarget2027: 1_000_000,
  travelersCurrent: 150,
  travelersTarget: 168,
  departuresCurrent: 10,
  departuresTarget: 14,
  clientsReal: 300,
  subscribers: 1_000,
  marginTargetPct: 30,
  /** Mitad moto, mitad coche según brief */
  motoShareApprox: 0.5,
} as const;

export const COMPANY = {
  name: "30 MPS Adventures",
  legal: "30 MPS Adventures, S.L.",
  tagline: "El mundo no está hecho de destinos, sino de caminos.",
  promise: "Nosotros lo organizamos todo. Tú conduces.",
  founded: 2015,
  website: "https://30mps.com",
  email: "ride@30mps.com",
  phone: "+34 667 11 37 84",
  ceo: "Miguel Checa",
  ceoTitle: "Fundador y Managing Director",
} as const;

export const TEAM = [
  { name: "Miguel Checa", role: "Fundador · CEO · relación comercial clave" },
  { name: "Laura Romera", role: "Booking & Office Manager" },
  { name: "David Rodríguez", role: "Tour Manager África & Oriente Medio" },
  { name: "Ramón Faro", role: "Tour Leader moto · guía alta montaña" },
] as const;

export const MPS_ASSUMPTIONS = [
  {
    id: "avg_ticket",
    label: "Ticket medio por viajero",
    value: "≈ 5.300 €",
    rationale: "800.000 € / 150 viajeros. Coherente con expediciones premium 8–14 días moto/4x4.",
  },
  {
    id: "gap_math",
    label: "Gap a 1M € (2027)",
    value: "+200.000 € (~+25%)",
    rationale:
      "Con +18 viajeros y +4 salidas (anexo): ~95k € por volumen a ticket actual; el resto (~105k) por mejor ocupación, reactivación y ajuste de precio moderado.",
  },
  {
    id: "dormant_share",
    label: "% clientes con 1 solo viaje (activo dormido)",
    value: "55–65 % (~180 de 300)",
    rationale:
      "Brief: muchos con un solo viaje + núcleo fiel 10+. SUPUESTO de distribución; reactivación es palanca #1.",
  },
  {
    id: "reactivation_yield",
    label: "Meta operativa reactivación",
    value: "10–15 reservas/año desde dormidos",
    rationale: "≈ 53–80k € a ticket medio. Contacto humano (Miguel/equipo), no secuencias automáticas al cliente.",
  },
  {
    id: "lead_volume",
    label: "Leads / mes a triar",
    value: "25–40",
    rationale: "Compatible con ~14 salidas y grupos 8–14 vehículos sin masificar.",
  },
  {
    id: "gap_attribution",
    label: "Leads/reservas sin origen hoy",
    value: ">70 %",
    rationale: "CRM de origen ‘prácticamente inexistente’ (brief). Mayor carencia técnica.",
  },
  {
    id: "founder_hours",
    label: "Horas/semana de Miguel en triaje + seguimiento + contenido",
    value: "12–18 h (SUPUESTO)",
    rationale: "Cuello #2: todo pasa por el fundador. Objetivo del sistema: devolver 6–10 h/semana a cierre humano de calidad.",
  },
  {
    id: "freelance_capacity",
    label: "Formato de construcción",
    value: "Growth Builder freelance · 8–12 h/semana",
    rationale: "Rol del proceso: part-time, traspasable, Make/n8n + datos + IA interna.",
  },
  {
    id: "stack",
    label: "Stack propuesto",
    value: "Airtable/Postgres ligero + n8n/Make + Brevo (lectura) + panel web interno",
    rationale: "Herramientas del JD Growth Builder; realismo > brillo; sin bot al cliente.",
  },
] as const;

export const GOLDEN_RULE =
  "Todas las soluciones son internas. Nunca interacción directa con clientes. 30 MPS vende trato humano: la tecnología trabaja detrás, no delante.";
