// Registers the service worker that keeps pages for offline reading
// (static/sw.js). Not under `hugo server`, whose files aren't fingerprinted
// and change on every edit.
export function initOffline() {
  if (!("serviceWorker" in navigator) || location.port === "1313") {
    return;
  }
  const firstVisit = !navigator.serviceWorker.controller;
  navigator.serviceWorker
    .register("/sw.js")
    .then(function () {
      return navigator.serviceWorker.ready;
    })
    .then(function (registration) {
      if (!firstVisit) {
        return;
      }
      // This page loaded before the worker was in control: hand it the page
      // and the files it used, to save as if it had fetched them.
      registration.active?.postMessage({
        type: "save",
        page: location.href,
        assets: performance
          .getEntriesByType("resource")
          .map((entry) => entry.name)
          .filter((url) => new URL(url).origin === location.origin),
      });
    })
    .catch(function () {});
}
