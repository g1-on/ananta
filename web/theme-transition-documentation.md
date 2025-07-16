# Day-to-Night Theme Transition System

## Overview

The theme transition system implements a sophisticated scroll-based color transition inspired by Zentry's approach, smoothly transitioning between four distinct themes as the user scrolls through the page. The system follows luxury color theory principles with a 60-30-10 color distribution rule.

## Features

### 🌅 Four Theme Stages
- **Dawn** (0-25% scroll): Clean white backgrounds with gold accents
- **Day** (25-50% scroll): Light gray backgrounds with refined gold tones  
- **Dusk** (50-75% scroll): Dark gray backgrounds with bright gold highlights
- **Night** (75-100% scroll): Pure black backgrounds with warm gold accents

### 🎨 Luxury Color Theory (60-30-10 Rule)
- **60% Dominant**: Background colors (bg, bgSecondary)
- **30% Secondary**: Text colors (text, textSecondary)  
- **10% Accent**: Gold variations (accent, accentLight, accentDark)

### ⚡ Smooth Transitions
- Real-time color interpolation based on scroll position
- Cubic easing functions for natural transitions
- 60fps updates using GSAP ticker
- CSS custom properties for instant theme application

## Implementation

### Core Files
- `src/animations/themeTransition.js` - Main theme transition logic
- `src/styles/index.css` - CSS custom properties and theme-aware styles
- `src/main.js` - Integration with main application

### CSS Custom Properties
The system dynamically updates these CSS variables:
```css
--theme-bg              /* Primary background */
--theme-bg-secondary    /* Secondary background */
--theme-text            /* Primary text color */
--theme-text-secondary  /* Secondary text color */
--theme-accent          /* Primary gold accent */
--theme-accent-light    /* Light gold variation */
--theme-accent-dark     /* Dark gold variation */
--theme-border          /* Border colors */
--theme-shadow          /* Shadow colors with opacity */
```

### Theme-Aware CSS Classes
```css
.theme-aware           /* Responds to all theme colors */
.theme-aware-secondary /* Uses secondary color palette */
.theme-aware-accent    /* Uses accent color palette */
.accent-gold          /* Always uses current accent color */
.bg-accent            /* Background with accent color */
```

## Usage

### Automatic Integration
The theme system initializes automatically when the main application loads:

```javascript
import themeTransition from './animations/themeTransition.js'

// Initialize the system
themeTransition.init()

// Listen for theme changes
window.addEventListener('themeTransition', (e) => {
  console.log(`Theme changed to ${e.detail.theme}`)
  console.log(`Scroll progress: ${e.detail.scrollProgress * 100}%`)
})
```

### Manual Theme Control
```javascript
// Force a specific theme
themeTransition.setTheme('night')

// Get current theme
const currentTheme = themeTransition.getCurrentTheme()

// Get current scroll progress
const progress = themeTransition.getScrollProgress()

// Get current theme colors
const colors = themeTransition.getThemeColors()
```

### HTML Integration
Add theme-aware classes to elements:

```html
<!-- Automatically adapts to current theme -->
<div class="theme-aware p-6 rounded-lg">
  <h2 class="accent-gold text-2xl">Dynamic Content</h2>
  <p class="theme-aware-secondary">This text adapts to the theme</p>
</div>

<!-- Theme indicator -->
<div class="theme-aware-accent px-4 py-2 rounded-full">
  <span class="theme-indicator"></span>
  Current Theme: <span id="theme-name">Dawn</span>
</div>
```

## Color Interpolation

The system uses advanced color blending algorithms:

### Hex Color Blending
```javascript
// Smoothly blend between two hex colors
const blended = themeTransition.blendHexColors('#ffffff', '#000000', 0.5)
// Result: '#808080' (50% gray)
```

### RGBA Shadow Blending
```javascript
// Blend shadow colors with opacity
const shadow1 = 'rgba(236, 187, 79, 0.1)'
const shadow2 = 'rgba(255, 215, 0, 0.25)'
const blended = themeTransition.blendRGBAColors(shadow1, shadow2, 0.3)
```

## Performance Optimizations

### Efficient Updates
- Uses GSAP ticker for 60fps smooth updates
- Caches DOM elements to avoid repeated queries
- Throttles transition calculations to prevent excessive updates
- Only updates CSS variables when values actually change

### Memory Management
- Proper cleanup on destroy
- Event listener management
- Animation frame cancellation

## Theme Stages Configuration

Each theme stage defines a complete color palette:

```javascript
{
  name: 'dawn',
  start: 0,
  end: 0.25,
  colors: {
    bg: '#ffffff',           // 60% - Primary background
    bgSecondary: '#f8f8f8',  // 60% - Secondary background
    text: '#000000',         // 30% - Primary text
    textSecondary: '#1a1a1a', // 30% - Secondary text
    accent: '#ecbb4f',       // 10% - Primary accent
    accentLight: '#ffd700',  // 10% - Light accent
    accentDark: '#d4af37',   // 10% - Dark accent
    border: '#e0e0e0',       // Supporting color
    shadow: 'rgba(236, 187, 79, 0.1)' // Shadow with opacity
  }
}
```

## Browser Support

- Modern browsers with CSS custom property support
- Graceful degradation for older browsers
- Respects `prefers-reduced-motion` settings
- Mobile-optimized performance

## Testing

Comprehensive test suite covers:
- Theme initialization and transitions
- Color blending algorithms
- Scroll progress calculations
- Event dispatching
- Cleanup and memory management
- Luxury color theory compliance

Run tests:
```bash
npm test src/animations/__tests__/themeTransition.test.js
```

## Integration with Other Components

The theme system integrates seamlessly with:
- **Custom Cursor**: Updates cursor colors based on current theme
- **Navigation**: Adapts navigation styling to theme changes
- **Video Backgrounds**: Coordinates with theme transitions
- **Dual Brand Logo**: Respects theme timing for brand reveals

## Customization

### Adding New Themes
```javascript
// Add a new theme stage
themeTransition.themeStages.push({
  name: 'midnight',
  start: 0.9,
  end: 1.0,
  colors: {
    // Define color palette
  }
})
```

### Custom Transition Timing
```javascript
// Modify transition speed
themeTransition.transitionSpeed = 0.2 // Faster transitions

// Custom easing function
themeTransition.easeInOutCubic = (t) => {
  // Custom easing logic
}
```

## Accessibility

- Maintains WCAG color contrast ratios across all themes
- Respects user motion preferences
- Provides theme indicators for screen readers
- Keyboard navigation support

## Inspiration

This implementation draws inspiration from:
- **Zentry**: Scroll-based theme transitions
- **ChungiYoo**: Smooth color interpolation
- **Luxury Design Principles**: 60-30-10 color theory
- **Modern Web Standards**: CSS custom properties and performance optimization

The result is a sophisticated theme system that creates an immersive, luxury experience while maintaining excellent performance and accessibility standards.