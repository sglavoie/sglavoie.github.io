// Theme toggle, and the theme choice in the display settings (header.html).
// The inline script in baseof.html applies a saved choice before first
// paint; this keeps it, the theme-color tags and the settings in step.

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

// The theme radio matching the theme in use: "auto" without an override.
function syncThemeChoice() {
  const value = document.documentElement.dataset.theme || "auto";
  const radio = document.querySelector(`#reading-settings input[name="theme"][value="${value}"]`);
  if (radio) {
    radio.checked = true;
  }
}

// "auto" follows the system appearance; "light" or "dark" pins one.
function setTheme(choice) {
  const followSystem = choice !== "light" && choice !== "dark";
  if (followSystem) {
    delete document.documentElement.dataset.theme;
  } else {
    document.documentElement.dataset.theme = choice;
  }
  syncThemeColor();
  syncThemeChoice();
  try {
    if (followSystem) {
      localStorage.removeItem("theme");
    } else {
      localStorage.setItem("theme", choice);
    }
  } catch (e) {}
}

export function toggleTheme() {
  const next = currentTheme() === "dark" ? "light" : "dark";
  // Landing on the system theme drops the override, so the site follows
  // the system appearance again.
  setTheme(next === systemTheme() ? "auto" : next);
}

export function initTheme() {
  syncThemeColor();
  syncThemeChoice();
  document.getElementById("theme-toggle")?.addEventListener("click", toggleTheme);
  const form = document.getElementById("reading-settings");
  form?.addEventListener("change", function (e) {
    if (e.target.name === "theme") {
      setTheme(e.target.value);
    }
  });
  // After the form has put its inputs back to their defaults.
  form?.addEventListener("reset", () => requestAnimationFrame(() => setTheme("auto")));
}
