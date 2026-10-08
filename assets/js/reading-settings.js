// Reading settings: the size of the article text and its font, chosen in
// the display settings popover (header.html), beside the theme (theme.js),
// and kept in this browser. js/inline/theme.js applies them before the first paint; the
// stylesheets read them as --reading-scale and --font-reading (tokens.css).

import { announce } from "./toast.js";

const key = "reading-settings";
const sizes = ["small", "default", "large", "larger"];
const sizeNames = { small: "Small", default: "Default", large: "Large", larger: "Larger" };

function load() {
  try {
    return JSON.parse(localStorage.getItem(key) || "{}") || {};
  } catch (e) {
    return {};
  }
}

function apply(settings) {
  const root = document.documentElement;
  if (settings.size && settings.size !== "default") {
    root.dataset.textSize = settings.size;
  } else {
    delete root.dataset.textSize;
  }
  if (settings.font === "sans") {
    root.dataset.readingFont = "sans";
  } else {
    delete root.dataset.readingFont;
  }
}

function save(settings) {
  try {
    if ((settings.size || "default") === "default" && settings.font !== "sans") {
      localStorage.removeItem(key);
    } else {
      localStorage.setItem(key, JSON.stringify(settings));
    }
  } catch (e) {}
}

// One step up or down the sizes, for the shortcuts (js/shortcuts.js).
export function stepTextSize(step) {
  const settings = load();
  const index = sizes.indexOf(settings.size || "default");
  const next = sizes[Math.max(0, Math.min(sizes.length - 1, index + step))];
  settings.size = next;
  apply(settings);
  save(settings);
  sync(settings);
  announce("Text size: " + sizeNames[next]);
}

function sync(settings) {
  const form = document.getElementById("reading-settings");
  if (!form) {
    return;
  }
  const size = form.querySelector(`input[name="size"][value="${settings.size || "default"}"]`);
  const font = form.querySelector(`input[name="font"][value="${settings.font === "sans" ? "sans" : "serif"}"]`);
  if (size) {
    size.checked = true;
  }
  if (font) {
    font.checked = true;
  }
}

export function initReadingSettings() {
  const form = document.getElementById("reading-settings");
  if (!form) {
    return;
  }
  sync(load());
  form.addEventListener("change", function () {
    const data = new FormData(form);
    const settings = { size: data.get("size"), font: data.get("font") };
    apply(settings);
    save(settings);
  });
  form.addEventListener("reset", function () {
    // After the form has put its inputs back to their defaults.
    requestAnimationFrame(function () {
      apply({});
      save({});
    });
  });
  form.addEventListener("submit", (e) => e.preventDefault());
}
