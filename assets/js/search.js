// Search dialog around Pagefind UI, plus category chips and a tag menu that
// filter the results. Posts carry their category and tags as Pagefind
// filters (single.html).

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

// The chips and the menu stand in for Pagefind's own filter panel (hidden in
// search.css): one category at a time, its chip pressed again to show every
// category, and one tag at a time.
function initFilters() {
  const filters = searchDialog.querySelector(".search-filters");
  if (!filters) {
    return;
  }
  const chips = Array.from(filters.querySelectorAll(".search-filters__chip"));
  const tagMenu = filters.querySelector(".search-filters__tag");
  let category = "";

  function apply() {
    const selected = {};
    if (category) {
      selected.category = [category];
    }
    if (tagMenu && tagMenu.value) {
      selected.tag = [tagMenu.value];
    }
    pagefindUI.triggerFilters(selected);
  }

  filters.addEventListener("click", function (e) {
    const chip = e.target.closest(".search-filters__chip");
    if (!chip) {
      return;
    }
    category = chip.getAttribute("aria-pressed") === "true" ? "" : chip.dataset.category;
    chips.forEach(function (other) {
      other.setAttribute("aria-pressed", String(other === chip && Boolean(category)));
    });
    apply();
    // Back to the query, without selecting it as opening the dialog does.
    searchDialog.querySelector("input")?.focus();
  });
  tagMenu?.addEventListener("change", apply);
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

  // The arrow keys move from the query down the results (sections of a
  // page included) to "Load more", and back up; Enter opens the one
  // focused, as with any link.
  const stops = ".pagefind-ui__search-input, .pagefind-ui__result-link, .pagefind-ui__button";
  searchDialog.addEventListener("keydown", function (e) {
    if ((e.key !== "ArrowDown" && e.key !== "ArrowUp") || !e.target.matches(stops)) {
      return;
    }
    const all = Array.from(searchDialog.querySelectorAll(stops)).filter(
      (stop) => stop.getClientRects().length,
    );
    const next = all[all.indexOf(e.target) + (e.key === "ArrowDown" ? 1 : -1)];
    if (next) {
      e.preventDefault();
      next.focus();
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
