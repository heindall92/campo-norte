# 30 MPS Adventures — Growth OS / CRM interno

> **Confidencial** · Demo de propuesta Growth Builder (Evolve) · Business case IA y automatización

Plataforma demo para **Miguel Checa** (Fundador / Managing Director de [30 MPS Adventures](https://30mps.com)): CRM operativo + cuadro de mando de atribución, margen, reservas/logística, facturación ES y automatizaciones internas.

**Regla de oro:** nada habla automáticamente con el viajero. La tecnología trabaja detrás; la confianza la cierran personas.

Repo: [`heindall92/30mps`](https://github.com/heindall92/30mps) (privado).

---

## Demo en local

```bash
npm install
npm run dev        # http://localhost:5173
```

Producción estática:

```bash
npm run build
npm run preview    # o: python3 serve.py  → http://0.0.0.0:8080
```

## Despliegue (Vercel)

Proyecto Vite + React. Configuración en `vercel.json`.

```bash
npm i -g vercel
vercel           # preview
vercel --prod    # producción
```

- **Framework:** Vite  
- **Build:** `npm run build`  
- **Output:** `dist`

---

## Qué incluye la demo

| Módulo | Para qué |
|---|---|
| Cuadro de mando | Gap 800k→1M, origen de leads, margen/ocupación moto vs 4x4 |
| Leads + scoring | Cola priorizada con razones explicables |
| Clientes 360º | Alta/edición popup, LTV, dormidos, VIP, pagos |
| **Reservas · logística** | **CRUD completo**: crear, modificar, duplicar, eliminar; contactos ops, lodges, comidas, checklist prep en vivo |
| Facturas · Veri*FACTU | REAV clave 05, PDF empresarial ES, export gestoría |
| Ecosistema CRM (n8n-like) | Flujos editables vinculados a módulos; import/export JSON |
| Content Factory | Plantillas editables email / WhatsApp / mensajes internos |
| Knowledge | Preguntas argumentadas + fuentes + “por qué importa” |
| Presentación | Pitch ES/EN argumentado para la reunión con Miguel |

Destinos alineados con la cartera real (Mongolia, Namibia, La Puna, Costa Rica, Nepal, Alaska…). Cifras del anexo del ejercicio: **ficticias**.

---

## Documentos

| Archivo | Uso |
|---|---|
| [`PROPUESTA.md`](./PROPUESTA.md) | Versión ejecutiva (~5 pág.) — entrega + guion 20 min |
| [`PROPUESTA-EXTENDIDA.md`](./PROPUESTA-EXTENDIDA.md) | Informe de estudio completo |

---

## Stack

- React 19 · Vite 8 · TypeScript · Tailwind CSS 4  
- Recharts · jsPDF · Lucide  
- Demo servida como SPA estática (Vercel / `serve.py`)

**Producción propuesta (fuera de esta demo):** panel React + Airtable/Postgres + n8n/Make + Brevo (lectura) · 8–12 h/semana freelance Growth Builder.

---

## Rol Growth Builder

Growth Operations · Content Engine (apoyo) · AI & Automation — sin gestionar clientes finales ni vender viajes. La IA informa y prioriza; el equipo contacta.
