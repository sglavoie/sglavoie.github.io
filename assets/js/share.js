// The share button at the end of a post (post-footer.html): the system
// share sheet where there is one (mostly phones), otherwise the post's
// address copied to the clipboard. With text selected in the post, the link
// leads to that passage.
import { selectionURL } from "./fragment.js";
import { announce } from "./toast.js";

export function initShare() {
  const button = document.querySelector("[data-share]");
  if (!button || !(navigator.share || navigator.clipboard)) {
    return;
  }
  button.parentElement.hidden = false;
  if (!navigator.share) {
    button.textContent = "Copy a link to this post";
  }
  // Pressing the button may clear the selection before the click.
  let passage = null;
  button.addEventListener("pointerdown", function () {
    passage = selectionURL(button.dataset.url);
  });
  button.addEventListener("click", function () {
    const url = passage || selectionURL(button.dataset.url);
    passage = null;
    const data = { title: button.dataset.title, url: url || button.dataset.url };
    if (navigator.share) {
      // Rejects when the reader closes the sheet; nothing to do then.
      navigator.share(data).catch(function () {});
      return;
    }
    navigator.clipboard.writeText(data.url).then(function () {
      announce(url ? "Link to the selected text copied" : "Link to this post copied");
    });
  });
}
