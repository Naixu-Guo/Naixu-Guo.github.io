(function () {
  /*
   * Configurable constants live here so the hero can be re-tuned without
   * rewriting the animation loop. The system supports "spring", "gravity",
   * and "hybrid" models through window.HERO_BG_CONFIG.
   */
  const TAU = Math.PI * 2;
  const DEFAULTS = {
    enabled: true,
    physicalModel: "hybrid",
    maxDpr: 1.75,
    baseCurveCount: 5,
    baseParticleCount: 46,
    baseNodeCount: 5,
    curveSteps: 132,
    anchorStiffness: 0.0031,
    linkStiffness: 0.00145,
    corridorStiffness: 0.00082,
    damping: 0.93,
    nodeRepulsion: 6400,
    centerPull: 0.00045,
    gravityStrength: 760,
    tangentStrength: 0.14,
    particleDrag: 0.986,
    pointerParallax: 18,
    touchDriftRadius: 0.28,
    maxNodeSpeed: 1.8,
    maxParticleSpeed: 2.6
  };
  const mediaListeners = [];

  function readCssVariable(name, fallback) {
    const value = window.getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    return value || fallback;
  }

  function hexToRgb(hex) {
    const value = hex.replace("#", "").trim();
    if (value.length === 3) {
      return [
        parseInt(value.charAt(0) + value.charAt(0), 16),
        parseInt(value.charAt(1) + value.charAt(1), 16),
        parseInt(value.charAt(2) + value.charAt(2), 16)
      ];
    }

    return [
      parseInt(value.slice(0, 2), 16),
      parseInt(value.slice(2, 4), 16),
      parseInt(value.slice(4, 6), 16)
    ];
  }

  const PALETTE = [
    hexToRgb(readCssVariable("--hero-curve1", "#88c2d8")),
    hexToRgb(readCssVariable("--hero-curve2", "#9aa3ff")),
    hexToRgb(readCssVariable("--hero-curve3", "#d4cdff"))
  ];

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function lerp(start, end, amount) {
    return start + (end - start) * amount;
  }

  function random(min, max) {
    return min + Math.random() * (max - min);
  }

  function rgba(index, alpha) {
    const color = PALETTE[index % PALETTE.length];
    return "rgba(" + color[0] + ", " + color[1] + ", " + color[2] + ", " + alpha + ")";
  }

  function addMediaListener(query, handler) {
    if (query.addEventListener) {
      query.addEventListener("change", handler);
      mediaListeners.push(function () {
        query.removeEventListener("change", handler);
      });
    } else if (query.addListener) {
      query.addListener(handler);
      mediaListeners.push(function () {
        query.removeListener(handler);
      });
    }
  }

  class HeroField {
    constructor(stage, canvas, options) {
      this.stage = stage;
      this.canvas = canvas;
      this.ctx = canvas.getContext("2d");
      this.options = options;
      this.pointer = { x: 0, y: 0, targetX: 0, targetY: 0 };
      this.nodes = [];
      this.particles = [];
      this.curves = [];
      this.metrics = null;
      this.resizeObserver = null;
      this.frameId = 0;
      this.elapsed = 0;
      this.lastFrame = 0;
      this.modelMix = this.getModelMix(options.physicalModel);
      this.coarsePointerQuery = window.matchMedia("(pointer: coarse)");
      this.reduceMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      this.isCoarsePointer = this.coarsePointerQuery.matches;
      this.handlePointerMove = this.handlePointerMove.bind(this);
      this.handlePointerLeave = this.handlePointerLeave.bind(this);
      this.handleResize = this.handleResize.bind(this);
      this.handleMediaChange = this.handleMediaChange.bind(this);
      this.loop = this.loop.bind(this);
    }

    getModelMix(model) {
      if (model === "spring") {
        return { spring: 1, gravity: 0.18 };
      }
      if (model === "gravity") {
        return { spring: 0.16, gravity: 1 };
      }
      return { spring: 0.82, gravity: 0.72 };
    }

    mount() {
      this.stage.classList.remove("hero-stage--static");
      this.canvas.hidden = false;
      this.resize();

      this.stage.addEventListener("mousemove", this.handlePointerMove);
      this.stage.addEventListener("mouseleave", this.handlePointerLeave);
      window.addEventListener("resize", this.handleResize, { passive: true });

      if (typeof ResizeObserver !== "undefined") {
        this.resizeObserver = new ResizeObserver(this.handleResize);
        this.resizeObserver.observe(this.stage);
      }

      addMediaListener(this.coarsePointerQuery, this.handleMediaChange);
      addMediaListener(this.reduceMotionQuery, this.handleMediaChange);

      this.lastFrame = performance.now();
      this.frameId = window.requestAnimationFrame(this.loop);
    }

    destroy() {
      window.cancelAnimationFrame(this.frameId);
      this.stage.removeEventListener("mousemove", this.handlePointerMove);
      this.stage.removeEventListener("mouseleave", this.handlePointerLeave);
      window.removeEventListener("resize", this.handleResize);
      if (this.resizeObserver) {
        this.resizeObserver.disconnect();
      }
      while (mediaListeners.length) {
        const remove = mediaListeners.pop();
        remove();
      }
    }

    handleMediaChange() {
      if (this.reduceMotionQuery.matches) {
        window.cancelAnimationFrame(this.frameId);
        this.stage.classList.add("hero-stage--static");
        this.canvas.hidden = true;
        return;
      }

      this.isCoarsePointer = this.coarsePointerQuery.matches;
      this.stage.classList.remove("hero-stage--static");
      this.canvas.hidden = false;
      this.handleResize();
      this.lastFrame = performance.now();
      window.cancelAnimationFrame(this.frameId);
      this.frameId = window.requestAnimationFrame(this.loop);
    }

    handleResize() {
      this.resize();
    }

    handlePointerMove(event) {
      if (this.isCoarsePointer) {
        return;
      }

      const rect = this.stage.getBoundingClientRect();
      const localX = clamp((event.clientX - rect.left) / rect.width, 0, 1);
      const localY = clamp((event.clientY - rect.top) / rect.height, 0, 1);
      this.pointer.targetX = (localX - 0.5) * 2;
      this.pointer.targetY = (localY - 0.5) * 2;
    }

    handlePointerLeave() {
      if (this.isCoarsePointer) {
        return;
      }

      this.pointer.targetX = 0;
      this.pointer.targetY = 0;
    }

    resize() {
      const rect = this.stage.getBoundingClientRect();
      const width = Math.max(1, rect.width);
      const height = Math.max(1, rect.height);
      this.dpr = Math.min(window.devicePixelRatio || 1, this.options.maxDpr);
      this.width = width;
      this.height = height;
      this.canvas.width = Math.round(width * this.dpr);
      this.canvas.height = Math.round(height * this.dpr);
      this.metrics = this.computeMetrics(width, height);
      this.buildScene();
    }

    computeMetrics(width, height) {
      const minDimension = Math.min(width, height);
      const areaScale = clamp((width * height) / 520000, 0.72, 1.55);
      const isSmall = width < 640;

      return {
        isSmall: isSmall,
        curveCount: Math.max(4, Math.round(this.options.baseCurveCount * areaScale * (isSmall ? 0.78 : 1))),
        particleCount: Math.max(30, Math.round(this.options.baseParticleCount * areaScale * (isSmall ? 0.62 : 1))),
        nodeCount: Math.max(4, Math.round(this.options.baseNodeCount * (isSmall ? 0.86 : 1))),
        curveSteps: Math.round(this.options.curveSteps * (isSmall ? 0.7 : 1)),
        parallaxDistance: minDimension * 0.045 + this.options.pointerParallax,
        orbitRadius: minDimension * (isSmall ? 0.23 : 0.27),
        particleMargin: minDimension * 0.08 + 36,
        glowRadius: minDimension * 0.042
      };
    }

    buildScene() {
      this.nodes = this.createNodes(this.metrics.nodeCount);
      this.particles = this.createParticles(this.metrics.particleCount);
      this.curves = this.createCurves(this.metrics.curveCount);
    }

    createNodes(count) {
      const nodes = [];
      const centerX = this.width * 0.5;
      const centerY = this.height * 0.5;

      for (let index = 0; index < count; index += 1) {
        const angle = (index / count) * TAU - Math.PI * 0.5;
        const orbit = this.metrics.orbitRadius * random(0.82, 1.12);
        const x = centerX + Math.cos(angle) * orbit;
        const y = centerY + Math.sin(angle) * orbit * 0.7;
        nodes.push({
          baseAngle: angle,
          orbit: orbit,
          x: x,
          y: y,
          vx: random(-0.12, 0.12),
          vy: random(-0.12, 0.12),
          mass: random(0.9, 1.3),
          phase: random(0, TAU),
          drift: random(0.65, 1.15),
          radius: random(6, 11),
          palette: index % PALETTE.length,
          parallax: random(0.16, 0.32)
        });
      }

      return nodes;
    }

    createParticles(count) {
      const particles = [];

      for (let index = 0; index < count; index += 1) {
        particles.push({
          x: random(0, this.width),
          y: random(0, this.height),
          vx: random(-0.18, 0.18),
          vy: random(-0.18, 0.18),
          radius: random(0.95, 2.8),
          alpha: random(0.16, 0.42),
          palette: index % PALETTE.length,
          seed: Math.random(),
          orbitWeight: random(0.55, 1.25),
          anchor: index % this.nodes.length,
          nextSwap: random(1.6, 5.4)
        });
      }

      return particles;
    }

    createCurves(count) {
      const curves = [];

      for (let index = 0; index < count; index += 1) {
        curves.push({
          phase: random(0, TAU),
          turns: random(1.4, 3.1),
          speed: random(0.036, 0.085),
          spiralMix: random(0.48, 0.78),
          lissajousX: random(0.12, 0.26),
          lissajousY: random(0.14, 0.3),
          freqX: 2 + (index % 3),
          freqY: 3 + ((index + 1) % 4),
          alpha: random(0.075, 0.16),
          lineWidth: random(0.8, 1.5),
          parallax: random(0.22, 0.54),
          paletteOffset: index % PALETTE.length
        });
      }

      return curves;
    }

    updatePointer(time) {
      if (this.isCoarsePointer) {
        this.pointer.targetX = Math.cos(time * 0.24) * this.options.touchDriftRadius;
        this.pointer.targetY = Math.sin(time * 0.31) * this.options.touchDriftRadius * 0.72;
      }

      this.pointer.x = lerp(this.pointer.x, this.pointer.targetX, 0.06);
      this.pointer.y = lerp(this.pointer.y, this.pointer.targetY, 0.06);
    }

    updateNodes(time, delta) {
      const centerX = this.width * 0.5 + this.pointer.x * this.metrics.parallaxDistance * 0.4;
      const centerY = this.height * 0.5 + this.pointer.y * this.metrics.parallaxDistance * 0.3;

      /*
       * The node network is a simple spring system: every node is tethered to
       * a moving orbital anchor, then linked to its neighbors with elastic
       * connections. Repulsion keeps the graph from collapsing into a point.
       */
      for (let index = 0; index < this.nodes.length; index += 1) {
        const node = this.nodes[index];
        const targetAngle = node.baseAngle + time * 0.16 * node.drift;
        const targetRadius = node.orbit * (1 + Math.sin(time * 0.52 + node.phase) * 0.07);
        const anchorX = centerX + Math.cos(targetAngle) * targetRadius + this.pointer.x * this.metrics.parallaxDistance * node.parallax;
        const anchorY = centerY + Math.sin(targetAngle * 1.1 + node.phase * 0.2) * targetRadius * 0.72 + this.pointer.y * this.metrics.parallaxDistance * node.parallax;
        node.vx += (anchorX - node.x) * this.options.anchorStiffness * delta;
        node.vy += (anchorY - node.y) * this.options.anchorStiffness * delta;
      }

      for (let index = 0; index < this.nodes.length; index += 1) {
        const node = this.nodes[index];
        const next = this.nodes[(index + 1) % this.nodes.length];
        const nextNext = this.nodes[(index + 2) % this.nodes.length];
        this.applySpring(node, next, (node.orbit + next.orbit) * 0.58, this.options.linkStiffness * delta);
        this.applySpring(node, nextNext, (node.orbit + nextNext.orbit) * 0.9, this.options.linkStiffness * 0.34 * delta);
      }

      for (let index = 0; index < this.nodes.length; index += 1) {
        for (let nextIndex = index + 1; nextIndex < this.nodes.length; nextIndex += 1) {
          const node = this.nodes[index];
          const other = this.nodes[nextIndex];
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const distanceSq = dx * dx + dy * dy + 1;
          const force = (this.options.nodeRepulsion / distanceSq) * delta;
          node.vx -= dx * force * 0.004;
          node.vy -= dy * force * 0.004;
          other.vx += dx * force * 0.004;
          other.vy += dy * force * 0.004;
        }
      }

      for (let index = 0; index < this.nodes.length; index += 1) {
        const node = this.nodes[index];
        node.vx += (centerX - node.x) * this.options.centerPull * delta;
        node.vy += (centerY - node.y) * this.options.centerPull * delta;
        node.vx *= this.options.damping;
        node.vy *= this.options.damping;

        const speed = Math.hypot(node.vx, node.vy);
        if (speed > this.options.maxNodeSpeed) {
          const scale = this.options.maxNodeSpeed / speed;
          node.vx *= scale;
          node.vy *= scale;
        }

        node.x += node.vx;
        node.y += node.vy;
      }
    }

    applySpring(node, other, restLength, strength) {
      const dx = other.x - node.x;
      const dy = other.y - node.y;
      const distance = Math.max(1, Math.hypot(dx, dy));
      const force = (distance - restLength) * strength;
      const fx = (dx / distance) * force;
      const fy = (dy / distance) * force;
      node.vx += fx / node.mass;
      node.vy += fy / node.mass;
      other.vx -= fx / other.mass;
      other.vy -= fy / other.mass;
    }

    updateParticles(time, delta) {
      const centerX = this.width * 0.5 + this.pointer.x * this.metrics.parallaxDistance * 0.25;
      const centerY = this.height * 0.5 + this.pointer.y * this.metrics.parallaxDistance * 0.2;

      for (let index = 0; index < this.particles.length; index += 1) {
        const particle = this.particles[index];
        const anchor = this.nodes[particle.anchor % this.nodes.length];
        const neighbor = this.nodes[(particle.anchor + 1) % this.nodes.length];
        const corridorBias = 0.5 + Math.sin(time * 0.48 + particle.seed * TAU) * 0.5;
        const corridorX = lerp(anchor.x, neighbor.x, corridorBias);
        const corridorY = lerp(anchor.y, neighbor.y, corridorBias);

        const dxAnchor = anchor.x - particle.x;
        const dyAnchor = anchor.y - particle.y;
        const distAnchor = Math.max(12, Math.hypot(dxAnchor, dyAnchor));
        const invAnchor = 1 / distAnchor;
        const gravityPull = this.modelMix.gravity * this.options.gravityStrength * invAnchor * invAnchor * delta;
        const tangent = this.options.tangentStrength * particle.orbitWeight * delta;

        particle.vx += dxAnchor * invAnchor * gravityPull;
        particle.vy += dyAnchor * invAnchor * gravityPull;
        particle.vx += (-dyAnchor * invAnchor) * tangent;
        particle.vy += (dxAnchor * invAnchor) * tangent;

        particle.vx += (corridorX - particle.x) * this.options.corridorStiffness * this.modelMix.spring * delta;
        particle.vy += (corridorY - particle.y) * this.options.corridorStiffness * this.modelMix.spring * delta;

        const dxCenter = centerX - particle.x;
        const dyCenter = centerY - particle.y;
        particle.vx += dxCenter * this.options.centerPull * this.modelMix.gravity * 0.28 * delta;
        particle.vy += dyCenter * this.options.centerPull * this.modelMix.gravity * 0.28 * delta;

        particle.vx += Math.cos(time * 0.44 + particle.seed * 13) * 0.018 * delta;
        particle.vy += Math.sin(time * 0.38 + particle.seed * 11) * 0.016 * delta;

        particle.vx *= this.options.particleDrag;
        particle.vy *= this.options.particleDrag;

        const speed = Math.hypot(particle.vx, particle.vy);
        if (speed > this.options.maxParticleSpeed) {
          const scale = this.options.maxParticleSpeed / speed;
          particle.vx *= scale;
          particle.vy *= scale;
        }

        particle.x += particle.vx;
        particle.y += particle.vy;

        if (time > particle.nextSwap) {
          particle.anchor = (particle.anchor + 1) % this.nodes.length;
          particle.nextSwap = time + random(2.2, 5.4);
        }

        this.wrapParticle(particle);
      }
    }

    wrapParticle(particle) {
      const margin = this.metrics.particleMargin;

      if (particle.x < -margin) {
        particle.x = this.width + margin;
      } else if (particle.x > this.width + margin) {
        particle.x = -margin;
      }

      if (particle.y < -margin) {
        particle.y = this.height + margin;
      } else if (particle.y > this.height + margin) {
        particle.y = -margin;
      }
    }

    drawNodeLinks(ctx) {
      ctx.save();
      ctx.lineWidth = this.metrics.isSmall ? 0.8 : 1.1;
      ctx.globalCompositeOperation = "lighter";

      for (let index = 0; index < this.nodes.length; index += 1) {
        const node = this.nodes[index];
        const next = this.nodes[(index + 1) % this.nodes.length];
        const gradient = ctx.createLinearGradient(node.x, node.y, next.x, next.y);
        gradient.addColorStop(0, rgba(node.palette, 0.13));
        gradient.addColorStop(0.5, rgba((node.palette + 1) % PALETTE.length, 0.08));
        gradient.addColorStop(1, rgba(next.palette, 0.12));
        ctx.strokeStyle = gradient;
        ctx.beginPath();
        ctx.moveTo(node.x, node.y);
        ctx.lineTo(next.x, next.y);
        ctx.stroke();
      }

      ctx.restore();
    }

    drawCurves(ctx, time) {
      const centerX = this.width * 0.5 + this.pointer.x * this.metrics.parallaxDistance * 0.55;
      const centerY = this.height * 0.5 + this.pointer.y * this.metrics.parallaxDistance * 0.35;
      const baseRadius = this.metrics.orbitRadius * 1.35;

      ctx.save();
      ctx.globalCompositeOperation = "lighter";
      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      for (let index = 0; index < this.curves.length; index += 1) {
        const curve = this.curves[index];
        const points = [];

        for (let step = 0; step <= this.metrics.curveSteps; step += 1) {
          const progress = step / this.metrics.curveSteps;
          const theta = progress * TAU * curve.turns + time * curve.speed * TAU + curve.phase;
          const spiralRadius = baseRadius * curve.spiralMix * progress;

          /*
           * The path blends an Archimedean spiral r = a + bθ with a Lissajous
           * modulation x = A sin(k t + δ), y = B cos(k t). The spring nodes
           * then perturb the curve, so the background behaves like a coupled
           * physical system rather than a purely decorative orbit.
           */
          const spiralX = Math.cos(theta) * spiralRadius;
          const spiralY = Math.sin(theta) * spiralRadius * 0.82;
          const lissajousX = Math.sin(theta * curve.freqX + curve.phase) * baseRadius * curve.lissajousX;
          const lissajousY = Math.cos(theta * curve.freqY) * baseRadius * curve.lissajousY;
          const node = this.nodes[step % this.nodes.length];
          const next = this.nodes[(step + 1) % this.nodes.length];
          const x = centerX + spiralX + lissajousX + (node.x + next.x - this.width) * 0.09 + this.pointer.x * this.metrics.parallaxDistance * curve.parallax;
          const y = centerY + spiralY + lissajousY + (node.y + next.y - this.height) * 0.09 + this.pointer.y * this.metrics.parallaxDistance * curve.parallax;
          points.push({ x: x, y: y });
        }

        const start = points[0];
        const end = points[points.length - 1];
        const gradient = ctx.createLinearGradient(start.x, start.y, end.x, end.y);
        gradient.addColorStop(0, rgba(curve.paletteOffset, curve.alpha));
        gradient.addColorStop(0.5, rgba((curve.paletteOffset + 1) % PALETTE.length, curve.alpha * 1.18));
        gradient.addColorStop(1, rgba((curve.paletteOffset + 2) % PALETTE.length, curve.alpha * 0.92));

        ctx.strokeStyle = gradient;
        ctx.lineWidth = curve.lineWidth;
        ctx.beginPath();
        ctx.moveTo(points[0].x, points[0].y);
        for (let pointIndex = 1; pointIndex < points.length - 1; pointIndex += 1) {
          const point = points[pointIndex];
          const nextPoint = points[pointIndex + 1];
          const midX = (point.x + nextPoint.x) * 0.5;
          const midY = (point.y + nextPoint.y) * 0.5;
          ctx.quadraticCurveTo(point.x, point.y, midX, midY);
        }
        ctx.stroke();
      }

      ctx.restore();
    }

    drawNodes(ctx) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      for (let index = 0; index < this.nodes.length; index += 1) {
        const node = this.nodes[index];
        const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, this.metrics.glowRadius);
        glow.addColorStop(0, rgba(node.palette, 0.4));
        glow.addColorStop(0.45, rgba((node.palette + 1) % PALETTE.length, 0.12));
        glow.addColorStop(1, rgba(node.palette, 0));
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(node.x, node.y, this.metrics.glowRadius, 0, TAU);
        ctx.fill();

        ctx.fillStyle = rgba(node.palette, 0.5);
        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, TAU);
        ctx.fill();
      }

      ctx.restore();
    }

    drawParticles(ctx) {
      ctx.save();
      ctx.globalCompositeOperation = "lighter";

      for (let index = 0; index < this.particles.length; index += 1) {
        const particle = this.particles[index];
        const radius = particle.radius * 3.15;
        const gradient = ctx.createRadialGradient(particle.x, particle.y, 0, particle.x, particle.y, radius);
        gradient.addColorStop(0, rgba(particle.palette, clamp(particle.alpha + 0.22, 0, 0.8)));
        gradient.addColorStop(0.36, rgba((particle.palette + 1) % PALETTE.length, particle.alpha * 0.82));
        gradient.addColorStop(1, rgba((particle.palette + 2) % PALETTE.length, 0));
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, radius, 0, TAU);
        ctx.fill();
      }

      ctx.restore();
    }

    render(time) {
      const ctx = this.ctx;
      ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
      ctx.clearRect(0, 0, this.width, this.height);

      const ambient = ctx.createRadialGradient(
        this.width * 0.52 + this.pointer.x * this.metrics.parallaxDistance,
        this.height * 0.44 + this.pointer.y * this.metrics.parallaxDistance,
        0,
        this.width * 0.52,
        this.height * 0.44,
        Math.max(this.width, this.height) * 0.68
      );
      ambient.addColorStop(0, rgba(0, 0.05));
      ambient.addColorStop(0.45, rgba(1, 0.03));
      ambient.addColorStop(1, "rgba(10, 15, 41, 0)");
      ctx.fillStyle = ambient;
      ctx.fillRect(0, 0, this.width, this.height);

      this.drawNodeLinks(ctx);
      this.drawCurves(ctx, time);
      this.drawNodes(ctx);
      this.drawParticles(ctx);
    }

    loop(now) {
      if (this.reduceMotionQuery.matches) {
        this.stage.classList.add("hero-stage--static");
        this.canvas.hidden = true;
        return;
      }

      const delta = clamp((now - this.lastFrame) / 16.6667, 0.5, 1.8);
      this.lastFrame = now;
      this.elapsed = now * 0.001;

      this.updatePointer(this.elapsed);
      this.updateNodes(this.elapsed, delta);
      this.updateParticles(this.elapsed, delta);
      this.render(this.elapsed);

      this.frameId = window.requestAnimationFrame(this.loop);
    }
  }

  function initHeroBackground() {
    const stage = document.getElementById("hero-stage");
    const canvas = document.getElementById("hero-canvas");
    const options = Object.assign({}, DEFAULTS, window.HERO_BG_CONFIG || {});

    if (!stage) {
      return;
    }

    if (!canvas) {
      stage.classList.remove("hero-stage--static");
      return;
    }

    if (!options.enabled) {
      if (stage) {
        stage.classList.add("hero-stage--static");
      }
      if (canvas) {
        canvas.hidden = true;
      }
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (reducedMotion.matches) {
      stage.classList.add("hero-stage--static");
      canvas.hidden = true;
      return;
    }

    const heroField = new HeroField(stage, canvas, options);
    heroField.mount();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeroBackground, { once: true });
  } else {
    initHeroBackground();
  }
})();
