// Section links beside article headings (see render-heading.html): a click
// still jumps to the section, and also copies its address.
export function initHeadingLinks() {
  if (!navigator.clipboard) {
    return;
  }
  document.querySelectorAll(".heading-anchor").forEach(function (anchor) {
    anchor.addEventListener("click", function () {
      navigator.clipboard.writeText(anchor.href).then(function () {
        anchor.dataset.copied = "";
        window.setTimeout(function () {
          delete anchor.dataset.copied;
        }, 1600);
      });
    });
  });
}
