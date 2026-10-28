/* Rianne's Rubik Cube Time | Offline service worker | v1.0.2
   Upload this file BESIDE index.html to the SAME GitHub Pages directory.
   The app shell is a single self-contained HTML file with no CDN dependencies.
   Personal solves are stored separately using the existing browser localStorage.
*/
const CACHE_PREFIX = 'riannes-cube-time-shell-';
const CACHE_VERSION = 'v1.0.2';
const CACHE_NAME = CACHE_PREFIX + CACHE_VERSION;
const HOME_URL = new URL('./', self.registration.scope);
const INDEX_URL = new URL('./index.html', self.registration.scope);

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    // A failed fetch must fail the install, never claiming offline readiness falsely.
    const response = await fetch(new Request(INDEX_URL.href, {cache: 'reload'}));
    if (!response.ok || response.type === 'opaque') throw new Error('Unable to cache the offline app');
    const cache = await caches.open(CACHE_NAME);
    await cache.put(INDEX_URL.href, response.clone());
    await cache.put(HOME_URL.href, response.clone());
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
      .map(key => caches.delete(key)));
    await self.clients.claim();
  })());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET' || request.mode !== 'navigate') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) return;
  // Update checks deliberately bypass the cached shell and fetch the published version.
  if (url.searchParams.has('app-version-check')) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(INDEX_URL.href);
    if (cached) return cached;
    // Recover if Safari evicted this particular entry but an online connection exists.
    try {
      const live = await fetch(request);
      if (live.ok && live.type !== 'opaque') {
        await cache.put(INDEX_URL.href, live.clone());
        await cache.put(HOME_URL.href, live.clone());
      }
      return live;
    } catch (error) {
      return new Response('<!doctype html><meta name="viewport" content="width=device-width"><title>Offline copy unavailable</title><body style="font:16px sans-serif;padding:20px;background:#080d1b;color:white"><h2>Offline copy unavailable</h2><p>Connect to the internet once and open Rianne\'s Rubik Cube Time to prepare its offline copy.</p></body>',
        {status:503,headers:{'Content-Type':'text/html; charset=utf-8'}});
    }
  })());
});
