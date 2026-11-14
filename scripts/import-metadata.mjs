/**
 * Optionaler, einmaliger Datenabgleich mit PubChem und Wikidata.
 * Erzeugt ausschließlich Quellenschnappschüsse in scripts/source/.
 * Änderungen an redaktionellen Elementprofilen erfolgen bewusst manuell.
 * Node >= 18, Internetverbindung erforderlich.
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outdir = join(root, 'scripts/source');
mkdirSync(outdir, {recursive: true});
const timestamp = new Date().toISOString();

async function getJson(url, accept = 'application/json') {
  const response = await fetch(url, {
    headers: {
      Accept: accept,
      'User-Agent': 'Periodensystem/1.0 (offline educational PWA; contact via project maintainer)'
    },
    signal: AbortSignal.timeout(45000)
  });
  if (!response.ok) throw Error(`HTTP ${response.status}: ${response.statusText}`);
  return response.json();
}

const pubchemUrl = 'https://pubchem.ncbi.nlm.nih.gov/rest/pug/periodictable/JSON';
const sparql = `SELECT ?number ?element ?elementLabel ?discoverer ?discovererLabel ?date ?image WHERE {
  ?element wdt:P31 wd:Q11344;
           wdt:P1086 ?number.
  FILTER (?number >= 1 && ?number <= 118)
  OPTIONAL { ?element wdt:P61 ?discoverer. }
  OPTIONAL { ?element wdt:P575 ?date. }
  OPTIONAL { ?element wdt:P18 ?image. }
  SERVICE wikibase:label { bd:serviceParam wikibase:language "de,en". }
} ORDER BY ?number`;
const wikidataUrl = 'https://query.wikidata.org/sparql?format=json&query=' + encodeURIComponent(sparql);

const unwrap = (row, field) => row[field]?.value ?? null;
const keep = (value, regex) => value && regex.test(value) ? value : null;
const discoveredBy = (item) => item?.name ? item : null;

async function run() {
  let done = 0;
  for (const source of ['pubchem', 'wikidata']) {
    try {
      if (source === 'pubchem') {
        // Der API-Export bleibt bewusst roh: unbekannte Tabellenfelder gehen
        // nicht verloren, und ein neues API-Schema überschreibt keine Werte.
        const result = await getJson(pubchemUrl);
        if (!result || typeof result !== 'object') throw Error('Kein JSON-Objekt');
        const filename = 'import-pubchem.json';
        writeFileSync(join(outdir, filename), JSON.stringify({
          downloadedAt: timestamp, source: pubchemUrl, data: result
        }, null, 2) + '\n');
        console.log(`PubChem: Rohdaten gespeichert in scripts/source/${filename}`);
      } else {
        const result = await getJson(wikidataUrl, 'application/sparql-results+json');
        if (!Array.isArray(result?.results?.bindings)) throw Error('Unerwartetes SPARQL-Ergebnis');
        const byNumber = new Map();
        for (const row of result.results.bindings) {
          const n = Number(unwrap(row, 'number'));
          if (!Number.isInteger(n) || n < 1 || n > 118) continue;
          if (!byNumber.has(n)) byNumber.set(n, {
            number: n, wikidata: null, label: null,
            discoverers: [], discoveryDates: [], imageCandidates: []
          });
          const dest = byNumber.get(n);
          dest.wikidata ||= keep(unwrap(row,'element'), /^https?:\/\/(www\.)?wikidata\.org\/entity\/Q\d+$/);
          dest.label ||= unwrap(row, 'elementLabel');
          const person = discoveredBy({
            name: unwrap(row,'discovererLabel'),
            wikidata: keep(unwrap(row,'discoverer'), /^https?:\/\/(www\.)?wikidata\.org\/entity\/Q\d+$/)
          });
          if (person && !dest.discoverers.some(p => p.name === person.name && p.wikidata === person.wikidata)) dest.discoverers.push(person);
          const date = unwrap(row,'date');
          if (date && !dest.discoveryDates.includes(date)) dest.discoveryDates.push(date);
          const image = unwrap(row,'image');
          if (image && !dest.imageCandidates.includes(image)) dest.imageCandidates.push(image);
        }
        const filename = 'import-wikidata.json';
        writeFileSync(join(outdir, filename), JSON.stringify({
          downloadedAt: timestamp,
          source: 'https://query.wikidata.org/',
          query: sparql,
          note: 'Wikidata: Datumspraezision und Entdeckungszuordnung manuell pruefen; Bilder nicht ungeprueft verwenden.',
          elements: [...byNumber.values()].sort((a,b) => a.number-b.number)
        }, null, 2) + '\n');
        console.log(`Wikidata: ${byNumber.size} Element-Kandidaten gespeichert in scripts/source/${filename}`);
      }
      done++;
    } catch (error) {
      console.warn(`${source}: ${error.message}`);
    }
  }
  if (!done) {
    console.error('Kein Datenimport erfolgreich. Bitte Internetverbindung und öffentliche Endpunkte prüfen.');
    process.exitCode = 1;
  } else {
    console.log('Fertig. Keine lokalen Elementprofile geändert. Quellendaten vor Übernahme prüfen.');
  }
}
await run();
