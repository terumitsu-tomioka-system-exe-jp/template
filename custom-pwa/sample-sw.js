const CACHE_NAME = "pwa-offline-sample-v1";
const urlsToCache = [
  'home.html',
  'news.html',
  'guide.html',
  'manifest.json',
  'icon-192.png',
  'icon-512.png'
  // 必要ならCSSや画像も追加
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});