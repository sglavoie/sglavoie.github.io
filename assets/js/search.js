// Search dialog around Pagefind UI.

const searchTrigger = document.getElementById("search-trigger");
const searchDialog = document.getElementById("search-dialog");
let pagefindUI = null;

function focusSearchInput() {
  const searchInput = searchDialog.querySelector("input");
  if (searchInput) {
    searchInput.focus();
    searchInput.select();
  }
}

export function isSearchOpen() {
  return Boolean(searchDialog?.open);
}

export function openSearch() {
  if (!searchDialog || searchDialog.open || typeof PagefindUI === "undefined") {
    return;
  }
  if (!pagefindUI) {
    pagefindUI = new PagefindUI({
      element: "#search",
      showSubResults: true,
      showImages: false,
      debounceTimeoutMs: 100,
    });
  }
  searchDialog.showModal();
  searchTrigger?.setAttribute("aria-expanded", "true");
  // Pagefind renders its input asynchronously on first open.
  requestAnimationFrame(focusSearchInput);
}

export function initSearch() {
  if (!searchDialog) {
    return;
  }

  searchDialog.addEventListener("close", function () {
    searchTrigger?.setAttribute("aria-expanded", "false");
  });

  searchDialog.addEventListener("click", function (e) {
    // Clicks on the backdrop target the dialog element itself.
    if (e.target === searchDialog || e.target.closest("[data-close-search]")) {
      searchDialog.close();
    }
    if (e.target.closest(".pagefind-ui__search-clear")) {
      focusSearchInput();
    }
  });

  if (searchTrigger) {
    searchTrigger.setAttribute("aria-expanded", "false");
    searchTrigger.addEventListener("click", openSearch);
  }
}
