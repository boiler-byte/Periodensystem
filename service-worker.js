/* Vollständig lokale PWA. Versionswechsel aktualisieren den Offline-Cache. */
const CACHE_NAME = 'periodensystem-shell-v2';
const APP_FILES = [
  './', './index.html', './manifest.webmanifest', './css/styles.css',
  './data/elements.js',
  './js/core.js', './js/store.js', './js/filters.js', './js/table.js',
  './js/details.js', './js/compare.js', './js/dialogs.js', './js/ui.js',
  './js/pwa.js', './js/app.js',
  './assets/icon.svg', './assets/icon-192.png', './assets/icon-512.png',
  './assets/icon-maskable-512.png', './QUELLEN.md', './README.md', './LICENSE'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_FILES)));
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(Promise.all([
    caches.keys().then(keys => Promise.all(keys.filter(key => key.startsWith('periodensystem-shell-') && key !== CACHE_NAME).map(key => caches.delete(key)))),
    self.clients.claim()
  ]));
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;

  // Cache-first: die HTML- und JS-Dateien bleiben pro App-Version konsistent.
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(event.request);
    if (cached) return cached;

    try {
      const response = await fetch(event.request);
      if (response.ok) {
        event.waitUntil(cache.put(event.request, response.clone()));
      }
      return response;
    } catch (_) {
      if (event.request.mode === 'navigate') {
        return await cache.match('./index.html') || Response.error();
      }
      return Response.error();
    }
  })());
});
