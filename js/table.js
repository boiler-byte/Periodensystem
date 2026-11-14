/* Periodensystem als CSS-Grid; Tiles werden nur einmal erstellt. */
(function (global) {
  'use strict';
  const PSE = global.PSE;
  const all = global.PSE_DATA.elements;
  const tileMap = new Map();
  let root;

  function makeSpan(text, className, column, row) {
    const node = document.createElement('span');
    node.className = className;
    node.textContent = text;
    node.style.gridColumn = String(column);
    node.style.gridRow = String(row);
    return node;
  }

  function makeTile(el) {
    const tile = document.createElement('button');
    tile.type = 'button';
    tile.className = 'element-tile';
    tile.dataset.number = String(el.number);
    tile.dataset.category = el.category;
    tile.dataset.phase = el.phase;
    tile.style.gridColumn = String(el.x + 1);
    tile.style.gridRow = String(el.y + 1);
    tile.style.setProperty('--mass-rgb', PSE.massColor(el.atomicMass));
    tile.title = `${el.number} · ${el.name} (${el.symbol})`;
    tile.setAttribute('aria-label', `${el.name}, Ordnungszahl ${el.number}, ${PSE.category(el.category).label}`);
    tile.setAttribute('aria-pressed', 'false');
    tile.innerHTML = `
      <span class="tile-number">${el.number}</span>
      <span class="tile-symbol">${el.symbol}</span>
      <span class="tile-name">${PSE.escape(el.name)}</span>
      <span class="tile-favorite" aria-hidden="true">★</span>`;
    tile.addEventListener('click', () => {
      PSE.Store.select(el.number);
      if (PSE.isMobile()) PSE.Dialogs.openProfile(el.number);
    });
    tile.addEventListener('keydown', event => moveByArrow(event, el));
    tileMap.set(el.number, tile);
    return tile;
  }

  function moveByArrow(event, current) {
    const direction = {
      ArrowLeft: [-1, 0], ArrowRight: [1, 0],
      ArrowUp: [0, -1], ArrowDown: [0, 1]
    }[event.key];
    if (!direction) return;
    event.preventDefault();
    const [dx, dy] = direction;
    const aligned = all.filter(candidate =>
      (dx ? candidate.y === current.y && (candidate.x - current.x) * dx > 0
          : candidate.x === current.x && (candidate.y - current.y) * dy > 0));
    aligned.sort((a, b) => dx
      ? (a.x - current.x) * dx - (b.x - current.x) * dx
      : (a.y - current.y) * dy - (b.y - current.y) * dy);
    if (aligned[0]) tileMap.get(aligned[0].number).focus();
  }

  PSE.Table = {
    init() {
      root = document.getElementById('periodic-grid');
      root.append(makeSpan('Gr.', 'axis-label axis-corner', 1, 1));
      for (let group = 1; group <= 18; group++) {
        root.append(makeSpan(String(group), 'axis-label group-label', group + 1, 1));
      }
      for (let period = 1; period <= 7; period++) {
        root.append(makeSpan(String(period), 'axis-label period-label', 1, period + 1));
      }
      const note = document.createElement('div');
      note.className = 'grid-watermark';
      note.style.gridColumn = '6 / 13';
      note.style.gridRow = '2 / 4';
      note.innerHTML = '<span class="grid-watermark-eyebrow">ENTDECKE DIE ELEMENTE</span><strong>118</strong><span>Elemente · 7 Perioden · 18 Gruppen</span>';
      root.append(note);

      for (const [y, start, end, text] of [[6,57,71,'57–71'], [7,89,103,'89–103']]) {
        const placeholder = document.createElement('div');
        placeholder.className = 'series-placeholder';
        placeholder.style.gridColumn = '4'; // Spalte 3 + Achsenvorspalte
        placeholder.style.gridRow = String(y + 1);
        placeholder.innerHTML = `<span>${start}–${end}</span><small>${y === 6 ? 'La–Lu' : 'Ac–Lr'}</small>`;
        placeholder.title = y === 6 ? 'Lanthanoide sind unten ausgegliedert' : 'Actinoide sind unten ausgegliedert';
        root.append(placeholder);
      }
      root.append(makeSpan('Lanthanoide', 'series-heading', '1 / 4', 10));
      root.append(makeSpan('Actinoide', 'series-heading', '1 / 4', 11));
      const fragment = document.createDocumentFragment();
      all.forEach(el => fragment.append(makeTile(el)));
      root.append(fragment);
    },
    render(state) {
      const matches = new Set(PSE.Filters.matching(state).map(el => el.number));
      root.dataset.view = state.view;
      for (const [number, tile] of tileMap) {
        const selected = number === state.selected;
        tile.classList.toggle('is-selected', selected);
        tile.classList.toggle('is-muted', !matches.has(number));
        tile.classList.toggle('is-favorite', state.favorites.has(number));
        tile.setAttribute('aria-pressed', String(selected));
      }
    },
    focus(number) {
      const tile = tileMap.get(number);
      if (tile) tile.focus();
    }
  };
})(window);
