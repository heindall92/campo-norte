# 30 MPS Adventures — Business Case (15 slides)

## Contenido

- `30MPS_BusinessCase_YoandyRamirez.html` — **presentación standalone**. Un solo archivo, sin dependencias externas ni build. Se abre en cualquier navegador y funciona offline. Es el archivo a embeber si solo hace falta mostrar el deck.
- `src/` — fuentes editables:
  - `Propuesta 30 MPS.dc.html` — el deck. Cada slide es un `<section data-label="…" data-speaker-notes="…">` con estilos inline.
  - `deck-stage.js` — web component `<deck-stage>`: escalado 1920×1080, navegación por teclado, rail de miniaturas, notas del orador, impresión/PDF.
  - `image-slot.js` — web component `<image-slot>`: hueco de imagen arrastrable (usado en la slide 15).
  - `support.js` — runtime del componente.

## Integración en el CRM

Opción A (recomendada, 5 min): servir el HTML standalone tal cual, o embeberlo en un iframe a pantalla completa.

```html
<iframe src="/assets/30MPS_BusinessCase_YoandyRamirez.html"
        style="width:100%;height:100%;border:0" allowfullscreen></iframe>
```

Opción B (integración nativa): copiar `deck-stage.js` al proyecto y renderizar los `<section>` de cada slide dentro de `<deck-stage width="1920" height="1080">`. El componente es JS plano, sin framework y sin bundler.

```html
<script src="/js/deck-stage.js"></script>
<deck-stage width="1920" height="1080">
  <section data-label="Portada" style="…">…</section>
</deck-stage>
```

Navegación programática: `document.querySelector('deck-stage').goTo(n)` (0-indexado).

## Notas

- Sin CSS externo: todo el estilo va inline en cada slide, así que no hay colisiones con los estilos del CRM.
- Paleta: oliva `#3E4238` / `#2B2E27`, crema `#F7F4EA` / `#E7E4D3`, dorado `#F2D06B` (acento) y `#8A6E17` (dorado sobre claro), texto `#2F3229` / `#F5F2E8`.
- Tipografías: Archivo (títulos y cuerpo) e Instrument Serif italic (frases de marca), cargadas desde Google Fonts; en el standalone van embebidas.
- La slide 15 tiene un hueco de imagen vacío. Para fijar la foto definitivamente, sustituir el `<image-slot>` por un `<img>` o un `background-image` con la ruta del asset del CRM.
- Notas del orador: atributo `data-speaker-notes` de cada `<section>`.
