/* Profilansicht mit optionalem Zusatzwissen, Stoffdaten und schematischen Elektronenschalen. */
(function (global) {
  'use strict';
  const PSE = global.PSE;
  let rootDesktop, rootDialog;
  let activeTab = 'data';
  let currentNumber = null;

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

  function baseData(el) {
    const config = PSE.superDigits(el.electronConfiguration);
    return `<section class="detail-section" aria-label="Daten">
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
      <div class="detail-footnote">Atomradien sind Näherungswerte. „–“ bedeutet: kein belastbarer Wert im Datensatz.</div>`;
  }

  function renderEl(el, state) {
    const category = PSE.category(el.category);
    const phase = PSE.phase(el.phase);
    const favorite = state.favorites.has(el.number);
    const enriched = PSE.Content.get(el.number);
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
          <div class="profile-heading-actions" role="group" aria-label="Aktionen für ${PSE.escape(el.name)}">
            <button class="action-btn ${favorite ? 'is-on' : ''}" type="button" data-action="favorite" aria-pressed="${favorite}" aria-label="${favorite ? 'Aus Favoriten entfernen' : 'Zu Favoriten hinzufügen'}">${favorite ? '★' : '☆'} Fav.</button>
            <button class="action-btn" type="button" data-action="compare">Vergleich</button>
          </div>
        </div>
      </div>
      ${enriched ? `
        ${PSE.Content.picture(enriched)}
        ${PSE.Content.navigation(activeTab)}
        ${activeTab === 'data' ? baseData(el) : PSE.Content.render(enriched, activeTab)}
        ${PSE.Content.sourceLinks(enriched)}
      ` : `
        <p class="profile-description">${PSE.escape(message)}</p>
        <p class="content-unavailable">Für dieses Element sind derzeit keine redaktionellen Zusatzdaten hinterlegt. Die chemischen Grunddaten bleiben verfügbar.</p>
        ${baseData(el)}
      `}
    `;
  }

  function selectAdjacent(delta) {
    const number = Math.max(1, Math.min(118, PSE.Store.get().selected + delta));
    PSE.Store.select(number);
    PSE.Dialogs.updateProfile(number);
  }

  function revealTab(root) {
    const row = root.querySelector('.content-tabs');
    const selected = row?.querySelector('.is-active');
    if (!row || !selected) return;
    // Tabwechsel soll direkt den zugehörigen Inhalt zeigen (insb. in mobilen Dialogen).
    root.scrollTop += row.getBoundingClientRect().top - root.getBoundingClientRect().top - 12;
    row.scrollLeft = Math.max(0, selected.offsetLeft - row.offsetLeft - (row.clientWidth - selected.offsetWidth) / 2);
  }

  function onClick(event) {
    const button = event.target.closest('[data-action]');
    if (!button) return;
    switch (button.dataset.action) {
      case 'prev': selectAdjacent(-1); break;
      case 'next': selectAdjacent(1); break;
      case 'favorite': PSE.Store.toggleFavorite(PSE.Store.get().selected); break;
      case 'compare': PSE.Dialogs.openCompare(PSE.Store.get().selected); break;
      case 'content-tab': {
        const newTab = button.dataset.tab;
        if (!PSE.Content.tabs.some(tab => tab.id === newTab) || !PSE.Content.has(PSE.Store.get().selected)) return;
        if (activeTab === newTab) return;
        activeTab = newTab;
        PSE.Details.render(PSE.Store.get());
        const inDialog = Boolean(event.currentTarget.closest('dialog'));
        const parent = inDialog ? rootDialog : rootDesktop;
        parent.querySelector(`[data-tab="${newTab}"]`)?.focus({preventScroll: true});
        revealTab(parent);
        break;
      }
    }
  }
  function onTabKeydown(event) {
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return;
    if (!event.target.matches('[data-action="content-tab"]')) return;
    const list = PSE.Content.tabs;
    const current = list.findIndex(item => item.id === event.target.dataset.tab);
    const next = event.key === 'Home' ? 0 : event.key === 'End' ? list.length - 1
      : (current + (event.key === 'ArrowRight' ? 1 : -1) + list.length) % list.length;
    event.preventDefault();
    activeTab = list[next].id;
    PSE.Details.render(PSE.Store.get());
    event.currentTarget.querySelector(`[data-tab="${activeTab}"]`)?.focus({preventScroll: true});
    revealTab(event.currentTarget);
  }
  PSE.Details = {
    init() {
      rootDesktop = document.getElementById('detail-container');
      rootDialog = document.getElementById('profile-dialog-content');
      [rootDesktop, rootDialog].forEach(root => {
        root.addEventListener('click', onClick);
        root.addEventListener('keydown', onTabKeydown);
      });
      document.querySelector('[data-action="close-profile"]').addEventListener('click', () => PSE.Dialogs.close());
    },
    render(state) {
      const el = PSE.byNumber.get(state.selected);
      if (!el) return;
      const changed = currentNumber !== el.number;
      if (changed) {
        currentNumber = el.number;
        activeTab = 'data';
      }
      const scrollD = changed ? 0 : rootDesktop.scrollTop;
      const scrollM = changed ? 0 : rootDialog.scrollTop;
      const html = renderEl(el, state);
      rootDesktop.innerHTML = html;
      rootDialog.innerHTML = html;
      rootDesktop.scrollTop = scrollD;
      rootDialog.scrollTop = scrollM;
    }
  };
})(window);
