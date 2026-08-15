# Campo Norte — WMS OS / Ecosistema de almacén

Demo de torre de control logística para hubs tipo hipermercado (Andalucía) y centros europeos.
Construido sobre la base Campo Norte (auth, roles, Data Hub, shell, finanzas).

**Regla de oro:** la torre orquesta huecos, gente y euros; decide la planta.

**Licencia:** ver [`LICENSE`](./LICENSE) y [`NOTICE`](./NOTICE).

---

## Fase 1 (esta rama)

Módulos WMS vivos con semilla demo:

| Módulo | Qué controla |
|---|---|
| Torre de control | Ocupación, stock, flota, gente, costes |
| Stock | SKU / categorías / ABC / mínimos |
| Huecos | Mapa de ubicaciones por zona y pasillo |
| Palets | SSCC, lote, caducidad, hueco |
| Flota eléctrica | Batería, horas, coste/h, operario |
| Recepción | ASN / muelle / putaway |
| Expedición | Olas a tienda / prioridad / cut-off |
| Operarios | Turnos, productividad, extras, €/h |
| Costes | Mano de obra, energía, flota, merma vs presupuesto |

Se conservan módulos útiles del CRM original (facturas, tesorería, aprobaciones, conocimiento, hub).

---

## Arranque

```bash
npm install
npm run dev        # http://localhost:5173
```

---

## Auth demo (sin Supabase)

| Email | Rol | Pass |
|---|---|---|
| `sofia@camponorte.demo` | Dirección | `norte2026` |
| `marta@camponorte.demo` | Office | `norte2026` |
| `luis@camponorte.demo` | Almacén | `norte2026` |
| `jorge@camponorte.demo` | Planta | `norte2026` |

---

## Identidad demo

- **Marca:** Campo Norte
- **Razón social demo:** Campo Norte Logística, S.L.
- **Hub demo:** CN-SEV-01 Sevilla + cámara Huelva
- Datos de stock/operarios/flota: inventados para la demo
