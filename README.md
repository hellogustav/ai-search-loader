# Glow Animation Component

A beautiful React/TypeScript component that creates an animated glowing orb following a custom SVG path with trail and shimmer effects.

## Features

- ✨ Smooth animation following a custom @ symbol path
- 🌟 Customizable trail particles
- ✨ Shimmer sparkle effects
- 🎨 Gradient colored path
- ⚡ GPU-accelerated animations
- 📦 TypeScript support
- 🎛️ Fully customizable props

## Installation

1. Copy the following files to your React project:
   - `GlowAnimation.tsx`
   - `GlowAnimation.css`

2. Import the component:

```tsx
import GlowAnimation from './GlowAnimation';
```

## Usage

### Basic Usage

```tsx
import GlowAnimation from './GlowAnimation';

function App() {
  return (
    <div>
      <GlowAnimation />
    </div>
  );
}
```

### With Custom Props

```tsx
<GlowAnimation
  duration={3}           // Animation completes in 3 seconds
  trailLength={20}       // 20 trail particles
  showTrail={true}       // Show trailing particles
  showShimmer={true}     // Show shimmer effects
  className="my-custom-class"
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `duration` | `number` | `4` | Animation duration in seconds |
| `trailLength` | `number` | `15` | Number of trail particles to render |
| `showTrail` | `boolean` | `true` | Enable/disable trail effect |
| `showShimmer` | `boolean` | `true` | Enable/disable shimmer sparkles |
| `className` | `string` | `''` | Additional CSS class names |

## Customization

### Change Colors

Edit the CSS gradients in `GlowAnimation.css`:

```css
/* Glow core color */
.glow-core {
  background: white; /* Change this */
  box-shadow: 0 0 10px rgba(255, 255, 255, 1); /* And these */
}

/* Trail color */
.trail-particle {
  background: linear-gradient(135deg,
    rgba(147, 197, 253, 0.8), /* Change colors */
    rgba(59, 130, 246, 0.4));
}
```

### Change Path

To use a different path, replace the `d` attribute in the `<path ref={routePathRef}>` element in `GlowAnimation.tsx`.

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers

## Performance

The animation uses `requestAnimationFrame` and CSS transforms for optimal performance. The component automatically cleans up particles and cancels animations on unmount.

## Demo

Run the included `App.tsx` to see various configuration examples:

```bash
npm start
```

## License

MIT
