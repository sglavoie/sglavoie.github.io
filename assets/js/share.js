// The share button at the end of a post (post-footer.html): the system
// share sheet where there is one (mostly phones), otherwise the post's
// address copied to the clipboard.
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
  button.addEventListener("click", function () {
    const data = { title: button.dataset.title, url: button.dataset.url };
    if (navigator.share) {
      // Rejects when the reader closes the sheet; nothing to do then.
      navigator.share(data).catch(function () {});
      return;
    }
    navigator.clipboard.writeText(data.url).then(function () {
      announce("Link to this post copied");
    });
  });
}
