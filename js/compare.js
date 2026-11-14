/* Elementvergleich: Dialog öffnet zunächst mit Partnerwahl. */
(function (global) {
  'use strict';
  const PSE = global.PSE;
  const all = global.PSE_DATA.elements;
  let root;

  function options(baseNumber, currentPartner) {
    return all.map(el => `<option value="${el.number}" ${el.number === baseNumber ? 'disabled' : ''} ${el.number === currentPartner ? 'selected' : ''}>${String(el.number).padStart(3, '0')} · ${PSE.escape(el.name)} (${el.symbol})${el.number === baseNumber ? ' – aktuell' : ''}</option>`).join('');
  }

  function specRow(label, first, second) {
    return `<tr><th scope="row">${label}</th><td>${PSE.escape(first)}</td><td>${PSE.escape(second)}</td></tr>`;
  }

  function content(a, b) {
    const heading = b
      ? `Vergleich von ${PSE.escape(a.name)} und ${PSE.escape(b.name)}`
      : `Vergleich starten: ${PSE.escape(a.name)}`;
    return `<section class="compare-window" aria-label="${heading}">
      <div class="compare-window-heading">
        <div><span class="eyebrow">ELEMENTE GEGENÜBERSTELLEN</span><h2>Elementvergleich</h2></div>
        <button type="button" class="icon-btn" data-action="close-dialog" aria-label="Vergleich schließen">✕</button>
      </div>
      <label class="compare-picker compare-picker-inline">
        <span>${PSE.escape(a.name)} VERGLEICHEN MIT</span>
        <select data-action="change-partner" aria-label="Vergleichspartner für ${PSE.escape(a.name)} auswählen" ${b ? '' : 'autofocus'}>
          <option value="" ${b ? '' : 'selected'} disabled>Element auswählen …</option>
          ${options(a.number, b?.number)}
        </select>
      </label>
      ${b ? `<div class="comparison-table-scroll">
        <table class="comparison-table"><thead><tr>
          <th scope="col">Eigenschaft</th>
          <th scope="col"><span class="comparison-symbol">${a.symbol}</span>${PSE.escape(a.name)}</th>
          <th scope="col"><span class="comparison-symbol">${b.symbol}</span>${PSE.escape(b.name)}</th>
        </tr></thead><tbody>
          ${specRow('Ordnungszahl', a.number, b.number)}
          ${specRow('Atommasse', `${PSE.format(a.atomicMass, 4)} u`, `${PSE.format(b.atomicMass, 4)} u`)}
          ${specRow('Elementfamilie', PSE.category(a.category).label, PSE.category(b.category).label)}
          ${specRow('Aggregatzustand', PSE.phase(a.phase).label, PSE.phase(b.phase).label)}
          ${specRow('Gruppe', a.group ?? 'f-Block', b.group ?? 'f-Block')}
          ${specRow('Periode', a.period, b.period)}
          ${specRow('Elektronenschalen', a.shells.join(' · '), b.shells.join(' · '))}
          ${specRow('Kovalenzradius', a.covalentRadiusPm == null ? '–' : `${a.covalentRadiusPm} pm`, b.covalentRadiusPm == null ? '–' : `${b.covalentRadiusPm} pm`)}
        </tbody></table>
      </div>
      <p class="modal-footnote">Die Werte stammen aus dem lokal eingebundenen Datensatz. Atomradien sind Näherungswerte.</p>`
      : `<div class="compare-empty" role="status"><strong>${PSE.escape(a.name)} (${a.symbol})</strong>Wähle oben ein zweites Element aus, um die Stoffdaten direkt gegenüberzustellen.</div>`}
    </section>`;
  }

  PSE.Compare = {
    options,
    init() {
      root = document.getElementById('compare-dialog-content');
      root.addEventListener('click', event => {
        if (event.target.closest('[data-action="close-dialog"]')) PSE.Dialogs.close();
      });
      root.addEventListener('change', event => {
        const select = event.target.closest('[data-action="change-partner"]');
        if (!select) return;
        const other = Number(select.value);
        const base = PSE.Dialogs.current()?.pseElement;
        if (PSE.byNumber.has(base) && PSE.byNumber.has(other) && base !== other) {
          PSE.Dialogs.updateComparison(other);
        }
      });
    },
    show(firstNumber, secondNumber) {
      const first = PSE.byNumber.get(firstNumber);
      const second = secondNumber == null ? null : PSE.byNumber.get(secondNumber);
      if (!first || (secondNumber != null && !second) || (second && first.number === second.number)) return;
      const partnerFocused = root.contains(document.activeElement) &&
        document.activeElement.matches('[data-action="change-partner"]');
      root.innerHTML = content(first, second);
      if (partnerFocused) root.querySelector('[data-action="change-partner"]').focus({ preventScroll: true });
    }
  };
})(window);
