// The /random/ page (random.html) opens one of the posts it lists, other
// than the one the reader came from.
export function initRandomPost() {
  const list = document.querySelector("[data-random-posts]");
  if (!list) {
    return;
  }
  const from = document.referrer ? new URL(document.referrer).pathname : "";
  const links = Array.from(list.querySelectorAll("a")).filter(
    (link) => new URL(link.href).pathname !== from,
  );
  if (links.length) {
    // Replaced, so going back returns to where the reader pressed the keys.
    location.replace(links[Math.floor(Math.random() * links.length)].href);
  }
}
