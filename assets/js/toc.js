// Highlights the table-of-contents entry for the section being read, and
// names it in the section bar on narrow screens (single.html), with the
// minutes left to read.
export function initTocScrollspy() {
  const links = Array.from(
    document.querySelectorAll('.post-reading__toc a[href^="#"]'),
  );
  if (!links.length || !("IntersectionObserver" in window)) {
    return;
  }

  const linkById = new Map();
  const headings = [];
  links.forEach(function (link) {
    const id = decodeURIComponent(link.getAttribute("href").slice(1));
    const heading = document.getElementById(id);
    if (heading) {
      linkById.set(id, link);
      headings.push(heading);
    }
  });

  const sidebar = document.querySelector(".post-reading__toc");
  const sectionBar = document.querySelector(".section-bar");
  const sectionBarText = sectionBar && sectionBar.querySelector(".section-bar__current");
  // The sticky header's height: a heading under it counts as passed.
  const headerOffset = 72;
  const visible = new Set();
  let current = null;

  // Opens the branch holding the link (its own subsections included) and
  // closes the rest; the sidebar CSS hides the subsections of closed ones.
  function openBranch(link) {
    sidebar.querySelectorAll(".toc li.is-open").forEach(function (li) {
      li.classList.remove("is-open");
    });
    for (let li = link && link.closest("li"); li; li = li.parentElement.closest("li")) {
      li.classList.add("is-open");
    }
  }

  // Keeps the link in view inside the sidebar without scrolling the page.
  function revealInSidebar(link) {
    if (sidebar.scrollHeight <= sidebar.clientHeight) {
      return;
    }
    const box = sidebar.getBoundingClientRect();
    const rect = link.getBoundingClientRect();
    const margin = 48;
    if (rect.top < box.top + margin) {
      sidebar.scrollTop -= box.top + margin - rect.top;
    } else if (rect.bottom > box.bottom - margin) {
      sidebar.scrollTop += rect.bottom - (box.bottom - margin);
    }
  }

  function setCurrent(link) {
    if (link === current) {
      return;
    }
    if (current) {
      current.classList.remove("is-active");
      current.removeAttribute("aria-current");
    }
    current = link;
    if (current) {
      current.classList.add("is-active");
      current.setAttribute("aria-current", "location");
    }
    openBranch(current);
    if (current) {
      revealInSidebar(current);
    }
    // Entries above the current one recede, so the outline shows how far
    // along the post is.
    let passed = Boolean(current);
    links.forEach(function (link) {
      if (link === current) {
        passed = false;
      }
      link.classList.toggle("is-passed", passed);
    });
    if (sectionBarText) {
      sectionBarText.textContent = current ? current.textContent : "";
    }
  }

  // The bar names the section being read, so it waits until the first
  // heading has gone under the header: above that, the title and the
  // table of contents are still on screen and say the same thing.
  function updateSectionBar() {
    if (!sectionBar) {
      return;
    }
    sectionBar.hidden =
      !current || headings[0].getBoundingClientRect().top > headerOffset;
  }

  // The post's reading time, by how far down the article the reader is.
  const article = document.querySelector(".article_text");
  const sectionBarLeft = sectionBar && sectionBar.querySelector(".section-bar__left");
  const minutes = sectionBar ? Number(sectionBar.dataset.readingMinutes) || 0 : 0;
  let leftFrame = 0;
  function updateTimeLeft() {
    leftFrame = 0;
    if (sectionBar.hidden) {
      return;
    }
    const box = article.getBoundingClientRect();
    const fraction = Math.min(1, Math.max(0, -box.top / Math.max(1, box.height - window.innerHeight)));
    const left = Math.ceil(minutes * (1 - fraction));
    sectionBarLeft.textContent = left > 0 ? left + " min left" : "";
  }
  if (sectionBarLeft && article && minutes) {
    window.addEventListener(
      "scroll",
      function () {
        leftFrame = leftFrame || requestAnimationFrame(updateTimeLeft);
      },
      { passive: true },
    );
  }

  // The bar leads to the table of contents, opened.
  if (sectionBar) {
    sectionBar.addEventListener("click", function () {
      const details = sidebar.querySelector(".toc-details");
      if (details) {
        details.open = true;
      }
    });
  }

  const observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          visible.add(entry.target);
        } else {
          visible.delete(entry.target);
        }
      });

      // Prefer the first heading in view; otherwise keep the last one passed.
      const inView = headings.find(function (h) {
        return visible.has(h);
      });
      if (inView) {
        setCurrent(linkById.get(inView.id));
      } else {
        // Headings in collapsed sections (sections.js) have no box.
        const passed = headings.filter(function (h) {
          return h.getClientRects().length && h.getBoundingClientRect().top <= headerOffset;
        });
        setCurrent(
          passed.length ? linkById.get(passed[passed.length - 1].id) : null,
        );
      }
      updateSectionBar();
    },
    { rootMargin: "-" + headerOffset + "px 0px -55% 0px" },
  );

  headings.forEach(function (h) {
    observer.observe(h);
  });
}
