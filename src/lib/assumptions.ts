/**
 * Campo Norte — supuestos del business case (demo interna ficticia).
 * Cifras del anexo: inventadas para la demo. SUPUESTO = estimación de producto.
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
  name: "Campo Norte",
  legal: "Campo Norte Expediciones, S.L.",
  tagline: "El mundo no está hecho de destinos, sino de caminos.",
  promise: "Nosotros lo organizamos todo. Tú conduces.",
  founded: 2015,
  website: "https://example.com",
  email: "hola@camponorte.demo",
  phone: "+34 900 00 00 01",
  ceo: "Sofía Navarro",
  ceoTitle: "Fundadora y directora",
} as const;

export const TEAM = [
  { name: "Sofía Navarro", role: "Fundadora · vende y cuida la relación con el cliente" },
  { name: "Marta Vega", role: "Office · reservas y día a día" },
  { name: "Luis Ortega", role: "Tour Manager · África y Oriente Medio" },
  { name: "Jorge Peña", role: "Guía moto · alta montaña" },
] as const;

export const MPS_ASSUMPTIONS = [
  {
    id: "avg_ticket",
    label: "Lo que deja de media un viajero",
    value: "≈ 5.300 €",
    rationale: "800.000 € entre 150 viajeros. Encaja con expediciones premium de 8–14 días.",
  },
  {
    id: "gap_math",
    label: "Lo que falta para llegar a 1M € en 2027",
    value: "+200.000 € (un +25 %)",
    rationale:
      "Con ~18 viajeros más y 4 salidas nuevas: unos 95k € por volumen; el resto (~105k) por llenar mejor, reactivar antiguos y subir un poco el precio donde haya demanda.",
  },
  {
    id: "dormant_share",
    label: "Clientes que solo viajaron una vez",
    value: "55–65 % (~180 de 300)",
    rationale:
      "Hay un núcleo fiel y muchos de un solo viaje. Recuperarlos es la palanca más clara de ingresos.",
  },
  {
    id: "reactivation_yield",
    label: "Meta: volver a llenar con antiguos",
    value: "10–15 reservas/año desde dormidos",
    rationale: "Unos 53–80k €. La llamada la hace Sofía o el equipo — nunca un robot.",
  },
  {
    id: "lead_volume",
    label: "Interesados a ordenar cada mes",
    value: "25–40",
    rationale: "Compatible con ~14 salidas y grupos pequeños, sin masificar la marca.",
  },
  {
    id: "gap_attribution",
    label: "Hoy no sabemos de dónde vienen",
    value: "Más del 70 % sin origen claro",
    rationale: "El brief dice que el seguimiento de origen es casi inexistente. Es el primer agujero a tapar.",
  },
  {
    id: "founder_hours",
    label: "Horas de Sofía en ordenar + seguir + contenido",
    value: "12–18 h/semana (estimado)",
    rationale: "Todo pasa por el fundador. Objetivo: devolverle 6–10 h/semana para vender y acompañar.",
  },
  {
    id: "freelance_capacity",
    label: "Cómo se construye esto",
    value: "Freelance · 8–12 h/semana",
    rationale: "Part-time, documentado y traspasable. Sin dependencia eterna del consultor.",
  },
  {
    id: "stack",
    label: "Herramientas (sin ruido)",
    value: "Base de datos + automatizaciones + newsletter + panel interno",
    rationale: "Lo justo para operar. Sin bots al cliente. Lo técnico se explica al equipo, no al viajero.",
  },
] as const;

export const GOLDEN_RULE =
  "Todo es interno: la tecnología nunca habla con el cliente. Campo Norte vende trato humano; las máquinas trabajan detrás.";
