/* Profilansicht und schematische Elektronenschalen (SVG). */
(function (global) {
  'use strict';
  const PSE = global.PSE;
  let rootDesktop, rootDialog;

  function shellDiagram(el) {
    const counts = el.shells;
    const center = 160;
    const gap = counts.length >= 6 ? 17 : counts.length >= 4 ? 21 : 33;
    const start = counts.length >= 6 ? 35 : 45;
    const rings = counts.map((count, index) => {
      const r = start + index * gap;
      const ring = `<circle cx="160" cy="160" r="${r}" fill="none" stroke="currentColor" class="shell-ring"/>`;
      const electrons = Array.from({ length: count }, (_, i) => {
        const angle = 2 * Math.PI * i / count - Math.PI / 2;
        return `<circle class="shell-electron" cx="${(center + Math.cos(angle) * r).toFixed(2)}" cy="${(center + Math.sin(angle) * r).toFixed(2)}" r="2.9"/>`;
      }).join('');
      return ring + electrons;
    }).join('');
    return `<svg class="shell-svg" viewBox="0 0 320 320" role="img" aria-label="Elektronenverteilung: ${counts.join(', ')}">
      <circle cx="160" cy="160" r="13" class="shell-nucleus"/>
      <text x="160" y="164" text-anchor="middle" class="shell-nucleus-text">${el.symbol}</text>
      ${rings}
    </svg>`;
  }

  function property(label, value, unit = '') {
    return `<div class="property"><dt>${label}</dt><dd>${PSE.escape(value)}${unit ? `<span class="property-unit"> ${unit}</span>` : ''}</dd></div>`;
  }

  function renderEl(el, state) {
    const category = PSE.category(el.category);
    const phase = PSE.phase(el.phase);
    const favorite = state.favorites.has(el.number);
    const config = PSE.superDigits(el.electronConfiguration);
    const message = el.phase === 'unknown'
      ? 'Der Aggregatzustand bei Raumtemperatur ist experimentell nicht sicher belegt.'
      : `${el.name} gehört zur Elementfamilie „${category.label}“ und ist bei Raumtemperatur ${phase.label.toLowerCase()}.`;

    return `
      <div class="detail-topline">
        <span class="eyebrow">ELEMENTPROFIL / ${String(el.number).padStart(3,'0')}</span>
        <div class="detail-nav" aria-label="Element wechseln">
          <button type="button" class="icon-btn" data-action="prev" aria-label="Vorheriges Element" ${el.number === 1 ? 'disabled' : ''}>←</button>
          <button type="button" class="icon-btn" data-action="next" aria-label="Nächstes Element" ${el.number === 118 ? 'disabled' : ''}>→</button>
        </div>
      </div>
      <div class="profile-hero" style="--profile-color:${category.color}">
        <div class="profile-symbol-block">
          <span class="profile-number">${String(el.number).padStart(3,'0')}</span>
          <strong class="profile-symbol">${el.symbol}</strong>
          <span class="profile-small-mass">${PSE.format(el.atomicMass, 4)} u</span>
        </div>
        <div class="profile-heading">
          <h2>${PSE.escape(el.name)}</h2>
          <span>${PSE.escape(el.nameEn)}</span>
          <div class="profile-tags">
            <span class="profile-tag">${category.label}</span>
            <span class="profile-tag">${phase.label}</span>
          </div>
        </div>
      </div>
      <div class="profile-actions">
        <button class="action-btn ${favorite ? 'is-on' : ''}" type="button" data-action="favorite" aria-pressed="${favorite}">
          ${favorite ? '★ Aus Favoriten entfernen' : '☆ Als Favorit merken'}
        </button>
      </div>
      <label class="compare-picker">
        <span>VERGLEICHEN MIT</span>
        <select data-action="compare-to" aria-label="Element zum Vergleichen mit ${PSE.escape(el.name)} auswählen">
          <option value="">Element auswählen …</option>
          ${PSE.Compare.options(el.number)}
        </select>
        <small>Die Auswahl öffnet den direkten Elementvergleich.</small>
      </label>
      <p class="profile-description">${message}</p>
      <section class="detail-section" aria-label="Stoffdaten">
        <div class="section-heading"><h3>Elementdaten</h3><span>Basiswerte</span></div>
        <dl class="properties">
          ${property('Ordnungszahl', el.number)}
          ${property('Atommasse', PSE.format(el.atomicMass, 4), 'u')}
          ${property('Gruppe', el.group == null ? 'f-Block' : el.group)}
          ${property('Periode', el.period)}
          ${property('Kovalenzradius', el.covalentRadiusPm == null ? '–' : el.covalentRadiusPm, el.covalentRadiusPm == null ? '' : 'pm')}
          ${property('vdW-Radius', el.vdwRadiusPm == null ? '–' : el.vdwRadiusPm, el.vdwRadiusPm == null ? '' : 'pm')}
        </dl>
      </section>
      <section class="detail-section shell-section" aria-label="Atombau">
        <div class="section-heading"><h3>Elektronenschalen</h3><span>Bohr-Modell · schematisch</span></div>
        <div class="shell-graphic">${shellDiagram(el)}</div>
        <div class="shell-counts" aria-label="Elektronen pro Schale">${el.shells.map((count,index) => `<span title="Schale ${index+1}"><small>${'KLMNOPQ'[index]}</small><b>${count}</b></span>`).join('')}</div>
        <div class="config-line"><span>Elektronenkonfiguration</span><code>${PSE.escape(config)}</code></div>
        ${el.configurationNote ? `<p class="data-note">${PSE.escape(el.configurationNote)}</p>` : ''}
      </section>
      <div class="detail-footnote">Atomradien sind Näherungswerte. „–“ bedeutet: kein belastbarer Wert im Datensatz.</div>
    `;
  }

  function selectAdjacent(delta) {
    const number = Math.max(1, Math.min(118, PSE.Store.get().selected + delta));
    PSE.Store.select(number);
    PSE.Dialogs.updateProfile(number);
  }

  function onClick(event) {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    switch (button.dataset.action) {
      case 'prev': selectAdjacent(-1); break;
      case 'next': selectAdjacent(1); break;
      case 'favorite': PSE.Store.toggleFavorite(PSE.Store.get().selected); break;
    }
  }

  function onChange(event) {
    const input = event.target.closest('[data-action="compare-to"]');
    if (!input || !input.value) return;
    const base = PSE.Store.get().selected;
    const partner = Number(input.value);
    if (PSE.byNumber.has(partner) && base !== partner) {
      PSE.Dialogs.openCompare(base, partner);
    }
  }

  PSE.Details = {
    init() {
      rootDesktop = document.getElementById('detail-container');
      rootDialog = document.getElementById('profile-dialog-content');
      [rootDesktop, rootDialog].forEach(root => {
        root.addEventListener('click', onClick);
        root.addEventListener('change', onChange);
      });
      document.querySelector('[data-action="close-profile"]').addEventListener('click', () => PSE.Dialogs.close());
    },
    render(state) {
      const el = PSE.byNumber.get(state.selected);
      if (!el) return;
      const html = renderEl(el, state);
      rootDesktop.innerHTML = html;
      rootDialog.innerHTML = html;
    }
  };
})(window);
