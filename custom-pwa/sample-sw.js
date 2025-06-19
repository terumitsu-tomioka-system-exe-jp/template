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
      caches.open(CACHE_NAME).then(async cache => {
        try {
          // オンライン時は新しい内容をフェッチ＆キャッシュ
          const fresh = await fetch(event.request);
          cache.put(event.request, fresh.clone());
          return fresh;
        } catch (err) {
          // オフライン時やエラー時はキャッシュから返却
          const cached = await cache.match(event.request);
          if (cached) return cached;
          // それでもなければカスタムオフライン画面やデフォルトを返す
          return caches.match('/offline.html') || Response.error();
        }
      })
    );

  // event.respondWith(
  //   caches.match(event.request)
  //     .then(response => response || fetch(event.request))
  // );
});