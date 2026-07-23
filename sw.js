// FitYear service worker — network-first for the app shell so deploys show up
// immediately, cache fallback so the app still works fully offline.
const CACHE = "fityear-v17";
const ASSETS = [
  "./", "index.html", "styles.css", "data.js", "tutorials.js", "planner.js", "app.js",
  "manifest.json", "icon.svg", "icon-192.png", "icon-512.png", "fonts/manrope.woff2",
];
// Tutorial photos in media/ are cached on first view by the fetch handler below.

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  if (e.request.method !== "GET") return;
  const path = new URL(e.request.url).pathname;
  // Immutable assets: serve from cache, fetch only on a miss.
  const cacheFirst = path.includes("/media/") || path.includes("/fonts/");

  if (cacheFirst) {
    e.respondWith(
      caches.match(e.request).then((hit) => hit || fetch(e.request).then((res) => {
        if (res.ok) caches.open(CACHE).then((c) => c.put(e.request, res.clone()));
        return res;
      }))
    );
    return;
  }

  // App shell: latest from the network, cache updated as a side effect;
  // fall back to cache (then index.html for navigations) when offline.
  e.respondWith(
    fetch(e.request)
      .then((res) => {
        if (res.ok) caches.open(CACHE).then((c) => c.put(e.request, res.clone()));
        return res;
      })
      .catch(() =>
        caches.match(e.request).then((hit) => hit || (e.request.mode === "navigate" ? caches.match("index.html") : undefined)))
  );
});
