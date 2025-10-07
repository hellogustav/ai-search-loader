import React, { useEffect, useRef } from 'react';
import './GlowAnimationV3.css';

interface TrailParticle {
  element: HTMLDivElement;
  x: number;
  y: number;
  age: number;
  maxAge: number;
  size: number;
}

interface GlowAnimationV3Props {
  duration?: number; // Animation duration in seconds
  trailLength?: number; // Number of trail particles
  showTrail?: boolean;
  showShimmer?: boolean;
  className?: string;
}

const GlowAnimationV3: React.FC<GlowAnimationV3Props> = ({
  duration = 4,
  trailLength = 15,
  showTrail = true,
  showShimmer = true,
  className = ''
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const glowContainerRef = useRef<HTMLDivElement>(null);
  const glowOrbRef = useRef<HTMLDivElement>(null);
  const routePathRef = useRef<SVGPathElement>(null);
  const animationRef = useRef<number>();
  const trailParticlesRef = useRef<TrailParticle[]>([]);

  useEffect(() => {
    if (!glowOrbRef.current || !routePathRef.current || !glowContainerRef.current) return;

    const routePath = routePathRef.current;
    const pathLength = routePath.getTotalLength();
    const glowOrb = glowOrbRef.current;
    const glowContainer = glowContainerRef.current;

    const createTrailParticle = (x: number, y: number) => {
      const particles = trailParticlesRef.current;

      if (particles.length >= trailLength) {
        const oldParticle = particles.shift();
        if (oldParticle?.element) {
          oldParticle.element.remove();
        }
      }

      const particle = document.createElement('div');
      particle.className = 'trail-particle-v3';
      particle.style.left = (x - 2) + 'px';
      particle.style.top = (y - 2) + 'px';

      const size = Math.random() * 3 + 1;
      particle.style.width = size + 'px';
      particle.style.height = size + 'px';

      glowContainer.appendChild(particle);

      particles.push({
        element: particle,
        x,
        y,
        age: 0,
        maxAge: 1000,
        size
      });
    };

    const updateTrailParticles = () => {
      trailParticlesRef.current = trailParticlesRef.current.filter(particle => {
        particle.age += 16;
        const ageRatio = particle.age / particle.maxAge;

        if (ageRatio >= 1) {
          particle.element.remove();
          return false;
        }

        particle.element.style.opacity = String((1 - ageRatio) * 0.6);
        const scale = 1 - (ageRatio * 0.5);
        particle.element.style.transform = `scale(${scale})`;

        particle.y += 0.2;
        particle.element.style.top = particle.y + 'px';

        return true;
      });
    };

    const createShimmer = (x: number, y: number) => {
      const shimmer = document.createElement('div');
      shimmer.className = 'shimmer-v3';

      const offsetX = (Math.random() - 0.5) * 20;
      const offsetY = (Math.random() - 0.5) * 20;

      shimmer.style.left = (x + offsetX) + 'px';
      shimmer.style.top = (y + offsetY) + 'px';

      glowContainer.appendChild(shimmer);

      setTimeout(() => shimmer.remove(), 500);
    };

    const animate = (timestamp: number) => {
      const progress = (timestamp % (duration * 1000)) / (duration * 1000);
      const distance = pathLength * (1 - progress);
      const point = routePath.getPointAtLength(distance);

      // Get the SVG element to create a point
      const svg = routePath.ownerSVGElement;
      if (!svg) return;

      // Create an SVG point and set its coordinates
      const svgPoint = svg.createSVGPoint();
      svgPoint.x = point.x;
      svgPoint.y = point.y;

      // Get the transformation matrix from the path to the SVG viewport
      const ctm = routePath.getScreenCTM();
      if (!ctm) return;

      // Transform the point using the matrix
      const transformedPoint = svgPoint.matrixTransform(ctm);

      // Get the SVG bounding rect to convert to container coordinates
      const svgRect = svg.getBoundingClientRect();

      const transformedX = transformedPoint.x - svgRect.left;
      const transformedY = transformedPoint.y - svgRect.top;

      glowOrb.style.left = transformedX + 'px';
      glowOrb.style.top = transformedY + 'px';

      if (showTrail && Math.random() > 0.3) {
        createTrailParticle(transformedX, transformedY);
      }

      if (showShimmer && Math.random() > 0.7) {
        createShimmer(transformedX, transformedY);
      }

      updateTrailParticles();

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      trailParticlesRef.current.forEach(p => p.element.remove());
      trailParticlesRef.current = [];
    };
  }, [duration, trailLength, showTrail, showShimmer]);

  return (
    <div className={`glow-animation-container-v3 ${className}`} ref={containerRef}>
      <svg className="main-svg-v3" width="220" height="220" viewBox="0 0 162 162" fill="none">
        <path
          d="M161.739 80.8707C161.739 125.396 125.548 161.547 80.9013 161.547C36.2865 161.547 0.0957031 125.396 0.0957031 80.8707C0.0957031 36.3127 36.2865 0.194092 80.9013 0.194092C125.548 0.194092 161.739 36.3127 161.739 80.8707ZM87.4785 147.126C96.3237 146.188 106.076 143.052 108.733 140.303C109.51 139.495 109.672 139.042 109.77 137.167C110.094 131.702 105.655 125.299 96.2265 117.507C91.8525 113.885 82.5537 106.642 81.6141 106.092C80.5125 105.478 80.9337 105.187 71.1165 113.012C61.1049 120.999 57.2169 124.782 54.1389 129.6C51.8709 133.125 51.1905 137.652 52.5837 139.721C54.4305 142.502 64.5069 146.091 73.0605 147.061C76.6569 147.482 83.8173 147.514 87.4785 147.126ZM38.9109 131.249C39.0405 130.99 39.8829 129.277 40.7901 127.401C41.6649 125.526 43.3821 122.713 44.5809 121.096C48.2097 116.31 56.3421 108.517 63.8265 102.665C67.9737 99.3989 70.5009 97.2324 70.5333 96.8444C70.5981 96.3917 69.5937 95.26 67.2933 93.1258C63.7293 89.8276 60.3597 85.9797 58.0269 82.5198C55.9857 79.4803 53.0049 73.0456 52.1949 69.9737C49.2465 58.721 51.9357 47.727 59.6145 39.6755C65.3493 33.6288 72.8013 30.363 80.9985 30.363C88.3857 30.3306 94.8657 32.8204 100.568 37.8647C104.424 41.26 108.668 48.2121 109.996 53.3534C110.839 56.5222 111.001 64.0887 110.32 67.7426C108.733 76.2468 103.516 84.7186 94.7361 93.0611C91.4313 96.1977 91.0425 96.6827 91.3341 97.2647C91.5285 97.6204 93.4401 99.2372 95.5785 100.854C110.547 112.268 117.967 120.287 122.017 129.471C122.568 130.732 123.248 131.799 123.54 131.864C124.123 131.993 129.923 126.27 132.903 122.648C138.865 115.373 143.563 106.157 145.766 97.3618C147.321 91.218 147.969 82.8432 147.418 75.9881C145.701 54.6468 135.171 36.6037 117.772 25.2216C109.154 19.5953 97.9437 15.8444 86.6361 14.842C81.1281 14.357 72.4449 14.842 66.9045 16.0061C49.6353 19.5306 34.8285 29.5869 25.1085 44.4288C17.7861 55.5522 14.2545 67.5162 14.2545 81.0971C14.2545 100.046 20.8965 115.47 34.9581 129.115C37.8093 131.896 38.4249 132.219 38.9109 131.249ZM83.1693 86.6911C85.8585 84.5246 90.8805 79.157 92.6625 76.5055C96.2589 71.1378 97.8789 66.2875 97.8789 60.9522C97.8789 57.4276 97.3605 54.9378 96.0969 52.448C91.0749 42.521 77.4669 40.3222 69.3021 48.0827C67.0989 50.1845 65.0901 53.8061 64.4745 56.8133C63.8265 59.7881 64.2153 65.6085 65.2521 68.5186C66.3537 71.6552 68.2653 75.1474 70.4685 78.0899C72.9957 81.4204 79.8321 87.9522 80.8365 87.9522C81.2577 87.9522 82.2945 87.4025 83.1693 86.6911Z"
          fill="url(#paint0_linear_glow_v3)"
        />
        <path
          d="M161.739 80.8707C161.739 125.396 125.548 161.547 80.9013 161.547C36.2865 161.547 0.0957031 125.396 0.0957031 80.8707C0.0957031 36.3127 36.2865 0.194092 80.9013 0.194092C125.548 0.194092 161.739 36.3127 161.739 80.8707ZM87.4785 147.126C96.3237 146.188 106.076 143.052 108.733 140.303C109.51 139.495 109.672 139.042 109.77 137.167C110.094 131.702 105.655 125.299 96.2265 117.507C91.8525 113.885 82.5537 106.642 81.6141 106.092C80.5125 105.478 80.9337 105.187 71.1165 113.012C61.1049 120.999 57.2169 124.782 54.1389 129.6C51.8709 133.125 51.1905 137.652 52.5837 139.721C54.4305 142.502 64.5069 146.091 73.0605 147.061C76.6569 147.482 83.8173 147.514 87.4785 147.126ZM38.9109 131.249C39.0405 130.99 39.8829 129.277 40.7901 127.401C41.6649 125.526 43.3821 122.713 44.5809 121.096C48.2097 116.31 56.3421 108.517 63.8265 102.665C67.9737 99.3989 70.5009 97.2324 70.5333 96.8444C70.5981 96.3917 69.5937 95.26 67.2933 93.1258C63.7293 89.8276 60.3597 85.9797 58.0269 82.5198C55.9857 79.4803 53.0049 73.0456 52.1949 69.9737C49.2465 58.721 51.9357 47.727 59.6145 39.6755C65.3493 33.6288 72.8013 30.363 80.9985 30.363C88.3857 30.3306 94.8657 32.8204 100.568 37.8647C104.424 41.26 108.668 48.2121 109.996 53.3534C110.839 56.5222 111.001 64.0887 110.32 67.7426C108.733 76.2468 103.516 84.7186 94.7361 93.0611C91.4313 96.1977 91.0425 96.6827 91.3341 97.2647C91.5285 97.6204 93.4401 99.2372 95.5785 100.854C110.547 112.268 117.967 120.287 122.017 129.471C122.568 130.732 123.248 131.799 123.54 131.864C124.123 131.993 129.923 126.27 132.903 122.648C138.865 115.373 143.563 106.157 145.766 97.3618C147.321 91.218 147.969 82.8432 147.418 75.9881C145.701 54.6468 135.171 36.6037 117.772 25.2216C109.154 19.5953 97.9437 15.8444 86.6361 14.842C81.1281 14.357 72.4449 14.842 66.9045 16.0061C49.6353 19.5306 34.8285 29.5869 25.1085 44.4288C17.7861 55.5522 14.2545 67.5162 14.2545 81.0971C14.2545 100.046 20.8965 115.47 34.9581 129.115C37.8093 131.896 38.4249 132.219 38.9109 131.249ZM83.1693 86.6911C85.8585 84.5246 90.8805 79.157 92.6625 76.5055C96.2589 71.1378 97.8789 66.2875 97.8789 60.9522C97.8789 57.4276 97.3605 54.9378 96.0969 52.448C91.0749 42.521 77.4669 40.3222 69.3021 48.0827C67.0989 50.1845 65.0901 53.8061 64.4745 56.8133C63.8265 59.7881 64.2153 65.6085 65.2521 68.5186C66.3537 71.6552 68.2653 75.1474 70.4685 78.0899C72.9957 81.4204 79.8321 87.9522 80.8365 87.9522C81.2577 87.9522 82.2945 87.4025 83.1693 86.6911Z"
          fill="url(#paint1_linear_glow_v3)"
        />

        <g transform="translate(80.9,80.87) scale(0.92) translate(-80.9,-80.87)">
          <g transform="scale(1.094594595, 1.08)">
            <path
              ref={routePathRef}
              id="route-v3"
              vectorEffect="non-scaling-stroke"
              d="M70.3853 148.98 C179.5 142.5 166.347 -3.95972 71.4235 1.02014 C-23.5 6 -21.9998 141.5 70.3853 148.98 C158 143.777 73.5 90 73.5 90 C36.5 62.5 51.1843 30 73.5 30 C95.8156 30 116.056 59.9065 73.5 90 C29 126 37.0001 131.5 42.5766 139.206 C47 142.5 55.9799 148.811 70.3853 148.98"
              fill="none"
              stroke="none"
            />
          </g>
        </g>

        <defs>
          <linearGradient id="paint0_linear_glow_v3" x1="16.6745" y1="36.7675" x2="144.125" y2="35.7694" gradientUnits="userSpaceOnUse">
            <stop stopColor="#FF9C26"/>
            <stop offset="1" stopColor="#F14575"/>
          </linearGradient>
          <linearGradient id="paint1_linear_glow_v3" x1="70.5557" y1="142.185" x2="108.121" y2="51.7212" gradientUnits="userSpaceOnUse">
            <stop stopColor="#65BDEB"/>
            <stop offset="0.630814" stopColor="#65BDEB" stopOpacity="0"/>
          </linearGradient>
        </defs>
      </svg>

      <div className="glow-container-v3" ref={glowContainerRef}>
        <div className="glow-orb-v3" ref={glowOrbRef}>
          <div className="glow-aura-v3"></div>
          <div className="glow-core-v3"></div>
        </div>
      </div>
    </div>
  );
};

export default GlowAnimationV3;
