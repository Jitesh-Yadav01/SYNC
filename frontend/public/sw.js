const CACHE_NAME = 'nexus-static-v1';
const RUNTIME_CACHE = 'nexus-runtime-v1';

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.webmanifest',
  '/clublogos/bwLogos/GDG.svg',
  '/background.svg'
];

self.addEventListener('install', event => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .catch(err => console.error('Failed to precache', err))
  );
});

self.addEventListener('activate', event => {
  const currentCaches = [CACHE_NAME, RUNTIME_CACHE];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return cacheNames.filter(cacheName => !currentCaches.includes(cacheName));
    }).then(cachesToDelete => {
      return Promise.all(cachesToDelete.map(cacheToDelete => caches.delete(cacheToDelete)));
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);

  // 1. Skip non-GET requests
  if (request.method !== 'GET') return;

  // 2. Skip API and Auth endpoints entirely
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/auth/') || url.pathname.startsWith('/admin/')) {
    return;
  }

  // 3. Navigation requests: Network-first, fallback to /index.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          // If valid response, cache the latest index.html
          if (response && response.status === 200) {
            const responseToCache = response.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put('/index.html', responseToCache);
            });
          }
          return response;
        })
        .catch(() => {
          // Offline fallback
          return caches.match('/index.html');
        })
    );
    return;
  }

  // 4. Static Assets: Cache-First
  if (
    url.pathname.startsWith('/assets/') || 
    url.pathname.startsWith('/clublogos/') || 
    url.pathname.endsWith('.svg') || 
    url.pathname.endsWith('.png') || 
    url.pathname.endsWith('.jpg') || 
    url.pathname.endsWith('.css') || 
    url.pathname.endsWith('.js')
  ) {
    event.respondWith(
      caches.match(request).then(cachedResponse => {
        if (cachedResponse) {
          return cachedResponse;
        }
        return fetch(request).then(response => {
          if (!response || response.status !== 200 || (response.type !== 'basic' && response.type !== 'cors')) {
            return response;
          }
          const responseToCache = response.clone();
          caches.open(RUNTIME_CACHE).then(cache => {
            cache.put(request, responseToCache);
          });
          return response;
        }).catch(() => {
          // Ignore failures
        });
      })
    );
    return;
  }

  // 5. Default fallback: Network Only for anything else
  event.respondWith(fetch(request).catch(() => {}));
});
