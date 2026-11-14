/**
 * Reproduzierbarer Offline-Build für redaktionelle Inhalte und schematische SVGs.
 * Node >= 18; keine externen npm-Pakete, keine Netzwerkverbindung.
 * Aufruf aus Projektordner: node scripts/build-content.mjs
 * Bestehende KI-WebP-Bilder der sechs Vorlagen werden nicht überschrieben.
 */
import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const read = p => readFileSync(join(root, p), 'utf8');
const context = {}; context.window = context;
runInNewContext(read('data/elements.js'), context);
const basic = context.PSE_DATA.elements;
const originals = JSON.parse(read('scripts/source/original-six.json'));
const photoOverrides = existsSync(join(root, 'scripts/source/photo-overrides.json'))
  ? JSON.parse(read('scripts/source/photo-overrides.json')) : {};

function records(file) {
  const map = new Map();
  for (const [i, raw] of read(file).split(/\r?\n/).entries()) {
    const line = raw.trim(); if (!line || line.startsWith('#')) continue;
    const cols = line.split('|');
    const number = Number(cols[0]);
    if (cols.length !== 5 || !Number.isInteger(number) || number < 1 || number > 118 || map.has(number)) {
      throw new Error(`${file}:${i+1} – ungültige/mehrfache Zeile (Spalten=${cols.length}, Element=${number})`);
    }
    map.set(number, cols.map(text => text.trim()));
  }
  return map;
}
const profiles = records('scripts/source/profiles.tsv');
const histories = records('scripts/source/discoveries.tsv');
const originalNumbers = new Set(Object.keys(originals).map(Number));
const missingNumbers = basic.map(e => e.number).filter(n => !originalNumbers.has(n));
if (profiles.size !== 112 || histories.size !== 112 || missingNumbers.some(n => !profiles.has(n) || !histories.has(n))) {
  throw new Error('Es werden für die 112 neuen Elemente je ein Profil und ein Geschichtseintrag erwartet.');
}

function list(str) {
  const parts = [];
  for (const part of str.split(';').map(x => x.trim()).filter(Boolean)) {
    if (!part.includes('~') && parts.length) parts[parts.length-1] += '; ' + part;
    else parts.push(part);
  }
  return parts.map(pair => {
    const cut = pair.indexOf('~');
    if (cut < 0) throw new Error(`Titel und Text durch ~ trennen: ${pair}`);
    return { title: pair.slice(0, cut).trim(), text: pair.slice(cut+1).trim() };
  });
}
const xml = str => String(str).replace(/[<>&"']/g, s => ({'<':'&lt;','>':'&gt;','&':'&amp;','"':'&quot;',"'":'&apos;'}[s]));
const palettes = {
  'alkali-metal': ['#fa9a73','#b94c47'], 'alkaline-earth': ['#efc278','#a56a37'],
  'transition-metal': ['#76bbff','#3055a6'], 'post-transition': ['#9ec4d4','#4f7a94'],
  metalloid: ['#91deca','#266e80'], nonmetal: ['#a3ea91','#2d997e'],
  halogen: ['#df9ff4','#8539a2'], 'noble-gas': ['#f5afce','#b34f9d'],
  lanthanoid: ['#86e3df','#2f8b9c'], actinoid: ['#ceb2ff','#744ba9']
};
function renderSvg(el) {
  const [accent, deep] = palettes[el.category] || ['#90afdf','#54689a'];
  const n = el.number, gas = el.phase === 'gas', liquid = el.phase === 'liquid', synthetic = n >= 104;
  let art = '';
  if (synthetic) {
    art = `<circle cx="256" cy="164" r="72" fill="url(#halo)" opacity=".7"/>
      <circle cx="256" cy="164" r="18" fill="${accent}" filter="url(#glow)"/>
      <g fill="none" stroke="${accent}" opacity=".84" stroke-width="2.5">
        <ellipse cx="256" cy="164" rx="123" ry="43" transform="rotate(20 256 164)"/>
        <ellipse cx="256" cy="164" rx="123" ry="43" transform="rotate(-48 256 164)"/>
        <ellipse cx="256" cy="164" rx="123" ry="43" transform="rotate(86 256 164)"/>
      </g><circle cx="361" cy="202" r="5" fill="#fff"/><circle cx="191" cy="94" r="5" fill="#fff"/>
      <text x="256" y="291" fill="#a6b8d2" text-anchor="middle" letter-spacing="3" font-size="10" font-family="sans-serif">NUR ATOMWEISE ERZEUGT</text>`;
  } else if (gas) {
    const bubbles = Array.from({length:18},(_,i)=> {
      const x=163+(i*53+n*17)%191, y=92+(i*41+n*11)%140;
      return `<circle cx="${x}" cy="${y}" r="${2+(i%4)}" fill="${accent}" opacity="${.15+(i%5)*.11}"/>`;
    }).join('');
    art = `<rect x="139" y="107" width="235" height="125" rx="60" stroke="#b8d8ef" stroke-opacity=".4" stroke-width="3" fill="url(#tube)"/>
      <rect x="157" y="137" width="200" height="62" rx="30" fill="${accent}" opacity=".26" filter="url(#glow)"/>
      <path d="M158 171 H357" stroke="${accent}" stroke-width="11" stroke-linecap="round" filter="url(#glow)" opacity=".86"/>
      <path d="M158 171 H357" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity=".9"/>${bubbles}`;
  } else if (liquid) {
    art = `<path d="M165 230 L168 132 Q168 117 183 117 H329 Q344 117 344 132 L347 230 Q348 247 330 247 H183 Q164 247 165 230Z" fill="url(#glass)" stroke="${accent}" stroke-opacity=".65" stroke-width="3"/>
      <path d="M169 175 Q212 156 252 177 T344 172 V230 Q343 244 326 244 H183 Q169 244 169 230Z" fill="url(#liquid)" opacity=".9"/>
      <path d="M178 133 H334" stroke="#fff" stroke-opacity=".43" stroke-width="3"/>
      <g fill="#fff" opacity=".46"><circle cx="213" cy="195" r="4"/><circle cx="272" cy="219" r="3"/><circle cx="313" cy="187" r="5"/></g>`;
  } else if (el.category === 'nonmetal' || el.category === 'metalloid') {
    art = `<g filter="url(#shadow)"><path d="M167 217 L202 91 L292 80 L345 168 L316 251 L214 251Z" fill="url(#mineral)" stroke="${accent}" stroke-opacity=".64" stroke-width="3"/>
      <path d="M202 91 L250 151 L214 251 L167 217Z" fill="${accent}" opacity=".7"/>
      <path d="M292 80 L250 151 L316 251 L345 168Z" fill="${deep}" opacity=".7"/>
      <path d="M202 91 L292 80 L250 151Z" fill="#e6fff9" opacity=".35"/>
      <path d="M250 151 L214 251 L316 251Z" fill="${accent}" opacity=".2"/></g>`;
  } else {
    art = `<g filter="url(#shadow)"><path d="M179 219 L158 138 L206 93 L301 84 L357 149 L338 226 L273 263 L198 253Z" fill="url(#mineral)" stroke="${accent}" stroke-width="2"/>
      <path d="M158 138 L206 93 L239 161 L198 253 L179 219Z" fill="${accent}" opacity=".44"/>
      <path d="M206 93 L301 84 L357 149 L239 161Z" fill="${accent}" opacity=".23"/>
      <path d="M239 161 L357 149 L338 226 L273 263 L198 253Z" fill="${deep}" opacity=".74"/>
      <path d="M206 93 L239 161 L357 149" fill="none" stroke="#f2fcff" stroke-opacity=".4" stroke-width="2"/>
      <path d="M239 161 L198 253" stroke="#f2fcff" stroke-opacity=".15" stroke-width="2"/></g>`;
  }
  const stars = Array.from({length:24},(_,i)=>{
    const x=24+(i*73+n*23)%460, y=30+(i*41+n*7)%264, opacity=0.1+(i%5)*.05;
    return `<circle cx="${x}" cy="${y}" r="${i%7===0?2:1}" fill="#b3dcff" opacity="${opacity}"/>`;
  }).join('');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 320" width="512" height="320" role="img" aria-label="${xml(el.name)}: schematisches Elementmotiv">
  <defs>
    <linearGradient id="background" x2="1" y2="1"><stop stop-color="#07131f"/><stop offset="1" stop-color="#12283e"/></linearGradient>
    <linearGradient id="mineral" x2=".9" y2="1"><stop stop-color="#e6f8ff"/><stop offset=".27" stop-color="${accent}"/><stop offset=".75" stop-color="${deep}"/><stop offset="1" stop-color="#0e253a"/></linearGradient>
    <linearGradient id="glass" x2="1" y2="1"><stop stop-color="#d7ebff" stop-opacity=".18"/><stop offset="1" stop-color="#6aa6e9" stop-opacity=".08"/></linearGradient>
    <linearGradient id="liquid" x2="1" y2=".8"><stop stop-color="${accent}"/><stop offset="1" stop-color="${deep}"/></linearGradient>
    <radialGradient id="halo"><stop stop-color="${accent}" stop-opacity=".5"/><stop offset="1" stop-color="${accent}" stop-opacity="0"/></radialGradient>
    <radialGradient id="tube"><stop stop-color="${accent}" stop-opacity=".33"/><stop offset="1" stop-color="#070f20" stop-opacity=".23"/></radialGradient>
    <filter id="glow" x="-80%" y="-100%" width="260%" height="300%"><feGaussianBlur stdDeviation="11"/></filter>
    <filter id="shadow" x="-60%" y="-60%" width="240%" height="240%"><feDropShadow dx="0" dy="18" stdDeviation="13" flood-color="#000" flood-opacity=".45"/></filter>
  </defs>
  <rect width="512" height="320" fill="url(#background)"/>
  <circle cx="263" cy="155" r="182" fill="${deep}" opacity=".12"/>
  ${stars}
  <g opacity=".5" stroke="#5c8eaa" fill="none"><path d="M20 56h70m-70 0v24m472 184h-70m70 0v-24"/></g>
  ${art}
  <rect x="18" y="16" width="66" height="63" rx="10" fill="#08121e" fill-opacity=".9" stroke="${accent}" stroke-opacity=".55"/>
  <text x="28" y="33" font-family="sans-serif" font-size="11" fill="#92a7bb">${String(n).padStart(3,'0')}</text>
  <text x="28" y="68" font-family="sans-serif" font-weight="700" font-size="32" fill="${accent}">${xml(el.symbol)}</text>
  <text x="496" y="297" text-anchor="end" fill="#c5d6e7" font-family="sans-serif" font-size="12">${xml(el.name)}</text>
  <text x="18" y="299" fill="#708ba4" font-family="sans-serif" font-size="9" letter-spacing="1.7">SCHEMATISCHE ILLUSTRATION</text>
</svg>\n`;
}

mkdirSync(join(root, 'assets/elements'), {recursive:true});
const catalog = {};
for (const el of basic) {
  const no = el.number;
  if (originalNumbers.has(no)) {
    catalog[no] = originals[no];
  } else {
    const [, description, useText, factText, safety] = profiles.get(no);
    const [, label, peopleText, narrative, note] = histories.get(no);
    const m = label.match(/^(\d{4})$/); const year = m ? Number(m[1]) : null;
    const firstYear = /\d{4}/.exec(label);
    const circa = firstYear ? Math.floor((Number(firstYear[0])-1)/100)+1 : null;
    const slug = el.nameEn.toLowerCase().replace(/[^a-z0-9]+/g,'-');
    const svgPath = `assets/elements/${slug}.svg`;
    writeFileSync(join(root, svgPath), renderSvg(el));
    const isOld = /Vorgeschichte|Antike/.test(label);
    const dNote = note || (isOld ? 'Die Nutzung seit der Frühgeschichte ist nicht auf eine einzelne Person oder Jahreszahl zurückzuführen.' : null);
    const people = peopleText ? peopleText.split(';').map(name=>({name,role: 'Beteiligt an Identifizierung bzw. experimentellem Nachweis'})) : [];
    catalog[no] = {
      description,
      discovery: {
        label,
        year,
        era: isOld ? 'Frühgeschichte' : circa ? `${circa}. Jahrhundert` : 'Historische Einordnung',
        people,
        narrative,
        note: dNote
      },
      uses: list(useText), facts: list(factText), safety: safety || null,
      image: {
        src: svgPath,
        alt: `Schematische Illustration zu ${el.name} (${el.symbol}); kein Foto einer realen Probe`,
        caption: `${el.name} · wissenschaftlich inspiriertes Symbolmotiv`,
        kind: 'Schematische SVG-Illustration, kein Originalfoto',
        credit: 'Originalgrafik für dieses Projekt (2026)',
        license: 'MIT (Projektlizenz)', licenseUrl: null, sourceUrl: null
      },
      sources: [
        {label: 'Royal Society of Chemistry',url: `https://periodic-table.rsc.org/element/${no}`},
        {label: 'PubChem / NCBI',url: `https://pubchem.ncbi.nlm.nih.gov/element/${no}`}
      ]
    };
  }
  if (photoOverrides[no]) {
    const photo = photoOverrides[no];
    if (!existsSync(join(root, photo.src))) throw new Error(`Bild überschrieben, aber Datei fehlt: ${photo.src}`);
    catalog[no].image = photo;
  }
  if (!catalog[no].uses?.length || !catalog[no].facts?.length) throw new Error(`Unvollständige Angaben zu ${no}`);
}
if (Object.keys(catalog).length !== 118) throw new Error('Es werden 118 Profile erwartet.');
const output = { schemaVersion: 2, updated: '2026-11-14', elements: catalog };
writeFileSync(join(root, 'data/element-content.js'),
  `/* Alle 118 redaktionellen Elementprofile – lokale Daten; generiert durch scripts/build-content.mjs.\n * Ursprung: scripts/source/*.tsv, original-six.json und optionale photo-overrides.json.\n * Nutzung auch über file:// ohne Netzwerkabruf. */\n(function (global) { 'use strict'; global.PSE_CONTENT = ${JSON.stringify(output,null,2)}; })(window);\n`);
console.log(`Daten: ${Object.keys(catalog).length} Elemente. Bilder: ${missingNumbers.length} schematische SVGs + 6 ursprüngliche WebP-Bilder. Fotos: ${Object.keys(photoOverrides).length} Overrides.`);
