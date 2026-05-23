/* global React, TweaksPanel, useTweaks, TweakSection, TweakRadio, TweakColor, TweakSlider */
// Tweaks for the homepage — theme variants, accent hue, density, display font.
// These manipulate CSS variables on :root so all components respond live.

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "palette": "mono",
  "accentHue": 40,
  "density": "regular",
  "displayFont": "bodoni"
}/*EDITMODE-END*/;

const PALETTES = {
  warm: {
    paper: "#f4f0e8", paper2: "#ece6d8",
    ink: "#1a1814", ink2: "#3d3933",
    muted: "#6b665c", muted2: "#8f8a7e",
    hairline: "#d6cfbf", hairlineSoft: "#e3ddcd",
  },
  cool: {
    paper: "#f1f3f6", paper2: "#e6e9ef",
    ink: "#0f1419", ink2: "#2d343d",
    muted: "#5e6772", muted2: "#8a929c",
    hairline: "#c8cfd9", hairlineSoft: "#dfe3eb",
  },
  mono: {
    paper: "#f7f6f4", paper2: "#eeede9",
    ink: "#0a0a0a", ink2: "#2a2a2a",
    muted: "#666", muted2: "#999",
    hairline: "#d4d4d2", hairlineSoft: "#e6e5e2",
  },
};

const DENSITIES = {
  compact:  { gutter: "min(4vw, 48px)", section: "56px", hero: "60px 0 72px" },
  regular:  { gutter: "min(4vw, 56px)", section: "80px", hero: "80px 0 96px" },
  comfy:    { gutter: "min(4vw, 72px)", section: "108px", hero: "112px 0 128px" },
};

const DISPLAY_FONTS = {
  bodoni:   '"Bodoni Moda", Georgia, serif',
  inter:    '"Inter", -apple-system, system-ui, sans-serif',
  mono:     '"JetBrains Mono", ui-monospace, Menlo, monospace',
};

function applyTweaks(t) {
  const root = document.documentElement;
  const isDark = root.getAttribute("data-theme") === "dark"
    || (root.getAttribute("data-theme") !== "light" && window.matchMedia("(prefers-color-scheme: dark)").matches);

  // accent (works in both light + dark)
  const hue = t.accentHue;
  if (isDark) {
    root.style.setProperty("--accent", `oklch(0.74 0.13 ${hue})`);
    root.style.setProperty("--accent-soft", `oklch(0.74 0.13 ${hue} / 0.14)`);
    root.style.setProperty("--accent-ink", `oklch(0.82 0.12 ${hue})`);
  } else {
    root.style.setProperty("--accent", `oklch(0.55 0.12 ${hue})`);
    root.style.setProperty("--accent-soft", `oklch(0.55 0.12 ${hue} / 0.10)`);
    root.style.setProperty("--accent-ink", `oklch(0.42 0.10 ${hue})`);
  }

  // palette — only override in light; dark mode has its own
  if (!isDark) {
    const p = PALETTES[t.palette] || PALETTES.warm;
    root.style.setProperty("--paper", p.paper);
    root.style.setProperty("--paper-2", p.paper2);
    root.style.setProperty("--ink", p.ink);
    root.style.setProperty("--ink-2", p.ink2);
    root.style.setProperty("--muted", p.muted);
    root.style.setProperty("--muted-2", p.muted2);
    root.style.setProperty("--hairline", p.hairline);
    root.style.setProperty("--hairline-soft", p.hairlineSoft);
  } else {
    // remove overrides so dark defaults kick back in
    ["--paper","--paper-2","--ink","--ink-2","--muted","--muted-2","--hairline","--hairline-soft"]
      .forEach(k => root.style.removeProperty(k));
  }

  // density
  const d = DENSITIES[t.density] || DENSITIES.regular;
  root.style.setProperty("--gutter", d.gutter);

  // display font
  root.style.setProperty("--f-display", DISPLAY_FONTS[t.displayFont] || DISPLAY_FONTS.bodoni);
}

function TweaksApp() {
  const [t, setTweak] = useTweaks(TWEAK_DEFAULTS);
  React.useEffect(() => { applyTweaks(t); }, [t]);
  // re-apply when system or user toggles light/dark
  React.useEffect(() => {
    const mq = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = () => applyTweaks(t);
    mq.addEventListener("change", onChange);
    // also watch the data-theme attr
    const obs = new MutationObserver(onChange);
    obs.observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
    return () => { mq.removeEventListener("change", onChange); obs.disconnect(); };
  }, [t]);

  return (
    <TweaksPanel>
      <TweakSection label="Palette" />
      <TweakRadio label="Mood" value={t.palette} options={["warm", "cool", "mono"]}
        onChange={(v) => setTweak("palette", v)} />
      <TweakSlider label="Accent hue" value={t.accentHue} min={0} max={360} step={5}
        onChange={(v) => setTweak("accentHue", v)} />
      <TweakSection label="Composition" />
      <TweakRadio label="Density" value={t.density} options={["compact", "regular", "comfy"]}
        onChange={(v) => setTweak("density", v)} />
      <TweakSection label="Typography" />
      <TweakRadio label="Display" value={t.displayFont} options={["bodoni", "inter", "mono"]}
        onChange={(v) => setTweak("displayFont", v)} />
    </TweaksPanel>
  );
}

// mount into its own root so it doesn't interfere with the main app
const tweakDiv = document.createElement("div");
tweakDiv.id = "tweaks-root";
document.body.appendChild(tweakDiv);
ReactDOM.createRoot(tweakDiv).render(<TweaksApp />);
