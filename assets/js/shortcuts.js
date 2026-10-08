// Single-key shortcuts, listed in the dialog that "?" opens (baseof.html).
import { isSearchOpen, openSearch } from "./search.js";
import { toggleTheme } from "./theme.js";

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
  "?": openShortcuts,
};

export function initShortcuts() {
  document.addEventListener("keydown", function (e) {
    if (
      e.metaKey ||
      e.ctrlKey ||
      e.altKey ||
      isSearchOpen() ||
      shortcutsDialog?.open ||
      isEditableTarget(e.target)
    ) {
      return;
    }
    const action = actions[e.key.length === 1 ? e.key.toLowerCase() : ""];
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
