const CACHE_NAME = 'rapunzel-magic-world-v40';

const APP_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './assets/icons/apple-touch-icon.png',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/audio/the-glade-at-dawn.mp3',
  './assets/audio/where-the-sunbeams-hide.mp3',
  './assets/images/items/animal-cat.png',
  './assets/images/items/animal-cow.png',
  './assets/images/items/animal-dog.png',
  './assets/images/items/animal-duck.png',
  './assets/images/items/animal-elephant.png',
  './assets/images/items/animal-frog.png',
  './assets/images/items/animal-lion.png',
  './assets/images/items/animal-monkey.png',
  './assets/images/items/animal-pig.png',
  './assets/images/items/animal-sheep.png',
  './assets/images/items/balloon-blue.png',
  './assets/images/items/balloon-purple.png',
  './assets/images/items/balloon-red.png',
  './assets/images/items/fruit-apple.png',
  './assets/images/items/fruit-apple-half-left.png',
  './assets/images/items/fruit-apple-half-right.png',
  './assets/images/items/fruit-banana.png',
  './assets/images/items/fruit-banana-half-left.png',
  './assets/images/items/fruit-banana-half-right.png',
  './assets/images/items/fruit-cherry.png',
  './assets/images/items/fruit-cherry-half-left.png',
  './assets/images/items/fruit-cherry-half-right.png',
  './assets/images/items/fruit-grapes.png',
  './assets/images/items/fruit-grapes-half-left.png',
  './assets/images/items/fruit-grapes-half-right.png',
  './assets/images/items/fruit-orange.png',
  './assets/images/items/fruit-orange-half-left.png',
  './assets/images/items/fruit-orange-half-right.png',
  './assets/images/items/fruit-peach.png',
  './assets/images/items/fruit-peach-half-left.png',
  './assets/images/items/fruit-peach-half-right.png',
  './assets/images/items/fruit-pear.png',
  './assets/images/items/fruit-pear-half-left.png',
  './assets/images/items/fruit-pear-half-right.png',
  './assets/images/items/fruit-pineapple.png',
  './assets/images/items/fruit-pineapple-half-left.png',
  './assets/images/items/fruit-pineapple-half-right.png',
  './assets/images/items/fruit-strawberry.png',
  './assets/images/items/fruit-strawberry-half-left.png',
  './assets/images/items/fruit-strawberry-half-right.png',
  './assets/images/items/fruit-watermelon.png',
  './assets/images/items/fruit-watermelon-half-left.png',
  './assets/images/items/fruit-watermelon-half-right.png',
  './assets/images/items/vehicle-ambulance.png',
  './assets/images/items/vehicle-bike.png',
  './assets/images/items/vehicle-bus.png',
  './assets/images/items/vehicle-car.png',
  './assets/images/items/vehicle-firetruck.png',
  './assets/images/items/vehicle-helicopter.png',
  './assets/images/items/vehicle-plane.png',
  './assets/images/items/vehicle-police.png',
  './assets/images/items/vehicle-rocket.png',
  './assets/images/items/vehicle-train.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(
        keys
          .filter((key) => key !== CACHE_NAME)
          .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (request.headers.has('range')) {
    event.respondWith(handleRangeRequest(request));
    return;
  }

  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const copy = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('./index.html', copy));
          return response;
        })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }

  event.respondWith(
    caches.match(request)
      .then((cached) => cached || fetch(request).then((response) => {
        if (!response || response.status !== 200) return response;
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        return response;
      }))
  );
});

async function handleRangeRequest(request) {
  const cached = await caches.match(request.url);
  if (!cached) return fetch(request);

  const range = request.headers.get('range') || '';
  const bytesPrefix = 'bytes=';
  if (!range.startsWith(bytesPrefix)) return cached;

  const buffer = await cached.arrayBuffer();
  const [startText, endText] = range.slice(bytesPrefix.length).split('-');
  const start = Number(startText);
  const end = endText ? Number(endText) : buffer.byteLength - 1;

  if (!Number.isFinite(start) || !Number.isFinite(end) || start > end) {
    return new Response(null, { status: 416, statusText: 'Range Not Satisfiable' });
  }

  const chunk = buffer.slice(start, end + 1);
  return new Response(chunk, {
    status: 206,
    statusText: 'Partial Content',
    headers: {
      'Accept-Ranges': 'bytes',
      'Content-Length': String(chunk.byteLength),
      'Content-Range': `bytes ${start}-${end}/${buffer.byteLength}`,
      'Content-Type': cached.headers.get('Content-Type') || 'application/octet-stream'
    }
  });
}
