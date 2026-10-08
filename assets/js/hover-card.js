// Places a card shown for a link (footnotes.js, link-previews.js) below it,
// or above it when that's where the room is, kept inside the window.

const margin = 16;

export function placeCard(card, anchor) {
  const box = anchor.getBoundingClientRect();
  const width = card.offsetWidth;
  const height = card.offsetHeight;
  const left = Math.max(margin, Math.min(box.left + box.width / 2 - width / 2, window.innerWidth - width - margin));
  const below = box.bottom + 8;
  const top = below + height > window.innerHeight - margin && box.top - height - 8 > margin ? box.top - height - 8 : below;
  card.style.left = left + window.scrollX + "px";
  card.style.top = top + window.scrollY + "px";
}
