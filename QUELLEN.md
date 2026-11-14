# Quellen und Rechte – Periodensystem (Phase 3)

## Chemische Basisdaten

- `data/elements.js`: RDKit-PeriodicTable-Referenzwerte für Atommasse und
  ausgewählte Radien, deutsche Namen, Rasterpositionen und Elementfamilien
  redaktionell ergänzt. Konfigurationen teilweise Näherungen, besonders bei
  superschweren Elementen.
- RDKit: https://www.rdkit.org/docs/source/rdkit.Chem.rdchem.html

## Beschreibung, Anwendungen, Entdeckungsgeschichte

- 112 Texte für Phase 3 wurden eigenständig deutsch formuliert und in
  `scripts/source/profiles.tsv` und `scripts/source/discoveries.tsv` abgelegt.
  Sie sind **keine kopierten Wikipedia- oder RSC-Artikel**. Die sechs bereits
  vorhandenen Inhalte liegen in `scripts/source/original-six.json`.
- Referenz und weiterführende Quelle pro Element:
  **Royal Society of Chemistry** – `https://periodic-table.rsc.org/element/N`
  (N = Ordnungszahl, z. B. https://periodic-table.rsc.org/element/3).
  Besonders nützlich für „History“, „Uses and properties“ und Erscheinungsbild.
- Weitere Referenz: **PubChem/NCBI** – `https://pubchem.ncbi.nlm.nih.gov/element/N`.
- Für künftige automatisierte Vergleiche: freier Elementexport mit Jahren und
  Entdeckern: https://api.periodictableofelements.org/elements/export/json/
  (laut Anbieter mit Linkhinweis für persönliche, Bildungs- und kommerzielle
  Nutzung nutzbar). Der aktuelle Lieferdatensatz wurde **nicht automatisiert**
  aus dieser API heruntergeladen.
- Gerade bei Sauerstoff, Aluminium, Vanadium, Radium und superschweren
  Elementen sind Erstbeobachtung, Identifizierung, Isolierung und offizielle
  Anerkennung nicht identisch. Entsprechend wird teils eine Zeitspanne
  angegeben. Im Einzelfall können wissenschaftliche Publikationen andere
  Prioritätszuordnungen verwenden.

## Lokal mitgelieferte Bilder

- **112 SVG-Grafiken** unter `assets/elements/*.svg`: durch das lokale
  `scripts/build-content.mjs` generierte wissenschaftlich inspirierte Motive.
  **Schematische Illustrationen; keine authentischen Probenfotos.** Sie sind
  Bestandteil des unter MIT veröffentlichten Projektcodes.
- **6 WebP-Grafiken** zu H, He, O, Fe, Au und U: bereits in Phase 1/2 für das
  Projekt erzeugte KI-Illustrationen. Keine dokumentarischen Laborfotografien.
  Bildnachweis steht in jedem Datensatz in `image.credit`.
- Es sind **keine** authentischen externen Fotos und **keine** Porträtfotos
  Teil des ausgelieferten Phase-3-ZIP.

## Optionaler echter Fotoimport (nicht im Lieferstand ausgeführt)

- Bildkandidaten und Dateinamen: https://github.com/Bowserinator/Periodic-Table-JSON
  (Datenbank unter CC BY-SA 3.0; auf Quellen- und Share-Alike-Pflichten achten).
- Bildmetadaten und tatsächliche Lizenz: Wikimedia Commons
  https://commons.wikimedia.org/wiki/Commons:Machine-readable_data
  mit `action=query&prop=imageinfo&iiprop=extmetadata|url`.
- Der Importer `scripts/import-wikimedia-photos.mjs` verarbeitet nur
  `upload.wikimedia.org`-Bilder und akzeptiert ausschließlich bestimmte
  maschinenlesbare freie Lizenzen (Public Domain, CC0, CC BY, CC BY-SA).
  Er speichert die Bilddateien im Projekt und trägt Lizenz, Urheber und
  Original-Dateiseite in `image` ein.
- **Lizenzprüfung bleibt Pflicht:** Metadaten können fehlerhaft, mehrdeutig
  oder veraltet sein. Originaldateien, deren Abbildungen (etwa urheberrechtlich
  geschützte Laborszenen) und eventuelle Bearbeitungen sind manuell zu prüfen.

## Nutzung ohne Internet

Alle 118 aktuellen Elementgrafiken sowie alle redaktionellen Inhalte sind
lokal im ZIP enthalten und Teil des PWA-Offlinespeichers. Bei Nutzung über
`file://` funktioniert die Webseite ebenfalls lokal; nur der Service Worker
und die Browser-Installation brauchen localhost oder HTTPS.

## Optionaler Metadatenimport (nicht im Lieferstand ausgeführt)

- `scripts/import-metadata.mjs` fragt die öffentliche PubChem-PUG-REST-API
  (`https://pubchem.ncbi.nlm.nih.gov/rest/pug/periodictable/JSON`) und den
  Wikidata-SPARQL-Endpunkt (`https://query.wikidata.org/`) nach
  Entdeckungsinformationen ab. Daten werden nur als Prüfkandidaten gespeichert.
- Genutzte Wikidata-Aussagen: Element (P31), Ordnungszahl (P1086),
  Entdecker (P61), Entdeckungsdatum (P575), Bild (P18). Die Aussagegenauigkeit
  variiert; die redaktionelle Übernahme erfolgt nach manueller Prüfung.
- Ohne Netzwerkzugang ist das Skript nicht ausgeführt und produziert keinen
  behaupteten oder fingierten Datenabgleich.
