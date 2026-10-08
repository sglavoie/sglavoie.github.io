// Remembers how far into a post the reader got, in this browser only. Back
// on a post left half read, a prompt offers to jump to the section they were
// in; reaching the end of the post forgets it. The /offline/ page shows the
// same progress beside the posts it lists (offline.js).

const storageKey = "reading";
const maxEntries = 30;
// Less than this is a glance, not a start.
const minProgress = 0.05;
const promptDuration = 12000;

export function readProgress() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || {};
  } catch (e) {
    return {};
  }
}

function writeProgress(progress) {
  // Only the most recent entries.
  const kept = Object.entries(progress)
    .sort((a, b) => b[1].at - a[1].at)
    .slice(0, maxEntries);
  try {
    localStorage.setItem(storageKey, JSON.stringify(Object.fromEntries(kept)));
  } catch (e) {}
}

// The last heading scrolled past, and how far down the article the top of
// the screen is.
function position(article, headings) {
  const box = article.getBoundingClientRect();
  const fraction = Math.min(1, Math.max(0, -box.top / Math.max(1, box.height - window.innerHeight)));
  let heading = null;
  for (const candidate of headings) {
    // Where a jump to the heading puts it, below the sticky header.
    const offset = parseFloat(getComputedStyle(candidate).scrollMarginTop) || 0;
    if (candidate.getBoundingClientRect().top > offset + 1) {
      break;
    }
    heading = candidate;
  }
  return { fraction: fraction, heading: heading };
}

function offerToResume(saved, headings) {
  const heading = headings.find((candidate) => candidate.id === saved.section);
  if (!heading) {
    return;
  }
  const prompt = document.createElement("div");
  prompt.className = "resume-prompt";
  prompt.setAttribute("role", "region");
  prompt.setAttribute("aria-label", "Continue reading");
  const jump = document.createElement("a");
  jump.href = "#" + heading.id;
  jump.className = "resume-prompt__jump";
  jump.textContent = "Continue at “" + saved.title + "”";
  const close = document.createElement("button");
  close.type = "button";
  close.className = "resume-prompt__close";
  close.setAttribute("aria-label", "Dismiss");
  close.textContent = "×";
  prompt.append(jump, close);
  document.body.appendChild(prompt);
  requestAnimationFrame(() => (prompt.dataset.visible = ""));

  function dismiss() {
    delete prompt.dataset.visible;
    window.setTimeout(() => prompt.remove(), 400);
  }
  jump.addEventListener("click", dismiss);
  close.addEventListener("click", dismiss);
  window.setTimeout(dismiss, promptDuration);
}

export function initReadingPosition() {
  const article = document.querySelector("article.post-reading:not(.post-reading--page) .article_text");
  const end = document.querySelector(".post-footer");
  if (!article || !end) {
    return;
  }
  const page = location.pathname;
  const headings = Array.from(article.querySelectorAll(":is(h2, h3)[id]"));
  const saved = readProgress()[page];

  // Arriving at the top of a post left part way, not following a link to
  // one of its sections.
  if (saved && saved.section && !location.hash && window.scrollY < 100) {
    offerToResume(saved, headings);
  }

  let timer = 0;
  function save() {
    const progress = readProgress();
    const { fraction, heading } = position(article, headings);
    if (fraction < minProgress && !progress[page]) {
      return;
    }
    progress[page] = {
      title: heading ? heading.textContent.replace(/#$/, "").trim() : "",
      section: heading ? heading.id : "",
      fraction: Math.round(fraction * 100) / 100,
      at: Date.now(),
    };
    writeProgress(progress);
  }
  window.addEventListener(
    "scroll",
    function () {
      window.clearTimeout(timer);
      timer = window.setTimeout(save, 500);
    },
    { passive: true },
  );

  // The end of the post: nothing left to come back to.
  new IntersectionObserver(function (entries) {
    if (entries.some((entry) => entry.isIntersecting)) {
      window.clearTimeout(timer);
      const progress = readProgress();
      if (progress[page]) {
        delete progress[page];
        writeProgress(progress);
      }
    }
  }).observe(end);
}
