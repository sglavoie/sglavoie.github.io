// Offline reading, registered by assets/js/offline.js. Pages come from the
// network first and fall back to the copy saved the last time they were
// read, then to /offline/, which lists the saved ones. Fingerprinted CSS
// and JS, fonts and images never change at a URL, so they come from the
// cache first. Both caches keep only the most recently used entries.

const PAGES = "pages";
const ASSETS = "assets";
const OFFLINE = "/offline/";
const MAX_PAGES = 60;
const MAX_ASSETS = 200;

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches
      .open(PAGES)
      .then((cache) => cache.addAll(["/", OFFLINE]))
      .then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", function (event) {
  event.waitUntil(self.clients.claim());
});

function isAsset(url) {
  return (
    /\.[0-9a-f]{64}\.(css|js)$/.test(url.pathname) ||
    /\.(woff2|png|jpe?g|gif|webp|svg|ico)$/.test(url.pathname)
  );
}

// One saved copy per page, whatever the query (search highlights) or hash.
function pageKey(url) {
  const key = new URL(url);
  key.search = "";
  key.hash = "";
  return key.href;
}

// Cache.put moves an entry to the end of keys(), so the oldest go first.
async function trim(name, max) {
  const cache = await caches.open(name);
  const keys = await cache.keys();
  await Promise.all(keys.slice(0, Math.max(0, keys.length - max)).map((key) => cache.delete(key)));
}

async function save(name, max, key, response) {
  const cache = await caches.open(name);
  await cache.put(key, response);
  await trim(name, max);
}

function isHTML(response) {
  return response.ok && (response.headers.get("content-type") || "").includes("text/html");
}

async function page(event) {
  const key = pageKey(event.request.url);
  try {
    const response = await fetch(event.request);
    if (isHTML(response)) {
      event.waitUntil(save(PAGES, MAX_PAGES, key, response.clone()));
    }
    return response;
  } catch (error) {
    return (await caches.match(key)) || (await caches.match(OFFLINE)) || Response.error();
  }
}

async function asset(event) {
  const cached = await caches.match(event.request);
  if (cached) {
    return cached;
  }
  const response = await fetch(event.request);
  if (response.ok) {
    event.waitUntil(save(ASSETS, MAX_ASSETS, event.request, response.clone()));
  }
  return response;
}

self.addEventListener("fetch", function (event) {
  const url = new URL(event.request.url);
  if (event.request.method !== "GET" || url.origin !== self.location.origin) {
    return;
  }
  if (event.request.mode === "navigate") {
    event.respondWith(page(event));
  } else if (isAsset(url)) {
    event.respondWith(asset(event));
  }
});

// The first page a reader opens loads before the worker is in control, so
// that page sends its own address and files to be saved.
self.addEventListener("message", function (event) {
  if (event.data?.type !== "save") {
    return;
  }
  event.waitUntil(
    (async function () {
      const response = await fetch(event.data.page);
      if (isHTML(response)) {
        await save(PAGES, MAX_PAGES, pageKey(event.data.page), response);
      }
      await Promise.all(
        event.data.assets
          .filter((url) => isAsset(new URL(url)))
          .map(async (url) => {
            if (!(await caches.match(url))) {
              const response = await fetch(url);
              if (response.ok) {
                await save(ASSETS, MAX_ASSETS, url, response);
              }
            }
          }),
      );
    })().catch(() => {}),
  );
});
