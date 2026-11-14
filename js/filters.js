/* Filter- und Suchlogik – unabhängig von der Darstellung. */
(function (global) {
  'use strict';
  const PSE = global.PSE;
  const elements = global.PSE_DATA.elements;

  PSE.Filters = {
    matching(state) {
      const needle = PSE.normalize(state.query);
      return elements.filter(el => {
        if (state.category !== 'all' && el.category !== state.category) return false;
        if (state.phase !== 'all' && el.phase !== state.phase) return false;
        if (state.favoritesOnly && !state.favorites.has(el.number)) return false;
        if (!needle) return true;
        const text = PSE.normalize([
          el.name, el.nameEn, el.symbol, el.number,
          PSE.category(el.category).label, PSE.phase(el.phase).label
        ].join(' '));
        return text.includes(needle);
      });
    },
    hasActive(state) {
      return !!state.query || state.category !== 'all' ||
        state.phase !== 'all' || state.favoritesOnly;
    }
  };
})(window);
