import React, { useEffect, useRef } from "react";
import './GlowAnimationV1_1.css';

/**
 * GlowAnimation V1.1 - Dynamic Neon Energy Tracer with @ Symbol
 *
 * Features:
 * - Original @ symbol shape visible underneath
 * - Continuous unbroken trail covering 30-50% of path
 * - Electric violet/neon purple with HDR white core
 * - Trail width decreases with intensity
 * - Multi-layered glow effects
 * - Variable velocity based on path curvature
 * - Additive blending at crossovers
 */

interface TrailSegment {
  x: number;
  y: number;
  intensity: number;
  color: { r: number; g: number; b: number };
}

type GlowAnimationV1_1Props = {
  duration?: number; // Animation duration in seconds
  trailCoverage?: number; // 0.3-0.5 recommended (30-50% of path)
  speedFactor?: number; // Speed multiplier
  className?: string;
};

const GlowAnimationV1_1: React.FC<GlowAnimationV1_1Props> = ({
  duration = 4,
  trailCoverage = 1.0, // Doubled to 100% - full path trail
  speedFactor = 1,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const routePathRef = useRef<SVGPathElement>(null);
  const animationRef = useRef<number>();

  useEffect(() => {
    if (!canvasRef.current || !routePathRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const routePath = routePathRef.current;
    const pathLength = routePath.getTotalLength();

    // Setup canvas for overlay
    canvas.width = 220;
    canvas.height = 220;

    // Pre-sample path for smooth trail
    const samples = 500;
    const pathPoints = new Array(samples).fill(0).map((_, i) => {
      const distance = (i / (samples - 1)) * pathLength;
      const point = routePath.getPointAtLength(distance);

      // Get the SVG element and transform point
      const svg = routePath.ownerSVGElement;
      if (!svg) return { x: 0, y: 0, color: { r: 138, g: 92, b: 255 } };

      const svgPoint = svg.createSVGPoint();
      svgPoint.x = point.x;
      svgPoint.y = point.y;

      const ctm = routePath.getScreenCTM();
      if (!ctm) return { x: 0, y: 0, color: { r: 138, g: 92, b: 255 } };

      const transformedPoint = svgPoint.matrixTransform(ctm);
      const svgRect = svg.getBoundingClientRect();

      // Determine color based on position in path
      // The @ shape has orange/pink on one side and blue on another
      const progress = i / samples;
      let color;

      // Map different sections of the path to appropriate colors
      if (progress < 0.25) {
        // First quarter - orange to pink gradient
        const t = progress / 0.25;
        color = {
          r: Math.round(255 * (1 - t) + 241 * t), // FF9C26 to F14575
          g: Math.round(156 * (1 - t) + 69 * t),
          b: Math.round(38 * (1 - t) + 117 * t)
        };
      } else if (progress < 0.5) {
        // Second quarter - pink
        color = { r: 241, g: 69, b: 117 }; // F14575
      } else if (progress < 0.75) {
        // Third quarter - transition to blue
        const t = (progress - 0.5) / 0.25;
        color = {
          r: Math.round(241 * (1 - t) + 101 * t), // F14575 to 65BDEB
          g: Math.round(69 * (1 - t) + 189 * t),
          b: Math.round(117 * (1 - t) + 235 * t)
        };
      } else {
        // Last quarter - blue
        color = { r: 101, g: 189, b: 235 }; // 65BDEB
      }

      return {
        x: transformedPoint.x - svgRect.left,
        y: transformedPoint.y - svgRect.top,
        color
      };
    });

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
    const trailLength = Math.floor(samples * trailCoverage);
    let currentIndex = 0;

    const animate = (timestamp: number) => {
      // Clear canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate position with variable speed
      const baseProgress = (timestamp % (duration * 1000)) / (duration * 1000);

      // Apply speed variation based on curvature
      let progress = 0;
      let accumSpeed = 0;
      const speeds = normCurvatures.map(c => 1 + (1 - c) * 0.5); // Faster on straights
      const totalSpeed = speeds.reduce((a, b) => a + b, 0);

      for (let i = 0; i < samples; i++) {
        accumSpeed += speeds[i] / totalSpeed;
        if (accumSpeed >= baseProgress) {
          progress = i / samples;
          break;
        }
      }

      currentIndex = Math.floor(progress * samples);

      // Update trail segments
      const headPoint = pathPoints[currentIndex];

      // Build trail
      trailSegments.length = 0;
      for (let i = 0; i < trailLength; i++) {
        const idx = (currentIndex - i + samples) % samples;
        const pt = pathPoints[idx];
        const intensity = Math.pow(1 - (i / trailLength), 2.2); // Exponential decay
        trailSegments.push({ x: pt.x, y: pt.y, intensity, color: pt.color });
      }

      // Enable additive blending
      ctx.globalCompositeOperation = 'lighter';

      // Draw trail layers (back to front)

      // Layer 1: Slightly larger atmospheric glow
      trailSegments.forEach(seg => {
        if (seg.intensity < 0.05) return; // Skip low intensity segments

        const gradient = ctx.createRadialGradient(
          seg.x, seg.y, 0,
          seg.x, seg.y, 23 * seg.intensity // Increased to 23
        );
        gradient.addColorStop(0, `rgba(${seg.color.r}, ${seg.color.g}, ${seg.color.b}, ${0.24 * seg.intensity})`);
        gradient.addColorStop(0.6, `rgba(${seg.color.r}, ${seg.color.g}, ${seg.color.b}, ${0.11 * seg.intensity})`);
        gradient.addColorStop(1, `rgba(${seg.color.r}, ${seg.color.g}, ${seg.color.b}, 0)`);

        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(seg.x, seg.y, 23 * seg.intensity, 0, Math.PI * 2);
        ctx.fill();
      });

      // Layer 2: Connect trail segments with slightly wider colored line
      ctx.save();
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Draw segments individually to apply their colors
      for (let i = 1; i < trailSegments.length; i++) {
        const seg = trailSegments[i];
        const prevSeg = trailSegments[i - 1];
        if (seg.intensity < 0.1) continue;

        ctx.beginPath();
        ctx.moveTo(prevSeg.x, prevSeg.y);
        ctx.lineTo(seg.x, seg.y);

        const width = 4.5 * seg.intensity; // Increased to 4.5
        ctx.lineWidth = width;
        ctx.strokeStyle = `rgba(${seg.color.r}, ${seg.color.g}, ${seg.color.b}, ${0.68 * seg.intensity})`;
        ctx.shadowBlur = 8 * seg.intensity; // Increased to 8
        ctx.shadowColor = `rgb(${seg.color.r}, ${seg.color.g}, ${seg.color.b})`;
        ctx.stroke();
      }
      ctx.restore();

      // Layer 3: Slightly larger bright spots along trail
      trailSegments.forEach(seg => {
        if (seg.intensity < 0.2) return; // Show for moderately bright segments

        ctx.save();
        ctx.shadowBlur = 9 * seg.intensity; // Increased to 9
        ctx.shadowColor = '#FFFFFF';
        ctx.fillStyle = `rgba(255, 255, 255, ${0.78 * seg.intensity})`;
        ctx.beginPath();
        ctx.arc(seg.x, seg.y, 2.5 * seg.intensity, 0, Math.PI * 2); // Increased to 2.5
        ctx.fill();
        ctx.restore();
      });

      // Draw head - minimal glow, just a bright point
      ctx.save();

      const headColor = headPoint.color;

      // Small colored dot with minimal glow
      ctx.shadowBlur = 4;
      ctx.shadowColor = `rgb(${headColor.r}, ${headColor.g}, ${headColor.b})`;
      ctx.fillStyle = `rgba(${headColor.r}, ${headColor.g}, ${headColor.b}, 1)`;
      ctx.beginPath();
      ctx.arc(headPoint.x, headPoint.y, 2, 0, Math.PI * 2);
      ctx.fill();

      // Tiny white core - 3px diameter (1.5px radius)
      ctx.shadowBlur = 3;
      ctx.shadowColor = '#FFFFFF';
      ctx.fillStyle = 'rgba(255, 255, 255, 1)';
      ctx.beginPath();
      ctx.arc(headPoint.x, headPoint.y, 1.5, 0, Math.PI * 2);
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
  }, [duration, trailCoverage, speedFactor]);

  return (
    <div className={`glow-animation-v1-1-container ${className}`} ref={containerRef}>
      {/* Original @ Symbol Shape */}
      <svg className="base-svg-v1-1" width="220" height="220" viewBox="0 0 162 162" fill="none">
        <path
          d="M161.739 80.8707C161.739 125.396 125.548 161.547 80.9013 161.547C36.2865 161.547 0.0957031 125.396 0.0957031 80.8707C0.0957031 36.3127 36.2865 0.194092 80.9013 0.194092C125.548 0.194092 161.739 36.3127 161.739 80.8707ZM87.4785 147.126C96.3237 146.188 106.076 143.052 108.733 140.303C109.51 139.495 109.672 139.042 109.77 137.167C110.094 131.702 105.655 125.299 96.2265 117.507C91.8525 113.885 82.5537 106.642 81.6141 106.092C80.5125 105.478 80.9337 105.187 71.1165 113.012C61.1049 120.999 57.2169 124.782 54.1389 129.6C51.8709 133.125 51.1905 137.652 52.5837 139.721C54.4305 142.502 64.5069 146.091 73.0605 147.061C76.6569 147.482 83.8173 147.514 87.4785 147.126ZM38.9109 131.249C39.0405 130.99 39.8829 129.277 40.7901 127.401C41.6649 125.526 43.3821 122.713 44.5809 121.096C48.2097 116.31 56.3421 108.517 63.8265 102.665C67.9737 99.3989 70.5009 97.2324 70.5333 96.8444C70.5981 96.3917 69.5937 95.26 67.2933 93.1258C63.7293 89.8276 60.3597 85.9797 58.0269 82.5198C55.9857 79.4803 53.0049 73.0456 52.1949 69.9737C49.2465 58.721 51.9357 47.727 59.6145 39.6755C65.3493 33.6288 72.8013 30.363 80.9985 30.363C88.3857 30.3306 94.8657 32.8204 100.568 37.8647C104.424 41.26 108.668 48.2121 109.996 53.3534C110.839 56.5222 111.001 64.0887 110.32 67.7426C108.733 76.2468 103.516 84.7186 94.7361 93.0611C91.4313 96.1977 91.0425 96.6827 91.3341 97.2647C91.5285 97.6204 93.4401 99.2372 95.5785 100.854C110.547 112.268 117.967 120.287 122.017 129.471C122.568 130.732 123.248 131.799 123.54 131.864C124.123 131.993 129.923 126.27 132.903 122.648C138.865 115.373 143.563 106.157 145.766 97.3618C147.321 91.218 147.969 82.8432 147.418 75.9881C145.701 54.6468 135.171 36.6037 117.772 25.2216C109.154 19.5953 97.9437 15.8444 86.6361 14.842C81.1281 14.357 72.4449 14.842 66.9045 16.0061C49.6353 19.5306 34.8285 29.5869 25.1085 44.4288C17.7861 55.5522 14.2545 67.5162 14.2545 81.0971C14.2545 100.046 20.8965 115.47 34.9581 129.115C37.8093 131.896 38.4249 132.219 38.9109 131.249ZM83.1693 86.6911C85.8585 84.5246 90.8805 79.157 92.6625 76.5055C96.2589 71.1378 97.8789 66.2875 97.8789 60.9522C97.8789 57.4276 97.3605 54.9378 96.0969 52.448C91.0749 42.521 77.4669 40.3222 69.3021 48.0827C67.0989 50.1845 65.0901 53.8061 64.4745 56.8133C63.8265 59.7881 64.2153 65.6085 65.2521 68.5186C66.3537 71.6552 68.2653 75.1474 70.4685 78.0899C72.9957 81.4204 79.8321 87.9522 80.8365 87.9522C81.2577 87.9522 82.2945 87.4025 83.1693 86.6911Z"
          fill="url(#paint0_linear_v1_1)"
        />
        <path
          d="M161.739 80.8707C161.739 125.396 125.548 161.547 80.9013 161.547C36.2865 161.547 0.0957031 125.396 0.0957031 80.8707C0.0957031 36.3127 36.2865 0.194092 80.9013 0.194092C125.548 0.194092 161.739 36.3127 161.739 80.8707ZM87.4785 147.126C96.3237 146.188 106.076 143.052 108.733 140.303C109.51 139.495 109.672 139.042 109.77 137.167C110.094 131.702 105.655 125.299 96.2265 117.507C91.8525 113.885 82.5537 106.642 81.6141 106.092C80.5125 105.478 80.9337 105.187 71.1165 113.012C61.1049 120.999 57.2169 124.782 54.1389 129.6C51.8709 133.125 51.1905 137.652 52.5837 139.721C54.4305 142.502 64.5069 146.091 73.0605 147.061C76.6569 147.482 83.8173 147.514 87.4785 147.126ZM38.9109 131.249C39.0405 130.99 39.8829 129.277 40.7901 127.401C41.6649 125.526 43.3821 122.713 44.5809 121.096C48.2097 116.31 56.3421 108.517 63.8265 102.665C67.9737 99.3989 70.5009 97.2324 70.5333 96.8444C70.5981 96.3917 69.5937 95.26 67.2933 93.1258C63.7293 89.8276 60.3597 85.9797 58.0269 82.5198C55.9857 79.4803 53.0049 73.0456 52.1949 69.9737C49.2465 58.721 51.9357 47.727 59.6145 39.6755C65.3493 33.6288 72.8013 30.363 80.9985 30.363C88.3857 30.3306 94.8657 32.8204 100.568 37.8647C104.424 41.26 108.668 48.2121 109.996 53.3534C110.839 56.5222 111.001 64.0887 110.32 67.7426C108.733 76.2468 103.516 84.7186 94.7361 93.0611C91.4313 96.1977 91.0425 96.6827 91.3341 97.2647C91.5285 97.6204 93.4401 99.2372 95.5785 100.854C110.547 112.268 117.967 120.287 122.017 129.471C122.568 130.732 123.248 131.799 123.54 131.864C124.123 131.993 129.923 126.27 132.903 122.648C138.865 115.373 143.563 106.157 145.766 97.3618C147.321 91.218 147.969 82.8432 147.418 75.9881C145.701 54.6468 135.171 36.6037 117.772 25.2216C109.154 19.5953 97.9437 15.8444 86.6361 14.842C81.1281 14.357 72.4449 14.842 66.9045 16.0061C49.6353 19.5306 34.8285 29.5869 25.1085 44.4288C17.7861 55.5522 14.2545 67.5162 14.2545 81.0971C14.2545 100.046 20.8965 115.47 34.9581 129.115C37.8093 131.896 38.4249 132.219 38.9109 131.249ZM83.1693 86.6911C85.8585 84.5246 90.8805 79.157 92.6625 76.5055C96.2589 71.1378 97.8789 66.2875 97.8789 60.9522C97.8789 57.4276 97.3605 54.9378 96.0969 52.448C91.0749 42.521 77.4669 40.3222 69.3021 48.0827C67.0989 50.1845 65.0901 53.8061 64.4745 56.8133C63.8265 59.7881 64.2153 65.6085 65.2521 68.5186C66.3537 71.6552 68.2653 75.1474 70.4685 78.0899C72.9957 81.4204 79.8321 87.9522 80.8365 87.9522C81.2577 87.9522 82.2945 87.4025 83.1693 86.6911Z"
          fill="url(#paint1_linear_v1_1)"
        />

        {/* Hidden path for animation tracking */}
        <g transform="translate(80.9,80.87) scale(0.92) translate(-80.9,-80.87)">
          <g transform="scale(1.094594595, 1.08)">
            <path
              ref={routePathRef}
              id="route-v1-1"
              vectorEffect="non-scaling-stroke"
              d="M70.3853 148.98 C179.5 142.5 166.347 -3.95972 71.4235 1.02014 C-23.5 6 -21.9998 141.5 70.3853 148.98 C158 143.777 73.5 90 73.5 90 C36.5 62.5 51.1843 30 73.5 30 C95.8156 30 116.056 59.9065 73.5 90 C29 126 37.0001 131.5 42.5766 139.206 C47 142.5 55.9799 148.811 70.3853 148.98"
              fill="none"
              stroke="none"
            />
          </g>
        </g>

        <defs>
          <linearGradient id="paint0_linear_v1_1" x1="16.6745" y1="36.7675" x2="144.125" y2="35.7694" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF9C26"/>
            <stop offset="1" stopColor="#F14575"/>
          </linearGradient>
          <linearGradient id="paint1_linear_v1_1" x1="70.5557" y1="142.185" x2="108.121" y2="51.7212" gradientUnits="userSpaceOnUse">
            <stop stopColor="#65BDEB"/>
            <stop offset="0.630814" stopColor="#65BDEB" stopOpacity="0"/>
          </linearGradient>
        </defs>
      </svg>

      {/* Canvas overlay for neon trail */}
      <canvas ref={canvasRef} className="trail-canvas-v1-1" />
    </div>
  );
};

export default GlowAnimationV1_1;