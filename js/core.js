/* Gemeinsamer Namensraum, Konfiguration und reine Hilfsfunktionen. */
(function (global) {
  'use strict';
  const PSE = global.PSE = global.PSE || {};

  PSE.categories = Object.freeze([
    { id: 'alkali-metal', label: 'Alkalimetalle', color: '#f39b71' },
    { id: 'alkaline-earth', label: 'Erdalkalimetalle', color: '#edc36e' },
    { id: 'transition-metal', label: 'Übergangsmetalle', color: '#70aeed' },
    { id: 'post-transition', label: 'Weitere Metalle', color: '#80a7b8' },
    { id: 'metalloid', label: 'Halbmetalle', color: '#80d1bd' },
    { id: 'nonmetal', label: 'Nichtmetalle', color: '#92dc82' },
    { id: 'halogen', label: 'Halogene', color: '#db9de9' },
    { id: 'noble-gas', label: 'Edelgase', color: '#e8a0be' },
    { id: 'lanthanoid', label: 'Lanthanoide', color: '#75d5d9' },
    { id: 'actinoid', label: 'Actinoide', color: '#c7adf2' }
  ]);
  PSE.phases = Object.freeze([
    { id: 'solid', label: 'Fest', color: '#69b9de' },
    { id: 'liquid', label: 'Flüssig', color: '#f2b66e' },
    { id: 'gas', label: 'Gasförmig', color: '#9dd48b' },
    { id: 'unknown', label: 'Unbekannt', color: '#a9a8c0' }
  ]);

  const categoryById = Object.fromEntries(PSE.categories.map(item => [item.id, item]));
  const phaseById = Object.fromEntries(PSE.phases.map(item => [item.id, item]));
  PSE.category = id => categoryById[id] || { label: 'Unbekannt', color: '#aaa' };
  PSE.phase = id => phaseById[id] || { label: 'Unbekannt', color: '#aaa' };

  PSE.byNumber = new Map(global.PSE_DATA.elements.map(el => [el.number, el]));

  PSE.format = (value, maxDigits = 3) => value == null
    ? '–'
    : new Intl.NumberFormat('de-DE', { maximumFractionDigits: maxDigits }).format(value);

  PSE.normalize = text => String(text || '')
    .toLocaleLowerCase('de-DE')
    .replace(/ß/g, 'ss').replace(/æ/g, 'ae')
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .trim();

  PSE.escape = text => String(text).replace(/[&<>"']/g, char => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[char]);

  PSE.superDigits = text => String(text).replace(/([spdf])([0-9]+)/g, (_, orbital, count) =>
    orbital + count.replace(/\d/g, d => '⁰¹²³⁴⁵⁶⁷⁸⁹'[Number(d)]));

  PSE.massColor = mass => {
    const t = Math.max(0, Math.min(1, (mass - 1) / 294));
    const start = [85, 198, 234], end = [232, 118, 164];
    return start.map((c, i) => Math.round(c + (end[i] - c) * t)).join(', ');
  };

  PSE.isMobile = () => global.matchMedia('(max-width: 1100px)').matches;
})(window);
