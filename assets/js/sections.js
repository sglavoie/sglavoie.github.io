// Long posts (data-collapsible on the article, single.html): a button
// beside each ## heading collapses its section, and one in the table of
// contents collapses or expands them all, leaving an outline to pick from.
// Sections start expanded, and a link to anything in a collapsed one
// expands it first. post.css hides them on screen only, so a printout has
// everything.

const minSections = 4;
const chevron =
  '<svg aria-hidden="true" focusable="false" width="0.8em" height="0.8em" viewBox="0 0 12 12"><path d="M2 4l4 4 4-4" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>';

let sections = [];

// Whether some of the article is collapsed: reading.js doesn't measure the
// reader's progress then.
export function isCollapsed() {
  return sections.some((section) => section.collapsed);
}

function setCollapsed(section, collapsed) {
  section.collapsed = collapsed;
  section.body.forEach(function (element) {
    if (collapsed) {
      element.dataset.collapsed = "";
    } else {
      delete element.dataset.collapsed;
    }
  });
  section.toggle.setAttribute("aria-expanded", String(!collapsed));
  section.toggle.setAttribute("aria-label", collapsed ? "Expand this section" : "Collapse this section");
}

// Changes the sections without moving the page under the reader: `heading`
// stays where it was, or comes to the top when it was above the screen.
function keepInPlace(heading, change) {
  const before = heading.getBoundingClientRect().top;
  change();
  if (before < 0) {
    heading.scrollIntoView({ block: "start", behavior: "instant" });
  } else {
    window.scrollBy({ top: heading.getBoundingClientRect().top - before, behavior: "instant" });
  }
}

// The section being read: the last heading at or above the top of the
// screen, below the sticky bars.
function current() {
  const passed = sections.filter(function (section) {
    const margin = parseFloat(getComputedStyle(section.heading).scrollMarginTop) || 0;
    return section.heading.getBoundingClientRect().top <= margin + 2;
  });
  return (passed[passed.length - 1] || sections[0]).heading;
}

// Expands the section holding the element with this id, if collapsed, and
// returns that element then.
function reveal(id) {
  const target = id && document.getElementById(id);
  const section =
    target &&
    sections.find((each) => each.collapsed && each.body.some((element) => element.contains(target)));
  if (!section) {
    return null;
  }
  setCollapsed(section, false);
  return target;
}

export function initSections() {
  const article = document.querySelector(".post-reading[data-collapsible] .article_text");
  const tocTop = document.querySelector(".post-reading__toc .toc-top");
  if (!article || !tocTop) {
    return;
  }
  // Each h2 with what follows it, up to the next h2 or the footnotes.
  let section = null;
  const found = [];
  Array.from(article.children).forEach(function (element) {
    if (element.matches("h2[id]")) {
      section = { heading: element, body: [], collapsed: false };
      found.push(section);
    } else if (element.matches(".footnotes")) {
      section = null;
    } else if (section) {
      section.body.push(element);
    }
  });
  sections = found.filter((candidate) => candidate.body.length);
  if (sections.length < minSections) {
    sections = [];
    return;
  }

  const all = document.createElement("button");
  all.type = "button";
  all.className = "toc-collapse";
  function updateAll() {
    all.textContent = isCollapsed() ? "Expand all sections" : "Collapse all sections";
  }
  all.addEventListener("click", function () {
    const collapse = !isCollapsed();
    keepInPlace(current(), function () {
      sections.forEach((each) => setCollapsed(each, collapse));
    });
    updateAll();
  });
  tocTop.before(all);
  updateAll();

  sections.forEach(function (each) {
    const toggle = document.createElement("button");
    toggle.type = "button";
    toggle.className = "section-toggle";
    toggle.innerHTML = chevron;
    toggle.addEventListener("click", function () {
      keepInPlace(each.heading, () => setCollapsed(each, !each.collapsed));
      updateAll();
    });
    each.toggle = toggle;
    each.heading.append(toggle);
    setCollapsed(each, false);
  });

  // Same-page links (the table of contents, footnotes, "Continue at...")
  // expand their target's section before the browser scrolls to it.
  document.addEventListener(
    "click",
    function (e) {
      const link = e.target.closest && e.target.closest('a[href*="#"]');
      if (!link) {
        return;
      }
      const url = new URL(link.href);
      if (url.pathname === location.pathname && url.hash) {
        reveal(decodeURIComponent(url.hash.slice(1)));
        updateAll();
      }
    },
    true,
  );
  // Back and forward: the browser has already tried to scroll there.
  window.addEventListener("hashchange", function () {
    const target = reveal(decodeURIComponent(location.hash.slice(1)));
    if (target) {
      updateAll();
      target.scrollIntoView();
    }
  });
}
