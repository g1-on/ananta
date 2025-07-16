export default {
  plugins: {
    // Import CSS files
    'postcss-import': {},
    
    // Tailwind CSS processing
    tailwindcss: {},
    
    // Nested CSS support for better organization
    'postcss-nested': {},
    
    // Autoprefixer for browser compatibility
    autoprefixer: {
      // Target modern browsers for better performance
      overrideBrowserslist: [
        '> 1%',
        'last 2 versions',
        'not dead',
        'not ie 11'
      ],
      // Enable grid support
      grid: 'autoplace'
    },
    
    // CSS optimization for production
    ...(process.env.NODE_ENV === 'production' && {
      cssnano: {
        preset: ['default', {
          // Preserve important comments
          discardComments: {
            removeAll: false,
          },
          // Optimize animations
          reduceIdents: false,
          // Preserve CSS custom properties for theme transitions
          normalizeWhitespace: false,
        }]
      }
    })
  },
};
