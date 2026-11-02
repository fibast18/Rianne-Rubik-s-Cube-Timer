/* Rianne's Rubik Cube Timer | Offline service worker | v1.0.5
   Upload ALL files in the release folder to the SAME GitHub Pages directory.
   The app shell is a self-contained HTML file with no CDN dependencies.
   Solves/settings remain exclusively in the existing localStorage key.
*/
const CACHE_PREFIX = 'riannes-cube-time-shell-';
const CACHE_VERSION = 'v1.0.5';
const CACHE_NAME = CACHE_PREFIX + CACHE_VERSION;
const HOME_URL = new URL('./', self.registration.scope);
const INDEX_URL = new URL('./index.html', self.registration.scope);
const ASSET_URLS = ['manifest.webmanifest', 'apple-touch-icon.png', 'icon-192.png', 'icon-512.png', 'favicon.png']
  .map(path => new URL('./' + path, self.registration.scope).href);

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Cache the HTML and every icon as one successful offline package.
    const urls = [INDEX_URL.href, ...ASSET_URLS];
    const contents = await Promise.all(urls.map(async url => {
      const res = await fetch(new Request(url, { cache: 'reload' }));
      if (!res.ok || res.type === 'opaque') throw new Error('Could not cache ' + url);
      return [url, res];
    }));
    for (const [url, res] of contents) {
      await cache.put(url, res.clone());
      if (url === INDEX_URL.href) await cache.put(HOME_URL.href, res.clone());
    }
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
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin || !url.href.startsWith(self.registration.scope)) return;

  if (request.mode === 'navigate') {
    // Update checks deliberately bypass the cached shell and fetch the published version.
    if (url.searchParams.has('app-version-check')) return;
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(INDEX_URL.href);
      if (cached) return cached;
      try {
        const live = await fetch(request);
        if (live.ok && live.type !== 'opaque') {
          await cache.put(INDEX_URL.href, live.clone());
          await cache.put(HOME_URL.href, live.clone());
        }
        return live;
      } catch (error) {
        return new Response('<!doctype html><meta name="viewport" content="width=device-width"><title>Offline copy unavailable</title><body style="font:16px sans-serif;padding:20px;background:#1b142e;color:white"><h2>Offline copy unavailable</h2><p>Connect to the internet once and open Rianne\'s Rubik Cube Timer to prepare its offline copy.</p></body>',
          {status: 503, headers: {'Content-Type': 'text/html; charset=utf-8'}});
      }
    })());
    return;
  }

  // Home Screen icons and manifest also work from the cached offline release.
  const assetHref = url.origin + url.pathname;
  if (ASSET_URLS.includes(assetHref)) {
    event.respondWith((async () => {
      const cache = await caches.open(CACHE_NAME);
      const cached = await cache.match(assetHref);
      if (cached) return cached;
      const live = await fetch(request);
      if (live.ok && live.type !== 'opaque') await cache.put(assetHref, live.clone());
      return live;
    })());
  }
});
