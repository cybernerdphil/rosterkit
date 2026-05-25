'use strict';

const VERSION      = '1';
const CACHE_STATIC = `rosterkit-staff-v${VERSION}`;
const CACHE_FONTS  = `rosterkit-fonts-v${VERSION}`;

const PRECACHE = [
  './staff-availability.html',
  './manifest-staff.json',
  './assets/icon-192.png',
  './assets/icon-512.png'
];

const FONT_DOMAINS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then(cache => cache.addAll(PRECACHE))
      .catch(err => console.warn('[SW Staff] Precache failed:', err))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (key.startsWith('rosterkit-') && !key.endsWith(`-v${VERSION}`)) {
          return caches.delete(key);
        }
      }))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  let url;
  try { url = new URL(req.url); } catch { return; }
  if (!/^https?:/.test(url.protocol)) return;

  const isFont = FONT_DOMAINS.some(d => url.hostname === d);
  const cacheName = isFont ? CACHE_FONTS : CACHE_STATIC;

  event.respondWith(
    caches.match(req).then(cached => {
      if (cached) return cached;
      return fetch(req).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') return response;
        const clone = response.clone();
        caches.open(cacheName).then(cache => cache.put(req, clone));
        return response;
      }).catch(() => {
        if (req.mode === 'navigate') return caches.match('./staff-availability.html');
        return new Response('Offline', { status: 503 });
      });
    })
  );
});
