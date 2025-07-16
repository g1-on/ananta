import { defineConfig } from 'vite'

export default defineConfig({
  // Optimized for animations and performance
  build: {
    // Enable code splitting for better performance
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate animation libraries for better caching
          animations: ['gsap', '@studio-freight/lenis', 'split-type'],
          // Separate utilities
          utils: ['imagesloaded']
        }
      }
    },
    // Optimize for modern browsers (ES2020+)
    target: 'es2020',
    // Enable minification for production
    minify: 'esbuild',
    // Generate source maps for debugging
    sourcemap: true,
    // Optimize CSS
    cssCodeSplit: true,
    // Preload modules for better performance
    modulePreload: {
      polyfill: true
    }
  },
  
  // Development server configuration
  server: {
    port: 3000,
    open: true,
    // Enable hot module replacement for faster development
    hmr: {
      overlay: true
    }
  },
  
  // Preview server configuration
  preview: {
    port: 4173,
    open: true
  },
  
  // Optimize dependencies for faster builds
  optimizeDeps: {
    include: [
      'gsap',
      '@studio-freight/lenis',
      'split-type',
      'imagesloaded'
    ],
    // Force optimization of animation libraries
    force: true
  },
  
  // CSS configuration for animations
  css: {
    // Enable CSS modules if needed
    modules: false,
    // PostCSS configuration will be loaded from postcss.config.js
    postcss: {},
    // Enable CSS source maps
    devSourcemap: true,
    // Optimize CSS for production
    preprocessorOptions: {
      css: {
        // Enable modern CSS features
        charset: false
      }
    }
  },
  
  // Asset handling for media files
  assetsInclude: [
    '**/*.mp4',
    '**/*.webm',
    '**/*.ogg',
    '**/*.mp3',
    '**/*.wav',
    '**/*.flac',
    '**/*.aac',
    '**/*.woff',
    '**/*.woff2',
    '**/*.eot',
    '**/*.ttf',
    '**/*.otf'
  ],
  
  // Plugin configuration
  plugins: [],
  
  // Define global constants
  define: {
    // Enable development features in dev mode
    __DEV__: JSON.stringify(process.env.NODE_ENV === 'development')
  },
  
  // Resolve configuration
  resolve: {
    alias: {
      // Create path aliases for cleaner imports
      '@': '/src',
      '@components': '/src/components',
      '@animations': '/src/animations',
      '@styles': '/src/styles',
      '@utils': '/src/utils',
      '@assets': '/src/assets'
    }
  }
})