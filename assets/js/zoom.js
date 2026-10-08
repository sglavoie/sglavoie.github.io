// Article images shown smaller than they are open full size in a dialog.
// Images already linked to their own file open there too, instead of
// leaving the page. The dialog shows the original file, not the WebP
// sized for the column (see responsive-images.html).

const imageFile = /\.(png|jpe?g|gif|webp|svg)$/i;

let dialog = null;
let zoomed = null;

function createDialog() {
  dialog = document.createElement("dialog");
  dialog.className = "zoom-dialog";
  dialog.setAttribute("aria-label", "Enlarged image");
  dialog.innerHTML =
    '<button type="button" class="search-dialog__close zoom-dialog__close" aria-label="Close image"><kbd>Esc</kbd></button>' +
    '<img class="zoom-dialog__image" alt="" />';
  zoomed = dialog.querySelector("img");
  // A click on the image switches between fitting the screen and its
  // actual size, when those differ; any other click closes.
  dialog.addEventListener("click", function (e) {
    if (e.target === zoomed && dialog.classList.contains("is-larger")) {
      dialog.classList.toggle("is-actual");
      return;
    }
    dialog.close();
  });
  zoomed.addEventListener("load", function () {
    dialog.classList.toggle(
      "is-larger",
      zoomed.naturalWidth > window.innerWidth || zoomed.naturalHeight > window.innerHeight,
    );
  });
  document.body.appendChild(dialog);
}

function open(src, alt) {
  if (!dialog) {
    createDialog();
  }
  dialog.classList.remove("is-larger", "is-actual");
  zoomed.src = src;
  zoomed.alt = alt;
  dialog.showModal();
}

// Shrunk by the column, so there's more to see; small images aren't.
function isShrunk(img) {
  return img.naturalWidth > img.clientWidth * 1.15;
}

function makeZoomable(img) {
  if (!isShrunk(img)) {
    return;
  }
  img.classList.add("is-zoomable");
  img.tabIndex = 0;
  img.setAttribute("role", "button");
  img.setAttribute("aria-label", "Enlarge image" + (img.alt ? ": " + img.alt : ""));
  function zoom() {
    open(img.getAttribute("src"), img.alt);
  }
  img.addEventListener("click", zoom);
  img.addEventListener("keydown", function (e) {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      zoom();
    }
  });
}

export function initZoom() {
  if (typeof HTMLDialogElement === "undefined") {
    return;
  }
  document.querySelectorAll(".article_text img").forEach(function (img) {
    const link = img.closest("a");
    if (link) {
      if (imageFile.test(new URL(link.href, location.href).pathname)) {
        img.classList.add("is-zoomable");
        link.addEventListener("click", function (e) {
          if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) {
            return;
          }
          e.preventDefault();
          open(link.href, img.alt);
        });
      }
      return;
    }
    if (img.complete) {
      makeZoomable(img);
    } else {
      img.addEventListener("load", function () {
        makeZoomable(img);
      }, { once: true });
    }
  });
}
