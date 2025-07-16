/**
 * Day-to-Night Theme Transition System
 * Inspired by Zentry's scroll-based theme transitions
 * Implements luxury color theory with 60-30-10 rule
 */

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

class ThemeTransition {
  constructor() {
    this.scrollProgress = 0
    this.currentTheme = 'dawn'
    this.isTransitioning = false
    this.transitionSpeed = 0.1 // Smooth transition speed
    
    // Theme stages with luxury color theory (60-30-10 rule)
    this.themeStages = [
      {
        name: 'dawn',
        start: 0,
        end: 0.25,
        colors: {
          // 60% - Dominant color (background)
          bg: '#ffffff',
          bgSecondary: '#f8f8f8',
          // 30% - Secondary color (text/content)
          text: '#000000',
          textSecondary: '#1a1a1a',
          // 10% - Accent color (highlights)
          accent: '#ecbb4f',
          accentLight: '#ffd700',
          accentDark: '#d4af37',
          // Supporting colors
          border: '#e0e0e0',
          shadow: 'rgba(236, 187, 79, 0.1)'
        }
      },
      {
        name: 'day',
        start: 0.25,
        end: 0.5,
        colors: {
          bg: '#f8f8f8',
          bgSecondary: '#ffffff',
          text: '#1a1a1a',
          textSecondary: '#2a2a2a',
          accent: '#d4af37',
          accentLight: '#ecbb4f',
          accentDark: '#b8860b',
          border: '#e0e0e0',
          shadow: 'rgba(212, 175, 55, 0.15)'
        }
      },
      {
        name: 'dusk',
        start: 0.5,
        end: 0.75,
        colors: {
          bg: '#2a2a2a',
          bgSecondary: '#1a1a1a',
          text: '#e0e0e0',
          textSecondary: '#ffffff',
          accent: '#ffd700',
          accentLight: '#ffed4e',
          accentDark: '#daa520',
          border: '#404040',
          shadow: 'rgba(255, 215, 0, 0.2)'
        }
      },
      {
        name: 'night',
        start: 0.75,
        end: 1,
        colors: {
          bg: '#000000',
          bgSecondary: '#1a1a1a',
          text: '#ffffff',
          textSecondary: '#e0e0e0',
          accent: '#ecbb4f',
          accentLight: '#ffd700',
          accentDark: '#d4af37',
          border: '#333333',
          shadow: 'rgba(236, 187, 79, 0.25)'
        }
      }
    ]
    
    // Cached DOM elements for performance
    this.rootElement = document.documentElement
    this.bodyElement = document.body
    
    // Animation frame ID for smooth transitions
    this.rafId = null
    
    // Bind methods
    this.handleScroll = this.handleScroll.bind(this)
    this.updateTheme = this.updateTheme.bind(this)
    this.onResize = this.onResize.bind(this)
  }
  
  init() {
    this.setupScrollListener()
    this.createCSSVariables()
    this.setupResizeListener()
    this.initializeTheme()
    
    console.log('🌅 Theme transition system initialized')
  }
  
  setupScrollListener() {
    // Use GSAP's ticker for smooth 60fps updates
    gsap.ticker.add(this.handleScroll)
    
    // Also listen to scroll events for immediate updates
    window.addEventListener('scroll', this.updateScrollProgress.bind(this), { passive: true })
  }
  
  setupResizeListener() {
    window.addEventListener('resize', this.onResize, { passive: true })
  }
  
  updateScrollProgress() {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop
    const scrollHeight = document.documentElement.scrollHeight - window.innerHeight
    
    if (scrollHeight > 0) {
      this.scrollProgress = Math.max(0, Math.min(1, scrollTop / scrollHeight))
    } else {
      this.scrollProgress = 0
    }
  }
  
  handleScroll() {
    this.updateScrollProgress()
    
    if (!this.isTransitioning) {
      this.isTransitioning = true
      this.updateTheme()
    }
  }
  
  updateTheme() {
    const currentStage = this.getCurrentThemeStage()
    const nextStage = this.getNextThemeStage()
    
    if (currentStage) {
      if (nextStage && this.scrollProgress > currentStage.start && this.scrollProgress < nextStage.end) {
        // We're in a transition zone - blend colors
        const blendRatio = this.calculateBlendRatio(currentStage, nextStage)
        const blendedColors = this.blendColors(currentStage.colors, nextStage.colors, blendRatio)
        this.applyCSSVariables(blendedColors)
        
        // Update current theme name for external components
        const newThemeName = blendRatio > 0.5 ? nextStage.name : currentStage.name
        if (newThemeName !== this.currentTheme) {
          this.currentTheme = newThemeName
          this.dispatchThemeChange(newThemeName, blendedColors)
        }
      } else {
        // We're in a stable zone - use stage colors directly
        this.applyCSSVariables(currentStage.colors)
        
        if (currentStage.name !== this.currentTheme) {
          this.currentTheme = currentStage.name
          this.dispatchThemeChange(currentStage.name, currentStage.colors)
        }
      }
    }
    
    this.isTransitioning = false
  }
  
  getCurrentThemeStage() {
    return this.themeStages.find(stage => 
      this.scrollProgress >= stage.start && this.scrollProgress <= stage.end
    ) || this.themeStages[0]
  }
  
  getNextThemeStage() {
    const currentIndex = this.themeStages.findIndex(stage => 
      this.scrollProgress >= stage.start && this.scrollProgress <= stage.end
    )
    
    if (currentIndex >= 0 && currentIndex < this.themeStages.length - 1) {
      return this.themeStages[currentIndex + 1]
    }
    
    return null
  }
  
  calculateBlendRatio(currentStage, nextStage) {
    if (!nextStage) return 0
    
    const transitionStart = currentStage.end - 0.1 // Start blending 10% before stage end
    const transitionEnd = nextStage.start + 0.1   // Finish blending 10% after next stage start
    
    if (this.scrollProgress < transitionStart) return 0
    if (this.scrollProgress > transitionEnd) return 1
    
    const transitionProgress = (this.scrollProgress - transitionStart) / (transitionEnd - transitionStart)
    
    // Apply easing for smooth transition
    return this.easeInOutCubic(Math.max(0, Math.min(1, transitionProgress)))
  }
  
  blendColors(fromColors, toColors, ratio) {
    const blended = {}
    
    Object.keys(fromColors).forEach(key => {
      if (key === 'shadow') {
        // Handle rgba shadows specially
        blended[key] = this.blendRGBAColors(fromColors[key], toColors[key], ratio)
      } else {
        // Handle hex colors
        blended[key] = this.blendHexColors(fromColors[key], toColors[key], ratio)
      }
    })
    
    return blended
  }
  
  blendHexColors(color1, color2, ratio) {
    const rgb1 = this.hexToRgb(color1)
    const rgb2 = this.hexToRgb(color2)
    
    if (!rgb1 || !rgb2) return color1
    
    const r = Math.round(rgb1.r + (rgb2.r - rgb1.r) * ratio)
    const g = Math.round(rgb1.g + (rgb2.g - rgb1.g) * ratio)
    const b = Math.round(rgb1.b + (rgb2.b - rgb1.b) * ratio)
    
    return this.rgbToHex(r, g, b)
  }
  
  blendRGBAColors(rgba1, rgba2, ratio) {
    const match1 = rgba1.match(/rgba?\(([^)]+)\)/)
    const match2 = rgba2.match(/rgba?\(([^)]+)\)/)
    
    if (!match1 || !match2) return rgba1
    
    const values1 = match1[1].split(',').map(v => parseFloat(v.trim()))
    const values2 = match2[1].split(',').map(v => parseFloat(v.trim()))
    
    const r = Math.round(values1[0] + (values2[0] - values1[0]) * ratio)
    const g = Math.round(values1[1] + (values2[1] - values1[1]) * ratio)
    const b = Math.round(values1[2] + (values2[2] - values1[2]) * ratio)
    const a = values1[3] + (values2[3] - values1[3]) * ratio
    
    return `rgba(${r}, ${g}, ${b}, ${a.toFixed(3)})`
  }
  
  hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
    return result ? {
      r: parseInt(result[1], 16),
      g: parseInt(result[2], 16),
      b: parseInt(result[3], 16)
    } : null
  }
  
  rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1)
  }
  
  easeInOutCubic(t) {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
  }
  
  applyCSSVariables(colors) {
    // Apply theme colors to CSS custom properties
    this.rootElement.style.setProperty('--theme-bg', colors.bg)
    this.rootElement.style.setProperty('--theme-bg-secondary', colors.bgSecondary)
    this.rootElement.style.setProperty('--theme-text', colors.text)
    this.rootElement.style.setProperty('--theme-text-secondary', colors.textSecondary)
    this.rootElement.style.setProperty('--theme-accent', colors.accent)
    this.rootElement.style.setProperty('--theme-accent-light', colors.accentLight)
    this.rootElement.style.setProperty('--theme-accent-dark', colors.accentDark)
    this.rootElement.style.setProperty('--theme-border', colors.border)
    this.rootElement.style.setProperty('--theme-shadow', colors.shadow)
    
    // Update data attribute for CSS selectors
    this.rootElement.setAttribute('data-theme', this.currentTheme)
    this.rootElement.setAttribute('data-scroll-progress', Math.round(this.scrollProgress * 100))
  }
  
  createCSSVariables() {
    // Initialize CSS variables with dawn theme
    const dawnColors = this.themeStages[0].colors
    this.applyCSSVariables(dawnColors)
  }
  
  initializeTheme() {
    // Set initial theme based on scroll position
    this.updateScrollProgress()
    this.updateTheme()
  }
  
  dispatchThemeChange(themeName, colors) {
    // Dispatch custom event for other components to listen to
    const event = new CustomEvent('themeTransition', {
      detail: {
        theme: themeName,
        colors: colors,
        scrollProgress: this.scrollProgress
      }
    })
    
    window.dispatchEvent(event)
  }
  
  onResize() {
    // Recalculate on resize
    this.updateScrollProgress()
    this.updateTheme()
  }
  
  // Public methods
  getCurrentTheme() {
    return this.currentTheme
  }
  
  getScrollProgress() {
    return this.scrollProgress
  }
  
  getThemeColors() {
    const currentStage = this.getCurrentThemeStage()
    return currentStage ? currentStage.colors : this.themeStages[0].colors
  }
  
  // Force theme (for manual control)
  setTheme(themeName) {
    const stage = this.themeStages.find(s => s.name === themeName)
    if (stage) {
      this.currentTheme = themeName
      this.applyCSSVariables(stage.colors)
      this.dispatchThemeChange(themeName, stage.colors)
    }
  }
  
  // Destroy method for cleanup
  destroy() {
    gsap.ticker.remove(this.handleScroll)
    window.removeEventListener('scroll', this.updateScrollProgress)
    window.removeEventListener('resize', this.onResize)
    
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
    }
  }
}

// Create and export singleton instance
const themeTransition = new ThemeTransition()

export default themeTransition