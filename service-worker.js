/* Automatisch generierter, versionierter PWA-Offline-Cache.
 * Nach Daten-/Bildänderungen: node scripts/sync-cache.mjs */
const CACHE_NAME = "periodensystem-shell-v4-3421a04aab59";
const APP_FILES = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "./css/styles.css",
  "./data/elements.js",
  "./data/element-content.js",
  "./js/core.js",
  "./js/content.js",
  "./js/store.js",
  "./js/filters.js",
  "./js/table.js",
  "./js/details.js",
  "./js/compare.js",
  "./js/dialogs.js",
  "./js/ui.js",
  "./js/pwa.js",
  "./js/app.js",
  "./assets/icon.svg",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/icon-maskable-512.png",
  "./README.md",
  "./QUELLEN.md",
  "./INHALTSMODELL.md",
  "./LICENSE",
  "./assets/elements/actinium.webp",
  "./assets/elements/aluminium.webp",
  "./assets/elements/americium.webp",
  "./assets/elements/antimony.webp",
  "./assets/elements/argon.webp",
  "./assets/elements/arsenic.webp",
  "./assets/elements/astatine.webp",
  "./assets/elements/barium.webp",
  "./assets/elements/berkelium.webp",
  "./assets/elements/beryllium.webp",
  "./assets/elements/bismuth.webp",
  "./assets/elements/bohrium.webp",
  "./assets/elements/boron.webp",
  "./assets/elements/bromine.webp",
  "./assets/elements/cadmium.webp",
  "./assets/elements/caesium.webp",
  "./assets/elements/calcium.webp",
  "./assets/elements/californium.webp",
  "./assets/elements/carbon.webp",
  "./assets/elements/cerium.webp",
  "./assets/elements/chlorine.webp",
  "./assets/elements/chromium.webp",
  "./assets/elements/cobalt.webp",
  "./assets/elements/copernicium.webp",
  "./assets/elements/copper.webp",
  "./assets/elements/curium.webp",
  "./assets/elements/darmstadtium.webp",
  "./assets/elements/dubnium.webp",
  "./assets/elements/dysprosium.webp",
  "./assets/elements/einsteinium.webp",
  "./assets/elements/erbium.webp",
  "./assets/elements/europium.webp",
  "./assets/elements/fermium.webp",
  "./assets/elements/flerovium.webp",
  "./assets/elements/fluorine.webp",
  "./assets/elements/francium.webp",
  "./assets/elements/gadolinium.webp",
  "./assets/elements/gallium.webp",
  "./assets/elements/germanium.webp",
  "./assets/elements/gold.webp",
  "./assets/elements/hafnium.webp",
  "./assets/elements/hassium.webp",
  "./assets/elements/helium.webp",
  "./assets/elements/holmium.webp",
  "./assets/elements/hydrogen.webp",
  "./assets/elements/indium.webp",
  "./assets/elements/iodine.webp",
  "./assets/elements/iridium.webp",
  "./assets/elements/iron.webp",
  "./assets/elements/krypton.webp",
  "./assets/elements/lanthanum.webp",
  "./assets/elements/lawrencium.webp",
  "./assets/elements/lead.webp",
  "./assets/elements/lithium.webp",
  "./assets/elements/livermorium.webp",
  "./assets/elements/lutetium.webp",
  "./assets/elements/magnesium.webp",
  "./assets/elements/manganese.webp",
  "./assets/elements/meitnerium.webp",
  "./assets/elements/mendelevium.webp",
  "./assets/elements/mercury.webp",
  "./assets/elements/molybdenum.webp",
  "./assets/elements/moscovium.webp",
  "./assets/elements/neodymium.webp",
  "./assets/elements/neon.webp",
  "./assets/elements/neptunium.webp",
  "./assets/elements/nickel.webp",
  "./assets/elements/nihonium.webp",
  "./assets/elements/niobium.webp",
  "./assets/elements/nitrogen.webp",
  "./assets/elements/nobelium.webp",
  "./assets/elements/oganesson.webp",
  "./assets/elements/osmium.webp",
  "./assets/elements/oxygen.webp",
  "./assets/elements/palladium.webp",
  "./assets/elements/phosphorus.webp",
  "./assets/elements/platinum.webp",
  "./assets/elements/plutonium.webp",
  "./assets/elements/polonium.webp",
  "./assets/elements/potassium.webp",
  "./assets/elements/praseodymium.webp",
  "./assets/elements/promethium.webp",
  "./assets/elements/protactinium.webp",
  "./assets/elements/radium.webp",
  "./assets/elements/radon.webp",
  "./assets/elements/rhenium.webp",
  "./assets/elements/rhodium.webp",
  "./assets/elements/roentgenium.webp",
  "./assets/elements/rubidium.webp",
  "./assets/elements/ruthenium.webp",
  "./assets/elements/rutherfordium.webp",
  "./assets/elements/samarium.webp",
  "./assets/elements/scandium.webp",
  "./assets/elements/seaborgium.webp",
  "./assets/elements/selenium.webp",
  "./assets/elements/silicon.webp",
  "./assets/elements/silver.webp",
  "./assets/elements/sodium.webp",
  "./assets/elements/strontium.webp",
  "./assets/elements/sulfur.webp",
  "./assets/elements/tantalum.webp",
  "./assets/elements/technetium.webp",
  "./assets/elements/tellurium.webp",
  "./assets/elements/tennessine.webp",
  "./assets/elements/terbium.webp",
  "./assets/elements/thallium.webp",
  "./assets/elements/thorium.webp",
  "./assets/elements/thulium.webp",
  "./assets/elements/tin.webp",
  "./assets/elements/titanium.webp",
  "./assets/elements/tungsten.webp",
  "./assets/elements/uranium.webp",
  "./assets/elements/vanadium.webp",
  "./assets/elements/xenon.webp",
  "./assets/elements/ytterbium.webp",
  "./assets/elements/yttrium.webp",
  "./assets/elements/zinc.webp",
  "./assets/elements/zirconium.webp"
];

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
