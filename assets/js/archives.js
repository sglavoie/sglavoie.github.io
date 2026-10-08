// Category chips on the archives page (archives.html): hide the posts of
// other categories and the years left empty, keep the counts in step, and
// mirror the choice in ?category=.
export function initArchivesFilter() {
  const filter = document.querySelector(".archives-filter");
  if (!filter) {
    return;
  }
  const chips = Array.from(filter.querySelectorAll(".archives-filter__chip"));
  const archives = document.querySelector(".archives");
  const years = Array.from(document.querySelectorAll(".archives-year"));
  const total = document.querySelector("[data-archives-total]");
  const plural = function (n) {
    return n + (n === 1 ? " post" : " posts");
  };

  function apply(category) {
    const known = chips.some(function (chip) {
      return chip.dataset.category === category;
    });
    if (!known) {
      category = "";
    }
    let shown = 0;
    years.forEach(function (year) {
      let inYear = 0;
      year.querySelectorAll(".archives-article").forEach(function (row) {
        const match = !category || row.dataset.category === category;
        row.hidden = !match;
        if (match) inYear++;
      });
      year.hidden = inYear === 0;
      year.querySelector(".archives-year__count").textContent = plural(inYear);
      shown += inYear;
    });
    total.textContent = plural(shown);
    // One category shown: its name on every row says nothing new.
    archives.toggleAttribute("data-filtered", Boolean(category));
    chips.forEach(function (chip) {
      chip.setAttribute("aria-pressed", String(chip.dataset.category === category));
    });
    const url = new URL(window.location.href);
    if (category) {
      url.searchParams.set("category", category);
    } else {
      url.searchParams.delete("category");
    }
    history.replaceState(null, "", url);
  }

  filter.addEventListener("click", function (e) {
    const chip = e.target.closest(".archives-filter__chip");
    if (chip) {
      apply(chip.dataset.category);
    }
  });
  filter.hidden = false;
  apply(new URLSearchParams(window.location.search).get("category") || "");
}
