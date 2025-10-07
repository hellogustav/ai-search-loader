# Setup Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm start
   ```

3. **Open your browser:**
   Navigate to `http://localhost:3000`

## Project Structure

```
fancy ai search loader/
├── public/
│   └── index.html          # HTML root
├── src/ (move files here)
│   ├── index.tsx           # React entry point
│   ├── index.css           # Global styles
│   ├── App.tsx             # Demo app
│   ├── App.css             # Demo styles
│   ├── GlowAnimation.tsx   # Main component
│   └── GlowAnimation.css   # Component styles
├── package.json            # Dependencies
├── tsconfig.json           # TypeScript config
└── README.md               # Documentation
```

## Files Created

### Core Component Files
- **GlowAnimation.tsx** - The main React component with animation logic
- **GlowAnimation.css** - Styles for the glow effect, trails, and shimmer

### Demo Files
- **App.tsx** - Demo application showing various configurations
- **App.css** - Styling for the demo page
- **index.tsx** - React root entry point
- **index.css** - Global CSS reset and base styles

### Configuration Files
- **package.json** - npm dependencies and scripts
- **tsconfig.json** - TypeScript compiler configuration
- **public/index.html** - HTML template

### Documentation
- **README.md** - Component usage and API documentation
- **SETUP.md** - This file

## Usage in Your Own Project

### Option 1: Copy Component Files

Just copy these two files to your React project:
1. `GlowAnimation.tsx`
2. `GlowAnimation.css`

Then import and use:
```tsx
import GlowAnimation from './GlowAnimation';

function MyComponent() {
  return <GlowAnimation />;
}
```

### Option 2: Use the Full Demo

1. Install all dependencies: `npm install`
2. Run the demo: `npm start`
3. Explore different configurations in `App.tsx`

## Customization

### Change Animation Speed
```tsx
<GlowAnimation duration={2} /> {/* Completes in 2 seconds */}
```

### Adjust Trail Length
```tsx
<GlowAnimation trailLength={30} /> {/* More trail particles */}
```

### Toggle Effects
```tsx
<GlowAnimation
  showTrail={false}    {/* No trail */}
  showShimmer={false}  {/* No sparkles */}
/>
```

### Custom Styling
Add a className and override styles:
```tsx
<GlowAnimation className="my-custom-animation" />
```

```css
.my-custom-animation {
  width: 300px;
  height: 300px;
}
```

## Troubleshooting

### Port 3000 already in use
Change the port by running:
```bash
PORT=3001 npm start
```

### TypeScript errors
Make sure you have TypeScript installed:
```bash
npm install --save-dev typescript @types/react @types/react-dom
```

### Component not rendering
1. Check that both `.tsx` and `.css` files are imported
2. Verify React is version 18+
3. Check browser console for errors

## Performance Tips

- The animation uses `requestAnimationFrame` for smooth 60fps
- Trail particles are automatically cleaned up
- All animations use CSS transforms (GPU accelerated)
- Component cleans up on unmount to prevent memory leaks

## Browser Support

- ✅ Chrome/Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ iOS Safari 14+
- ✅ Chrome Android

## Next Steps

1. Open `App.tsx` to see usage examples
2. Open `GlowAnimation.tsx` to understand the animation logic
3. Open `GlowAnimation.css` to customize colors and effects
4. Read `README.md` for detailed API documentation

## Need Help?

- Check the `README.md` for component API documentation
- Look at `App.tsx` for working examples
- The code is well-commented for easy understanding

Enjoy your glowing animation! ✨
