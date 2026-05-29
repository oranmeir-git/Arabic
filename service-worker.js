const CACHE_NAME = 'hakawati-cache-v11';
const ASSETS = [
  './',
  './index.html',
  './style.css',
  './app.js',
  './stories.json',
  './my_stories.txt',
  './logo.svg',
  './manifest.json'
];

// Install Event
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Service Worker: Caching files...');
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activate Event (Cleanup old caches)
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('Service Worker: Clearing old cache...');
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch Event (Network-First, falling back to cache for PWA/Offline support)
self.addEventListener('fetch', (e) => {
  e.respondWith(
    fetch(e.request)
      .then((networkResponse) => {
        // If successful and it's a valid GET request, cache it
        if (networkResponse.status === 200 && e.request.method === 'GET') {
          const cacheCopy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, cacheCopy));
        }
        return networkResponse;
      })
      .catch(() => {
        // If offline/network fails, fallback to cache
        return caches.match(e.request);
      })
  );
});
