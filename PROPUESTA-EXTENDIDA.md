# 30 MPS Growth OS — Informe extendido

**Versión de estudio / consultoría (complemento a la ejecutiva)**  
**Propuesta de Transformación Digital e IA · Growth Builder**  
**Para:** Miguel Checa · 30 MPS Adventures, S.L.  
**Autor:** Yoandy Ramírez Delgado  
**Confidencial · NDA candidatos · Escuela Evolve 2026**

> Este documento desarrolla la versión ejecutiva (`PROPUESTA.md`). Sirve para profundizar y responder Q&A. La entrega al CEO puede ser la ejecutiva; este informe demuestra preparación.

---

## Índice

1. Introducción  
2. Entendimiento del negocio  
3. Diagnóstico y matriz de problemas  
4. Objetivos estratégicos  
5. Arquitectura Growth OS  
6. Data Hub  
7. Dashboard ejecutivo  
8. Lead Intelligence  
9. Customer Intelligence  
10. Knowledge Assistant  
11. Content Engine  
12. Automatizaciones  
13. Roadmap  
14. Tecnologías  
15. KPIs  
16. Riesgos, costes, escalabilidad  
17. Futuro (post-2027)  
18. Visión 2030  
19. Necesidades, preguntas y cierre  

---

## 1. Introducción

El caso pregunta qué construir con IA y automatización para llegar al millón en 2027 y sentar premiumización. La trampa: no gana quien monte el stack más espectacular, sino quien piense como quien **construye un negocio** respetando la marca.

La respuesta no es “tres proyectos”. Es **una plataforma**: **30 MPS Growth OS**.

---

## 2. Entendimiento del negocio

30 MPS Adventures (desde 2015) diseña expediciones premium en moto y 4x4 (Mongolia, Namibia, La Puna, Alaska, Costa Rica, Nepal…). Grupos reducidos, logística cuidada, “nosotros organizamos; tú conduces”.

- No vende destinos: vende **caminos y confianza**.  
- El cliente de valor es exigente; valora trato personal.  
- Miguel Checa (fundador/MD) es parte del producto comercial.  
- Laura (booking), David y Ramón completan ops/guía.  
- Principios de marca: responder en el día, sin letra pequeña, antes un cliente menos que uno insatisfecho.

**Implicación:** cualquier sistema que “hable” por la marca destruye el diferencial.

Cifras del anexo (ficticias): ~800k→1M € · 150→168 viajeros · 10→14 salidas · ~300 clientes + ~1.000 suscriptores · margen ~30% · palancas: dormidos + cartera + precio.

---

## 3. Diagnóstico

### Situación actual
Datos en Excel, correo del CEO y Brevo. CRM/origen casi inexistente. Sin cuadro de mando vivo. CEO en triaje + seguimiento + contenido + viajes clave. Muchos 5★ con un solo viaje.

### Matriz

| Problema | Impacto | Prioridad |
|---|---|---|
| No existe CRM | Muy alta | Alta |
| Datos dispersos | Muy alta | Alta |
| Origen desconocido | Muy alta | Alta |
| CEO hace (casi) todo | Crítica | Muy alta |
| No existe BI | Muy alta | Alta |
| No existe lead scoring | Media | Media |
| Clientes dormidos | Muy alta | Muy alta |
| No existe knowledge base | Media | Media |
| Contenido post-viaje manual | Media | Media |

---

## 4. Objetivos estratégicos

Incrementar ingresos · ocupación · margen · recurrencia.  
Reducir tiempo operativo del CEO y dependencia de su memoria.  
Profesionalizar decisiones.  
**No** automatizar la relación con el cliente.

---

## 5. Arquitectura propuesta

```
        ┌─────────┐   ┌─────────┐   ┌──────────┐
        │   WEB   │   │  Brevo  │   │  Hojas / │
        │ + UTM   │   │ lectura │   │  email   │
        └────┬────┘   └────┬────┘   └────┬─────┘
             └─────────────┼─────────────┘
                           ▼
                     ┌───────────┐
                     │ n8n/Make  │
                     └─────┬─────┘
                           ▼
                     ┌───────────┐
                     │ DATA HUB  │  Airtable → PostgreSQL
                     └─────┬─────┘
          ┌────────┬───────┼───────┬─────────┬─────────┐
          ▼        ▼       ▼       ▼         ▼         ▼
        CRM     Score   Cust.   Dashboard  Knowledge  Content
                (IA)    Intel.             (RAG)      Factory
          └────────┴───────┴───────┴─────────┴─────────┘
                           ▼
              Notificación interna → CEO / Laura
                           ▼
                 SEGUIMIENTO HUMANO (confianza)
```

Una imagen vale más que diez slides de logos de vendors.

---

## 6. Data Hub

**Problema:** no hay memoria única.  
**Qué almacena:** ID, nombre, fecha, origen, campaña, destino, moto/4x4, estado, score, valor esperado, nuevo/recurrente, última interacción, responsable, vínculo a reserva/expedición.  
**Cómo se conecta:** webhooks formulario, API Brevo, CSV/Sheets, etiqueta bandeja Miguel.  
**Qué gana 30 MPS:** atribución; base del resto del OS.  
**Éxito:** origen ≥80% en 60 días; meta 6 meses **95%**.

---

## 7. Dashboard ejecutivo

Una pantalla (módulo del panel; Looker/Power BI opcional después):

- Embudo: visitas → leads → llamadas → reservas → viajes  
- Ingresos, margen, ocupación, ROI canales  
- Repetidores, dormidos, ticket/LTV, score medio  
- Mapa: Google, IG, NL, referidos, ferias, YouTube, **sin origen**

No más de lo necesario. Actualización diaria.

---

## 8. Lead Intelligence

Variables **solo si existen**: destino, historial, canal, opens/clicks, repetidor, presupuesto declarado, tiempo de respuesta del equipo.  
**No inventar** edad/renta.  
Salida: score + probabilidad relativa + prioridad + explicación.  
Avisa al responsable. **No escribe al lead.**

---

## 9. Customer Intelligence

Segmentos: VIP · dormidos · premium · embajadores · en riesgo.  
Lista mensual “contactar”. Ejemplo: Namibia hace 18 meses, abre NL, sin llamada → cola humana.  
Palanca de dinero del gap a 1M.

---

## 10. Knowledge Assistant

RAG sobre rutas, costes, hoteles, proveedores, procedimientos, históricos.  
pgvector en Postgres (Pinecone si escala).  
Solo empleados. Cita fuentes o “no está en el sistema”.

---

## 11. Content Engine

Tras expedición, desde fotos/vídeos/notas:

| Pieza | Canal |
|---|---|
| Newsletter | Brevo (humano publica) |
| LinkedIn / Instagram | RRSS (humano publica) |
| Blog | Web |
| Guion YouTube | Vídeo |
| Resumen interno | Ops / Miguel |

Revisión humana = no negociable.

---

## 12. Automatizaciones

```
Formulario → crear lead → deduplicar → origen/UTM → score IA
 → actualizar dashboard → avisar owner → recordatorio INTERNO
 → seguimiento MANUAL
```

La tubería es automática; la confianza no.

---

## 13. Roadmap

| Mes | Foco |
|---|---|
| 1 | CRM + Data Hub + Dashboard base |
| 2 | Lead Scoring + Customer Intelligence + automatizaciones |
| 3 | Knowledge Assistant (RAG) + Content Factory |
| 4 | Optimización · KPIs · formación · documentación · entrega |

---

## 14. Tecnologías

| Capa | Preferido | Alt. |
|---|---|---|
| Frontend ops | Panel React / Airtable Interfaces | Notion docs |
| Automatización | n8n | Make |
| IA | Claude / OpenAI / Gemini | — |
| Datos | Airtable → PostgreSQL | — |
| BI | Panel propio primero | Looker / Power BI |
| Vectores | pgvector | Pinecone |

---

## 15. KPIs

| KPI | Foco |
|---|---|
| Tiempo de respuesta | Cumplir “en el día” con menos caos |
| Tiempo administrativo CEO | −60% (baseline semana 1) |
| Margen por ruta | Visible → ~30% |
| Clientes repetidores | ↑ |
| ROI por canal | Medible con origen |
| Ocupación | ↑ |
| Conversión | ↑ en alta prioridad |
| Valor medio cliente | ↑ vía recurrencia |
| Origen leads | 95% |
| Dashboard | Diario |

---

## 16. Riesgos, costes, escalabilidad

**Riesgos:** dependencia OpenAI/otros · cambios API · RGPD · calidad datos · mantenimiento · documentación · backups · builder se va.  
**Mitigación:** proveedor intercambiable · tope de gasto LLM · UE · higiene Fase 1 · runbook · exports · traspaso mes 4.

**Costes (SUPUESTO €/mes):** Hub 0–25 · automatización 0–40 · LLM 20–80. Dominante: horas Growth Builder.

**Escalabilidad:** mismo OS alimenta premiumización (LTV, núcleo 10+) sin masificar.

---

## 17. Futuro (más allá del caso)

No prioridad 2027:

- Predicción ocupación / cancelaciones  
- Precio dinámico orientativo (veto humano)  
- Recomendación de destinos  
- Alto potencial de recompra  
- Sentimiento postviaje  

Evolución natural cuando haya datos limpios.

---

## 18. Visión 2030

El objetivo de este proyecto no es automatizar procesos por automatizar. Es construir una plataforma que permita a 30 MPS crecer **sin perder** lo que la hace diferente: una experiencia premium basada en la confianza, la atención personalizada y la excelencia operativa. La tecnología debe eliminar tareas repetitivas, aportar información para mejores decisiones y liberar tiempo para crear experiencias memorables.

---

## 19. Necesidades · preguntas · cierre

**Necesidades:** export Brevo · hojas 24–26 · ~300 clientes · muestra emails anonimizada · API lectura · UTM · Drive · Miguel, Laura, NL, web · 45 min/sem.

**Preguntas de sesión:** owner 48 h · mix precio/plazas/salidas · rutas intocables · qué abandonar en Excel · canal intuido · definición premiumización.

### Cierre

> No propongo sustituir el trato humano. Propongo automatizar todo lo que ocurre detrás del escenario para que el equipo dedique más tiempo a crear experiencias premium. La IA aporta información y eficiencia; las personas siguen construyendo la confianza que diferencia a 30 MPS.

---

*Demo interactiva del Growth OS: panel en este repositorio. Cifras del business case: ficticias.*
