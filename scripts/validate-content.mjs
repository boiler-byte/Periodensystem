/* Validiert die lokale Datenbank und PWA-Assets. Aufruf: node scripts/validate-content.mjs */
import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';

const app = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const context = {};
context.window = context;
for (const script of ['data/elements.js', 'data/element-content.js']) {
  runInNewContext(readFileSync(resolve(app, script), 'utf8'), context, { filename: script });
}
const errors = [];
const basic = context.PSE_DATA.elements;
const richer = context.PSE_CONTENT.elements;
if (basic.length !== 118 || new Set(basic.map(el => el.number)).size !== 118) errors.push('Basisdaten: 118 eindeutige Elemente erwartet.');
const all = new Set(basic.map(el => el.number));
const imagePaths = new Set();
for (const [key, item] of Object.entries(richer)) {
  const name = basic.find(el => el.number === Number(key))?.name || `#${key}`;
  const prefix = `${name} (#${key})`;
  if (!all.has(Number(key))) errors.push(`${prefix}: unbekannte Ordnungszahl.`);
  if (!item.description || item.description.length < 25) errors.push(`${prefix}: Beschreibung fehlt.`);
  if (!item.discovery || !item.discovery.label || !Array.isArray(item.discovery.people) || !item.discovery.narrative) errors.push(`${prefix}: Entdeckung unvollständig.`);
  if (!Array.isArray(item.uses) || item.uses.length < 3 || item.uses.some(u => !u.title || !u.text)) errors.push(`${prefix}: Anwendungen unvollständig.`);
  if (!Array.isArray(item.facts) || item.facts.length < 2 || item.facts.some(f => !f.title || !f.text)) errors.push(`${prefix}: Fakten unvollständig.`);
  if (!item.image?.src || !item.image?.alt || !item.image?.caption || !item.image?.credit || !item.image?.kind) errors.push(`${prefix}: Bildmetadaten unvollständig.`);
  if (item.image?.src) {
    if (!/^assets\/elements\/(?:photos\/)?[a-z0-9_-]+\.(webp|png|jpg|jpeg|svg)$/.test(item.image.src)) errors.push(`${prefix}: Bildpfad unerwartet: ${item.image.src}`);
    if (!existsSync(resolve(app, item.image.src))) errors.push(`${prefix}: Bild fehlt: ${item.image.src}`);
    imagePaths.add(item.image.src);
  }
  if (!Array.isArray(item.sources) || !item.sources.length || item.sources.some(s => !s.label || !/^https:\/\//.test(s.url))) errors.push(`${prefix}: Quellen fehlen oder sind ungültig.`);
}
const html = readFileSync(resolve(app, 'index.html'), 'utf8');
for (const script of [...html.matchAll(/<script src="([^"]+)" defer><\/script>/g)].map(match => match[1])) {
  if (!existsSync(resolve(app, script))) errors.push(`index.html: Script fehlt: ${script}`);
}
const serviceWorker = readFileSync(resolve(app, 'service-worker.js'), 'utf8');
const fileBlock = serviceWorker.match(/const APP_FILES = \[([\s\S]*?)\];/);
if (!fileBlock) errors.push('service-worker.js: APP_FILES fehlt.');
else {
  const cached = [...fileBlock[1].matchAll(/[\"']([^\"']+)[\"']/g)].map(match => match[1]);
  for (const asset of cached) {
    if (!existsSync(resolve(app, asset))) errors.push(`Service-Worker-Asset fehlt: ${asset}`);
  }
  for (const src of imagePaths) if (!cached.includes('./' + src)) errors.push(`Bild nicht offline gecacht: ${src}`);
  for (const required of ['./data/element-content.js', './js/content.js']) if (!cached.includes(required)) errors.push(`Modul nicht offline gecacht: ${required}`);
  console.log(`PWA-Precache: ${cached.length} Einträge.`);
}
if (Object.keys(richer).length !== 118) errors.push(`Erweiterte Profile: 118 erwartet, ${Object.keys(richer).length} gefunden.`);
if (imagePaths.size !== 118) errors.push(`Bildpfade: 118 eindeutige erwartet, ${imagePaths.size} gefunden.`);
if (errors.length) {
  console.error(`Validierung fehlgeschlagen (${errors.length}):\n- ${errors.join('\n- ')}`);
  process.exitCode = 1;
} else {
  console.log(`OK: ${basic.length} chemische Elemente, ${Object.keys(richer).length} redaktionelle Profile, ${imagePaths.size} lokale Bilder, sämtliche referenzierten Dateien vorhanden.`);
}
