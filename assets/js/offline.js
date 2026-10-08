import { readProgress } from "./reading.js";
import { announce } from "./toast.js";

const savedDate = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });

// When a saved page was saved (static/sw.js), as a date, or "".
function formatSaved(value) {
  const date = new Date(value || "");
  return Number.isNaN(date.getTime()) ? "" : savedDate.format(date);
}

// Registers the service worker that keeps pages for offline reading
// (static/sw.js). Not under `hugo server`, whose files aren't fingerprinted
// and change on every edit.
export function initOffline() {
  if (!("serviceWorker" in navigator) || location.port === "1313") {
    return;
  }
  // A page opened from a prefetch (static/speculation-rules.json) came
  // without the worker saving it, as on a first visit.
  const navigation = performance.getEntriesByType("navigation")[0];
  const unsaved = !navigator.serviceWorker.controller || navigation?.deliveryType === "navigational-prefetch";
  navigator.serviceWorker
    .register("/sw.js")
    .then(function () {
      return navigator.serviceWorker.ready;
    })
    .then(function (registration) {
      if (!unsaved) {
        return;
      }
      // This page loaded before the worker was in control, or from a
      // prefetch: hand it the page and the files it used, to save as if it
      // had fetched them.
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

// A saved copy served without a connection says so, and from when: the page
// may have changed since.
export function initOfflineCopy() {
  const meta = document.querySelector('meta[name="offline-copy"]');
  if (!meta) {
    return;
  }
  const saved = formatSaved(meta.content);
  const message = "You're offline: this is the copy saved" + (saved ? " on " + saved : "") + ".";
  const article = document.querySelector(".article_text");
  if (!article) {
    announce(message);
    return;
  }
  const note = document.createElement("aside");
  note.className = "callout callout--note offline-copy";
  note.setAttribute("aria-label", "Note");
  const title = document.createElement("p");
  title.className = "callout__title";
  title.textContent = "Saved copy";
  const text = document.createElement("p");
  text.textContent = message + " It may have changed since.";
  note.append(title, text);
  article.prepend(note);
}

// The /offline/ page (offline.html) lists the pages the worker has saved.
export async function initSavedPages() {
  const section = document.querySelector("[data-saved-pages]");
  if (!section || !("caches" in window)) {
    return;
  }
  try {
    // Pages kept from reading, and posts saved for later (saved.js), which
    // may be in both: the saved copy wins.
    const responses = new Map();
    for (const name of ["pages", "saved"]) {
      const cache = await caches.open(name);
      for (const request of await cache.keys()) {
        const url = new URL(request.url);
        if (name === "pages" || !/\.[a-z0-9]+$/.test(url.pathname)) {
          responses.set(url.pathname, { request: request, cache: cache, kept: name === "saved" });
        }
      }
    }
    const pages = await Promise.all(
      Array.from(responses.values()).map(async ({ request, cache, kept }) => {
        const response = await cache.match(request);
        const html = await response.text();
        const title = new DOMParser().parseFromString(html, "text/html").title;
        const saved = formatSaved(response.headers.get("X-Saved-At") || response.headers.get("Date"));
        return { url: new URL(request.url).pathname, title: title, saved: saved, kept: kept };
      }),
    );
    const list = section.querySelector("ul");
    const progress = readProgress();
    pages
      // Pages that only lead elsewhere.
      .filter((page) => !["/offline/", "/random/", "/saved/"].includes(page.url))
      .sort((a, b) => a.title.localeCompare(b.title))
      .forEach((page) => {
        const item = document.createElement("li");
        const link = document.createElement("a");
        link.href = page.url;
        link.textContent = page.url === "/" ? "Home" : page.title.replace(/^sglavoie\.com – /, "");
        item.appendChild(link);
        // When it was saved, and how far into it the reader got (reading.js).
        const read = progress[page.url];
        const details = [];
        if (page.kept) {
          details.push("saved for later");
        }
        if (page.saved) {
          details.push("saved " + page.saved);
        }
        if (read) {
          details.push(Math.round(read.fraction * 100) + "% read");
        }
        if (details.length) {
          const meta = document.createElement("span");
          meta.className = "post-footer__related-meta";
          meta.textContent = details.join(" · ");
          item.appendChild(meta);
        }
        list.appendChild(item);
      });
    section.hidden = !list.children.length;
  } catch (e) {}
}
