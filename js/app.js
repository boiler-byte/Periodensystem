/* Einstiegspunkt: Module in Reihenfolge initialisieren. */
(function (global) {
  'use strict';
  document.addEventListener('DOMContentLoaded', () => {
    const PSE = global.PSE;
    const data = global.PSE_DATA;
    if (!data || !Array.isArray(data.elements) || data.elements.length !== 118 ||
        new Set(data.elements.map(el => el.number)).size !== 118) {
      document.body.textContent = 'Fehler: elements.js enthält keinen vollständigen Datensatz mit 118 Elementen.';
      return;
    }
    PSE.Dialogs.init();
    PSE.Table.init();
    PSE.Details.init();
    PSE.Compare.init();
    PSE.UI.init();
    const render = state => {
      PSE.Table.render(state);
      PSE.UI.render(state);
      PSE.Details.render(state);
    };
    PSE.Store.subscribe(render);
    render(PSE.Store.get());
    PSE.Dialogs.restore();
    PSE.PWA.init();
  });
})(window);
