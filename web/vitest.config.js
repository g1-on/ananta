import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.js'],
    css: true,
    // Mock CSS imports for testing
    transformMode: {
      web: [/\.[jt]sx?$/],
      ssr: [/\.css$/]
    },
    // Coverage configuration
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      exclude: [
        'node_modules/',
        'src/test/',
        '**/*.test.js',
        '**/*.spec.js'
      ]
    }
  },
  // Resolve aliases to match Vite config
  resolve: {
    alias: {
      '@': '/src',
      '@components': '/src/components',
      '@animations': '/src/animations',
      '@styles': '/src/styles',
      '@utils': '/src/utils',
      '@assets': '/src/assets'
    }
  }
})
