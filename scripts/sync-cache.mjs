/** Synchronisiert den Offline-Precache mit den wirklich verwendeten lokalen Bildern. */
import { readFileSync, writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runInNewContext } from 'node:vm';
import { createHash } from 'node:crypto';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const context = {}; context.window = context;
runInNewContext(readFileSync(join(root,'data/element-content.js'),'utf8'), context);
const assets = [...new Set(Object.values(context.PSE_CONTENT.elements).map(item => './' + item.image.src))].sort();
const base = [
  './','./index.html','./manifest.webmanifest','./css/styles.css',
  './data/elements.js','./data/element-content.js',
  './js/core.js','./js/content.js','./js/store.js','./js/filters.js','./js/table.js',
  './js/details.js','./js/compare.js','./js/dialogs.js','./js/ui.js','./js/pwa.js','./js/app.js',
  './assets/icon.svg','./assets/icon-192.png','./assets/icon-512.png','./assets/icon-maskable-512.png',
  './README.md','./QUELLEN.md','./INHALTSMODELL.md','./LICENSE'
];
const files = [...new Set([...base, ...assets])];
const hash = createHash('sha256');
for (const path of files) {
  const full = join(root,path);
  if (path === './') continue;
  if (!existsSync(full)) throw Error('Fehlende Offline-Datei: '+path);
  hash.update(path).update(readFileSync(full));
}
const version = 'periodensystem-shell-v4-' + hash.digest('hex').slice(0,12);
const worker = `/* Automatisch generierter, versionierter PWA-Offline-Cache.\n * Nach Daten-/Bildänderungen: node scripts/sync-cache.mjs */\nconst CACHE_NAME = ${JSON.stringify(version)};\nconst APP_FILES = ${JSON.stringify(files,null,2)};\n
self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Kleine Chargen vermeiden übermäßige parallele Anfragen auf Mobilgeräten.
    for (let i = 0; i < APP_FILES.length; i += 20) {
      await cache.addAll(APP_FILES.slice(i, i + 20));
    }
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith('periodensystem-shell-') && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin || !url.pathname.startsWith(new URL(self.registration.scope).pathname)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(event.request);
    if (cached) return cached;
    try {
      const response = await fetch(event.request);
      if (response.ok) event.waitUntil(cache.put(event.request, response.clone()));
      return response;
    } catch (_) {
      if (event.request.mode === 'navigate') return await cache.match('./index.html') || Response.error();
      return Response.error();
    }
  })());
});
`;
writeFileSync(join(root, 'service-worker.js'), worker);
console.log(`Service Worker: ${files.length} Dateien, Cache ${version}`);
