// Single-key shortcuts, plus "g" followed by a key to go to a page, listed in the dialog that "?" opens (baseof.html).
import { selectionURL } from "./fragment.js";
import { stepTextSize } from "./reading-settings.js";
import { openSearch } from "./search.js";
import { toggleTheme } from "./theme.js";
import { announce } from "./toast.js";

const shortcutsDialog = document.getElementById("shortcuts-dialog");

// Buttons don't take these keys, and one keeps focus after a click (the
// theme toggle, a dialog's close button), so only text fields are skipped.
function isEditableTarget(target) {
  return Boolean(
    target && target.closest('input, textarea, select, [contenteditable="true"]'),
  );
}

// Older and newer posts, from the links at the end of a post.
function follow(rel) {
  const link = document.querySelector('.post-footer__pager a[rel="' + rel + '"]');
  if (link) {
    window.location.href = link.href;
  }
}

// Article sections: the h2 and h3 headings, measured against the offset
// they scroll to (post.css keeps them clear of the sticky bars). Those in
// collapsed sections (sections.js) are skipped.
function sections() {
  return Array.from(document.querySelectorAll(".article_text :is(h2, h3)[id]"))
    .filter((heading) => heading.getClientRects().length)
    .map(function (heading) {
      const margin = parseFloat(getComputedStyle(heading).scrollMarginTop) || 0;
      return { heading: heading, top: heading.getBoundingClientRect().top - margin };
    });
}

function goToSection(heading) {
  if (heading) {
    heading.scrollIntoView({ block: "start" });
    history.replaceState(null, "", "#" + heading.id);
  }
}

// "]" goes to the next section; "[" back to the start of this one, or to
// the one before when already there.
function nextSection() {
  goToSection(sections().find((s) => s.top > 2)?.heading);
}

function previousSection() {
  goToSection(sections().findLast((s) => s.top < -2)?.heading);
}

// The address of the passage selected, else of the section being read, or
// of the page above the first.
function copyLink() {
  if (!navigator.clipboard) {
    return;
  }
  const passage = selectionURL(location.href);
  if (passage) {
    navigator.clipboard.writeText(passage).then(function () {
      announce("Link to the selected text copied");
    });
    return;
  }
  const current = sections().findLast((s) => s.top <= 2)?.heading;
  const url = new URL(location.href);
  url.search = "";
  url.hash = current ? current.id : "";
  navigator.clipboard.writeText(url.href).then(function () {
    announce(current ? "Link to this section copied" : "Link to this page copied");
  });
}

function openShortcuts() {
  if (shortcutsDialog && !shortcutsDialog.open) {
    shortcutsDialog.showModal();
  }
}

const actions = {
  f: openSearch,
  "/": openSearch,
  t: toggleTheme,
  p: function () {
    follow("prev");
  },
  n: function () {
    follow("next");
  },
  "[": previousSection,
  "]": nextSection,
  c: copyLink,
  g: function () {
    pendingGo = Date.now();
  },
  "?": openShortcuts,
  "+": () => stepTextSize(1),
  "=": () => stepTextSize(1),
  "-": () => stepTextSize(-1),
};

// The second key after "g", pressed within a second.
const destinations = {
  h: "/",
  a: "/archives/",
  t: "/topics/",
  r: "/random/",
};
let pendingGo = 0;

export function initShortcuts() {
  document.addEventListener("keydown", function (e) {
    if (
      e.metaKey ||
      e.ctrlKey ||
      e.altKey ||
      document.querySelector("dialog[open]") ||
      isEditableTarget(e.target)
    ) {
      return;
    }
    const key = e.key.length === 1 ? e.key.toLowerCase() : "";
    const going = Date.now() - pendingGo < 1000;
    pendingGo = 0;
    if (going && destinations[key]) {
      e.preventDefault();
      window.location.href = destinations[key];
      return;
    }
    const action = actions[key];
    if (action) {
      e.preventDefault();
      action();
    }
  });

  if (shortcutsDialog) {
    shortcutsDialog.addEventListener("click", function (e) {
      if (e.target === shortcutsDialog || e.target.closest("[data-close-shortcuts]")) {
        shortcutsDialog.close();
      }
    });
    document.querySelectorAll("[data-open-shortcuts]").forEach(function (button) {
      button.hidden = false;
      button.addEventListener("click", openShortcuts);
    });
  }
}
