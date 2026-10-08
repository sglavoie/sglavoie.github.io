// The table of contents is collapsed above the article on narrow screens and
// kept open where it becomes the sticky sidebar (single.html). Inline, so the
// sidebar doesn't open after the first paint.
(function () {
  var details = document.currentScript.previousElementSibling;
  var sidebar = window.matchMedia("(min-width: 1280px)");
  function sync() {
    details.open = sidebar.matches;
  }
  sync();
  sidebar.addEventListener("change", sync);
})();
