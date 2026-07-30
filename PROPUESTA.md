# 30 MPS Growth OS

**Versión ejecutiva (entrega 48 h antes · ~5 páginas)**  
**Propuesta Growth Builder – IA & Automatización**  
**Para:** Miguel Checa · Fundador y MD · 30 MPS Adventures  
**Autor:** Yoandy Ramírez Delgado · Confidencial (NDA)

> *«El mundo no está hecho de destinos, sino de caminos.»*

Complemento de estudio: [`PROPUESTA-EXTENDIDA.md`](./PROPUESTA-EXTENDIDA.md).

---

## 0. Qué quiere realmente el CEO

No una lista de herramientas. Una **infraestructura de crecimiento** que reduzca la dependencia del fundador, preserve el trato humano y sea **sencilla, medible y mantenible** part-time. Tech **detrás del escenario**. Nunca sustituye al viajero.

---

## 1. Entendimiento del negocio

Boutique premium moto/4x4. Vende confianza y caminos, no folletos. El fundador es parte del producto. 5★ → el problema no es el producto, es el **sistema**. Crecer a ~1M € (cifras ficticias del caso) sin masificar.

---

## 2. Diagnóstico (prioridad)

| Problema | Impacto | Prioridad |
|---|---|---|
| Sin CRM / origen de leads | Muy alto | **P0** |
| Datos dispersos (Excel, mail, Brevo) | Muy alto | **P0** |
| CEO demasiado operativo | Crítico | **P0** |
| Sin BI / margen por ruta | Muy alto | **P1** |
| Sin scoring | Medio–alto | **P1** |
| Clientes dormidos | Muy alto | **P1** |
| Sin knowledge / content system | Medio | **P2** |

---

## 3. Objetivos empresariales

↑ ingresos · ↑ ocupación · ↑ margen · ↓ tiempo admin. CEO · ↓ dependencia del conocimiento “en una cabeza” · ↑ recurrencia · decisiones con dato diario.

---

## 4. Arquitectura — una plataforma

```
WEB + Brevo + hojas → n8n/Make → Data Hub → CRM / Scoring / CI / Dashboard / RAG / Content
                                              ↓
                                    aviso interno → seguimiento HUMANO
```

**30 MPS Growth OS** = Data Hub · Dashboard · Lead Intelligence · Customer Intelligence · Knowledge · Content Factory.

---

## 5. Fases (resumen)

| Fase | Qué | Resultado |
|---|---|---|
| **1 Quick win** | Data Hub + CRM + UTM | Origen visible |
| **2** | Dashboard ejecutivo | Una pantalla para decidir |
| **3** | Lead scoring (explica, no habla al cliente) | Tiempo al mejor lead |
| **4** | Customer Intelligence (VIP/dormidos/…) | Recurrencia |
| **5** | Knowledge RAG interno | Menos “pregúntale a Miguel” |
| **6** | Content Factory (NL, LinkedIn, IG, blog, YT) | Borradores; humano publica |

Automatización: Formulario → Hub → score → dashboard → notificación → **seguimiento manual**.

---

## 6. Roadmap part-time

| Mes | Entrega |
|---|---|
| **1** | Data Hub + CRM + dashboard base |
| **2** | Scoring + Customer Intelligence + automatizaciones |
| **3** | Knowledge Assistant (RAG) + Content Factory |
| **4** | Optimización KPI · formación · documentación · entrega/traspaso |

---

## 7. Stack realista

Airtable→Postgres · n8n/Make · Claude/OpenAI/Gemini API · panel React/Interfaces · pgvector · Looker/Power BI solo si aporta después.

---

## 8. KPIs (negocio)

Origen **95%** · tiempo admin. CEO **−60%** (baseline sem. 1) · ~**15%** dormidos reactivados · ↑ ocupación · margen →~30% · ↑ conversión prioritarios · ↑ LTV · ROI por canal medible · dashboard **diario** · mantener “respondemos en el día”.

---

## 9. Riesgos

Dependencia APIs LLM · cambios de precio · RGPD/datos · calidad de datos · mantenimiento · docs/backups · over-engineering.  
Mitigar: fases, abstracción de proveedor, UE, runbook, humano en el loop, Visión 2030 ≠ mes 1.

---

## 10. Futuro (evolución, no prioridad 2027)

ML ocupación/cancelaciones · precio dinámico con veto humano · recomendación de destino · recompra · sentimiento postviaje. Solo con Hub limpio.

---

## 11. Visión 2030

No automatizar por automatizar. Construir una plataforma para que 30 MPS **crezca sin perder** confianza, atención personalizada y excelencia operativa. La tech quita lo repetitivo y libera tiempo para experiencias memorables.

---

## 12. Necesidades · preguntas · cierre

**Necesito:** Brevo, hojas, clientes, API lectura, UTM, Drive, Miguel/Laura/NL/web · 45 min/sem.

**Pregunto:** owner 48 h · mix gap 1M · rutas intocables · qué dejar en Excel · canal intuido · qué es premiumizar.

> No propongo sustituir el trato humano. Propongo automatizar lo que ocurre **detrás del escenario** para que Miguel y el equipo dediquen más tiempo a la confianza y la experiencia premium. La IA informa; **las personas construyen la confianza**.
