# Campo Norte — Growth OS / CRM interno

Demo de CRM operativo para expediciones (marca y personas **ficticias**).

**Regla de oro:** nada habla automáticamente con el viajero. La tecnología trabaja detrás; la confianza la cierran personas.

**Licencia:** ver [`LICENSE`](./LICENSE) y [`NOTICE`](./NOTICE).

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

## Auth demo (sin Supabase)

| Email | Rol | Pass |
|---|---|---|
| `sofia@camponorte.demo` | Admin | `norte2026` |
| `marta@camponorte.demo` | Booking | `norte2026` |
| `luis@camponorte.demo` | Ops | `norte2026` |
| `jorge@camponorte.demo` | Guía | `norte2026` |

Antes de un despliegue real: `VITE_STRICT_AUTH=true` + Supabase Auth.

---

## Data Hub

| Modo | Cuándo | Dónde viven los datos |
|---|---|---|
| **Local** (por defecto) | Sin `.env` | `localStorage` |
| **Supabase / Postgres** | `VITE_DATA_MODE=supabase` | Tablas `mps_*` |

Ver [`.env.example`](./.env.example) y [`supabase/schema.sql`](./supabase/schema.sql).

---

## Identidad demo

- **Marca:** Campo Norte (ficticia)
- **Razón social demo:** Campo Norte Expediciones, S.L.
- **Contacto demo:** `hola@camponorte.demo` · `+34 900 00 00 01`
- Los datos de clientes/leads del seed son inventados.
EOF