// FitYear service worker â€” cache-first so the app works fully offline.
const CACHE = "fityear-v14";
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
  e.respondWith(
    caches.match(e.request).then((hit) => {
      const refresh = fetch(e.request)
        .then((res) => {
          if (res.ok) caches.open(CACHE).then((c) => c.put(e.request, res.clone()));
          return res;
        })
        .catch(() => hit);
      return hit || refresh;
    })
  );
});
