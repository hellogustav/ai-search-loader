import React, { useEffect, useRef } from "react";

/**
 * NeonInfinityTracer (V6)
 * Canvas-based neon energy tracer following your exact path.
 *
 * Key features:
 * - Electric violet neon with HDR-like bloom (multi-pass, additive)
 * - Trail persistence covers ~40% of the path (tunable), fades exponentially
 * - Width shrinks as intensity falls (bloom radius bound to intensity)
 * - Variable velocity from curvature (slows on tight turns, whips on straights)
 * - Secondary ambient scatter following the head
 * - Additive blending at crossovers (hotspots)
 * - Subtle background noise + faint static path trace
 *
 * Safe to drop into React/TS. No external libs.
 */

type GlowAnimationV6Props = {
  size?: number;         // CSS px canvas size (square)  | default 220
  tailFraction?: number; // 0.3–0.5 recommended          | default 0.42
  speedMin?: number;     // min path units/sec (curves)  | default 55
  speedMax?: number;     // max path units/sec (straights)| default 180
  className?: string;
  background?: "black" | "transparent"; // draw near-black bg (with noise) | default "black"
  showStaticTrace?: boolean;            // faint gray path                   | default true
  hue?: string;         // main neon hue (electric violet)                  | default "#7A4CFF"
};

const PATH_D = `
M70.3853 148.98
C179.5 142.5 166.347 -3.95972 71.4235 1.02014
C-23.5 6 -21.9998 141.5 70.3853 148.98
C158 143.777 73.5 90 73.5 90
C36.5 62.5 51.1843 30 73.5 30
C95.8156 30 116.056 59.9065 73.5 90
C29 126 37.0001 131.5 42.5766 139.206
C47 142.5 55.9799 148.811 70.3853 148.98
`;

const GlowAnimationV6: React.FC<GlowAnimationV6Props> = ({
  size = 220,
  tailFraction = 0.42,
  speedMin = 55,
  speedMax = 180,
  className,
  background = "black",
  showStaticTrace = true,
  hue = "#7A4CFF",
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const pathRef = useRef<SVGPathElement | null>(null);
  const gWrapRef = useRef<SVGGElement | null>(null);

  // Build an offscreen <svg> so we can use native path sampling (length/points)
  useEffect(() => {
    const svgNS = "http://www.w3.org/2000/svg";
    const svg = document.createElementNS(svgNS, "svg");
    svg.setAttribute("viewBox", "0 0 162 162");
    svg.style.position = "absolute";
    svg.style.width = "0";
    svg.style.height = "0";
    svg.style.pointerEvents = "none";

    const g1 = document.createElementNS(svgNS, "g");
    g1.setAttribute("transform", "translate(80.9,80.87) scale(0.92) translate(-80.9,-80.87)");

    const g2 = document.createElementNS(svgNS, "g");
    g2.setAttribute("transform", "scale(1.094594595, 1.08)");

    const path = document.createElementNS(svgNS, "path");
    path.setAttribute("d", PATH_D);
    // Important: keep stroke off; we only need geometry
    path.setAttribute("fill", "none");

    g2.appendChild(path);
    g1.appendChild(g2);
    svg.appendChild(g1);
    document.body.appendChild(svg);

    pathRef.current = path;
    gWrapRef.current = g1;

    return () => {
      document.body.removeChild(svg);
      pathRef.current = null;
      gWrapRef.current = null;
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const pathEl = pathRef.current;
    if (!canvas || !pathEl) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Device-pixel-ratio scaling for crispness
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1)); // cap at 2 for perf
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // We render in viewBox coordinates (0..162), so compute scale to fit
    const viewSize = 162;
    const scale = size / viewSize;
    // Centered letterbox in case size != 162 ratio (kept square)
    ctx.translate(0, 0);
    ctx.scale(scale, scale);

    // Pre-sample path geometry, curvature & arc-length mapping
    const totalLen = pathEl.getTotalLength();
    const samples = 700; // optimized for performance while maintaining smoothness
    const pts = new Array(samples).fill(0).map((_, i) => {
      const s = (i / (samples - 1)) * totalLen;
      const p = pathEl.getPointAtLength(s);
      return { s, x: p.x, y: p.y };
    });

    // Finite-difference curvature estimate
    const deriv = (arr: typeof pts, i: number) => {
      const i0 = Math.max(0, i - 1);
      const i1 = Math.min(samples - 1, i + 1);
      const p0 = arr[i0];
      const p1 = arr[i1];
      return { dx: (p1.x - p0.x) / (p1.s - p0.s || 1), dy: (p1.y - p0.y) / (p1.s - p0.s || 1) };
    };
    const second = (arr: typeof pts, i: number) => {
      const im = Math.max(0, i - 1);
      const ip = Math.min(samples - 1, i + 1);
      const dm = deriv(arr, im);
      const dp = deriv(arr, ip);
      return { ddx: (dp.dx - dm.dx) / (pts[ip].s - pts[im].s || 1), ddy: (dp.dy - dm.dy) / (pts[ip].s - pts[im].s || 1) };
    };

    const curvature = pts.map((_, i) => {
      const { dx, dy } = deriv(pts, i);
      const { ddx, ddy } = second(pts, i);
      const num = Math.abs(dx * ddy - dy * ddx);
      const den = Math.pow(dx * dx + dy * dy, 1.5) || 1;
      return num / den;
    });

    // Normalize curvature robustly (use 95th percentile to avoid spikes)
    const sorted = [...curvature].sort((a, b) => a - b);
    const k95 = sorted[Math.floor(sorted.length * 0.95)] || 1;
    const normK = curvature.map(k => Math.min(1, k / k95));

    // Map s -> speed using curvature (higher curvature => lower speed)
    // Speed is in "path units per second"
    const speedAtS = (s: number) => {
      // find nearest sample index
      const idx = Math.floor((s / totalLen) * (samples - 1));
      const k = normK[idx] ?? 0;
      const t = Math.pow(1 - k, 0.55);         // ease response curve
      return speedMin + (speedMax - speedMin) * t;
    };

    // Trail control
    const tailLen = totalLen * tailFraction;  // portion of the path kept
    const step = 2.8;                         // draw step in path units (optimized)
    const fadeExp = 1.9;                      // intensity falloff exponent
    const baseCoreR = 1.6;                    // white-hot core radius
    const baseHaloR = 4.6;                    // violet halo near head
    const maxBloom = 12.0;                    // widest bloom near head

    // Colors
    const violet = hue;                        // e.g. "#7A4CFF"
    const white = "rgba(255,255,255,1)";

    // Noise (once)
    const noiseCanvas = document.createElement("canvas");
    const noiseCtx = noiseCanvas.getContext("2d")!;
    const noiseSize = 128;
    noiseCanvas.width = noiseCanvas.height = noiseSize;
    const noiseImg = noiseCtx.createImageData(noiseSize, noiseSize);
    for (let i = 0; i < noiseImg.data.length; i += 4) {
      const n = 32 + Math.random() * 32;  // 32..64 gray
      noiseImg.data[i] = noiseImg.data[i + 1] = noiseImg.data[i + 2] = n;
      noiseImg.data[i + 3] = 255;
    }
    noiseCtx.putImageData(noiseImg, 0, 0);

    // Helper: point at length with wrap
    const P = (s: number) => {
      let t = s % totalLen;
      if (t < 0) t += totalLen;
      const p = pathEl.getPointAtLength(t);
      return { x: p.x, y: p.y };
    };

    // For static trace render a polyline once
    const drawStaticTrace = () => {
      if (!showStaticTrace) return;
      ctx.save();
      ctx.globalCompositeOperation = "source-over";
      ctx.strokeStyle = "rgba(160,170,190,0.12)";
      ctx.lineWidth = 0.9;
      ctx.lineCap = "round";
      ctx.beginPath();
      // Draw every other point for performance (still smooth enough)
      for (let i = 0; i < samples; i += 2) {
        const p = pts[i];
        if (i === 0) ctx.moveTo(p.x, p.y);
        else ctx.lineTo(p.x, p.y);
      }
      ctx.stroke();
      ctx.restore();
    };

    let running = true;
    let lastTime = performance.now();
    let sHead = 0; // current arc length along path

    const render = (now: number) => {
      if (!running) return;
      const dt = Math.min(0.05, (now - lastTime) / 1000); // seconds, clamp for tab-switch spikes
      lastTime = now;

      // Advance head with curvature-aware speed
      const v = speedAtS(sHead);
      sHead = (sHead + v * dt) % totalLen;

      // Clear / background
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.setTransform(dpr * scale, 0, 0, dpr * scale, 0, 0);

      if (background === "black") {
        // Near-black with subtle vignette
        const bg = ctx.createRadialGradient(81, 81, 10, 81, 81, 95);
        bg.addColorStop(0, "rgba(0,0,0,1)");
        bg.addColorStop(1, "rgba(0,0,0,1)");
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, viewSize, viewSize);

        // very subtle noise
        ctx.globalAlpha = 0.035;
        ctx.globalCompositeOperation = "source-over";
        for (let y = 0; y < viewSize; y += noiseSize) {
          for (let x = 0; x < viewSize; x += noiseSize) {
            ctx.drawImage(noiseCanvas, x, y, noiseSize, noiseSize);
          }
        }
        ctx.globalAlpha = 1;
      }

      // Static faint trace
      drawStaticTrace();

      // Additive blending for neon accumulation
      ctx.globalCompositeOperation = "lighter";

      // Draw trail from head backwards up to tailLen
      // Intensity and radius decay with distance (exponential)
      const drawTrail = () => {
        // render from far tail -> near head so near-head stays dominant
        for (let d = tailLen; d >= 0; d -= step) {
          const t = d / tailLen;                       // 0..1
          const intensity = Math.pow(1 - t, fadeExp); // nonlinear decay

          // Skip very low intensity segments (performance optimization)
          if (intensity < 0.05) continue;

          // Width dynamics: radius shrinks with intensity (HDR feel)
          const bloomR = maxBloom * (0.3 + 0.7 * intensity);
          const haloR = baseHaloR * (0.6 + 0.8 * intensity);
          const coreR = baseCoreR * (0.7 + 0.6 * intensity);

          const { x, y } = P(sHead - d);

          // Wide violet bloom
          ctx.shadowBlur = bloomR;
          ctx.shadowColor = hue;
          ctx.fillStyle = `rgba(124, 76, 255, ${0.08 + 0.35 * intensity})`;
          ctx.beginPath();
          ctx.arc(x, y, Math.max(0.8, haloR), 0, Math.PI * 2);
          ctx.fill();

          // Inner halo (saturated violet)
          ctx.shadowBlur = haloR;
          ctx.shadowColor = hue;
          ctx.fillStyle = `rgba(124, 76, 255, ${0.18 + 0.42 * intensity})`;
          ctx.beginPath();
          ctx.arc(x, y, Math.max(0.6, haloR * 0.8), 0, Math.PI * 2);
          ctx.fill();

          // Core (white, tiny) - only render for higher intensity
          if (intensity > 0.2) {
            ctx.shadowBlur = coreR * 0.75;
            ctx.shadowColor = "#FFFFFF";
            ctx.fillStyle = `rgba(255,255,255, ${0.25 + 0.6 * intensity})`;
            ctx.beginPath();
            ctx.arc(x, y, coreR, 0, Math.PI * 2);
            ctx.fill();
          }
        }
      };

      drawTrail();

      // Comet head (brighter + secondary ambient scatter)
      const H = P(sHead);
      // secondary ambient scattering "patch"
      ctx.shadowBlur = 0;
      ctx.globalAlpha = 1;
      ctx.fillStyle = `rgba(124,76,255,0.18)`;
      ctx.beginPath();
      ctx.arc(H.x, H.y, 22, 0, Math.PI * 2);
      ctx.fill();

      // head halo (strong)
      ctx.shadowBlur = 18;
      ctx.shadowColor = hue;
      ctx.fillStyle = "rgba(124,76,255,0.85)";
      ctx.beginPath();
      ctx.arc(H.x, H.y, 5.6, 0, Math.PI * 2);
      ctx.fill();

      // head white-hot core with shimmer
      const shimmer = 0.9 + 0.1 * Math.sin(now * 0.012);
      ctx.shadowBlur = 7.5;
      ctx.shadowColor = "#FFFFFF";
      ctx.fillStyle = "rgba(255,255,255,1)";
      ctx.beginPath();
      ctx.arc(H.x, H.y, 2.5 * shimmer, 0, Math.PI * 2);
      ctx.fill();

      // Optional: very faint overall violet bloom following head (big radius)
      ctx.shadowBlur = 36;
      ctx.shadowColor = hue;
      ctx.fillStyle = "rgba(124,76,255,0.06)";
      ctx.beginPath();
      ctx.arc(H.x, H.y, 16, 0, Math.PI * 2);
      ctx.fill();

      requestAnimationFrame(render);
    };

    let raf = requestAnimationFrame((t) => {
      lastTime = t;
      raf = requestAnimationFrame(render);
    });

    // Pause on reduced motion
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const stop = () => (running = false);
    if (mq.matches) stop();

    return () => {
      running = false;
      cancelAnimationFrame(raf);
    };
  }, [size, tailFraction, speedMin, speedMax, background, showStaticTrace, hue]);

  return (
    <div
      className={className}
      style={{
        position: "relative",
        width: size,
        height: size,
        // Screen blend against whatever is behind, for extra HDR punch (optional)
        mixBlendMode: "screen",
      }}
      aria-label="Loading"
      role="img"
    >
      <canvas ref={canvasRef} />
    </div>
  );
};

export default GlowAnimationV6;
