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

// self.addEventListener('fetch', event => {
//   event.respondWith(
//     caches.match(event.request)
//       .then(response => response || fetch(event.request))
//   );
// });

self.addEventListener('fetch', event => {
  // GET かつ http(s) リクエストのみ処理
  if (event.request.method !== 'GET' ||
      !event.request.url.startsWith('http')) {
    return; // サポート外は早期リターン
  }

  event.respondWith(
    caches.open(CACHE_NAME).then(async cache => {
      try {
        const fresh = await fetch(event.request);
        // オリジンチェック
        if (event.request.url.startsWith('http')) {
          cache.put(event.request, fresh.clone());
        }
        return fresh;
      } catch (err) {
        const cached = await cache.match(event.request);
        if (cached) return cached;
        return caches.match('/offline.html') || Response.error();
      }
    })
  );
});
