# Periodensystem – Vanilla-JavaScript-PWA

Ein vollständiges interaktives Periodensystem mit 118 Elementen, ohne Framework, CDN, Node-Pakete oder andere Laufzeit-Abhängigkeiten.

## Direkt lokal öffnen

1. ZIP entpacken.
2. `index.html` doppelklicken.
3. Suche, Filter, Elementprofile und Vergleiche nutzen – ohne Internet.

`data/elements.js` enthält sämtliche Elemente als JavaScript-Datenobjekt. Es gibt keine `fetch`-Anfrage nach einer JSON-Datei, keine dynamischen ES-Modulimporte und keine Netzwerkpflicht.

**Wichtig:** Beim Öffnen als `file://` funktioniert die Anwendung, aber **PWA-Installation und Service Worker funktionieren nicht über `file://`**. Dafür die App über `localhost` oder HTTPS bereitstellen (nächster Abschnitt).

## Als installierbare Offline-PWA starten

1. Ein Terminal im entpackten Projektordner öffnen.
2. Einen einfachen lokalen Webserver starten (Python 3 genügt):

   ```bash
   python3 -m http.server 8000
   ```

   Alternativ unter Windows: `py -m http.server 8000`.

3. Im Browser `http://localhost:8000/` öffnen. Beim ersten Aufruf können der Service Worker und alle App-Dateien gecacht werden.
4. Nach dem ersten vollständigen Online-Aufruf funktioniert die App **offline**. In unterstützten Browsern über die Browser-Installation bzw. die Schaltfläche „Installieren“ installieren. Auf iOS kann man über „Teilen“ → „Zum Home-Bildschirm“ hinzufügen.

Für ein echtes Deployment genügt ein statischer HTTPS-Webserver. Der Service Worker stellt die App-Dateien aus einem versionsbasierten Cache bereit und ermöglicht den Start ohne Verbindung. Für Updates `CACHE_NAME` in `service-worker.js` hochzählen.

## Funktionen

- Alle 118 Elemente im Periodensystem, mit deutschen und englischen Namen.
- Suche nach Name, Symbol oder Ordnungszahl; Filter für Elementfamilie und Aggregatzustand sowie Favoritenfilter.
- Farbcodierung nach Elementfamilie, Aggregatzustand oder Atommasse.
- Elementprofil mit Eigenschaften, Elektronenkonfiguration und Schalenmodell.
- **Mobile Profile als modale Dialoge**, auf dem Desktop in der rechten Seitenleiste.
- **Einfacher Vergleich über „Vergleichen mit“:** Eine Liste mit allen 118 Elementen; nach Auswahl öffnet sich der Vergleich automatisch. Den Vergleichspartner kann man im Dialog ändern.
- **Browser-Zurück** schließt den aktuellen Dialog. Bei einem Vergleich, der aus einem mobilen Profil geöffnet wurde, führt Zurück zunächst zum Profil, anschließend zur Elementübersicht. Browser-Vorwärts öffnet den Dialog wieder.
- Tastenkombination `/` für die Suche, Pfeiltasten zur Navigation zwischen Kacheln, Escape für das Schließen des aktiven Dialogs.
- Dunkles und helles Farbschema; Favoriten und Design werden lokal gespeichert, sofern verfügbar.
- Installierbare PWA mit App-Icon, Manifest und Service-Worker-Cache; keine externen Abhängigkeiten.

## Verzeichnisstruktur

```text
periodensystem-pwa/
├── index.html                 # HTML-Seite, native Dialog-Container
├── manifest.webmanifest       # Name, Start-URL, Display-Modus und App-Icons
├── service-worker.js          # Offline-Cache und Cache-Aktualisierung
├── assets/
│   ├── icon.svg
│   ├── icon-192.png
│   ├── icon-512.png
│   ├── icon-maskable-512.png
│   └── icon-maskable.svg
├── css/
│   └── styles.css             # Layout, Themes, Responsive Design, Dialoge
├── data/
│   └── elements.js            # Vollständiger Datensatz: 118 Elemente
├── js/
│   ├── core.js                # Elementfamilien, Farben und Formatierung
│   ├── store.js               # Zentraler UI-Zustand, Favoriten und Theme
│   ├── filters.js             # Suche und Filter
│   ├── table.js               # Kacheln, Grid, Tastaturnavigation
│   ├── details.js             # Profil-Darstellung und Vergleichsauswahl
│   ├── compare.js             # Vergleichsdialog und Vergleichstabelle
│   ├── dialogs.js             # Modal-Steuerung über die History API
│   ├── ui.js                  # Filter, Theme, Suche und Zufallsauswahl
│   ├── pwa.js                 # Installation und Service-Worker-Registrierung
│   └── app.js                 # Initialisierung
├── QUELLEN.md
├── LICENSE
└── README.md
```

## Module erweitern

Alle Module werden klassisch mit `defer` geladen und registrieren ihre öffentliche API unter `window.PSE`. Dieses Design funktioniert auch per Doppelklick auf `index.html`. Neue Module müssen vor `js/app.js` eingebunden werden.

- `PSE.Store` hält reaktive UI-Daten.
- `PSE.Table`, `PSE.Details`, `PSE.Compare` sind voneinander getrennte Darstellungen.
- `PSE.Dialogs` verwaltet **ein** aktives natives Dialogfenster über `history.pushState()`/`popstate`. Der Dialogtyp und die ausgewählten Elemente werden im History-State gespeichert.
- `PSE.PWA` nutzt `beforeinstallprompt`, falls der Browser das Ereignis anbietet, und registriert nur auf `http(s)` einen Service Worker. Für lokale Entwicklung ist `http://localhost` ausreichend.

## Daten bearbeiten

`data/elements.js` enthält den globalen Datensatz `window.PSE_DATA.elements`. Die Datei ist bereits ausführbares JavaScript: Eine bloß umbenannte JSON-Datei würde **nicht** ausreichen. Beispiele für Felder: `number`, `symbol`, `name`, `nameEn`, `atomicMass`, `category`, `phase`, `group`, `period`, `shells`, `electronConfiguration`.

## Daten und Lizenz

Siehe `QUELLEN.md` für Quellen und Datenbeschränkungen. Der Quellcode dieses Projekts ist unter MIT lizenziert (`LICENSE`). Datenwerte sind teilweise Näherungen und eignen sich nicht ungeprüft für wissenschaftliche Berechnungen.
