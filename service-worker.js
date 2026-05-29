const CACHE_NAME = 'rapunzel-magic-world-v47';

const APP_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './assets/icons/apple-touch-icon.png',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/audio/the-glade-at-dawn.mp3',
  './assets/audio/where-the-sunbeams-hide.mp3',
  './assets/audio/abc-song.mp3',
  './assets/audio/sfx/balloon-pop.ogg',
  './assets/audio/sfx/animal-cat.mp3',
  './assets/audio/sfx/animal-cow.mp3',
  './assets/audio/sfx/animal-dog.mp3',
  './assets/audio/sfx/animal-duck.mp3',
  './assets/audio/sfx/animal-elephant.mp3',
  './assets/audio/sfx/animal-frog.mp3',
  './assets/audio/sfx/animal-lion.mp3',
  './assets/audio/sfx/animal-monkey.mp3',
  './assets/audio/sfx/animal-pig.mp3',
  './assets/audio/sfx/animal-sheep.mp3',
  './assets/audio/sfx/vehicle-ambulance.mp3',
  './assets/audio/sfx/vehicle-bike.mp3',
  './assets/audio/sfx/vehicle-bus.mp3',
  './assets/audio/sfx/vehicle-car.mp3',
  './assets/audio/sfx/vehicle-firetruck.mp3',
  './assets/audio/sfx/vehicle-helicopter.mp3',
  './assets/audio/sfx/vehicle-plane.mp3',
  './assets/audio/sfx/vehicle-police.mp3',
  './assets/audio/sfx/vehicle-rocket.mp3',
  './assets/audio/sfx/vehicle-train.mp3',
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

  // Range requests (audio/video streaming) MUST be left to the browser. A service
  // worker that answers a Range request via respondWith() — even with a correctly
  // synthesized 206 — breaks the <audio> byte-range state machine in Chrome and
  // Safari, so the element stalls at readyState 0 and never plays a sound. Returning
  // here (no respondWith) lets the request go straight to the network natively.
  // This is why background music + the ABC tune were silent.
  if (request.headers.has('range')) {
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
