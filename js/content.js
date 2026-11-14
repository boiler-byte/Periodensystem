/* Redaktionelles Zusatzwissen: ausschließlich Darstellung, keine Datenbeschaffung.
   Das Datenmodul data/element-content.js bleibt unabhängig von der UI. */
(function (global) {
  'use strict';
  const PSE = global.PSE;
  const catalog = global.PSE_CONTENT?.elements || {};
  const escape = PSE.escape;

  const tabs = Object.freeze([
    { id: 'data', name: 'Daten' },
    { id: 'history', name: 'Geschichte' },
    { id: 'uses', name: 'Verwendung' },
    { id: 'facts', name: 'Wissen' }
  ]);
  function get(number) { return catalog[number] || null; }
  function sourceLinks(item) {
    if (!item?.sources?.length) return '';
    return `<div class="content-sources"><span>QUELLEN</span><div>${item.sources.map(source =>
      `<a href="${escape(source.url)}" target="_blank" rel="noopener noreferrer">${escape(source.label)} <span aria-hidden="true">↗</span></a>`).join('')}</div></div>`;
  }
  function picture(item) {
    const pic = item?.image;
    if (!pic?.src) return '';
    return `<figure class="content-figure">
      <div class="content-image-frame" tabindex="0" role="group" aria-label="Bildnachweis anzeigen">
        <img src="${escape(pic.src)}" alt="${escape(pic.alt)}" width="512" height="512" loading="lazy" decoding="async">
        <span class="image-type">${/Fotograf/i.test(pic.kind) ? 'FOTOGRAFIE' : /Schematisch/i.test(pic.kind) ? 'SCHEMATISCH' : 'ILLUSTRATION'}</span>
        <figcaption>
          <span>${escape(pic.caption)}</span><small>${escape(pic.kind)} · ${escape(pic.credit)}</small>
          ${pic.license ? `<small>Lizenz: ${pic.licenseUrl ? `<a href="${escape(pic.licenseUrl)}" target="_blank" rel="noopener noreferrer">${escape(pic.license)}</a>` : escape(pic.license)}</small>` : ''}
          ${pic.sourceUrl ? `<a class="image-original-link" href="${escape(pic.sourceUrl)}" target="_blank" rel="noopener noreferrer">Originalbild und Bildnachweis ↗</a>` : ''}
        </figcaption>
      </div>
    </figure>`;
  }
  function navigation(tab) {
    return `<div class="content-tabs" role="tablist" aria-label="Elementprofil-Bereiche">
      ${tabs.map(({id,name}) => `<button type="button" role="tab" data-action="content-tab" data-tab="${id}" aria-selected="${id === tab}" tabindex="${id === tab ? 0 : -1}" class="${id === tab ? 'is-active' : ''}">${name}</button>`).join('')}
    </div>`;
  }
  function safety(item) {
    return item?.safety ? `<aside class="content-safety"><strong>Wichtiger Hinweis</strong><p>${escape(item.safety)}</p></aside>` : '';
  }
  function history(item) {
    const d = item.discovery;
    return `<div class="content-pane" role="tabpanel" aria-label="Geschichte">
      <div class="history-year"><span>ENTDECKUNG</span><strong>${escape(d.label)}</strong><small>${escape(d.era)}</small></div>
      <p class="content-paragraph">${escape(d.narrative)}</p>
      <h3 class="content-subheading">${d.people.length ? 'Beteiligte und Forschungsteams' : 'Überlieferung'}</h3>
      ${d.people.length ? `<ul class="discoverer-list">${d.people.map(person => `<li><strong>${escape(person.name)}</strong><span>${escape(person.role)}</span></li>`).join('')}</ul>` : '<p class="content-paragraph">Kein einzelner Entdecker bekannt: Das Metall wurde schon in der Vorgeschichte verwendet.</p>'}
      ${d.note ? `<div class="content-clarification"><strong>Historische Einordnung</strong><p>${escape(d.note)}</p></div>` : ''}
    </div>`;
  }
  function uses(item) {
    return `<div class="content-pane" role="tabpanel" aria-label="Verwendung">
      <p class="content-intro">Beispiele für die wichtigsten Anwendungen dieses Elements oder seiner Verbindungen:</p>
      <div class="content-use-list">${item.uses.map((use,index) => `<article class="content-use"><span>${String(index+1).padStart(2,'0')}</span><div><h3>${escape(use.title)}</h3><p>${escape(use.text)}</p></div></article>`).join('')}</div>
      ${safety(item)}
    </div>`;
  }
  function facts(item) {
    return `<div class="content-pane" role="tabpanel" aria-label="Wissenswertes">
      <div class="content-fact-list">${item.facts.map((fact,index) => `<article class="content-fact"><span>0${index+1}</span><h3>${escape(fact.title)}</h3><p>${escape(fact.text)}</p></article>`).join('')}</div>
      ${safety(item)}
    </div>`;
  }
  PSE.Content = {
    get, tabs, picture, navigation, sourceLinks,
    has: number => Boolean(get(number)),
    count: Object.keys(catalog).length,
    render: (item, tab) => ({ history, uses, facts }[tab] || history)(item)
  };
})(window);
