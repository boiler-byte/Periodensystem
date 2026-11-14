/**
 * Optionaler Online-Importer für frei lizenzierte Commons-Fotografien.
 * Keine Laufzeitabhängigkeit der PWA. Ersetzt nie unbemerkt manuell ausgewählte Fotos.
 * Aufruf: node scripts/import-wikimedia-photos.mjs [--only=3,6,29] [--replace] [--dry-run]
 * Node >= 18, Internetzugang erforderlich. Quellen vor Veröffentlichung selbst prüfen.
 */
import { readFileSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { runInNewContext } from 'node:vm';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const input = 'https://raw.githubusercontent.com/Bowserinator/Periodic-Table-JSON/master/PeriodicTableJSON.json';
const args = process.argv.slice(2);
const dry = args.includes('--dry-run');
const replace = args.includes('--replace');
const only = args.find(a=>a.startsWith('--only='))?.slice(7).split(',').map(Number) || null;
const limit = Number(args.find(a=>a.startsWith('--limit='))?.slice(8) || 118);
const sleep = ms => new Promise(r=>setTimeout(r,ms));
const txt = value => String(value ?? '').replace(/<[^>]*>/g,' ').replace(/&nbsp;|&#160;/gi,' ').replace(/&amp;/gi,'&').replace(/&quot;/gi,'"').replace(/&#39;/gi,"'").replace(/\s+/g,' ').trim().slice(0,240);
const meta = (info,key) => info?.extmetadata?.[key]?.value || '';
const attr = (text,max=200) => txt(text).slice(0,max);
const fetchJson = async url => {
  const response = await fetch(url, {headers:{'User-Agent':'Periodensystem/1.0 (educational offline app; no tracking)'},signal:AbortSignal.timeout(25000)});
  if (!response.ok) throw Error(`${response.status} ${response.statusText}`);
  return response.json();
};
const context={};context.window=context;
runInNewContext(readFileSync(join(root,'data/elements.js'),'utf8'),context);
const base = new Map(context.PSE_DATA.elements.map(e=>[e.number,e]));
const overridePath = join(root,'scripts/source/photo-overrides.json');
let overrides={};
try { overrides=JSON.parse(readFileSync(overridePath,'utf8')); } catch(_) {}
let count=0, successes=0, skipped=0;

console.log(`Wikimedia-Import ${dry?'(nur Vorschau)':''} – Bilder werden erst nach Lizenzprüfung lokal gespeichert.`);
const data = await fetchJson(input);
if (!Array.isArray(data.elements) || data.elements.length!==118) throw Error('Quelldatensatz enthält nicht genau 118 Elemente.');
const imagesDir = join(root,'assets/elements/photos');
if (!dry) mkdirSync(imagesDir,{recursive:true});
for (const item of data.elements) {
  const n = item.number, el = base.get(n);
  if (!el || (only && !only.includes(n)) || (!replace && overrides[n])) continue;
  if (++count > limit) break;
  try {
    const source = item.image?.url;
    if (!source) { skipped++; continue; }
    const sourceUrl = new URL(source);
    if (sourceUrl.protocol !== 'https:' || sourceUrl.hostname !== 'upload.wikimedia.org') { skipped++; continue; }
    const filename = decodeURIComponent(sourceUrl.pathname.split('/').pop());
    if (!/\.(png|jpe?g|webp)$/i.test(filename)) { skipped++; continue; }
    const query = new URL('https://commons.wikimedia.org/w/api.php');
    query.searchParams.set('action','query'); query.searchParams.set('format','json');
    query.searchParams.set('prop','imageinfo'); query.searchParams.set('titles','File:'+filename);
    query.searchParams.set('iiprop','url|mime|extmetadata'); query.searchParams.set('iiurlwidth','640');
    query.searchParams.set('iiextmetadatafilter','LicenseShortName|LicenseUrl|Artist|Credit|Attribution|Copyrighted');
    const result = await fetchJson(query);
    const info = Object.values(result.query?.pages||{})[0]?.imageinfo?.[0];
    if (!info) { skipped++; continue; }
    const license = txt(meta(info,'LicenseShortName'));
    const permitted = /^(?:CC0|Public domain|PD|CC BY(?:-SA)?\s\d(?:\.\d)?)/i.test(license);
    if (!permitted) { skipped++; continue; }
    const imageUrl = new URL(info.thumburl || info.url);
    if (imageUrl.hostname !== 'upload.wikimedia.org' || imageUrl.protocol !== 'https:') { skipped++; continue; }
    const extension = /image\/png/.test(info.thumbmime || info.mime) ? 'png' : /image\/webp/.test(info.thumbmime || info.mime) ? 'webp' : 'jpg';
    const src = `assets/elements/photos/${el.symbol.toLowerCase()}.${extension}`;
    const author = attr(meta(info,'Attribution') || meta(info,'Artist') || meta(info,'Credit'),180) || 'Siehe Wikimedia Commons';
    const licenseUrl = txt(meta(info,'LicenseUrl'));
    const origin = `https://commons.wikimedia.org/wiki/File:${encodeURIComponent(filename).replace(/%20/g,'_')}`;
    const proposal = {
      src, alt:`Wikimedia-Commons-Abbildung zu ${el.name} (${el.symbol}); Bildinhalt bitte anhand der Originalquelle prüfen`,
      caption: `Wikimedia-Commons-Abbildung zu ${el.name}`,
      kind:'Fotografie aus Wikimedia Commons; Motiv bitte überprüfen',
      credit:author, license,
      licenseUrl:licenseUrl.startsWith('https://') ? licenseUrl : null, sourceUrl:origin
    };
    if (dry) {
      console.log(`#${n} ${el.name}: ${license} – ${origin}`);
    } else {
      const response = await fetch(imageUrl, {signal:AbortSignal.timeout(30000)});
      if (!response.ok) throw Error(`Foto HTTP ${response.status}`);
      const mime = response.headers.get('content-type') || '';
      if (!/^image\/(jpeg|png|webp)/i.test(mime)) throw Error(`Unerwarteter Bildtyp: ${mime}`);
      const bytes = Buffer.from(await response.arrayBuffer());
      if (!bytes.length || bytes.length > 7_000_000) throw Error('Bild zu groß oder leer');
      writeFileSync(join(root,src),bytes);
      overrides[n] = proposal;
      console.log(`#${n} ${el.name}: gespeichert (${license})`);
    }
    successes++;
  } catch (error) {
    console.warn(`#${n} ${el.name}: ausgelassen (${error.message})`);
    skipped++;
  }
  await sleep(180); // Freiwillige Begrenzung der Anfragefrequenz
}
if (!dry && successes) {
  writeFileSync(overridePath,JSON.stringify(overrides,null,2)+'\n');
  execFileSync(process.execPath,['scripts/build-content.mjs'],{cwd:root,stdio:'inherit'});
  execFileSync(process.execPath,['scripts/sync-cache.mjs'],{cwd:root,stdio:'inherit'});
}
console.log(`Fertig: ${successes} ${dry?'Kandidaten':'lokale Fotos'}, ${skipped} ausgelassen. Alle anderen Elemente behalten ihre Offline-Illustrationen.`);
console.log('WICHTIG: Die Bildmotive und Lizenzangaben vor Veröffentlichung einzeln überprüfen; CC-BY-SA-Nachnutzungspflichten beachten.');
