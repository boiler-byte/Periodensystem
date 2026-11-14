/* Zentraler App-Zustand mit kleinem Publish/Subscribe-System. */
(function (global) {
  'use strict';
  const PSE = global.PSE;
  const STORAGE_KEY = 'pse-vanilla-v1';
  const subscribers = new Set();

  function loadPreferences() {
    try {
      const value = JSON.parse(global.localStorage.getItem(STORAGE_KEY) || '{}');
      return value && typeof value === 'object' ? value : {};
    } catch (_) { return {}; } // file:// kann Storage einschränken.
  }
  const saved = loadPreferences();
  const validFavorites = Array.isArray(saved.favorites)
    ? saved.favorites.filter(n => Number.isInteger(n) && PSE.byNumber.has(n)) : [];
  let state = {
    query: '',
    category: 'all',
    phase: 'all',
    favoritesOnly: false,
    view: 'family',
    selected: 8,
    theme: saved.theme === 'light' ? 'light' : 'dark',
    favorites: new Set(validFavorites)
  };

  function save() {
    try {
      global.localStorage.setItem(STORAGE_KEY, JSON.stringify({
        favorites: [...state.favorites], theme: state.theme
      }));
    } catch (_) { /* Die App funktioniert ohne persistenten Speicher. */ }
  }

  function notify() {
    save();
    subscribers.forEach(listener => listener(state));
  }

  PSE.Store = {
    get: () => state,
    subscribe: listener => { subscribers.add(listener); return () => subscribers.delete(listener); },
    set: patch => { state = { ...state, ...patch }; notify(); },
    select: number => {
      if (!PSE.byNumber.has(number)) return;
      state = { ...state, selected: number };
      notify();
    },
    toggleFavorite: number => {
      const favorites = new Set(state.favorites);
      if (favorites.has(number)) favorites.delete(number);
      else favorites.add(number);
      state = { ...state, favorites };
      notify();
    },
    resetFilters: () => {
      state = { ...state, query: '', category: 'all', phase: 'all', favoritesOnly: false };
      notify();
    }
  };
})(window);
