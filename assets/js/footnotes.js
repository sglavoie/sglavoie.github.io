// Footnote previews: pointing at or focusing a footnote reference shows the
// note beside it, so reading it doesn't mean jumping to the end of the post
// and back. A click still jumps there.

const showDelay = 150;
const hideDelay = 250;
const margin = 16;

export function initFootnotes() {
  const refs = document.querySelectorAll(".article_text a.footnote-ref");
  if (!refs.length) {
    return;
  }
  const preview = document.createElement("div");
  preview.className = "footnote-preview";
  preview.id = "footnote-preview";
  preview.setAttribute("role", "tooltip");
  preview.hidden = true;
  document.body.appendChild(preview);

  let timer = 0;
  let current = null;

  function place(ref) {
    const box = ref.getBoundingClientRect();
    const width = preview.offsetWidth;
    const height = preview.offsetHeight;
    const left = Math.max(margin, Math.min(box.left + box.width / 2 - width / 2, window.innerWidth - width - margin));
    // Below the reference, or above it when that's where the room is.
    const below = box.bottom + 8;
    const top = below + height > window.innerHeight - margin && box.top - height - 8 > margin ? box.top - height - 8 : below;
    preview.style.left = left + window.scrollX + "px";
    preview.style.top = top + window.scrollY + "px";
  }

  function show(ref) {
    const note = document.getElementById(decodeURIComponent(ref.hash.slice(1)));
    if (!note) {
      return;
    }
    const content = note.cloneNode(true);
    content.querySelectorAll(".footnote-backref").forEach((backref) => backref.remove());
    content.querySelectorAll("[id]").forEach((element) => element.removeAttribute("id"));
    preview.replaceChildren(...content.childNodes);
    preview.hidden = false;
    current?.removeAttribute("aria-describedby");
    current = ref;
    ref.setAttribute("aria-describedby", preview.id);
    place(ref);
  }

  function hide() {
    preview.hidden = true;
    current?.removeAttribute("aria-describedby");
    current = null;
  }

  function later(action, delay) {
    window.clearTimeout(timer);
    timer = window.setTimeout(action, delay);
  }

  refs.forEach(function (ref) {
    ref.addEventListener("mouseenter", () => later(() => show(ref), showDelay));
    ref.addEventListener("mouseleave", () => later(hide, hideDelay));
    ref.addEventListener("focus", () => later(() => show(ref), 0));
    ref.addEventListener("blur", () => later(hide, 0));
    ref.addEventListener("click", hide);
  });
  // The reader can move onto the note, to select its text or follow a link.
  preview.addEventListener("mouseenter", () => window.clearTimeout(timer));
  preview.addEventListener("mouseleave", () => later(hide, hideDelay));
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && current) {
      hide();
    }
  });
  window.addEventListener("resize", hide);
}
