'use strict';

const VERSION      = '1';
const CACHE_STATIC = `rosterkit-static-v${VERSION}`;
const CACHE_FONTS  = `rosterkit-fonts-v${VERSION}`;

const PRECACHE = [
  './',
  './index.html',
  './manifest.json',
  './assets/icon-192.png',
  './assets/icon-512.png'
];

const FONT_DOMAINS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

// ── INSTALL ──
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then(cache => cache.addAll(PRECACHE))
      .catch(err => console.warn('[SW] Precache failed:', err))
  );
  self.skipWaiting();
});

// ── ACTIVATE — purge old caches ──
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(key => {
        if (!key.startsWith('rosterkit-') || (!key.endsWith(`-v${VERSION}`))) {
          console.log('[SW] Deleting old cache:', key);
          return caches.delete(key);
        }
      }))
    ).then(() => self.clients.claim())
  );
});

// ── FETCH — cache-first with network fallback ──
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
        if (req.mode === 'navigate') return caches.match('./index.html');
        return new Response('Offline', { status: 503, statusText: 'Service Unavailable' });
      });
    })
  );
});

console.log(`[SW] RosterKit service worker v${VERSION} loaded`);
