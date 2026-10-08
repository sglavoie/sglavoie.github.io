// A short message at the bottom of the screen confirming something done
// out of sight, like copying a link. Read out by screen readers too.
let toast = null;
let toastTimer = 0;

export function announce(message) {
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    document.body.appendChild(toast);
    // Screen readers only announce changes to a region already in place.
    requestAnimationFrame(function () {
      announce(message);
    });
    return;
  }
  toast.textContent = message;
  toast.dataset.visible = "";
  window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(function () {
    delete toast.dataset.visible;
  }, 1800);
}
