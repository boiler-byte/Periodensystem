# Datenquellen und methodische Hinweise

## Herkunft

- **RDKit PeriodicTable** (Projekt: https://www.rdkit.org/): englische Elementnamen und Symbole, relative Atommassen und Referenz-Atomradien. Dokumentation: https://www.rdkit.org/docs/source/rdkit.Chem.rdchem.html. RDKit ist unter einer BSD-3-Clause-Lizenz veröffentlicht, siehe https://github.com/rdkit/rdkit/blob/master/license.txt.
- **Deutsche Elementnamen, Familien, Gruppen/Perioden und Kachelpositionen** wurden für dieses Projekt ergänzt. Das Standardschema hat für den f-Block keine vollständig einheitliche Gruppen-Zuordnung; deshalb wird für Lanthanoide und Actinoide meist `null` verwendet.
- **Elektronenkonfigurationen/Schalen** wurden hier mit dem Aufbau-Modell generiert und für bekannte Ausnahmen angepasst. Für superschwere Elemente ab 104 können Zustände und Konfigurationen theoretisch bzw. unsicher sein.

Die Datei `data/elements.js` ist ein eigenständig zusammengestellter lokaler Datensatz und **keine Kopie** der Bowserinator-JSON-Datei. Die frühere Empfehlung https://github.com/Bowserinator/Periodic-Table-JSON eignet sich ebenfalls als Datenquelle, steht aber unter CC BY-SA 3.0 und wurde deshalb hier nicht eingebettet.

## Einheiten

| Eigenschaft | Einheit / Bedeutung |
|---|---|
| `atomicMass` | Atommasse in u; bei instabilen Elementen oft repräsentative Massenzahlen bzw. Näherungswerte |
| `covalentRadiusPm` | Kovalenzradius, in pm aus Å umgerechnet |
| `vdwRadiusPm` | van-der-Waals-Radius, in pm aus Å umgerechnet |
| `shells` | Elektronen pro Hauptschale im vereinfachten Grundzustandsmodell |
| `phase` | grobe Einordnung bei Raumtemperatur; `unknown` bei nicht ausreichend gesicherten sehr schweren Elementen |

**Hinweis:** Elektronenschalen und Konfigurationen sind nicht bei allen schweren Atomen unabhängig experimentell gesichert. Bei mehreren Elementen sind Atomradien nicht verfügbar (`null`). „Unbekannt“ ist ausdrücklich keine Messung. Das Periodensystem veranschaulicht Zusammenhänge, ersetzt aber keine chemische Fachdatenbank.
