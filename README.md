# Periodensystem – Phase 3

**118 interaktive, redaktionell ausgearbeitete Elementprofile** mit Geschichte,
Entdeckern bzw. Forschungsgruppen, Anwendungsbeispielen, Wissenswertem,
Sicherheitshinweisen, Quellen und **118 lokal gespeicherten Bildassets**.

Vollständig lokal lauffähige HTML-/CSS-/Vanilla-JavaScript-PWA, ohne Framework,
CDN, API-Schlüssel oder Netzwerkzugriff zur Laufzeit.

## Starten

1. Projekt entpacken und `index.html` per Doppelklick öffnen.
2. Für die **installierbare PWA mit Offline-Service-Worker** (braucht localhost
   oder HTTPS) im Projektordner starten:

   ```bash
   python3 -m http.server 8000
   ```

3. `http://localhost:8000/` im Browser öffnen. Die Anwendung kann nach
   erfolgreicher Offline-Vorbefüllung auch ohne Internet genutzt werden.

Die 118 Texte und Illustrationen liegen schon im Projekt. **Kein Importskript
muss ausgeführt werden**, damit das Projekt funktioniert.

## Oberfläche – Delta v2

- Der kompakte Kopfbereich zeigt Eisen (Fe, 26) als Brand-Kachel; die große
  Einführungssektion und die zusätzliche Offline-Statusanzeige entfallen.
- Über das **Trichter-Symbol „Filter“** wird das anfangs ausgeblendete Panel
  mit Suche, Elementfamilie, Aggregatzustand und Favoriten ein- bzw. ausgeblendet.
  Mit `/` lässt es sich öffnen und die Suche fokussieren; `Esc` schließt es
  (bei einer nichtleeren Suche wird diese zuerst geleert). Ein Punkt am
  Filter-Button signalisiert aktive Filter auch bei geschlossenem Panel.
- **Fav.** und **Vergleich** liegen jetzt direkt im Elementprofil neben dem Namen.
  **Vergleich** öffnet sofort den Vergleichsdialog, in dem der Vergleichspartner
  ausgewählt wird. Browser-Zurück schließt den Vergleich wie zuvor; auf
  Mobilgeräten erscheint danach das Profil wieder.
- Diese Änderungen sind ausschließlich UI-Anpassungen. Die 118 Elementdaten und
  Bilddateien bleiben unverändert.

## Phase 3: Was ist enthalten?

- 118 Profilseiten mit den vier Bereichen **Daten, Geschichte, Verwendung
  und Wissen**. Alle Quellen stehen direkt am Profil.
- 112 neu geschriebene deutschsprachige Profile zusätzlich zu den sechs
  vorhandenen erweiterten Profilen (Wasserstoff, Helium, Sauerstoff, Eisen,
  Gold, Uran).
- Entdeckungsdaten mit mehreren Beteiligten, differenzierten Jahresangaben
  oder „seit der Antike / Vorgeschichte bekannt“. Bei sehr schweren Elementen
  steht Forschung statt erfundener Alltagsanwendungen im Mittelpunkt.
- 118 **KI-generierte WebP-Illustrationen**: sechs zuvor einzeln erzeugte Motive und 112 aus größeren KI-generierten Sammelkompositionen zugeschnittene Motive.
  **Dies sind keine authentischen Fotos** von Elementproben. Besonders kurzlebige/synthetische Elemente werden ausdrücklich symbolisch dargestellt.
  Die aus größeren Kompositionen zugeschnittenen Bilder besitzen eine geringere ursprüngliche Detailauflösung als separat erzeugte Motive (siehe `BILD-SERIE.md`).
- Alle 118 Bilddateien werden im PWA-Service-Worker für den Offlinebetrieb
  vorgemerkt; der Cache aktualisiert sich durch eine neue Versionskennung.
- Ein offlinefähiger, reproduzierbarer Generator für Profilinhalte und SVGs.
- Ein optionaler Wikimedia-Commons-Importer mit technischen Lizenzprüfungen
  für das *spätere* Ersetzen von Illustrationen durch lokale Fotos.
- Ein optionaler Online-Abgleich von Entdeckungsjahren gegen einen API-Datensatz.

## Projektstruktur

```text
periodensystem/
├── index.html
├── manifest.webmanifest
├── service-worker.js
├── css/styles.css
├── data/
│   ├── elements.js                 # 118 chemische Grundprofile
│   └── element-content.js         # 118 redaktionelle Profile, direkt ladbar
├── assets/
│   ├── elements/
│   │   ├── hydrogen.webp          # sechs frühere KI-Illustrationen
│   │   ├── lithium.webp           # weitere KI-generierte Studiomotive
│   │   ├── ...                    # 118 verwendete WebP-Illustrationen
│   │   ├── lithium.svg            # veraltetes, nicht verwendetes Fallback
│   │   └── photos/                # optional: Wikimedia-Fotos nach Import
│   ├── discoverers/              # vorbereitet, keine Porträts
│   └── icon-*.png / icon.svg
├── js/
│   ├── content.js                 # Inhalt, Bild-/Lizenznachweise
│   ├── details.js                 # Profil + Tabs
│   ├── dialogs.js                 # mobile Modals, Browser-History
│   ├── compare.js, table.js, ...  # weitere Vanilla-JS-Module
├── scripts/
│   ├── source/
│   │   ├── profiles.tsv           # 112 handredigierte Profile
│   │   ├── discoveries.tsv        # 112 Entdeckungsgeschichten
│   │   ├── original-six.json      # Ausgangsbestand der sechs Profile
│   │   ├── photo-overrides.json  # alle 112 neuen Bildreferenzen
│   │   └── photo-overrides.json   # optional, nach Fotoimport
│   ├── build-content.mjs          # offline: Daten + SVGs regenerieren
│   ├── sync-cache.mjs             # offline: Service-Worker aktualisieren
│   ├── validate-content.mjs      # offline: QA und Vollständigkeit
│   ├── import-wikimedia-photos.mjs# optional online: freie Fotos laden
│   └── audit-discoveries.mjs      # optional online: Jahreszahlen abgleichen
├── INHALTSMODELL.md
├── QUELLEN.md
└── LICENSE
```

## Redaktionelle Daten bearbeiten

Für die 112 hinzugefügten Elemente werden Texte in `scripts/source/profiles.tsv`
und `scripts/source/discoveries.tsv` gepflegt. Die sechs ursprünglichen Profile
stehen in `scripts/source/original-six.json`. Nach einer Änderung:

```bash
node scripts/build-content.mjs
node scripts/sync-cache.mjs
node scripts/validate-content.mjs
```

Die fertige `data/element-content.js` wird automatisch neu erstellt. Diese Datei
kann weiterhin wie gewohnt direkt von `index.html` geladen werden; **Node wird
nur für die optionale redaktionelle Wartung benötigt**.

## Optionale echte Fotos von Wikimedia Commons

Der ausgelieferte Stand enthält aus Transparenzgründen ausschließlich eigens
entworfene Illustrationen. Wenn eine Internetverbindung vorhanden ist, kann der
folgende Importer aus einem frei verfügbaren Periodensystemdatensatz
Wikimedia-Commons-Fotokandidaten ermitteln. Er prüft die Metadaten bei Commons,
lädt erlaubte Dateitypen verkleinert lokal und hinterlegt Lizenz-/Urheberangaben.
Ohne geeignete frei lizenzierte Datei bleibt das SVG erhalten.

```bash
# Zuerst nur Kandidaten ansehen (Internet nötig):
node scripts/import-wikimedia-photos.mjs --dry-run --only=3,6,29

# Drei einzelne Elemente importieren:
node scripts/import-wikimedia-photos.mjs --only=3,6,29

# Alle Elemente prüfen; vorhandene Foto-Overrides bleiben erhalten:
node scripts/import-wikimedia-photos.mjs

# Optional auch die sechs ursprünglichen Illustrationen ersetzen:
node scripts/import-wikimedia-photos.mjs --replace
```

**Wichtig:** Der Importer kann Bildrechte nur anhand technischer Angaben
vorprüfen. Vor jeder öffentlichen Veröffentlichung müssen Bildmotiv, Urheber,
Originalseite und geltende Lizenz (insbesondere CC BY-SA) **manuell geprüft**
werden. Die Bilder sind möglicherweise keine Fotografien reiner Elemente,
sondern Spektren, Mineralien oder Verbindungen. Der Importer wurde in dieser
Umgebung mangels Internetzugang **nicht online ausgeführt**. Damit wird im
Lieferstand keine Anzahl authentischer Fotos behauptet.

## Optionale Quelldaten aus PubChem und Wikidata aktualisieren

```bash
node scripts/import-metadata.mjs
```

Das Skript ruft den offiziellen PubChem-Periodensystemexport und einen
Wikidata-SPARQL-Datensatz ab. Es speichert ausschließlich **Quellenschnappschüsse**
in `scripts/source/import-pubchem.json` und `scripts/source/import-wikidata.json`
und überschreibt keine redaktionellen Profile. Wikidata-Angaben (insbesondere
Datumspräzision, Entdecker und Bildlizenzen) erfordern vor einer Übernahme
fachliche Prüfung. Der Online-Import konnte in der Erstellungsumgebung
mangels Netzwerkzugang nicht live getestet werden.

## Optionaler Quellenabgleich für historische Angaben

```bash
node scripts/audit-discoveries.mjs
```

Das Skript erstellt `scripts/source/discovery-audit.json`, ohne die redaktionell
bewusst differenzierten Jahresangaben zu überschreiben. Historische Angaben
können sich auf Erstbeobachtung, Isolierung, Identifikation oder Anerkennung
beziehen und müssen daher fachlich eingeordnet werden. Die redaktionellen
Einträge wurden nicht automatisiert für jedes Element gegen eine Online-API
verifiziert.

## Bestehende App-Funktionen

- Suche und Filter über alle 118 Elemente; drei Farbdarstellungen.
- Desktop: Elementdaten in der rechten Seitenleiste.
- Mobil: native Profil-Dialoge mit Tabs und scrollbaren Inhalten.
- Vergleich über Dropdown, danach Vergleichs-Dialog.
- Browser-Zurück schließt Dialoge, Vorwärts stellt sie wieder her.
- Favoriten, Dark/Light-Modus und Tastaturnavigation.
- Für Installation/Offline-Cache localhost oder HTTPS. Direkter `file://`-Start
  ist auch ohne Service Worker möglich.

## Fachliche und urheberrechtliche Einordnung

Siehe `QUELLEN.md`. Der Inhalt ist ein didaktischer Einstieg, keine vollständige
fachwissenschaftliche Datenbank. Seltene bzw. superschwere Elemente haben nur
wenige Messdaten; manche Eigenschaften sind theoretisch. Für Unterricht,
Publikation oder kommerzielle Nutzung sollten historisch umstrittene Angaben
und jede importierte Bilddatei vorab gegengeprüft werden.

## Bildserie – Delta v4 (November 2026)

Die sechs ursprünglichen WebP-Motive (H, He, O, Fe, Au, U) bleiben unverändert.
Für die restlichen 112 Elemente wurden WebP-Bilder lokal eingebunden (davon
106 außerhalb des akzeptierten Pilotsets und sechs bisher noch nicht in der
PWA integrierte Pilotmotive). Sie liegen vollständig offline vor.

Die Bilder stammen aus KI-generierten Gruppentafeln und wurden zugeschnitten,
von Beschriftung bereinigt und auf 640 × 400 px exportiert. **Die tatsächliche
Quellauflösung ist je nach Gruppe niedriger.** Insbesondere die Bilder der
superschweren Elemente sind frei interpretierte Symbole und keine Nachweise
einer makroskopischen Substanz. Einzelheiten siehe `BILD-SERIE.md`.

Bildreferenzen werden in `scripts/source/photo-overrides.json` gepflegt und
beim Neuaufbau mit `node scripts/build-content.mjs` wieder übernommen.
Die alten SVG-Dateien sind allenfalls Fallbacks und werden im normalen
PWA-Betrieb nicht mehr referenziert oder offline gecacht.
