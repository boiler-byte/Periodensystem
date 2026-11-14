# Inhaltsmodell und Wartung (Phase 3)

Das Modell trennt weiterhin **Stoffdaten** (`data/elements.js`) von
**redaktionellen Profilen** (`data/element-content.js`). Jedes der 118 Elemente
hat einen eigenständigen Datensatz, zugeordnet über die Ordnungszahl.

```javascript
window.PSE_CONTENT.elements[3] = {
  description: 'Eigenständiger Kurztext zu Lithium',
  discovery: {
    label: '1817',        // auch Zeitspannen oder „Seit der Antike bekannt“
    year: 1817,          // Zahl nur bei eindeutigem Einzeljahr; sonst null
    era: '19. Jahrhundert',
    people: [{ name: 'Johan August Arfwedson', role: '...' }],
    narrative: 'Eigenständig formulierter historischer Zusammenhang',
    note: null           // Hinweis zu Priorität / Isolierung / Anerkennung
  },
  uses: [{ title: 'Akkus', text: 'Anwendungsbeschreibung' }],
  facts: [{ title: 'Leichtes Metall', text: 'Besonderheit' }],
  safety: 'Optionaler Gefahrenhinweis oder null',
  image: {
    src: 'assets/elements/lithium.svg',
    alt: 'Schematische Visualisierung zu Lithium',
    caption: 'Stilisierte Darstellung',
    kind: 'Schematische SVG-Illustration, kein Originalfoto',
    credit: 'Originalgrafik für dieses Projekt (2026)',
    license: 'MIT (Projektlizenz)',
    licenseUrl: null,
    sourceUrl: null
  },
  sources: [
    { label: 'Royal Society of Chemistry', url: 'https://periodic-table.rsc.org/element/3' },
    { label: 'PubChem / NCBI', url: 'https://pubchem.ncbi.nlm.nih.gov/element/3' }
  ]
};
```

## Wie Inhalte bearbeitet werden

- **112 neue Elemente:** `scripts/source/profiles.tsv` (Beschreibung,
  Anwendungen, Fakten und Sicherheit) sowie `scripts/source/discoveries.tsv`
  (historische Einordnung). Ein `~` trennt bei Anwendungen und Fakten den
  Titel vom Beschreibungstext. Ein `;` trennt die einzelnen Beispiele.
- **Sechs ursprüngliche Elemente:** `scripts/source/original-six.json`.
- **Fotoersatz:** Wenn `scripts/source/photo-overrides.json` existiert,
  überschreibt dessen Bildreferenz das ursprüngliche Motiv. Der Importer
  kann diese Datei automatisch befüllen.
- **Generierung:** `node scripts/build-content.mjs` erzeugt
  `data/element-content.js` und die 112 schematischen SVG-Grafiken erneut.
- **Offline-Cache aktualisieren:** `node scripts/sync-cache.mjs` bildet eine
  neue, inhaltsbasierte Service-Worker-Version aus allen UI-Dateien und Bildern.
- **Prüfen:** `node scripts/validate-content.mjs` validiert Bildpfade,
  Inhaltsfelder und die vollständige PWA-Cache-Abdeckung.

## Bildarten

Es gibt **sechs KI-Illustrationen**, **112 schematische Vektorgrafiken** und
vorerst **null authentische Fotos**. Die Bildart steht im Feld `image.kind`
und wird im Profil sichtbar gekennzeichnet. Ein späterer Fotoimport sollte
zusätzlich Autor, Lizenz, Lizenz-Link und Original-Dateiseite angeben.

## Historische Angaben

`discovery.year` wird nur verwendet, wenn ein einzelnes Jahr sinnvoll
angegeben werden kann. `discovery.label` kann den historischen Sachverhalt
präziser beschreiben. `discovery.people` kann mehrere Beteiligte oder
Forschungsteams enthalten; bei seit der Vorgeschichte bekannten Elementen
bleibt die Liste leer. Für superschwere Elemente liegt der Schwerpunkt auf
experimenteller Synthese und Anerkennung, nicht auf einer erfundenen
Alltagsnutzung.

## Oberfläche

`js/content.js` stellt die Profilnavigation sowie Geschichte, Verwendung und Wissen dar;
`js/details.js` ergänzt den Bereich Daten und verwaltet die vier Tabs.
Desktop zeigt den Inhalt in der Seitenleiste, Mobilgeräte in einem nativen
History-gesteuerten Dialog. Auch die Vergleichsansicht über Dropdown und
Browser-Zurück bleibt erhalten.
