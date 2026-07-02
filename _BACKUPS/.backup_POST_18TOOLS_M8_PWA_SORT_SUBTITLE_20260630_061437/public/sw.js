/* Korelyy PWA Service Worker (minimal install-only)
 * Purpose: satisfy the PWA install requirement (sw registered + manifest)
 * No offline cache to avoid path mismatch issues with next export static output
 */
const CACHE_NAME = 'korelyy-install-v1';
const NOOP = () => {};

self.addEventListener('install', (event) => {
  event.waitUntil(Promise.resolve());
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys
          .filter((k) => k !== CACHE_NAME)
          .map((k) => caches.delete(k).catch(NOOP))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', NOOP);

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
