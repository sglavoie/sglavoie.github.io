// Keyboard shortcut: "F" opens the search.
import { isSearchOpen, openSearch } from "./search.js";

function isEditableTarget(target) {
  return Boolean(
    target &&
      target.closest('input, textarea, select, button, [contenteditable="true"]'),
  );
}

export function initShortcuts() {
  document.addEventListener("keydown", function (e) {
    if (
      e.key.toLowerCase() === "f" &&
      !isSearchOpen() &&
      !e.metaKey &&
      !e.ctrlKey &&
      !e.altKey &&
      !isEditableTarget(e.target)
    ) {
      e.preventDefault();
      openSearch();
    }
  });
}
