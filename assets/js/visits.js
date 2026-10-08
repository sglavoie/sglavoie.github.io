// What the site had published at the reader's previous visit, in this
// browser only, so lists of posts can mark what's new since (initReadMarks).
// Every page names the newest post date and revision date of its build
// (data-newest-post and data-newest-revision on <html>, baseof.html): build
// dates rather than the reader's clock, so a post dated before it went live
// still counts as new to a reader who came in between.

const storageKey = "visits";
// Page views closer together than this are one visit.
const visitGap = 30 * 60 * 1000;

let previous = null;

function read() {
  try {
    return JSON.parse(localStorage.getItem(storageKey)) || null;
  } catch (e) {
    return null;
  }
}

function latest(a, b) {
  return (Date.parse(a) || 0) >= (Date.parse(b) || 0) ? a : b;
}

// Records this page view. A first visit has nothing to compare with, so it
// marks nothing new.
export function initVisits() {
  const root = document.documentElement;
  const page = {
    post: root.dataset.newestPost || "",
    revision: root.dataset.newestRevision || "",
  };
  if (!page.post) {
    return;
  }
  const saved = read();
  const now = Date.now();
  let state = { previous: null, seen: page, at: now };
  if (saved && saved.seen) {
    state.previous = now - saved.at > visitGap ? saved.seen : saved.previous;
    // A page saved for offline reading may come from an older build.
    state.seen = {
      post: latest(saved.seen.post, page.post),
      revision: latest(saved.seen.revision, page.revision),
    };
  }
  previous = state.previous;
  try {
    localStorage.setItem(storageKey, JSON.stringify(state));
  } catch (e) {}
}

// The newest post and revision dates seen at the previous visit, or null.
export function previousVisit() {
  return previous;
}
