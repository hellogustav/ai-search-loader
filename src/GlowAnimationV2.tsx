import React from "react";

/**
 * InfinityGlowLoader (V2)
 * - Replaces the black dot with a neon comet (head + long tail)
 * - Keeps your original SVG art + path
 * - Works in modern Chrome/Edge/Safari/Firefox
 *
 * Props:
 *   size:   outer SVG size in px (scales everything)  [default 220]
 *   speed:  seconds per loop                          [default 4]
 *   className: optional className for wrapping <svg>
 */
type Props = {
  size?: number;
  speed?: number;
  className?: string;
};

const GlowAnimationV2: React.FC<Props> = ({ size = 300, speed = 4, className }) => {
  const dur = `${speed}s`;

  // Tail tuning — feel free to tweak live to match your brand aesthetic:
  const tailShort = 0.18; // segment as fraction of path length (closest to the head, brightest)
  const tailMid   = 0.30; // mid "halo"
  const tailLong  = 0.48; // longest soft glow

  // To make the dash end exactly at the comet head, dashoffset must animate from -segment to (1 - segment).
  const dashFromTo = (seg: number) => ({
    from: `-${seg}`,
    to: `${1 - seg}`,
  });

  const dfS = dashFromTo(tailShort);
  const dfM = dashFromTo(tailMid);
  const dfL = dashFromTo(tailLong);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 162 162"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      // xlink still helps with some browsers for mpath
      xmlnsXlink="http://www.w3.org/1999/xlink"
      className={className}
    >
      {/* --- Base artwork (your original) ----------------------------------- */}
      <path
        d="M161.739 80.8707C161.739 125.396 125.548 161.547 80.9013 161.547C36.2865 161.547 0.0957031 125.396 0.0957031 80.8707C0.0957031 36.3127 36.2865 0.194092 80.9013 0.194092C125.548 0.194092 161.739 36.3127 161.739 80.8707ZM87.4785 147.126C96.3237 146.188 106.076 143.052 108.733 140.303C109.51 139.495 109.672 139.042 109.77 137.167C110.094 131.702 105.655 125.299 96.2265 117.507C91.8525 113.885 82.5537 106.642 81.6141 106.092C80.5125 105.478 80.9337 105.187 71.1165 113.012C61.1049 120.999 57.2169 124.782 54.1389 129.6C51.8709 133.125 51.1905 137.652 52.5837 139.721C54.4305 142.502 64.5069 146.091 73.0605 147.061C76.6569 147.482 83.8173 147.514 87.4785 147.126ZM38.9109 131.249C39.0405 130.99 39.8829 129.277 40.7901 127.401C41.6649 125.526 43.3821 122.713 44.5809 121.096C48.2097 116.31 56.3421 108.517 63.8265 102.665C67.9737 99.3989 70.5009 97.2324 70.5333 96.8444C70.5981 96.3917 69.5937 95.26 67.2933 93.1258C63.7293 89.8276 60.3597 85.9797 58.0269 82.5198C55.9857 79.4803 53.0049 73.0456 52.1949 69.9737C49.2465 58.721 51.9357 47.727 59.6145 39.6755C65.3493 33.6288 72.8013 30.363 80.9985 30.363C88.3857 30.3306 94.8657 32.8204 100.568 37.8647C104.424 41.26 108.668 48.2121 109.996 53.3534C110.839 56.5222 111.001 64.0887 110.32 67.7426C108.733 76.2468 103.516 84.7186 94.7361 93.0611C91.4313 96.1977 91.0425 96.6827 91.3341 97.2647C91.5285 97.6204 93.4401 99.2372 95.5785 100.854C110.547 112.268 117.967 120.287 122.017 129.471C122.568 130.732 123.248 131.799 123.54 131.864C124.123 131.993 129.923 126.27 132.903 122.648C138.865 115.373 143.563 106.157 145.766 97.3618C147.321 91.218 147.969 82.8432 147.418 75.9881C145.701 54.6468 135.171 36.6037 117.772 25.2216C109.154 19.5953 97.9437 15.8444 86.6361 14.842C81.1281 14.357 72.4449 14.842 66.9045 16.0061C49.6353 19.5306 34.8285 29.5869 25.1085 44.4288C17.7861 55.5522 14.2545 67.5162 14.2545 81.0971C14.2545 100.046 20.8965 115.47 34.9581 129.115C37.8093 131.896 38.4249 132.219 38.9109 131.249ZM83.1693 86.6911C85.8585 84.5246 90.8805 79.157 92.6625 76.5055C96.2589 71.1378 97.8789 66.2875 97.8789 60.9522C97.8789 57.4276 97.3605 54.9378 96.0969 52.448C91.0749 42.521 77.4669 40.3222 69.3021 48.0827C67.0989 50.1845 65.0901 53.8061 64.4745 56.8133C63.8265 59.7881 64.2153 65.6085 65.2521 68.5186C66.3537 71.6552 68.2653 75.1474 70.4685 78.0899C72.9957 81.4204 79.8321 87.9522 80.8365 87.9522C81.2577 87.9522 82.2945 87.4025 83.1693 86.6911Z"
        fill="url(#paint0_linear_7770_27570)"
      />
      <path
        d="M161.739 80.8707C161.739 125.396 125.548 161.547 80.9013 161.547C36.2865 161.547 0.0957031 125.396 0.0957031 80.8707C0.0957031 36.3127 36.2865 0.194092 80.9013 0.194092C125.548 0.194092 161.739 36.3127 161.739 80.8707ZM87.4785 147.126C96.3237 146.188 106.076 143.052 108.733 140.303C109.51 139.495 109.672 139.042 109.77 137.167C110.094 131.702 105.655 125.299 96.2265 117.507C91.8525 113.885 82.5537 106.642 81.6141 106.092C80.5125 105.478 80.9337 105.187 71.1165 113.012C61.1049 120.999 57.2169 124.782 54.1389 129.6C51.8709 133.125 51.1905 137.652 52.5837 139.721C54.4305 142.502 64.5069 146.091 73.0605 147.061C76.6569 147.482 83.8173 147.514 87.4785 147.126ZM38.9109 131.249C39.0405 130.99 39.8829 129.277 40.7901 127.401C41.6649 125.526 43.3821 122.713 44.5809 121.096C48.2097 116.31 56.3421 108.517 63.8265 102.665C67.9737 99.3989 70.5009 97.2324 70.5333 96.8444C70.5981 96.3917 69.5937 95.26 67.2933 93.1258C63.7293 89.8276 60.3597 85.9797 58.0269 82.5198C55.9857 79.4803 53.0049 73.0456 52.1949 69.9737C49.2465 58.721 51.9357 47.727 59.6145 39.6755C65.3493 33.6288 72.8013 30.363 80.9985 30.363C88.3857 30.3306 94.8657 32.8204 100.568 37.8647C104.424 41.26 108.668 48.2121 109.996 53.3534C110.839 56.5222 111.001 64.0887 110.32 67.7426C108.733 76.2468 103.516 84.7186 94.7361 93.0611C91.4313 96.1977 91.0425 96.6827 91.3341 97.2647C91.5285 97.6204 93.4401 99.2372 95.5785 100.854C110.547 112.268 117.967 120.287 122.017 129.471C122.568 130.732 123.248 131.799 123.54 131.864C124.123 131.993 129.923 126.27 132.903 122.648C138.865 115.373 143.563 106.157 145.766 97.3618C147.321 91.218 147.969 82.8432 147.418 75.9881C145.701 54.6468 135.171 36.6037 117.772 25.2216C109.154 19.5953 97.9437 15.8444 86.6361 14.842C81.1281 14.357 72.4449 14.842 66.9045 16.0061C49.6353 19.5306 34.8285 29.5869 25.1085 44.4288C17.7861 55.5522 14.2545 67.5162 14.2545 81.0971C14.2545 100.046 20.8965 115.47 34.9581 129.115C37.8093 131.896 38.4249 132.219 38.9109 131.249ZM83.1693 86.6911C85.8585 84.5246 90.8805 79.157 92.6625 76.5055C96.2589 71.1378 97.8789 66.2875 97.8789 60.9522C97.8789 57.4276 97.3605 54.9378 96.0969 52.448C91.0749 42.521 77.4669 40.3222 69.3021 48.0827C67.0989 50.1845 65.0901 53.8061 64.4745 56.8133C63.8265 59.7881 64.2153 65.6085 65.2521 68.5186C66.3537 71.6552 68.2653 75.1474 70.4685 78.0899C72.9957 81.4204 79.8321 87.9522 80.8365 87.9522C81.2577 87.9522 82.2945 87.4025 83.1693 86.6911Z"
        fill="url(#paint1_linear_7770_27570)"
      />

      {/* --- Animation overlay (scaled same as yours) ------------------------ */}
      <g transform="translate(80.9,80.87) scale(0.92) translate(-80.9,-80.87)">
        <g transform="scale(1.094594595, 1.08)">
          {/* This is the path the comet follows; we also use it for the tail. */}
          <path
            id="route"
            vectorEffect="non-scaling-stroke"
            d="M70.3853 148.98
               C179.5 142.5 166.347 -3.95972 71.4235 1.02014
               C-23.5 6 -21.9998 141.5 70.3853 148.98
               C158 143.777 73.5 90 73.5 90
               C36.5 62.5 51.1843 30 73.5 30
               C95.8156 30 116.056 59.9065 73.5 90
               C29 126 37.0001 131.5 42.5766 139.206
               C47 142.5 55.9799 148.811 70.3853 148.98"
            fill="none"
            stroke="none"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            // Normalize length to 1 so our dash math is easy:
            pathLength={1}
          />

          {/* Long, soft tail (lowest layer) */}
          <use href="#route" stroke="url(#tailGradientLong)" strokeWidth="14" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.55" filter="url(#bloomSoft)">
            <animate attributeName="stroke-dasharray" dur={dur} values={`${tailLong} 1`} repeatCount="indefinite" />
            <animate attributeName="stroke-dashoffset" dur={dur} from={dfL.from} to={dfL.to} repeatCount="indefinite" />
            {/* gentle shimmer by modulating opacity */}
            <animate attributeName="opacity" dur="1.6s" values="0.45;0.6;0.5;0.55;0.45" repeatCount="indefinite" />
          </use>

          {/* Mid tail */}
          <use href="#route" stroke="url(#tailGradientMid)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.75" filter="url(#bloom)">
            <animate attributeName="stroke-dasharray" dur={dur} values={`${tailMid} 1`} repeatCount="indefinite" />
            <animate attributeName="stroke-dashoffset" dur={dur} from={dfM.from} to={dfM.to} repeatCount="indefinite" />
            <animate attributeName="opacity" dur="1.2s" values="0.65;0.85;0.7;0.8;0.65" repeatCount="indefinite" />
          </use>

          {/* Bright inner tail (closest to head) */}
          <use href="#route" stroke="url(#tailGradientShort)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" fill="none" opacity="0.95" filter="url(#bloomHard)">
            <animate attributeName="stroke-dasharray" dur={dur} values={`${tailShort} 1`} repeatCount="indefinite" />
            <animate attributeName="stroke-dashoffset" dur={dur} from={dfS.from} to={dfS.to} repeatCount="indefinite" />
            <animate attributeName="opacity" dur="0.9s" values="0.8;1;0.9;0.95;0.8" repeatCount="indefinite" />
          </use>

          {/* Comet head — follows the same path */}
          <g id="cometHead">
            {/* white hot core */}
            <circle r="2.2" fill="white" filter="url(#bloomHard)">
              <animateMotion dur={dur} repeatCount="indefinite" rotate="auto">
                <mpath xlinkHref="#route" href="#route" />
              </animateMotion>
              <animate attributeName="r" dur="0.9s" values="2.2;2.9;2.2" repeatCount="indefinite" />
            </circle>

            {/* inner glow */}
            <circle r="4.4" fill="url(#headRadial)" opacity="0.95" filter="url(#bloom)">
              <animateMotion dur={dur} repeatCount="indefinite" rotate="auto">
                <mpath xlinkHref="#route" href="#route" />
              </animateMotion>
              <animate attributeName="opacity" dur="1.2s" values="0.85;1;0.9;1;0.85" repeatCount="indefinite" />
              <animateTransform attributeName="transform" type="scale" additive="sum" dur="1s" values="1;1.12;1" repeatCount="indefinite" />
            </circle>

            {/* faint aura */}
            <circle r="8.5" fill="url(#headRadialOuter)" opacity="0.7" filter="url(#bloomSoft)">
              <animateMotion dur={dur} repeatCount="indefinite" rotate="auto">
                <mpath xlinkHref="#route" href="#route" />
              </animateMotion>
              <animate attributeName="opacity" dur="1.8s" values="0.55;0.75;0.6;0.7;0.55" repeatCount="indefinite" />
            </circle>
          </g>
        </g>
      </g>

      {/* --- Gradients & Filters ------------------------------------------- */}
      <defs>
        {/* your gradients (unchanged) */}
        <linearGradient id="paint0_linear_7770_27570" x1="16.6745" y1="36.7675" x2="144.125" y2="35.7694" gradientUnits="userSpaceOnUse">
          <stop stopColor="#FF9C26"/>
          <stop offset="1" stopColor="#F14575"/>
        </linearGradient>
        <linearGradient id="paint1_linear_7770_27570" x1="70.5557" y1="142.185" x2="108.121" y2="51.7212" gradientUnits="userSpaceOnUse">
          <stop stopColor="#65BDEB"/>
          <stop offset="0.630814" stopColor="#65BDEB" stopOpacity="0"/>
        </linearGradient>

        {/* Tail gradients (cool neon → transparent) */}
        <linearGradient id="tailGradientShort" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="162" y2="0">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="30%" stopColor="#A796FF" />
          <stop offset="100%" stopColor="#6C52FF" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="tailGradientMid" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="162" y2="0">
          <stop offset="0%" stopColor="#B6A9FF" stopOpacity="0.9" />
          <stop offset="35%" stopColor="#8A71FF" stopOpacity="0.7" />
          <stop offset="100%" stopColor="#4A34D9" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="tailGradientLong" gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="162" y2="0">
          <stop offset="0%" stopColor="#7E57FF" stopOpacity="0.55" />
          <stop offset="55%" stopColor="#5C3FE6" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#3B2CB0" stopOpacity="0" />
        </linearGradient>

        {/* Comet head */}
        <radialGradient id="headRadial" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="35%" stopColor="#CBBEFF" />
          <stop offset="100%" stopColor="#7B5BFF" stopOpacity="0.1" />
        </radialGradient>
        <radialGradient id="headRadialOuter" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#A796FF" stopOpacity="0.8" />
          <stop offset="80%" stopColor="#6C52FF" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#6C52FF" stopOpacity="0" />
        </radialGradient>

        {/* Bloom/Glow filters */}
        <filter id="bloomHard" x="-80%" y="-80%" width="260%" height="260%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="1.7" result="b1" />
          {/* turn blur into bright bloom */}
          <feColorMatrix in="b1" type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 18 -8" result="b2" />
          <feBlend in="SourceGraphic" in2="b2" mode="screen"/>
        </filter>

        <filter id="bloom" x="-120%" y="-120%" width="340%" height="340%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="3.5" result="b1" />
          <feColorMatrix in="b1" type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 16 -6" result="b2" />
          <feBlend in="SourceGraphic" in2="b2" mode="screen"/>
        </filter>

        <filter id="bloomSoft" x="-180%" y="-180%" width="460%" height="460%" colorInterpolationFilters="sRGB">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6.5" result="b1" />
          <feColorMatrix in="b1" type="matrix"
            values="1 0 0 0 0
                    0 1 0 0 0
                    0 0 1 0 0
                    0 0 0 14 -5" result="b2" />
          <feBlend in="SourceGraphic" in2="b2" mode="screen"/>
        </filter>
      </defs>
    </svg>
  );
};

export default GlowAnimationV2;
