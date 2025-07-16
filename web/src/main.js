// Import styles
import './styles/index.css'
import './styles/components/dualBrandLogoMask.css'
import './styles/components/customCursor.css'
import './styles/components/videoBackground.css'
import './styles/components/hero.css'

// Import animation libraries
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'
import imagesLoaded from 'imagesloaded'

// Import smooth scroll system
import smoothScroll from './animations/smoothScroll.js'

// Import animation controller
import animationController from './animations/animationController.js'

// Import text animations
import textAnimations from './animations/textAnimations.js'

// Import theme transition system
import themeTransition from './animations/themeTransition.js'

// Import dual brand logo mask
import DualBrandLogoMask from './components/dualBrandLogoMask.js'

// Import custom cursor system
import CustomCursor from './components/customCursor.js'

// Import navigation system
import Navigation from './components/navigation.js'

// Import video background system
import videoBackgroundManager from './utils/videoBackgroundManager.js'

// Import hero section
import HeroSection from './sections/hero.js'

// Import existing section modules
import { initStatsCounters, createStatsSection } from './sections/stats.js'
import { initAboutReveal } from './sections/about.js'
import { initAmenitiesScroll } from './sections/amenities.js'
import { initTestimonialsMarquee } from './sections/testimonials.js'
import { initContactForm } from './sections/contact.js'
import { initMap } from './sections/location.js'
import { initOurGroupReveal } from './sections/ourGroup.js'
import { initIntro } from './sections/intro.js'

// Import utilities
import { debounce, throttle, isInViewport, scrollToElement } from './utils/index.js'

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger)

// Application class for modern architecture
class AnantaApp {
  constructor() {
    this.lenis = null
    this.isLoaded = false
    this.currentTheme = 'dawn'
    this.animations = new Map()
    this.dualBrandMask = null
    this.customCursor = null
    this.navigation = null
    this.mainSiteReady = false
    
    this.init()
  }
  
  async init() {
    try {
      // Wait for DOM to be ready
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => this.start())
      } else {
        this.start()
      }
    } catch (error) {
      console.error('Failed to initialize Ananta App:', error)
    }
  }
  
  async start() {
    // Initialize custom cursor system first (works during dual brand mask)
    this.initCustomCursor()
    
    // Initialize dual brand logo mask
    this.initDualBrandMask()
    
    // Initialize smooth scrolling
    this.initSmoothScroll()
    
    // Initialize theme system
    this.initThemeSystem()
    
    // Wait for images to load
    await this.waitForImages()
    
    // Prepare main site (but don't show until dual brand is complete)
    this.prepareMainSite()
    
    // Mark as loaded
    this.isLoaded = true
    document.body.classList.add('loaded')
    
    console.log('🏛️ Ananta website loaded successfully')
  }
  
  initSmoothScroll() {
    // Initialize our smooth scroll system
    this.lenis = smoothScroll.init({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    })
    
    // Connect Lenis with GSAP ScrollTrigger
    this.lenis.on('scroll', ScrollTrigger.update)
    
    gsap.ticker.add((time) => {
      this.lenis.raf(time * 1000)
    })
    
    gsap.ticker.lagSmoothing(0)
  }
  
  initThemeSystem() {
    // Initialize the scroll-based theme transition system
    themeTransition.init()
    
    // Listen for theme transition events
    window.addEventListener('themeTransition', (e) => {
      this.currentTheme = e.detail.theme
      
      // Update theme indicator
      this.updateThemeIndicator(e.detail.theme, e.detail.scrollProgress)
      
      // Update other components that depend on theme
      if (this.customCursor) {
        this.customCursor.updateTheme(e.detail.theme)
      }
      
      if (this.navigation) {
        this.navigation.refresh()
      }
    })
    
    // Auto theme transition based on time (optional fallback)
    if (localStorage.getItem('ananta-auto-theme') === 'true') {
      this.initAutoTheme()
    }
    
    console.log('🌅 Theme transition system initialized')
  }
  
  setTheme(theme) {
    this.currentTheme = theme
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('ananta-theme', theme)
    
    // Dispatch theme change event
    window.dispatchEvent(new CustomEvent('themechange', { detail: { theme } }))
  }
  
  initAutoTheme() {
    const hour = new Date().getHours()
    let autoTheme = 'dawn'
    
    if (hour >= 6 && hour < 12) autoTheme = 'dawn'
    else if (hour >= 12 && hour < 18) autoTheme = 'day'
    else if (hour >= 18 && hour < 21) autoTheme = 'dusk'
    else autoTheme = 'night'
    
    this.setTheme(autoTheme)
  }
  
  async waitForImages() {
    return new Promise((resolve) => {
      imagesLoaded(document.body, { background: true }, resolve)
    })
  }
  
  initExistingSections() {
    // Initialize existing section functionality
    try {
      // Initialize intro first
      initIntro()
      
      // Initialize other sections
      initStatsCounters()
      initAboutReveal()
      initAmenitiesScroll()
      initTestimonialsMarquee()
      initContactForm()
      initMap()
      initOurGroupReveal()
      
      // Headline animations are now handled by textAnimations system
    } catch (error) {
      console.warn('Some existing sections failed to initialize:', error)
    }
  }
  
  initCustomCursor() {
    // Initialize custom cursor system
    this.customCursor = new CustomCursor()
    
    // Listen for theme changes to update cursor colors
    window.addEventListener('themechange', (e) => {
      if (this.customCursor) {
        this.customCursor.updateTheme(e.detail.theme)
      }
    })
    
    console.log('🎯 Custom cursor system initialized')
  }
  
  initNavigation() {
    // Initialize navigation system
    this.navigation = new Navigation()
    
    // Listen for theme changes to update navigation
    window.addEventListener('themechange', (e) => {
      if (this.navigation) {
        this.navigation.refresh()
      }
    })
    
    console.log('🧭 Navigation system initialized')
  }
  
  initDualBrandMask() {
    // Initialize dual brand logo mask system
    this.dualBrandMask = new DualBrandLogoMask()
    
    // Listen for dual brand completion
    document.addEventListener('dualBrandMaskComplete', (e) => {
      console.log('🎭 Dual brand mask completed, initializing main site')
      this.onDualBrandComplete()
    })
    
    // Initialize the mask
    this.dualBrandMask.init()
  }
  
  onDualBrandComplete() {
    // Now initialize the main site animations and functionality
    this.initNavigation()
    this.initHeroSection()
    this.initExistingSections()
    this.initAnimations()
    this.initVideoBackgrounds()
    this.initEventListeners()
    this.mainSiteReady = true
    
    console.log('🏛️ Main site fully initialized after dual brand intro')
  }
  
  initHeroSection() {
    // Initialize hero section with cinematic day-time experience
    this.heroSection = new HeroSection()
    this.heroSection.init()
    
    console.log('🌅 Hero section with cinematic day-time experience initialized')
  }
  
  prepareMainSite() {
    // Prepare main site elements but don't initialize interactions yet
    // This ensures everything is ready when dual brand completes
    
    // Create enhanced stats section structure
    createStatsSection()
    
    console.log('🏛️ Main site prepared, waiting for dual brand completion')
  }

  initAnimations() {
    // Initialize animation controller with data-preset system
    animationController.init()
    
    // Initialize text animations
    textAnimations.init()
    
    // Initialize scroll-triggered animations
    this.initScrollAnimations()
    
    // Initialize hover animations
    this.initHoverAnimations()
  }
  

  
  initScrollAnimations() {
    // Fade up animations
    const fadeUpElements = document.querySelectorAll('[data-animate="fade-up"]')
    
    fadeUpElements.forEach((element) => {
      gsap.set(element, { opacity: 0, y: 50 })
      
      ScrollTrigger.create({
        trigger: element,
        start: 'top 80%',
        onEnter: () => {
          gsap.to(element, {
            opacity: 1,
            y: 0,
            duration: 1,
            ease: 'power2.out'
          })
        }
      })
    })
    
    // Scale in animations
    const scaleElements = document.querySelectorAll('[data-animate="scale"]')
    
    scaleElements.forEach((element) => {
      gsap.set(element, { opacity: 0, scale: 0.8 })
      
      ScrollTrigger.create({
        trigger: element,
        start: 'top 80%',
        onEnter: () => {
          gsap.to(element, {
            opacity: 1,
            scale: 1,
            duration: 1,
            ease: 'back.out(1.7)'
          })
        }
      })
    })
  }
  
  initHoverAnimations() {
    // Button hover effects
    const buttons = document.querySelectorAll('.btn-luxury')
    
    buttons.forEach((button) => {
      button.addEventListener('mouseenter', () => {
        gsap.to(button, { scale: 1.05, duration: 0.3, ease: 'power2.out' })
      })
      
      button.addEventListener('mouseleave', () => {
        gsap.to(button, { scale: 1, duration: 0.3, ease: 'power2.out' })
      })
    })
  }
  
  initVideoBackgrounds() {
    // Initialize video background system
    videoBackgroundManager.init()
    
    console.log('🎬 Video background system initialized')
  }
  
  initEventListeners() {
    // Resize handler
    const handleResize = debounce(() => {
      ScrollTrigger.refresh()
    }, 250)
    
    window.addEventListener('resize', handleResize)
    
    // Theme toggle functionality
    const themeToggle = document.querySelector('[data-theme-toggle]')
    if (themeToggle) {
      themeToggle.addEventListener('click', () => {
        const themes = ['dawn', 'day', 'dusk', 'night']
        const currentIndex = themes.indexOf(this.currentTheme)
        const nextTheme = themes[(currentIndex + 1) % themes.length]
        this.setTheme(nextTheme)
      })
    }
    
    // Navigation smooth scroll
    const navLinks = document.querySelectorAll('a[href^="#"]')
    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault()
        const target = document.querySelector(link.getAttribute('href'))
        if (target) {
          this.lenis.scrollTo(target, { duration: 1.5 })
        }
      })
    })
  }
  
  // Public methods for external use
  scrollTo(target, options = {}) {
    smoothScroll.scrollTo(target, options)
  }
  
  refresh() {
    ScrollTrigger.refresh()
  }
  
  destroy() {
    smoothScroll.destroy()
    ScrollTrigger.getAll().forEach(trigger => trigger.kill())
    this.animations.clear()
    
    // Clean up theme transition system
    themeTransition.destroy()
    
    // Clean up custom cursor
    if (this.customCursor) {
      this.customCursor.destroy()
      this.customCursor = null
    }
    
    // Clean up navigation
    if (this.navigation) {
      this.navigation.destroy()
      this.navigation = null
    }
  }
  
  // Theme management methods
  getCurrentTheme() {
    return themeTransition.getCurrentTheme()
  }
  
  getScrollProgress() {
    return themeTransition.getScrollProgress()
  }
  
  getThemeColors() {
    return themeTransition.getThemeColors()
  }
  
  forceTheme(themeName) {
    themeTransition.setTheme(themeName)
  }
  
  // Update theme indicator UI
  updateThemeIndicator(theme, scrollProgress) {
    const themeNameElement = document.getElementById('theme-name')
    const scrollProgressElement = document.getElementById('scroll-progress')
    
    if (themeNameElement) {
      themeNameElement.textContent = theme.charAt(0).toUpperCase() + theme.slice(1)
    }
    
    if (scrollProgressElement) {
      scrollProgressElement.textContent = `${Math.round(scrollProgress * 100)}%`
    }
  }
}

// Initialize the application
const app = new AnantaApp()

// Make app globally available for debugging
if (typeof window !== 'undefined') {
  window.AnantaApp = app
}

// Export for module usage
export default app
