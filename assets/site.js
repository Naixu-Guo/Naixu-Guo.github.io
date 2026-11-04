const root = document.documentElement;
const picker = document.querySelector("[data-theme-picker]");
const mobileMenu = document.querySelector(".ink-menu");
const themeTrigger = picker?.querySelector(".theme-picker__trigger");
const themeOptions = picker?.querySelector(".theme-picker__options");
const inkTheme = document.querySelector("[data-ink-theme]");
const gameTheme = document.querySelector("[data-game-theme]");
// The build embeds this same manifest before first paint on every route.
// Legacy ng-theme values are not restored: older dark preferences meant Game.
const appearances = JSON.parse(document.getElementById("appearance-config").textContent);
const validTheme = (theme) => appearances.find(appearance => appearance.id === theme) || appearances[0];

function setTheme(theme, persist = true) {
  const appearance = validTheme(theme);
  theme = appearance.id;
  root.dataset.theme = theme;
  if (inkTheme) inkTheme.media = appearance.stylesheet === "ink" ? "all" : "not all";
  if (gameTheme) gameTheme.media = appearance.stylesheet === "base" ? "all" : "not all";
  document.querySelectorAll('meta[name="theme-color"]').forEach((meta) => {
    meta.content = appearance.color;
  });
  if (persist) {
    try {
      localStorage.setItem("ng-appearance", theme);
    } catch {
      /* storage unavailable */
    }
  }
  picker?.querySelectorAll('input[name="theme"]').forEach((input) => {
    input.checked = input.value === theme;
  });
  if (themeTrigger) {
    themeTrigger.querySelector("[data-theme-name]").textContent = appearance.name;
    themeTrigger.setAttribute("aria-label", `Appearance: ${appearance.name}`);
    themeTrigger.title = `Appearance: ${appearance.name}`;
  }
}

setTheme(root.dataset.theme, false);
if (picker) picker.hidden = false;

picker?.addEventListener("change", (event) => {
  if (event.target.matches('input[name="theme"]')) setTheme(event.target.value);
});

if (picker && themeTrigger && themeOptions) {
  const openPicker = () => {
    if (mobileMenu) mobileMenu.open = false;
    themeOptions.hidden = false;
    themeTrigger.setAttribute("aria-expanded", "true");
    themeOptions.querySelector("input:checked")?.focus({ preventScroll: true });
  };
  const closePicker = (restoreFocus = false) => {
    if (restoreFocus) themeTrigger.focus({ preventScroll: true });
    themeOptions.hidden = true;
    themeTrigger.setAttribute("aria-expanded", "false");
  };
  themeTrigger.addEventListener("click", () => {
    if (themeOptions.hidden) openPicker();
    else closePicker();
  });
  picker.addEventListener("focusout", (event) => {
    // A label click briefly clears focus before the associated radio receives it.
    if (event.relatedTarget && !picker.contains(event.relatedTarget)) closePicker();
  });
  picker.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      event.preventDefault();
      closePicker(true);
    } else if (event.target === themeTrigger && ["ArrowDown", "ArrowUp"].includes(event.key)) {
      event.preventDefault();
      openPicker();
    } else if (["Enter", " "].includes(event.key) && event.target.matches('input[name="theme"]')) {
      event.preventDefault();
      setTheme(event.target.value);
      closePicker(true);
    }
  });
  themeOptions.addEventListener("click", (event) => {
    const label = event.target.closest("label");
    if (label && !event.target.matches("input")) {
      event.preventDefault();
      setTheme(label.querySelector("input").value);
      closePicker(true);
    }
  });
  document.addEventListener("pointerdown", (event) => {
    if (!picker.contains(event.target)) closePicker();
  });
}

document.querySelector("[data-print]")?.addEventListener("click", () => window.print());

window.addEventListener("storage", (event) => {
  if (event.key !== "ng-appearance" && event.key !== null) return;
  setTheme(event.newValue, false);
});

// Optional, pointer-driven movement of the single landscape. No animation loop.
const motionButton = document.querySelector("[data-motion-toggle]");
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)");
const finePointer = matchMedia("(hover: hover) and (pointer: fine)");
let motionRequested = false;
try { motionRequested = localStorage.getItem("ng-motion") === "on"; } catch { /* optional storage */ }
function updateMotion() {
  const enabled = motionRequested && !reducedMotion.matches;
  root.dataset.motion = enabled ? "on" : "off";
  if (motionButton) {
    motionButton.hidden = false;
    motionButton.textContent = enabled ? "Motion on" : "Motion off";
    motionButton.setAttribute("aria-pressed", String(enabled));
    motionButton.disabled = reducedMotion.matches;
    motionButton.title = reducedMotion.matches ? "Motion is disabled by your system preference" : "Toggle subtle background movement";
  }
  root.style.removeProperty("--world-x");
  root.style.removeProperty("--world-y");
}
motionButton?.addEventListener("click", () => {
  motionRequested = !motionRequested;
  try { localStorage.setItem("ng-motion", motionRequested ? "on" : "off"); } catch { /* optional storage */ }
  updateMotion();
});
reducedMotion.addEventListener("change", updateMotion);
updateMotion();
document.addEventListener("pointermove", (event) => {
  if (!["ink", "black"].includes(root.dataset.theme) || root.dataset.motion !== "on" || !finePointer.matches) return;
  root.style.setProperty("--world-x", `${(event.clientX / innerWidth - .5) * -10}px`);
  root.style.setProperty("--world-y", `${(event.clientY / innerHeight - .5) * -6}px`);
}, { passive: true });
document.addEventListener("pointerleave", () => {
  root.style.removeProperty("--world-x");
  root.style.removeProperty("--world-y");
});
mobileMenu?.addEventListener("click", (event) => {
  if (event.target.closest("a")) mobileMenu.open = false;
});
mobileMenu?.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    event.preventDefault();
    mobileMenu.open = false;
    mobileMenu.querySelector("summary").focus({ preventScroll: true });
  }
});

// The two compact header controls share one open surface at a time.
mobileMenu?.addEventListener("toggle", () => {
  if (mobileMenu.open && themeOptions && themeTrigger) {
    themeOptions.hidden = true;
    themeTrigger.setAttribute("aria-expanded", "false");
  }
});
document.addEventListener("pointerdown", (event) => {
  if (mobileMenu?.open && !mobileMenu.contains(event.target)) mobileMenu.open = false;
});
mobileMenu?.addEventListener("focusout", (event) => {
  if (event.relatedTarget && !mobileMenu.contains(event.relatedTarget)) mobileMenu.open = false;
});

// Resolve contact details only after a visitor activates the Email control.
// Obfuscation reduces simple address scraping; it is not access control.
for (const button of document.querySelectorAll("[data-email]")) {
  button.addEventListener("click", () => {
    location.href = `mailto:${atob(button.dataset.email)}`;
  });
  button.hidden = false;
}
