// Applies the saved color theme and reading settings before the first
// paint (baseof.html), so the page doesn't change once shown. One variable
// per function: the page's minifier renames them again, and with more than
// one it can name them differently, which breaks the CSP hash of the script
// (build-validate.py catches that).
(function () {
  try {
    var theme = localStorage.getItem("theme");
    if (theme === "light" || theme === "dark") {
      document.documentElement.dataset.theme = theme;
    }
  } catch (e) {}
})();
// js/reading-settings.js
(function () {
  try {
    var reading = JSON.parse(localStorage.getItem("reading-settings") || "{}");
    if (/^(small|large|larger)$/.test(reading.size)) {
      document.documentElement.dataset.textSize = reading.size;
    }
    if (reading.font === "sans") {
      document.documentElement.dataset.readingFont = "sans";
    }
  } catch (e) {}
})();
