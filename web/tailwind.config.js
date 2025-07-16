/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,html}',
  ],
  theme: {
    extend: {
      // Luxury color palette: Gold, White, Black
      colors: {
        // Primary Gold Variations (60% of design)
        gold: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#ecbb4f', // Main gold accent
          600: '#d4af37', // Deeper gold for contrast
          700: '#b8860b', // Subtle gold for backgrounds
          800: '#92400e',
          900: '#78350f',
          light: '#ffd700', // Bright highlights
          primary: '#ecbb4f', // Main gold accent
          dark: '#d4af37', // Deeper gold for contrast
          muted: '#b8860b', // Subtle gold for backgrounds
          warm: '#ffb347', // Warm gold for hover states
          cool: '#daa520', // Cool gold for active states
        },
        
        // Neutral Base (30% of design)
        neutral: {
          white: '#ffffff', // Pure white for clean backgrounds
          'off-white': '#f8f8f8', // Soft white for subtle contrast
          'light-gray': '#e0e0e0', // Light gray for borders
          'dark-gray': '#2a2a2a', // Dark gray for text
          black: '#000000', // Pure black for maximum contrast
        },
        
        // Theme transition colors
        theme: {
          dawn: {
            bg: '#ffffff',
            text: '#000000',
            accent: '#ecbb4f'
          },
          day: {
            bg: '#f8f8f8',
            text: '#1a1a1a',
            accent: '#d4af37'
          },
          dusk: {
            bg: '#2a2a2a',
            text: '#e0e0e0',
            accent: '#ffd700'
          },
          night: {
            bg: '#000000',
            text: '#ffffff',
            accent: '#ecbb4f'
          }
        },
        
        // Legacy brand colors for compatibility
        brand: {
          DEFAULT: '#000000',
          inverted: '#ffffff',
          gold: '#ecbb4f',
        },
      },
      
      // Typography with Montserrat Thin focus
      fontFamily: {
        'montserrat': ['Montserrat', 'sans-serif'],
        'montserrat-thin': ['Montserrat', 'sans-serif'],
        'tiro': ['"Tiro Devanagari Hindi"', 'serif'],
        'sans': ['Montserrat', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      
      // Font weights for Montserrat variations
      fontWeight: {
        'thin': '100',
        'extralight': '200',
        'light': '300',
        'normal': '400',
        'medium': '500',
        'semibold': '600',
        'bold': '700',
        'extrabold': '800',
        'black': '900',
      },
      
      // Animation and transition configurations
      animation: {
        'fade-in': 'fadeIn 0.8s ease-out',
        'fade-up': 'fadeUp 1.2s ease-out',
        'scale-in': 'scaleIn 1.0s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
        'slide-left': 'slideLeft 1.2s ease-out',
        'float': 'float 3s ease-in-out infinite',
        'pulse-gold': 'pulseGold 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      
      // Custom keyframes for luxury animations
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(50px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.8)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        slideLeft: {
          '0%': { opacity: '0', transform: 'translateX(100px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        pulseGold: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
      },
      
      // Spacing for luxury layouts
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      
      // Custom shadows for depth
      boxShadow: {
        'gold': '0 0 20px rgba(236, 187, 79, 0.3)',
        'gold-lg': '0 0 30px rgba(236, 187, 79, 0.5)',
        'luxury': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
        'luxury-gold': '0 25px 50px -12px rgba(236, 187, 79, 0.15)',
      },
      
      // Custom gradients
      backgroundImage: {
        'gradient-gold': 'linear-gradient(135deg, #ecbb4f 0%, #d4af37 100%)',
        'gradient-luxury': 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
        'gradient-dawn': 'linear-gradient(135deg, #ffffff 0%, #f8f8f8 100%)',
        'gradient-dusk': 'linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)',
      },
      
      // Custom blur effects
      backdropBlur: {
        'xs': '2px',
      },
      
      // Custom border radius for modern design
      borderRadius: {
        '4xl': '2rem',
      },
    },
  },
  plugins: [
    // Add custom utilities
    function({ addUtilities }) {
      const newUtilities = {
        // Luxury text styles
        '.text-luxury': {
          fontFamily: 'Montserrat, sans-serif',
          fontWeight: '100',
          letterSpacing: '0.05em',
        },
        '.text-gold-glow': {
          textShadow: '0 0 10px rgba(236, 187, 79, 0.5)',
        },
        // Smooth transitions
        '.transition-luxury': {
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        },
        // Glass morphism effect
        '.glass': {
          backdropFilter: 'blur(10px)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        // Custom cursor styles
        '.cursor-luxury': {
          cursor: 'none',
        },
      }
      addUtilities(newUtilities)
    }
  ],
};
