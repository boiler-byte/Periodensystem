/** Optionale Online-Quellenprüfung. Überschreibt bewusst keine historischen Angaben. */
import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve, join } from 'node:path';
import { runInNewContext } from 'node:vm';
const root=resolve(dirname(fileURLToPath(import.meta.url)),'..');
const ctx={};ctx.window=ctx;
runInNewContext(readFileSync(join(root,'data/element-content.js'),'utf8'),ctx);
const answer=await fetch('https://api.periodictableofelements.org/elements/export/json/',{signal:AbortSignal.timeout(25000)});
if(!answer.ok) throw Error(`Referenz-API meldet HTTP ${answer.status}`);
const rows=await answer.json();
if(!Array.isArray(rows)||rows.length!==118) throw Error('Referenz-API lieferte keine 118 Elemente');
const audit=rows.map(e=>({number:e.atomic_number, name:e.name, apiYear:e.discovery_year, apiDiscoverers:e.discovered_by,
  localLabel:ctx.PSE_CONTENT.elements[e.atomic_number]?.discovery?.label,
  localPeople:ctx.PSE_CONTENT.elements[e.atomic_number]?.discovery?.people?.map(p=>p.name),
  reviewNeeded: (Number.isInteger(e.discovery_year) && ctx.PSE_CONTENT.elements[e.atomic_number]?.discovery?.year !== e.discovery_year)
}));
writeFileSync(join(root,'scripts/source/discovery-audit.json'),JSON.stringify({source:'https://api.periodictableofelements.org/elements/export/json/',checked:new Date().toISOString(),entries:audit},null,2)+'\n');
console.log(`Verglichen: ${audit.length} Elemente, ${audit.filter(e=>e.reviewNeeded).length} abweichende/mehrdeutige Jahreszahlen. Siehe scripts/source/discovery-audit.json.`);
console.log('Eine Abweichung ist nicht automatisch ein Fehler: Die Jahreszahl kann Erstbeobachtung, Identifikation oder Isolierung bedeuten.');
