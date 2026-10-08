// The 404 page (notfound.html): names the missing path in the shell
// session and suggests posts whose words match it.

// A variable, so js.Build leaves the import to the browser: the index only
// exists once Pagefind has run on the built site.
const pagefindURL = "/pagefind/pagefind.js";

function linkItem(url, title) {
  const item = document.createElement("li");
  const link = document.createElement("a");
  link.href = url;
  link.textContent = title;
  item.appendChild(link);
  return item;
}

// Posts whose words match the missing path, from the Pagefind index:
// /posts/tmux-sesions/ looks for "tmux sesions", then for each word alone
// when no post has them all.
async function suggest(section) {
  let words = [];
  try {
    words = decodeURI(location.pathname)
      .toLowerCase()
      .split(/[^a-z0-9]+/)
      .filter((word) => word.length > 2 && !/^\d+$/.test(word))
      .filter((word) => !["posts", "html", "index", "tags", "categories"].includes(word));
  } catch (e) {}
  if (!words.length) {
    return;
  }
  try {
    const pagefind = await import(pagefindURL);
    let results = (await pagefind.search(words.join(" "))).results;
    if (!results.length) {
      const searches = await Promise.all(words.map((word) => pagefind.search(word)));
      const byURL = new Map();
      searches.flatMap((search) => search.results).forEach((result) => {
        const seen = byURL.get(result.id);
        byURL.set(result.id, seen ? { ...result, score: seen.score + result.score } : result);
      });
      results = [...byURL.values()].sort((a, b) => b.score - a.score);
    }
    const pages = await Promise.all(results.slice(0, 5).map((result) => result.data()));
    const list = section.querySelector("ul");
    pages.forEach((page) => list.appendChild(linkItem(page.url, page.meta.title)));
    section.hidden = !pages.length;
  } catch (e) {
    // No index (hugo server) or no network: the usual links remain.
  }
}

export function initNotFound() {
  const path = document.querySelector("[data-not-found-path]");
  if (!path) {
    return;
  }
  document.querySelector("[data-open-search]")?.addEventListener("click", function () {
    document.getElementById("search-trigger")?.click();
  });
  // /404.html itself, opened directly, has no missing path to show.
  if (location.pathname === "/404.html") {
    return;
  }
  try {
    path.textContent = decodeURI(location.pathname);
  } catch (e) {
    path.textContent = location.pathname;
  }
  const section = document.querySelector("[data-not-found-suggestions]");
  if (section) {
    suggest(section);
  }
}
