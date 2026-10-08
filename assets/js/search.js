// Search dialog around Pagefind UI, plus category chips that filter the
// results. Posts carry their category as a Pagefind filter (single.html).

const searchTrigger = document.getElementById("search-trigger");
const searchDialog = document.getElementById("search-dialog");
let pagefindUI = null;
// Result links carry the search terms in this parameter; the page they open
// marks those terms (initHighlight).
const highlightParam = "highlight";

function focusSearchInput() {
  const searchInput = searchDialog.querySelector("input");
  if (searchInput) {
    searchInput.focus();
    searchInput.select();
  }
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
      showEmptyFilters: false,
      debounceTimeoutMs: 100,
      highlightParam: highlightParam,
    });
    initFilters();
  }
  searchDialog.showModal();
  searchTrigger?.setAttribute("aria-expanded", "true");
  // Pagefind renders its input asynchronously on first open.
  requestAnimationFrame(focusSearchInput);
}

// The chips stand in for Pagefind's own filter panel (hidden in search.css):
// one category at a time, pressed again to show every category.
function initFilters() {
  const filters = searchDialog.querySelector(".search-filters");
  if (!filters) {
    return;
  }
  const chips = Array.from(filters.querySelectorAll(".search-filters__chip"));
  filters.addEventListener("click", function (e) {
    const chip = e.target.closest(".search-filters__chip");
    if (!chip) {
      return;
    }
    const category = chip.getAttribute("aria-pressed") === "true" ? "" : chip.dataset.category;
    chips.forEach(function (other) {
      other.setAttribute("aria-pressed", String(other === chip && Boolean(category)));
    });
    pagefindUI.triggerFilters(category ? { category: [category] } : {});
    // Back to the query, without selecting it as opening the dialog does.
    searchDialog.querySelector("input")?.focus();
  });
  filters.hidden = false;
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

// Marks the search terms on a page opened from a result. Pagefind's
// highlighter is only fetched when there are terms to mark.
export function initHighlight() {
  if (!new URLSearchParams(location.search).has(highlightParam)) {
    return;
  }
  const script = document.createElement("script");
  script.type = "module";
  script.src = "/pagefind/pagefind-highlight.js";
  script.addEventListener("load", function () {
    if (typeof PagefindHighlight !== "undefined") {
      new PagefindHighlight({ highlightParam: highlightParam });
    }
  });
  document.head.appendChild(script);
}
