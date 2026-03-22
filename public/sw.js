// Minimal service worker to satisfy PWA requirements for "Add to Home Screen"
// This app still requires internet connectivity to function.

const CACHE_NAME = 'kickoff-rivals-v1';

self.addEventListener('install', (event) => {
  // Pass through
});

self.addEventListener('activate', (event) => {
  // Pass through
});

// Browsers require a fetch listener to trigger the native install prompt
self.addEventListener('fetch', (event) => {
  // We don't cache anything yet, just networking as usual
  // event.respondWith(fetch(event.request));
});
