/* global React */
// Autonomous flow-field background.
// Particles follow a divergence-free velocity field derived from a
// slowly-drifting stream function ψ(x, y, t):
//   u =  ∂ψ/∂y,  v = -∂ψ/∂x
// When a particle leaves the box it reseeds on the opposite edge, so
// the population stays distributed and trails never collapse onto a
// single point. No pointer interaction — this is ambient by design.

const { useEffect, useRef } = React;

function Dynamics({ background = false }) {
  const wrapRef = useRef(null);
  const canvasRef = useRef(null);
  const stateRef = useRef({
    particles: [],
    width: 0, height: 0, dpr: 1,
    t: 0,
  });

  useEffect(() => {
    const wrap = wrapRef.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const st = stateRef.current;

    // ---- sizing ----
    const resize = () => {
      const rect = wrap.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      st.width = rect.width;
      st.height = rect.height;
      st.dpr = dpr;
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      // paint paper-colored base so trail-fading has something to blend onto
      const paper = getComputedStyle(document.documentElement).getPropertyValue("--paper").trim() || "#f4f0e8";
      ctx.fillStyle = paper;
      ctx.fillRect(0, 0, rect.width, rect.height);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(wrap);

    // ---- particles ----
    const N = background ? 80 : 140;
    const reseed = (p, edge = null) => {
      // life lets us cap streak length so trails don't accumulate forever
      p.life = 0;
      p.maxLife = 280 + Math.random() * 480;
      if (edge === null) {
        // initial — uniform random in the box
        p.x = Math.random();
        p.y = Math.random();
      } else {
        // seed on the opposite edge so flow continues smoothly
        if (edge === "left")   { p.x = 1.02; p.y = Math.random(); }
        if (edge === "right")  { p.x = -0.02; p.y = Math.random(); }
        if (edge === "top")    { p.y = 1.02; p.x = Math.random(); }
        if (edge === "bottom") { p.y = -0.02; p.x = Math.random(); }
        if (edge === "rand")   { p.x = Math.random(); p.y = Math.random(); }
      }
    };
    st.particles = Array.from({ length: N }, () => {
      const p = {};
      reseed(p);
      p.life = Math.random() * 200; // stagger initial lifespans
      return p;
    });

    // ---- velocity field ----
    // ψ(x, y, t) = sin(2πax + φa) cos(2πby + φb) + 0.6 sin(2πcy + φc) cos(2πdx + φd)
    // u =  ∂ψ/∂y,  v = -∂ψ/∂x
    // (a, b, c, d) are spatial frequencies; phases drift slowly with t.
    const A = 1.3, B = 1.7, C = 1.1, D = 1.9;
    const TWO_PI = Math.PI * 2;
    const velocity = (x, y, t) => {
      const phi_a = 0.12 * t;
      const phi_b = 0.09 * t + 1.1;
      const phi_c = 0.07 * t + 2.3;
      const phi_d = 0.10 * t + 0.4;

      // ψ = sin(2π A x + φa) cos(2π B y + φb) + 0.6 sin(2π C y + φc) cos(2π D x + φd)
      // u = ∂ψ/∂y = -2π B sin(2π A x + φa) sin(2π B y + φb)
      //              + 0.6 * 2π C cos(2π C y + φc) cos(2π D x + φd)
      // v = -∂ψ/∂x = -2π A cos(2π A x + φa) cos(2π B y + φb)
      //              + 0.6 * 2π D sin(2π C y + φc) sin(2π D x + φd)
      const sA = Math.sin(TWO_PI * A * x + phi_a);
      const cA = Math.cos(TWO_PI * A * x + phi_a);
      const sB = Math.sin(TWO_PI * B * y + phi_b);
      const cB = Math.cos(TWO_PI * B * y + phi_b);
      const sC = Math.sin(TWO_PI * C * y + phi_c);
      const cC = Math.cos(TWO_PI * C * y + phi_c);
      const sD = Math.sin(TWO_PI * D * x + phi_d);
      const cD = Math.cos(TWO_PI * D * x + phi_d);

      let u = -TWO_PI * B * sA * sB + 0.6 * TWO_PI * C * cC * cD;
      let v = -TWO_PI * A * cA * cB + 0.6 * TWO_PI * D * sC * sD;
      // tiny global drift so the field doesn't have zero-velocity nodes that trap particles
      u += 0.05;
      v += 0.02;
      return [u, v];
    };

    // ---- color helpers ----
    const cs = getComputedStyle(document.documentElement);
    const cssVar = (name) => cs.getPropertyValue(name).trim();
    const paperColor  = () => cssVar("--paper")  || "#f4f0e8";
    const inkColor    = () => cssVar("--ink")    || "#1a1814";
    const accentColor = () => cssVar("--accent") || "#a05a30";
    const mutedColor  = () => cssVar("--muted")  || "#6b665c";

    // hex → rgba helper for the fade-overlay
    const hexToRgba = (hex, a) => {
      let h = hex.trim();
      if (h.startsWith("#")) h = h.slice(1);
      if (h.length === 3) h = h.split("").map(c => c + c).join("");
      const r = parseInt(h.slice(0, 2), 16);
      const g = parseInt(h.slice(2, 4), 16);
      const b = parseInt(h.slice(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${a})`;
    };

    // ---- animation ----
    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    let raf = 0;
    let lastT = performance.now();

    const step = (now) => {
      const dt = Math.min(0.05, (now - lastT) / 1000);
      lastT = now;
      st.t += dt;

      const w = st.width, h = st.height;
      if (w === 0 || h === 0) {
        raf = requestAnimationFrame(step);
        return;
      }

      // CLEAR each frame — particles render as dots, not trails
      ctx.clearRect(0, 0, w, h);

      // STEP particles forward along the field
      const speedScale = background ? 0.0007 : 0.020;
      const accent = accentColor();
      const ink = inkColor();
      const muted = mutedColor();

      for (const p of st.particles) {
        const [u, v] = velocity(p.x, p.y, st.t);
        const nx = p.x + u * speedScale * dt * 60;
        const ny = p.y + v * speedScale * dt * 60;

        // pick stable per-particle color
        const colorPick = (p.tint = p.tint ?? Math.random());
        const color =
          colorPick < 0.12 ? accent :
          colorPick < 0.32 ? ink : muted;

        // stable per-particle size (set once)
        if (p.r === undefined) p.r = 1.0 + Math.random() * 1.6;

        // alpha eases in/out across lifetime so particles don't pop
        const lifeT = p.life / p.maxLife;
        const fade = lifeT < 0.15 ? lifeT / 0.15
                   : lifeT > 0.85 ? (1 - lifeT) / 0.15
                   : 1;
        const baseAlpha = background ? 0.55 : 0.8;

        ctx.fillStyle = color;
        ctx.globalAlpha = baseAlpha * fade;
        ctx.beginPath();
        ctx.arc(nx * w, ny * h, p.r, 0, Math.PI * 2);
        ctx.fill();

        p.x = nx;
        p.y = ny;
        p.life++;

        // reseed if out of bounds OR life expired (so trails refresh)
        if (p.x < -0.05 || p.x > 1.05 || p.y < -0.05 || p.y > 1.05) {
          // pick the opposite edge to keep flow continuous
          let edge = "rand";
          if (p.x > 1.05) edge = "right";
          else if (p.x < -0.05) edge = "left";
          else if (p.y > 1.05) edge = "top";
          else if (p.y < -0.05) edge = "bottom";
          reseed(p, edge);
        } else if (p.life > p.maxLife) {
          reseed(p, "rand");
        }
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(step);
    };

    if (!reducedMotion) {
      raf = requestAnimationFrame(step);
    } else {
      // single static frame — run a handful of update steps so trails materialise
      lastT = performance.now() - 16;
      for (let i = 0; i < 30; i++) {
        step(performance.now() + i * 16);
        cancelAnimationFrame(raf); // don't actually loop
      }
    }

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
    };
  }, [background]);

  return (
    <div className={background ? "dynamics dynamics--bg" : "dynamics"} ref={wrapRef} aria-hidden="true">
      <canvas ref={canvasRef} />
      {!background && (
        <React.Fragment>
          <div className="dynamics__label">Structured Dynamics</div>
          <div className="dynamics__hint">
            <span>flow field · stream function ψ(x, y, t)</span>
            <span>autonomous</span>
          </div>
        </React.Fragment>
      )}
    </div>
  );
}

window.Dynamics = Dynamics;
