// On small screens the nav row scrolls sideways; mark which ends have links
// out of view so the CSS can fade them as a hint.
export function initNavFades() {
  const siteNav = document.querySelector(".site-nav");
  const siteNavList = siteNav?.querySelector(".site-nav__list");
  if (!siteNavList) {
    return;
  }
  function syncNavFades() {
    const max = siteNavList.scrollWidth - siteNavList.clientWidth;
    const more = [];
    if (siteNavList.scrollLeft > 1) more.push("start");
    if (siteNavList.scrollLeft < max - 1) more.push("end");
    siteNav.dataset.more = more.join(" ");
  }
  siteNavList.addEventListener("scroll", syncNavFades, { passive: true });
  window.addEventListener("resize", syncNavFades);
  syncNavFades();
}
