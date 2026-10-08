// Offline reading, registered by assets/js/offline.js. Pages come from the
// network first and fall back to the copy saved the last time they were
// read, then to /offline/, which lists the saved ones. Fingerprinted CSS
// and JS, fonts and images never change at a URL, so they come from the
// cache first. Both caches keep only the most recently used entries.
// Saved pages carry when they were saved, which the copy served offline
// tells the page (js/offline.js) so it can say how old it is.
// Posts a reader saves for later (js/saved.js) are kept apart, with the
// files they use, and never trimmed until the reader removes them.

const PAGES = "pages";
const ASSETS = "assets";
const SAVED = "saved";
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

const SAVED_AT = "X-Saved-At";

// A page's response, stamped with when it was saved.
async function stamped(response) {
  const headers = new Headers(response.headers);
  headers.set(SAVED_AT, new Date().toISOString());
  return new Response(await response.blob(), {
    status: response.status,
    statusText: response.statusText,
    headers: headers,
  });
}

// A saved page served offline, with a <meta name="offline-copy"> naming
// when it was saved. Pages saved before the stamp fall back to the date
// the server sent them.
async function offlineCopy(cached) {
  const savedAt = cached.headers.get(SAVED_AT) || cached.headers.get("Date") || "";
  const html = (await cached.text()).replace(
    /<head[^>]*>/i,
    (head) => head + '<meta name="offline-copy" content="' + savedAt.replace(/"/g, "") + '">',
  );
  return new Response(html, { status: cached.status, headers: cached.headers });
}

function isHTML(response) {
  return response.ok && (response.headers.get("content-type") || "").includes("text/html");
}

// A page fetched ahead of a click (static/speculation-rules.json) may never
// be read, so it isn't saved; if it's opened, the page asks for it to be
// (js/offline.js).
function isPrefetch(request) {
  return /prefetch/.test(request.headers.get("Sec-Purpose") || "");
}

async function page(event) {
  const key = pageKey(event.request.url);
  try {
    const response = await fetch(event.request);
    if (isHTML(response) && !isPrefetch(event.request)) {
      event.waitUntil(stamped(response.clone()).then((copy) => save(PAGES, MAX_PAGES, key, copy)));
      event.waitUntil(refreshKept(key, response.clone()));
    }
    return response;
  } catch (error) {
    const cached = await caches.match(key);
    if (cached) {
      return offlineCopy(cached);
    }
    return (await caches.match(OFFLINE)) || Response.error();
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

// A post saved for later is kept up to date whenever it's read online.
async function refreshKept(key, response) {
  const cache = await caches.open(SAVED);
  if (await cache.match(key)) {
    await cache.put(key, await stamped(response));
  }
}

// Saves a post for later, with the files it uses (fingerprinted CSS and
// JS, fonts, images) so it reads the same offline.
async function keep(page, assets) {
  const cache = await caches.open(SAVED);
  const response = await fetch(page);
  if (!isHTML(response)) {
    return;
  }
  await cache.put(pageKey(page), await stamped(response));
  await Promise.all(
    assets
      .filter((url) => isAsset(new URL(url)))
      .map(async (url) => {
        if (!(await cache.match(url))) {
          const asset = await fetch(url);
          if (asset.ok) {
            await cache.put(url, asset);
          }
        }
      }),
  );
}

// Removes a saved post, and the files no other saved post uses. Fonts are
// kept while any post is: stylesheets load them, so no page names them.
async function forget(page) {
  const cache = await caches.open(SAVED);
  await cache.delete(pageKey(page));
  const keys = await cache.keys();
  const pages = await Promise.all(
    keys
      .filter((request) => !isAsset(new URL(request.url)))
      .map(async (request) => (await cache.match(request)).text()),
  );
  await Promise.all(
    keys
      .filter((request) => isAsset(new URL(request.url)) && (!pages.length || !request.url.endsWith(".woff2")))
      .filter((request) => !pages.some((html) => html.includes(new URL(request.url).pathname)))
      .map((request) => cache.delete(request)),
  );
}

// The first page a reader opens loads before the worker is in control, so
// that page sends its own address and files to be saved. Saving a post for
// later, or removing it, comes as a message too.
self.addEventListener("message", function (event) {
  if (event.data?.type === "keep") {
    event.waitUntil(keep(event.data.page, event.data.assets).catch(() => {}));
    return;
  }
  if (event.data?.type === "forget") {
    event.waitUntil(forget(event.data.page).catch(() => {}));
    return;
  }
  if (event.data?.type !== "save") {
    return;
  }
  event.waitUntil(
    (async function () {
      const response = await fetch(event.data.page);
      if (isHTML(response)) {
        await save(PAGES, MAX_PAGES, pageKey(event.data.page), await stamped(response));
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
