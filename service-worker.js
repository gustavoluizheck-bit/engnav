const CACHE_NAME = 'glheck-portfolio-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/curriculo/index.html',
  '/curriculo/style.css',
  '/curriculo/script.js',
  '/engnav/index.html',
  '/engnav/style.css',
  '/engnav/app.js',
  '/engnav/market_data.json'
];

// Install Event
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('S-Worker: Caching Assets');
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('S-Worker: Clearing Old Cache', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event (Offline Fallback)
self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cachedResponse => {
      return cachedResponse || fetch(e.request).catch(() => {
        // Return home if offline and fetching document
        if (e.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});
