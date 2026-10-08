// Posts saved for later: the button at the end of a post (post-footer.html)
// or the "s" shortcut adds the post to a list kept in this browser, which
// /saved/ shows (saved.html). The service worker (static/sw.js) keeps a
// copy of each, so they read offline too, until they're removed.
import { readProgress } from "./reading.js";
import { announce } from "./toast.js";

const storageKey = "saved-posts";
const savedDate = new Intl.DateTimeFormat(undefined, { dateStyle: "medium" });

// [{ url, title, at }], most recently saved first.
export function readSaved() {
  try {
    const saved = JSON.parse(localStorage.getItem(storageKey));
    return Array.isArray(saved) ? saved : [];
  } catch (e) {
    return [];
  }
}

function writeSaved(saved) {
  try {
    localStorage.setItem(storageKey, JSON.stringify(saved));
    return true;
  } catch (e) {
    return false;
  }
}

function isSaved(url) {
  return readSaved().some((post) => post.url === url);
}

function tellWorker(message) {
  navigator.serviceWorker?.ready
    .then((registration) => registration.active?.postMessage(message))
    .catch(function () {});
}

function add(url, title) {
  const saved = readSaved().filter((post) => post.url !== url);
  saved.unshift({ url: url, title: title, at: Date.now() });
  if (!writeSaved(saved)) {
    return false;
  }
  // The files this page used, so the saved copy looks the same offline.
  tellWorker({
    type: "keep",
    page: new URL(url, location.origin).href,
    assets: url === location.pathname
      ? performance
          .getEntriesByType("resource")
          .map((entry) => entry.name)
          .filter((name) => new URL(name).origin === location.origin)
      : [],
  });
  return true;
}

function remove(url) {
  writeSaved(readSaved().filter((post) => post.url !== url));
  tellWorker({ type: "forget", page: new URL(url, location.origin).href });
}

function syncButton(button) {
  const saved = isSaved(location.pathname);
  button.setAttribute("aria-pressed", String(saved));
  button.textContent = saved ? "Saved for later" : "Save for later";
  button.title = saved ? "Remove from your saved posts (S)" : "Keep this post to read later, offline too (S)";
}

// Saves the post being read, or removes it if it's saved.
export function toggleSaved() {
  const button = document.querySelector("[data-save]");
  if (!button) {
    return;
  }
  if (isSaved(location.pathname)) {
    remove(location.pathname);
    announce("Removed from your saved posts");
  } else if (add(location.pathname, button.dataset.title)) {
    announce("Saved for later, offline too");
  } else {
    announce("Couldn't save: this browser keeps no data for the site");
  }
  syncButton(button);
}

export function initSaveButton() {
  const button = document.querySelector("[data-save]");
  if (!button) {
    return;
  }
  syncButton(button);
  button.parentElement.hidden = false;
  button.addEventListener("click", toggleSaved);
  // Saved or removed in another tab.
  window.addEventListener("storage", function (e) {
    if (e.key === storageKey) {
      syncButton(button);
    }
  });
}

// The /saved/ page lists the saved posts, with how far the reader got.
export function initSavedList() {
  const section = document.querySelector("[data-saved-posts]");
  if (!section) {
    return;
  }
  const list = section.querySelector("ul");
  const empty = section.querySelector("[data-saved-empty]");

  function render() {
    const saved = readSaved();
    const progress = readProgress();
    list.replaceChildren(
      ...saved.map(function (post) {
        const item = document.createElement("li");
        const link = document.createElement("a");
        link.href = post.url;
        link.textContent = post.title || post.url;
        const meta = document.createElement("span");
        meta.className = "post-footer__related-meta";
        const details = ["saved " + savedDate.format(new Date(post.at))];
        const read = progress[post.url];
        if (read) {
          details.push(Math.round(read.fraction * 100) + "% read");
        }
        meta.textContent = details.join(" · ");
        const button = document.createElement("button");
        button.type = "button";
        button.className = "saved-posts__remove";
        button.textContent = "Remove";
        button.setAttribute("aria-label", "Remove " + (post.title || post.url));
        button.addEventListener("click", function () {
          remove(post.url);
          render();
          announce("Removed from your saved posts");
          (list.querySelector("button") || section.querySelector("h2"))?.focus();
        });
        item.append(link, meta, button);
        return item;
      }),
    );
    list.hidden = !saved.length;
    empty.hidden = Boolean(saved.length);
  }

  render();
  window.addEventListener("storage", (e) => e.key === storageKey && render());
}
