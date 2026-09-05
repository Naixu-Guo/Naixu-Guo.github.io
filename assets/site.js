const root = document.documentElement;
const toggle = document.querySelector("[data-theme-toggle]");

function preferredTheme() {
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

function setTheme(theme, persist = true) {
  root.dataset.theme = theme;
  if (persist) {
    try {
      localStorage.setItem("ng-theme", theme);
    } catch {
      /* storage unavailable */
    }
  }
  toggle?.setAttribute("aria-label", `Switch to ${theme === "dark" ? "light" : "dark"} theme`);
}

setTheme(root.dataset.theme || preferredTheme(), false);

toggle?.addEventListener("click", () => {
  setTheme(root.dataset.theme === "dark" ? "light" : "dark");
});

document.querySelector("[data-print]")?.addEventListener("click", () => window.print());
