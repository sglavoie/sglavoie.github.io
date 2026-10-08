// Link previews: pointing at or focusing a link to another post, in the
// text of a post or page, shows that post's title, description, date and
// reading time beside it, so the reader can tell whether to follow it. The
// details come from /posts/previews.json (_default/section.previews.json),
// fetched once, on the first link pointed at. A link to a section of a post
// also names the section, read from that post's page.
import { placeCard } from "./hover-card.js";

const showDelay = 350;
const hideDelay = 250;
const previewsURL = "/posts/previews.json";

const siteOrigin = new URL(document.querySelector('link[rel="canonical"]')?.href || location.href).origin;
let previews = null;
const sections = new Map();

function loadPreviews() {
  previews ??= fetch(previewsURL)
    .then((response) => (response.ok ? response.json() : {}))
    .catch(() => ({}));
  return previews;
}

// The heading a fragment lands on in a post, or "".
function sectionName(path, fragment) {
  const key = path + "#" + fragment;
  if (!sections.has(key)) {
    sections.set(
      key,
      fetch(path)
        .then((response) => (response.ok ? response.text() : ""))
        .then(function (html) {
          const page = new DOMParser().parseFromString(html, "text/html");
          const target = page.getElementById(fragment);
          const heading = target?.matches("h2, h3, h4, h5, h6") ? target : target?.closest("section")?.querySelector("h2, h3, h4");
          heading?.querySelectorAll(".heading-anchor").forEach((anchor) => anchor.remove());
          return heading?.textContent.trim() || "";
        })
        .catch(() => ""),
    );
  }
  return sections.get(key);
}

// The post a link leads to, as its path and fragment, or null for any
// other link (another site, this post, a file, a footnote).
function target(link) {
  if (link.matches(".footnote-ref, .footnote-backref, .heading-anchor")) {
    return null;
  }
  const url = new URL(link.href, location.href);
  // Links written with ref are absolute, to the site's own address.
  const own = url.origin === location.origin || url.origin === siteOrigin;
  if (!own || !url.pathname.startsWith("/posts/") || url.pathname === location.pathname) {
    return null;
  }
  return { path: url.pathname, fragment: decodeURIComponent(url.hash.slice(1)) };
}

function element(tag, className, text) {
  const node = document.createElement(tag);
  node.className = className;
  if (text) {
    node.textContent = text;
  }
  return node;
}

export function initLinkPreviews() {
  const links = Array.from(document.querySelectorAll(".article_text a[href]")).filter(target);
  if (!links.length || !window.matchMedia("(hover: hover)").matches) {
    return;
  }
  const card = element("div", "footnote-preview link-preview");
  card.id = "link-preview";
  card.setAttribute("role", "tooltip");
  card.hidden = true;
  document.body.appendChild(card);

  let timer = 0;
  let current = null;

  async function show(link) {
    const { path, fragment } = target(link);
    const post = (await loadPreviews())[path];
    // Gone elsewhere while the details loaded.
    if (!post || current !== link) {
      return;
    }
    const parts = [element("p", "link-preview__title", post.title)];
    if (fragment) {
      const section = element("p", "link-preview__section");
      parts.push(section);
      sectionName(path, fragment).then(function (name) {
        section.textContent = name ? "Section: " + name : "";
        if (!card.hidden) {
          placeCard(card, link);
        }
      });
    }
    if (post.description) {
      parts.push(element("p", "link-preview__description", post.description));
    }
    const meta = [post.category, post.date, post.minutes + " min read"].filter(Boolean).join(" · ");
    parts.push(element("p", "link-preview__meta", meta));
    card.replaceChildren(...parts);
    card.hidden = false;
    link.setAttribute("aria-describedby", card.id);
    placeCard(card, link);
  }

  function hide() {
    card.hidden = true;
    current?.removeAttribute("aria-describedby");
    current = null;
  }

  function later(action, delay) {
    window.clearTimeout(timer);
    timer = window.setTimeout(action, delay);
  }

  function enter(link, delay) {
    later(function () {
      current?.removeAttribute("aria-describedby");
      current = link;
      show(link);
    }, delay);
  }

  links.forEach(function (link) {
    link.addEventListener("mouseenter", () => enter(link, showDelay));
    link.addEventListener("mouseleave", () => later(hide, hideDelay));
    link.addEventListener("focus", () => enter(link, 0));
    link.addEventListener("blur", () => later(hide, 0));
    link.addEventListener("click", hide);
  });
  // The reader can move onto the card, to select its text.
  card.addEventListener("mouseenter", () => window.clearTimeout(timer));
  card.addEventListener("mouseleave", () => later(hide, hideDelay));
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && current) {
      hide();
    }
  });
  window.addEventListener("resize", hide);
}
