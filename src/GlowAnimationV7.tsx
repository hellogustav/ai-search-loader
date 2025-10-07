import React, { useEffect, useRef, useMemo } from "react";
import './GlowAnimationV7.css';

/**
 * GlowAnimationV7 - Production-ready neon trail animation
 *
 * Lightweight, standalone component with minimal dependencies.
 * Based on V1.1 trail-only version, optimized for production use.
 *
 * @component
 * @param {number} [duration=2.24] - Animation duration in seconds (0.5-10s)
 * @param {boolean} [reverse=false] - Run animation in reverse direction
 * @param {string} [ariaLabel] - Accessibility label for screen readers
 * @returns {React.FC} Animated neon trail component
 */

interface TrailSegment {
  x: number;
  y: number;
  intensity: number;
  color: { r: number; g: number; b: number };
}

interface PathPoint {
  x: number;
  y: number;
  color: { r: number; g: number; b: number };
}

type GlowAnimationV7Props = {
  duration?: number; // Animation duration in seconds (0.5-10s)
  reverse?: boolean; // Run animation in reverse direction
  ariaLabel?: string; // Accessibility label
};

const GlowAnimationV7: React.FC<GlowAnimationV7Props> = ({
  duration = 2.24, // 20% faster (2.8 * 0.8)
  reverse = false,
  ariaLabel = "Animated neon trail loading indicator"
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const pathRef = useRef<SVGPathElement>(null);
  const isReducedMotion = useRef<boolean>(false);

  // Validate props
  const validatedDuration = useMemo(() => {
    const d = Number(duration);
    if (isNaN(d) || d < 0.5) return 0.5;
    if (d > 10) return 10;
    return d;
  }, [duration]);

  useEffect(() => {
    // Check for reduced motion preference
    if (window.matchMedia) {
      const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
      isReducedMotion.current = mediaQuery.matches;
    }

    // Check browser support
    if (!canvasRef.current || !pathRef.current) return;
    if (!window.requestAnimationFrame) {
      console.warn('GlowAnimationV7: requestAnimationFrame not supported');
      return;
    }

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      console.warn('GlowAnimationV7: Canvas 2D context not supported');
      return;
    }

    try {
      const routePath = pathRef.current;
      const pathLength = routePath.getTotalLength();

      // Setup canvas - 140x140 with 120x120 content centered
      canvas.width = 140;
      canvas.height = 140;

      // Constants (hard-coded from V1.1 optimized values, adjusted for smaller size)
      const samples = 350; // Optimized for balance between performance and smoothness
      const trailCoverage = 0.784;
      const glowMultiplier = 2.0; // Reduced from 3.2 to fit in smaller space
      const headGlowMultiplier = 1.2; // Reduced from 1.4

      // Pre-sample path for smooth trail
      const pathPoints: PathPoint[] = [];

      for (let i = 0; i < samples; i++) {
        const distance = (i / (samples - 1)) * pathLength;
        const point = routePath.getPointAtLength(distance);

        // Get the SVG element and transform point
        const svg = routePath.ownerSVGElement;
        if (!svg) continue;

        const svgPoint = svg.createSVGPoint();
        svgPoint.x = point.x;
        svgPoint.y = point.y;

        const ctm = routePath.getScreenCTM();
        if (!ctm) continue;

        const transformedPoint = svgPoint.matrixTransform(ctm);
        const svgRect = svg.getBoundingClientRect();

        // Determine color based on position (with smooth wraparound)
        const progress = i / samples;
        let color;

        if (progress < 0.22) {
          const t = progress / 0.22;
          color = {
            r: Math.round(255 * (1 - t) + 241 * t),
            g: Math.round(156 * (1 - t) + 69 * t),
            b: Math.round(38 * (1 - t) + 117 * t)
          };
        } else if (progress < 0.45) {
          color = { r: 241, g: 69, b: 117 };
        } else if (progress < 0.7) {
          const t = (progress - 0.45) / 0.25;
          color = {
            r: Math.round(241 * (1 - t) + 101 * t),
            g: Math.round(69 * (1 - t) + 189 * t),
            b: Math.round(117 * (1 - t) + 235 * t)
          };
        } else if (progress < 0.9) {
          color = { r: 101, g: 189, b: 235 };
        } else {
          const t = (progress - 0.9) / 0.1;
          color = {
            r: Math.round(101 * (1 - t) + 255 * t),
            g: Math.round(189 * (1 - t) + 156 * t),
            b: Math.round(235 * (1 - t) + 38 * t)
          };
        }

        // Canvas offset - center 120px content in 140px canvas
        const canvasOffset = 10;

        pathPoints.push({
          x: transformedPoint.x - svgRect.left + canvasOffset,
          y: transformedPoint.y - svgRect.top + canvasOffset,
          color
        });
      }

      // Calculate curvature for variable speed
      const curvatures = pathPoints.map((pt, i) => {
        if (i === 0 || i === pathPoints.length - 1) return 0;

        const prev = pathPoints[i - 1];
        const next = pathPoints[i + 1];

        const dx1 = pt.x - prev.x;
        const dy1 = pt.y - prev.y;
        const dx2 = next.x - pt.x;
        const dy2 = next.y - pt.y;

        const angle = Math.atan2(dy2, dx2) - Math.atan2(dy1, dx1);
        return Math.abs(angle);
      });

      // Normalize curvature
      const maxCurve = Math.max(...curvatures);
      const normCurvatures = curvatures.map(c => c / (maxCurve || 1));

      const trailSegments: TrailSegment[] = [];
      const trailLength = Math.min(Math.floor(samples * trailCoverage), samples * 2);
      let currentIndex = 0;

      const animate = (timestamp: number) => {
        // Clear canvas
        ctx.clearRect(0, 0, 140, 140);

        // If reduced motion is preferred, show static trail at 50% progress
        if (isReducedMotion.current) {
          const staticProgress = 0.5;
          const staticIndex = Math.floor(staticProgress * samples);
          const headPoint = pathPoints[staticIndex];

          // Draw static trail
          ctx.save();
          ctx.globalAlpha = 0.6;
          ctx.strokeStyle = `rgba(${headPoint.color.r}, ${headPoint.color.g}, ${headPoint.color.b}, 0.8)`;
          ctx.lineWidth = 2;
          ctx.shadowBlur = 8;
          ctx.shadowColor = `rgba(${headPoint.color.r}, ${headPoint.color.g}, ${headPoint.color.b}, 0.8)`;

          ctx.beginPath();
          for (let i = 0; i < pathPoints.length; i++) {
            const pt = pathPoints[i];
            if (i === 0) {
              ctx.moveTo(pt.x, pt.y);
            } else {
              ctx.lineTo(pt.x, pt.y);
            }
          }
          ctx.stroke();
          ctx.restore();
          return;
        }

        // Calculate position with variable speed
        const baseProgress = (timestamp % (validatedDuration * 1000)) / (validatedDuration * 1000);
        const adjustedProgress = reverse ? (1 - baseProgress) : baseProgress;

        // Apply speed variation based on curvature
        let progress = 0;
        let accumSpeed = 0;
        const speeds = normCurvatures.map(c => 1 + (1 - c) * 0.5);
        const totalSpeed = speeds.reduce((a, b) => a + b, 0);

        for (let i = 0; i < samples; i++) {
          accumSpeed += speeds[i] / totalSpeed;
          if (accumSpeed >= adjustedProgress) {
            progress = i / samples;
            break;
          }
        }

        currentIndex = Math.floor(progress * samples);
        const headPoint = pathPoints[currentIndex];

        // Build trail
        trailSegments.length = 0;
        for (let i = 0; i < trailLength; i++) {
          const wrappedIndex = i % samples;
          const idx = reverse
            ? (currentIndex + wrappedIndex) % samples
            : (currentIndex - wrappedIndex + samples) % samples;
          const pt = pathPoints[idx];
          const intensity = Math.pow(1 - (i / trailLength), 1.8);
          trailSegments.push({ x: pt.x, y: pt.y, intensity, color: pt.color });
        }

        // Use normal blending
        ctx.globalCompositeOperation = 'source-over';

        // Draw trail with adaptive sampling
        ctx.save();
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        for (let i = 1; i < trailSegments.length; i++) {
          const seg = trailSegments[i];

          if (seg.intensity < 0.005) continue;

          // Adaptive sampling
          let skip = false;
          if (seg.intensity < 0.2 && i % 3 !== 0) {
            skip = true;
          } else if (seg.intensity < 0.5 && i % 2 !== 0) {
            skip = true;
          }

          if (skip) continue;

          // Find previous segment
          let prevIndex = i - 1;
          if (seg.intensity < 0.2) {
            prevIndex = Math.max(1, i - 3);
          } else if (seg.intensity < 0.5) {
            prevIndex = Math.max(1, i - 2);
          }
          const prevSeg = trailSegments[prevIndex];

          // Width tapering near head
          let widthMultiplier = 1;
          if (seg.intensity > 0.8) {
            widthMultiplier = 0.5 + (0.5 * (1 - seg.intensity) / 0.2);
          }

          // Set segment style
          ctx.lineWidth = 2.8 * seg.intensity * glowMultiplier * widthMultiplier;
          ctx.strokeStyle = `rgba(${seg.color.r}, ${seg.color.g}, ${seg.color.b}, ${0.7 * seg.intensity})`;

          // Graduated shadow blur
          if (seg.intensity > 0.2) {
            ctx.shadowBlur = 1.5 * seg.intensity * glowMultiplier * widthMultiplier;
            ctx.shadowColor = `rgba(${seg.color.r}, ${seg.color.g}, ${seg.color.b}, ${0.9})`;
          } else {
            ctx.shadowBlur = 0;
          }

          // Draw segment with extension
          ctx.beginPath();
          ctx.moveTo(prevSeg.x, prevSeg.y);

          const nextIndex = Math.min(i + 1, trailSegments.length - 1);
          const nextSeg = trailSegments[nextIndex];
          const extendX = seg.x + (nextSeg.x - seg.x) * 0.3;
          const extendY = seg.y + (nextSeg.y - seg.y) * 0.3;

          ctx.lineTo(extendX, extendY);
          ctx.stroke();
        }
        ctx.restore();

        // Draw head
        const headColor = headPoint.color;
        ctx.save();

        ctx.shadowBlur = 2.5 * headGlowMultiplier;
        ctx.shadowColor = `rgba(${headColor.r}, ${headColor.g}, ${headColor.b}, 0.9)`;

        ctx.fillStyle = `rgba(${headColor.r}, ${headColor.g}, ${headColor.b}, 1)`;
        ctx.beginPath();
        ctx.arc(headPoint.x, headPoint.y, 1.2, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 2 * headGlowMultiplier;
        ctx.fillStyle = `rgba(${headColor.r}, ${headColor.g}, ${headColor.b}, 0.8)`;
        ctx.beginPath();
        ctx.arc(headPoint.x, headPoint.y, 0.6, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();

        animationRef.current = requestAnimationFrame(animate);
      };

      animationRef.current = requestAnimationFrame(animate);

      return () => {
        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
        }
      };
    } catch (error) {
      console.error('GlowAnimationV7: Error during initialization or animation', error);
      // Graceful fallback - show static content
      if (ctx) {
        ctx.fillStyle = 'rgba(255, 156, 38, 0.5)';
        ctx.fillRect(60, 60, 20, 20);
      }
    }
  }, [validatedDuration, reverse]);

  return (
    <div
      className="glow-animation-v7-container"
      role="img"
      aria-label={ariaLabel}
    >
      {/* Hidden SVG for path extraction */}
      <svg style={{ position: 'absolute', width: 0, height: 0, visibility: 'hidden' }} aria-hidden="true">
        <g transform="translate(80.9,80.87) scale(0.65) translate(-80.9,-80.87)">
          <g transform="scale(0.8, 0.8)">
            <path
              ref={pathRef}
              d="M70.3853 148.98 C179.5 142.5 166.347 -3.95972 71.4235 1.02014 C-23.5 6 -21.9998 141.5 70.3853 148.98 C158 143.777 73.5 90 73.5 90 C36.5 62.5 51.1843 30 73.5 30 C95.8156 30 116.056 59.9065 73.5 90 C29 126 37.0001 131.5 42.5766 139.206 C47 142.5 55.9799 148.811 70.3853 148.98"
              fill="none"
              stroke="none"
            />
          </g>
        </g>
      </svg>

      {/* Canvas for animation */}
      <canvas ref={canvasRef} className="glow-animation-v7-canvas" />
    </div>
  );
};

export default GlowAnimationV7;