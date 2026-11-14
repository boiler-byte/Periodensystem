# Generierte Elementillustrationen – Delta v4

## Lieferumfang

Alle 118 Elementprofile besitzen jetzt ein lokal ladbares WebP-Motiv.
Die sechs ursprünglich in der App integrierten WebP-Dateien bleiben bestehen.
Neu hinzu kommen 112 Dateien (106 weitere Elemente und sechs bisher
noch nicht als Einzelassets integrierte Motive aus dem Pilotset).

## Bildherkunft und Qualität

Die Bilder wurden mit einem generativen Bildmodell als mehrere Gruppenmotive
erzeugt und anschließend programmgesteuert anhand ihrer Elementpositionen
zugeschnitten, die eingeblendeten Gruppenbeschriftungen weitgehend entfernt,
auf einen dunklen Studiostil vereinheitlicht und als WebP mit 640 × 400 Pixeln
exportiert. Das Exportformat ist nicht die effektive Quellauflösung. Die
Bilddetails sind je nach Quelldichte unterschiedlich scharf. Besonders die
Motive im Bereich höherer Ordnungszahlen stammen aus sehr kleinen
Teilbildern einer Gesamtkomposition und eignen sich vor allem für kleine
Bildflächen. Für eine spätere Version sind einzeln neu generierte
hochauflösende Motive vorzuziehen.

**Wissenschaftliche Einordnung:** Keine dieser Abbildungen ist ein
Probenfoto oder ein Beleg für das makroskopische Vorliegen des Elements.
Bei synthetischen und sehr kurzlebigen Elementen sind die Materialien in
den Bildern ausschließlich symbolisch und können physikalisch unmögliche
Proben suggerieren. Genau deshalb sind sie durch `kind`, `alt` und
`caption` gekennzeichnet.

## Daten und Offline-Betrieb

- `data/element-content.js`: verwendete Bildpfade, Alt-Texte, Legenden.
- `scripts/source/photo-overrides.json`: wartbare Quelldaten für den Generator.
- `assets/elements/*.webp`: 118 aktive lokale Bilddateien.
- `service-worker.js`: neue Cache-Version und sämtliche aktiven Bilder.
- Die alten `.svg`-Dateien dürfen lokal bestehen bleiben; sie werden
  von den Profilen nicht mehr angefordert.

Neubau und Prüfung aus dem Projektordner:

```bash
node scripts/build-content.mjs
node scripts/sync-cache.mjs
node scripts/validate-content.mjs
```

## Noch offen

- Visuelle Einzelkontrolle aller Motive auf anatomisch/stofflich falsche
  Details, wiederholte Motive und verbleibende Textartefakte.
- Optional hochwertige Neugenerierung pro Element statt Extraktion aus
  Gruppentafeln, insbesondere für die sehr schweren Elemente.
- Keine externen Fotos oder Porträts wurden eingebunden.
