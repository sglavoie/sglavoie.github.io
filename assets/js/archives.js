// Category chips on the archives page (archives.html): hide the posts of
// other categories and the years left empty, keep the counts in step, and
// mirror the choice in ?category=. A ?tag= from a tag page narrows the list
// further, until its chip is clicked away.
export function initArchivesFilter() {
  const filter = document.querySelector(".archives-filter");
  if (!filter) {
    return;
  }
  const chips = Array.from(filter.querySelectorAll(".archives-filter__chip[data-category]"));
  const tagChip = filter.querySelector(".archives-filter__tag");
  const tagTitles = JSON.parse(filter.dataset.tagTitles || "{}");
  const archives = document.querySelector(".archives");
  const years = Array.from(document.querySelectorAll(".archives-year"));
  const total = document.querySelector("[data-archives-total]");
  const plural = function (n) {
    return n + (n === 1 ? " post" : " posts");
  };
  let category = "";
  let tag = "";

  function apply() {
    let shown = 0;
    years.forEach(function (year) {
      let inYear = 0;
      year.querySelectorAll(".archives-article").forEach(function (row) {
        const match =
          (!category || row.dataset.category === category) &&
          (!tag || row.dataset.tags.split(" ").includes(tag));
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
    tagChip.hidden = !tag;
    if (tag) {
      tagChip.querySelector("[data-tag-title]").textContent = tagTitles[tag];
      tagChip.setAttribute("aria-label", "Tagged " + tagTitles[tag] + ", remove");
    }
    const url = new URL(window.location.href);
    for (const [name, value] of [
      ["category", category],
      ["tag", tag],
    ]) {
      if (value) {
        url.searchParams.set(name, value);
      } else {
        url.searchParams.delete(name);
      }
    }
    history.replaceState(null, "", url);
  }

  filter.addEventListener("click", function (e) {
    const chip = e.target.closest(".archives-filter__chip");
    if (!chip) {
      return;
    }
    if (chip !== tagChip) {
      category = chip.dataset.category;
      apply();
      return;
    }
    tag = "";
    apply();
    // The tag chip goes away under the pointer; keep the keyboard nearby.
    chips.find((other) => other.dataset.category === category).focus();
  });
  const params = new URLSearchParams(window.location.search);
  const wanted = params.get("category") || "";
  category = chips.some((chip) => chip.dataset.category === wanted) ? wanted : "";
  tag = Object.hasOwn(tagTitles, params.get("tag")) ? params.get("tag") : "";
  filter.hidden = false;
  apply();
}
