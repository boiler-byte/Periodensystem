/* Automatisch generierter, versionierter PWA-Offline-Cache.
 * Nach Daten-/Bildänderungen: node scripts/sync-cache.mjs */
const CACHE_NAME = "periodensystem-shell-v4-e5edf2a93c62";
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
  "./assets/elements/actinium.svg",
  "./assets/elements/aluminium.svg",
  "./assets/elements/americium.svg",
  "./assets/elements/antimony.svg",
  "./assets/elements/argon.svg",
  "./assets/elements/arsenic.svg",
  "./assets/elements/astatine.svg",
  "./assets/elements/barium.svg",
  "./assets/elements/berkelium.svg",
  "./assets/elements/beryllium.svg",
  "./assets/elements/bismuth.svg",
  "./assets/elements/bohrium.svg",
  "./assets/elements/boron.svg",
  "./assets/elements/bromine.svg",
  "./assets/elements/cadmium.svg",
  "./assets/elements/caesium.svg",
  "./assets/elements/calcium.svg",
  "./assets/elements/californium.svg",
  "./assets/elements/carbon.svg",
  "./assets/elements/cerium.svg",
  "./assets/elements/chlorine.svg",
  "./assets/elements/chromium.svg",
  "./assets/elements/cobalt.svg",
  "./assets/elements/copernicium.svg",
  "./assets/elements/copper.svg",
  "./assets/elements/curium.svg",
  "./assets/elements/darmstadtium.svg",
  "./assets/elements/dubnium.svg",
  "./assets/elements/dysprosium.svg",
  "./assets/elements/einsteinium.svg",
  "./assets/elements/erbium.svg",
  "./assets/elements/europium.svg",
  "./assets/elements/fermium.svg",
  "./assets/elements/flerovium.svg",
  "./assets/elements/fluorine.svg",
  "./assets/elements/francium.svg",
  "./assets/elements/gadolinium.svg",
  "./assets/elements/gallium.svg",
  "./assets/elements/germanium.svg",
  "./assets/elements/gold.webp",
  "./assets/elements/hafnium.svg",
  "./assets/elements/hassium.svg",
  "./assets/elements/helium.webp",
  "./assets/elements/holmium.svg",
  "./assets/elements/hydrogen.webp",
  "./assets/elements/indium.svg",
  "./assets/elements/iodine.svg",
  "./assets/elements/iridium.svg",
  "./assets/elements/iron.webp",
  "./assets/elements/krypton.svg",
  "./assets/elements/lanthanum.svg",
  "./assets/elements/lawrencium.svg",
  "./assets/elements/lead.svg",
  "./assets/elements/lithium.svg",
  "./assets/elements/livermorium.svg",
  "./assets/elements/lutetium.svg",
  "./assets/elements/magnesium.svg",
  "./assets/elements/manganese.svg",
  "./assets/elements/meitnerium.svg",
  "./assets/elements/mendelevium.svg",
  "./assets/elements/mercury.svg",
  "./assets/elements/molybdenum.svg",
  "./assets/elements/moscovium.svg",
  "./assets/elements/neodymium.svg",
  "./assets/elements/neon.svg",
  "./assets/elements/neptunium.svg",
  "./assets/elements/nickel.svg",
  "./assets/elements/nihonium.svg",
  "./assets/elements/niobium.svg",
  "./assets/elements/nitrogen.svg",
  "./assets/elements/nobelium.svg",
  "./assets/elements/oganesson.svg",
  "./assets/elements/osmium.svg",
  "./assets/elements/oxygen.webp",
  "./assets/elements/palladium.svg",
  "./assets/elements/phosphorus.svg",
  "./assets/elements/platinum.svg",
  "./assets/elements/plutonium.svg",
  "./assets/elements/polonium.svg",
  "./assets/elements/potassium.svg",
  "./assets/elements/praseodymium.svg",
  "./assets/elements/promethium.svg",
  "./assets/elements/protactinium.svg",
  "./assets/elements/radium.svg",
  "./assets/elements/radon.svg",
  "./assets/elements/rhenium.svg",
  "./assets/elements/rhodium.svg",
  "./assets/elements/roentgenium.svg",
  "./assets/elements/rubidium.svg",
  "./assets/elements/ruthenium.svg",
  "./assets/elements/rutherfordium.svg",
  "./assets/elements/samarium.svg",
  "./assets/elements/scandium.svg",
  "./assets/elements/seaborgium.svg",
  "./assets/elements/selenium.svg",
  "./assets/elements/silicon.svg",
  "./assets/elements/silver.svg",
  "./assets/elements/sodium.svg",
  "./assets/elements/strontium.svg",
  "./assets/elements/sulfur.svg",
  "./assets/elements/tantalum.svg",
  "./assets/elements/technetium.svg",
  "./assets/elements/tellurium.svg",
  "./assets/elements/tennessine.svg",
  "./assets/elements/terbium.svg",
  "./assets/elements/thallium.svg",
  "./assets/elements/thorium.svg",
  "./assets/elements/thulium.svg",
  "./assets/elements/tin.svg",
  "./assets/elements/titanium.svg",
  "./assets/elements/tungsten.svg",
  "./assets/elements/uranium.webp",
  "./assets/elements/vanadium.svg",
  "./assets/elements/xenon.svg",
  "./assets/elements/ytterbium.svg",
  "./assets/elements/yttrium.svg",
  "./assets/elements/zinc.svg",
  "./assets/elements/zirconium.svg"
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
