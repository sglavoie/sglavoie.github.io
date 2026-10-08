import { readProgress } from "./reading.js";

// Registers the service worker that keeps pages for offline reading
// (static/sw.js). Not under `hugo server`, whose files aren't fingerprinted
// and change on every edit.
export function initOffline() {
  if (!("serviceWorker" in navigator) || location.port === "1313") {
    return;
  }
  const firstVisit = !navigator.serviceWorker.controller;
  navigator.serviceWorker
    .register("/sw.js")
    .then(function () {
      return navigator.serviceWorker.ready;
    })
    .then(function (registration) {
      if (!firstVisit) {
        return;
      }
      // This page loaded before the worker was in control: hand it the page
      // and the files it used, to save as if it had fetched them.
      registration.active?.postMessage({
        type: "save",
        page: location.href,
        assets: performance
          .getEntriesByType("resource")
          .map((entry) => entry.name)
          .filter((url) => new URL(url).origin === location.origin),
      });
    })
    .catch(function () {});
}

// The /offline/ page (offline.html) lists the pages the worker has saved.
export async function initSavedPages() {
  const section = document.querySelector("[data-saved-pages]");
  if (!section || !("caches" in window)) {
    return;
  }
  try {
    const cache = await caches.open("pages");
    const requests = await cache.keys();
    const pages = await Promise.all(
      requests.map(async (request) => {
        const html = await (await cache.match(request)).text();
        const title = new DOMParser().parseFromString(html, "text/html").title;
        return { url: new URL(request.url).pathname, title: title };
      }),
    );
    const list = section.querySelector("ul");
    const progress = readProgress();
    pages
      // Pages that only lead elsewhere.
      .filter((page) => page.url !== "/offline/" && page.url !== "/random/")
      .sort((a, b) => a.title.localeCompare(b.title))
      .forEach((page) => {
        const item = document.createElement("li");
        const link = document.createElement("a");
        link.href = page.url;
        link.textContent = page.url === "/" ? "Home" : page.title.replace(/^sglavoie\.com – /, "");
        item.appendChild(link);
        // Posts left part way (reading.js).
        const read = progress[page.url];
        if (read) {
          const meta = document.createElement("span");
          meta.className = "post-footer__related-meta";
          meta.textContent = Math.round(read.fraction * 100) + "% read";
          item.appendChild(meta);
        }
        list.appendChild(item);
      });
    section.hidden = !list.children.length;
  } catch (e) {}
}
