/* Formulare, Legende, Theme, Tastenkürzel und Ergebnisanzeige. */
(function (global) {
  'use strict';
  const PSE = global.PSE;
  const $ = id => document.getElementById(id);
  let lastLegendView = null;

  function fillSelect(select, values) {
    values.forEach(item => {
      const option = document.createElement('option');
      option.value = item.id;
      option.textContent = item.label;
      select.append(option);
    });
  }

  function renderLegend(state) {
    const root = $('legend');
    const items = state.view === 'family' ? PSE.categories : PSE.phases;
    if (state.view !== lastLegendView) {
      lastLegendView = state.view;
      if (state.view === 'mass') {
        root.innerHTML = '<div class="gradient-legend"><span>Leichte Elemente</span><div class="gradient-track"></div><span>Schwere Elemente</span></div>';
      } else {
        root.innerHTML = items.map(item => `<button type="button" class="legend-chip" data-legend-id="${item.id}" style="--chip-color:${item.color}"><i></i>${item.label}</button>`).join('');
      }
    }
    root.querySelectorAll('[data-legend-id]').forEach(button => {
      const key = state.view === 'family' ? 'category' : 'phase';
      button.classList.toggle('is-active', state[key] === button.dataset.legendId);
      button.setAttribute('aria-pressed', String(state[key] === button.dataset.legendId));
    });
  }

  PSE.UI = {
    init() {
      fillSelect($('category-filter'), PSE.categories);
      fillSelect($('phase-filter'), PSE.phases);
      $('search').addEventListener('input', event => PSE.Store.set({ query: event.target.value }));
      $('category-filter').addEventListener('change', event => PSE.Store.set({ category: event.target.value }));
      $('phase-filter').addEventListener('change', event => PSE.Store.set({ phase: event.target.value }));
      $('favorites-only').addEventListener('click', () => PSE.Store.set({ favoritesOnly: !PSE.Store.get().favoritesOnly }));
      $('reset-filters').addEventListener('click', () => PSE.Store.resetFilters());
      $('view-switch').addEventListener('click', event => {
        const button = event.target.closest('[data-view]');
        if (button) PSE.Store.set({ view: button.dataset.view });
      });
      $('legend').addEventListener('click', event => {
        const button = event.target.closest('[data-legend-id]');
        if (!button) return;
        const state = PSE.Store.get();
        const key = state.view === 'family' ? 'category' : 'phase';
        PSE.Store.set({ [key]: state[key] === button.dataset.legendId ? 'all' : button.dataset.legendId });
      });
      $('theme-toggle').addEventListener('click', () => {
        PSE.Store.set({ theme: PSE.Store.get().theme === 'dark' ? 'light' : 'dark' });
      });
      $('random-element').addEventListener('click', () => {
        PSE.Store.select(Math.floor(Math.random() * 118) + 1);
        if (PSE.isMobile()) PSE.Dialogs.openProfile(PSE.Store.get().selected);
      });
      document.addEventListener('keydown', event => {
        const target = event.target;
        const isEditing = target instanceof HTMLElement &&
          (['INPUT','TEXTAREA','SELECT'].includes(target.tagName) || target.isContentEditable);
        if (event.key === '/' && !isEditing && !PSE.Dialogs.isOpen()) {
          event.preventDefault();
          $('search').focus();
        }
        if (event.key === 'Escape' && document.activeElement === $('search') && $('search').value) {
          PSE.Store.set({ query: '' });
          $('search').blur();
        }
      });
    },
    render(state) {
      const matches = PSE.Filters.matching(state);
      const queryInput = $('search');
      if (queryInput.value !== state.query) queryInput.value = state.query;
      $('category-filter').value = state.category;
      $('phase-filter').value = state.phase;
      $('favorites-only').classList.toggle('is-on', state.favoritesOnly);
      $('favorites-only').setAttribute('aria-pressed', String(state.favoritesOnly));
      $('favorite-total').textContent = state.favorites.size ? ` · ${state.favorites.size}` : '';
      $('reset-filters').disabled = !PSE.Filters.hasActive(state);
      $('match-count').textContent = `${matches.length} von 118 Elementen ${PSE.Filters.hasActive(state) ? 'entsprechen den Filtern' : 'angezeigt'}`;
      $('empty-note').hidden = matches.length !== 0;
      $('view-switch').querySelectorAll('[data-view]').forEach(button => {
        const active = state.view === button.dataset.view;
        button.classList.toggle('is-active', active);
        button.setAttribute('aria-pressed', String(active));
      });
      document.documentElement.dataset.theme = state.theme;
      $('theme-toggle').textContent = state.theme === 'dark' ? '☀ Hell' : '☾ Dunkel';
      $('theme-toggle').setAttribute('aria-label', state.theme === 'dark' ? 'Helles Design aktivieren' : 'Dunkles Design aktivieren');
      renderLegend(state);
    }
  };
})(window);
