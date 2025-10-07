import React from 'react';
import './GlowAnimationV5.css';

interface GlowAnimationV5Props {
  speed?: number; // Speed of the color flow animation in seconds
  className?: string;
}

const GlowAnimationV5: React.FC<GlowAnimationV5Props> = ({
  speed = 4,
  className = ''
}) => {
  const animationDuration = `${speed}s`;

  // Apple Intelligence style: soft pastel rainbow colors
  // Purple, Blue, Cyan, Pink, Orange flowing smoothly
  return (
    <div className={`glow-animation-container-v5 ${className}`}>
      <svg className="main-svg-v5" width="100" height="100" viewBox="0 0 162 162" fill="none">
        <g transform="translate(80.9,80.87) scale(0.92) translate(-80.9,-80.87)">
          <g transform="scale(1.094594595, 1.08)">
            {/* Massive outer glow - moving segment covers ~40% of perimeter */}
            <path
              d="M70.3853 148.98 C179.5 142.5 166.347 -3.95972 71.4235 1.02014 C-23.5 6 -21.9998 141.5 70.3853 148.98 C158 143.777 73.5 90 73.5 90 C36.5 62.5 51.1843 30 73.5 30 C95.8156 30 116.056 59.9065 73.5 90 C29 126 37.0001 131.5 42.5766 139.206 C47 142.5 55.9799 148.811 70.3853 148.98"
              fill="none"
              stroke="url(#appleGradient0)"
              strokeWidth="50"
              strokeLinecap="butt"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              filter="url(#outerGlow)"
              pathLength="1"
              strokeDasharray="0.4 0.6"
              opacity="0.4"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="1"
                dur={animationDuration}
                repeatCount="indefinite"
              />
            </path>
            {/* Medium inner glow layer - moving segment */}
            <path
              d="M70.3853 148.98 C179.5 142.5 166.347 -3.95972 71.4235 1.02014 C-23.5 6 -21.9998 141.5 70.3853 148.98 C158 143.777 73.5 90 73.5 90 C36.5 62.5 51.1843 30 73.5 30 C95.8156 30 116.056 59.9065 73.5 90 C29 126 37.0001 131.5 42.5766 139.206 C47 142.5 55.9799 148.811 70.3853 148.98"
              fill="none"
              stroke="url(#appleGradient1)"
              strokeWidth="20"
              strokeLinecap="butt"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
              filter="url(#innerGlow)"
              pathLength="1"
              strokeDasharray="0.35 0.65"
              opacity="0.6"
            >
              <animate
                attributeName="stroke-dashoffset"
                from="0"
                to="1"
                dur={animationDuration}
                repeatCount="indefinite"
              />
            </path>
            {/* Sharp bright core line - full path always visible */}
            <path
              d="M70.3853 148.98 C179.5 142.5 166.347 -3.95972 71.4235 1.02014 C-23.5 6 -21.9998 141.5 70.3853 148.98 C158 143.777 73.5 90 73.5 90 C36.5 62.5 51.1843 30 73.5 30 C95.8156 30 116.056 59.9065 73.5 90 C29 126 37.0001 131.5 42.5766 139.206 C47 142.5 55.9799 148.811 70.3853 148.98"
              fill="none"
              stroke="url(#appleGradient2)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              vectorEffect="non-scaling-stroke"
            />
          </g>
        </g>

        <defs>
          {/* Apple Intelligence-style animated gradients - soft pastel rainbow */}
          <linearGradient id="appleGradient0" x1="16.6745" y1="36.7675" x2="144.125" y2="35.7694" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#A78BFA">
              <animate attributeName="stop-color"
                values="#A78BFA;#60A5FA;#22D3EE;#F472B6;#FB923C;#A78BFA"
                dur={animationDuration}
                repeatCount="indefinite"/>
            </stop>
            <stop offset="33%" stopColor="#60A5FA">
              <animate attributeName="stop-color"
                values="#60A5FA;#22D3EE;#F472B6;#FB923C;#A78BFA;#60A5FA"
                dur={animationDuration}
                repeatCount="indefinite"/>
            </stop>
            <stop offset="66%" stopColor="#22D3EE">
              <animate attributeName="stop-color"
                values="#22D3EE;#F472B6;#FB923C;#A78BFA;#60A5FA;#22D3EE"
                dur={animationDuration}
                repeatCount="indefinite"/>
            </stop>
            <stop offset="100%" stopColor="#F472B6">
              <animate attributeName="stop-color"
                values="#F472B6;#FB923C;#A78BFA;#60A5FA;#22D3EE;#F472B6"
                dur={animationDuration}
                repeatCount="indefinite"/>
            </stop>
          </linearGradient>

          <linearGradient id="appleGradient1" x1="70.5557" y1="142.185" x2="108.121" y2="51.7212" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#FB923C">
              <animate attributeName="stop-color"
                values="#FB923C;#A78BFA;#60A5FA;#22D3EE;#F472B6;#FB923C"
                dur={animationDuration}
                repeatCount="indefinite"/>
            </stop>
            <stop offset="50%" stopColor="#A78BFA">
              <animate attributeName="stop-color"
                values="#A78BFA;#60A5FA;#22D3EE;#F472B6;#FB923C;#A78BFA"
                dur={animationDuration}
                repeatCount="indefinite"/>
            </stop>
            <stop offset="100%" stopColor="#60A5FA">
              <animate attributeName="stop-color"
                values="#60A5FA;#22D3EE;#F472B6;#FB923C;#A78BFA;#60A5FA"
                dur={animationDuration}
                repeatCount="indefinite"/>
            </stop>
          </linearGradient>

          <linearGradient id="appleGradient2" x1="16.6745" y1="36.7675" x2="144.125" y2="35.7694" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#F472B6">
              <animate attributeName="stop-color"
                values="#F472B6;#FB923C;#A78BFA;#60A5FA;#22D3EE;#F472B6"
                dur={animationDuration}
                repeatCount="indefinite"/>
            </stop>
            <stop offset="50%" stopColor="#22D3EE">
              <animate attributeName="stop-color"
                values="#22D3EE;#F472B6;#FB923C;#A78BFA;#60A5FA;#22D3EE"
                dur={animationDuration}
                repeatCount="indefinite"/>
            </stop>
            <stop offset="100%" stopColor="#A78BFA">
              <animate attributeName="stop-color"
                values="#A78BFA;#60A5FA;#22D3EE;#F472B6;#FB923C;#A78BFA"
                dur={animationDuration}
                repeatCount="indefinite"/>
            </stop>
          </linearGradient>

          {/* Multi-layer glow filters matching neon style */}
          <filter id="outerGlow" x="-200%" y="-200%" width="500%" height="500%">
            <feGaussianBlur stdDeviation="40" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>

          <filter id="innerGlow" x="-150%" y="-150%" width="400%" height="400%">
            <feGaussianBlur stdDeviation="15" result="blur"/>
            <feMerge>
              <feMergeNode in="blur"/>
              <feMergeNode in="blur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
      </svg>
    </div>
  );
};

export default GlowAnimationV5;
