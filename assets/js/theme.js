// Theme toggle. The inline script in baseof.html applies a saved choice
// before first paint; this keeps it, and the theme-color tags, in step.

const themeColors = { dark: "#090f15", light: "#fcfdfe" };

function systemTheme() {
  return window.matchMedia("(prefers-color-scheme: light)").matches
    ? "light"
    : "dark";
}

function currentTheme() {
  return document.documentElement.dataset.theme || systemTheme();
}

// With an explicit theme, both theme-color tags use its colour; otherwise
// each tag goes back to the colour matching its own media query.
function syncThemeColor() {
  const explicit = document.documentElement.dataset.theme;
  document.querySelectorAll('meta[name="theme-color"]').forEach(function (meta) {
    const own = (meta.getAttribute("media") || "").includes("light")
      ? "light"
      : "dark";
    meta.setAttribute("content", themeColors[explicit || own]);
  });
}

export function toggleTheme() {
  const next = currentTheme() === "dark" ? "light" : "dark";
  // Landing on the system theme drops the override, so the site follows
  // the system appearance again.
  const followSystem = next === systemTheme();
  if (followSystem) {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = next;
  }
  syncThemeColor();
  try {
    if (followSystem) {
      localStorage.removeItem("theme");
    } else {
      localStorage.setItem("theme", next);
    }
  } catch (e) {}
}

export function initTheme() {
  syncThemeColor();
  document.getElementById("theme-toggle")?.addEventListener("click", toggleTheme);
}
