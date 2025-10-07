# AI Search Loader Animation Collection

A collection of 8 beautiful animated loading components for React applications, featuring neon trails, gradient text animations, and smooth transitions. Perfect for AI-powered search interfaces and modern web applications.

🚀 **[Live Demo](https://ai-search-loader-demo-33db839f2540.herokuapp.com/)**

## Features

- 🎨 **8 Different Animations** - From simple spinners to complex neon trails
- ✨ **Neon Trail Effects** - Smooth animated trails with gradient colors
- 📝 **Typewriter Text Animation** - AI search messages with typewriter effect
- 🌈 **Gradient Text Effects** - Animated color-shifting text
- 🌙 **Dark/Light Theme Support** - Automatic theme adaptation
- ⚡ **GPU-Accelerated** - Smooth 60fps animations
- 📱 **Fully Responsive** - Works on all screen sizes
- 🎛️ **Highly Customizable** - Easy to configure and extend
- 📦 **TypeScript Support** - Full type definitions included

## Available Animations

1. **V1** - Original shimmer animation with trail effects
2. **V1.1** - Enhanced neon trail with continuous glow
3. **V2** - Lightweight animation with single trail
4. **V3** - High-performance version with optimized rendering
5. **V4** - Extended trail with smooth transitions
6. **V5** - Multi-particle effects with variations
7. **V6** - Multiple tracer animations (Spin, Pulse, Wave, Orbit)
8. **V7** - Production-ready standalone component
9. **V8** - AI Search Loader with typewriter text animations

## Installation

### For the full collection:

1. Clone the repository:
```bash
git clone https://github.com/hellogustav/ai-search-loader.git
```

2. Install dependencies:
```bash
npm install
```

3. Run the demo:
```bash
npm start
```

### For individual components:

Copy the desired component files to your React project:
- `GlowAnimationV7.tsx` - Standalone production version
- `GlowAnimationV8.tsx` & `GlowAnimationV8.css` - Version with text animations

## Usage

### Basic Usage

```tsx
import GlowAnimationV7 from './GlowAnimationV7';

function App() {
  return (
    <div>
      <GlowAnimationV7 />
    </div>
  );
}
```

### With Loading Text (V8)

```tsx
import GlowAnimationV8 from './GlowAnimationV8';
import './GlowAnimationV8.css';

function App() {
  return (
    <GlowAnimationV8
      messages={[
        "Searching database...",
        "Analyzing results...",
        "Preparing recommendations..."
      ]}
      textAnimation="typewriter"
    />
  );
}
```

## Props

### GlowAnimationV7 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `duration` | `number` | `2.24` | Animation duration in seconds |
| `reverse` | `boolean` | `false` | Reverse animation direction |
| `ariaLabel` | `string` | `"Animated neon trail..."` | Accessibility label |

### GlowAnimationV8 Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `duration` | `number` | `2.24` | Spinner animation duration |
| `reverse` | `boolean` | `false` | Reverse spinner direction |
| `showText` | `boolean` | `true` | Show/hide loading text |
| `textChangeInterval` | `number` | `2.5` | Text change interval (seconds) |
| `textAnimation` | `string` | `'typewriter'` | Animation style: `'typewriter'`, `'fade'`, `'slide'`, `'flip'`, `'blur'` |
| `messages` | `string[]` | *(20 default messages)* | Custom loading messages |
| `className` | `string` | `''` | Additional CSS class |

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
