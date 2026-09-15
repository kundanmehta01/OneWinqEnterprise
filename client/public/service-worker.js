const CACHE = 'onewinq-public-profile-v1';
const APP_SHELL = ['/', '/manifest.webmanifest', '/onewinq-icon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(APP_SHELL)));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  const url = new URL(event.request.url);
  if (url.origin !== self.location.origin) return;
  event.respondWith(fetch(event.request).then((response) => {
    if (response.ok && (url.pathname.startsWith('/api/public/') || url.pathname.startsWith('/profile/'))) {
      caches.open(CACHE).then((cache) => cache.put(event.request, response.clone()));
    }
    return response;
  }).catch(() => caches.match(event.request)));
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'CACHE_PROFILE' && event.data.url) {
    caches.open(CACHE).then((cache) => cache.add(event.data.url));
  }
});
