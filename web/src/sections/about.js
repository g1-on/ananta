/**
 * About Section with Scroll-Triggered Reveals and Dusk Theme
 * Implements luxury animations with Gold/Black contrast and parallax effects
 */

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import SplitType from 'split-type'

class AboutSection {
  constructor() {
    this.section = null
    this.animations = []
    this.parallaxElements = []
    this.isInitialized = false
    
    // Animation presets for luxury reveals
    this.animationPresets = {
      'slide-left': {
        from: { opacity: 0, x: -60, rotationY: -15 },
        to: { opacity: 1, x: 0, rotationY: 0 },
        ease: "power2.out"
      },
      'slide-right': {
        from: { opacity: 0, x: 60, rotationY: 15 },
        to: { opacity: 1, x: 0, rotationY: 0 },
        ease: "power2.out"
      },
      'fade-up': {
        from: { opacity: 0, y: 40 },
        to: { opacity: 1, y: 0 },
        ease: "power2.out"
      },
      'scale-in': {
        from: { opacity: 0, scale: 0.8 },
        to: { opacity: 1, scale: 1 },
        ease: "back.out(1.7)"
      },
      'scale-x': {
        from: { scaleX: 0, transformOrigin: "left center" },
        to: { scaleX: 1 },
        ease: "power2.out"
      },
      'rotate': {
        from: { rotation: 0 },
        to: { rotation: 360 },
        ease: "none",
        repeat: -1,
        duration: 20
      },
      'pulse': {
        from: { scale: 1, opacity: 0.3 },
        to: { scale: 1.2, opacity: 0.6 },
        ease: "power2.inOut",
        repeat: -1,
        yoyo: true,
        duration: 2
      }
    }
  }
  
  init() {
    this.section = document.getElementById('about')
    if (!this.section || this.isInitialized) return
    
    this.setupElements()
    this.initScrollTriggers()
    this.initParallaxEffects()
    this.initTextAnimations()
    this.initFeatureCards()
    this.initThemeTransition()
    
    this.isInitialized = true
    console.log('🏢 About section with dusk theme initialized')
  }
  
  setupElements() {
    // Cache DOM elements for performance
    this.elements = {
      content: this.section.querySelector('[data-about-content]'),
      visual: this.section.querySelector('[data-about-visual]'),
      parallaxBg: this.section.querySelector('[data-parallax-bg]'),
      parallaxElements: this.section.querySelectorAll('[data-parallax-element]'),
      animatedElements: this.section.querySelectorAll('[data-animate]'),
      featureCards: this.section.querySelectorAll('[data-feature-card]'),
      fadeImg: this.section.querySelector('[data-fade-img]'),
      textElements: this.section.querySelectorAll('[data-text-preset]')
    }
  }
  
  initScrollTriggers() {
    // Main section entrance animation
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: this.section,
        start: "top 80%",
        end: "bottom 20%",
        toggleActions: "play none none reverse"
      }
    })
    
    // Animate elements with data-animate attributes
    this.elements.animatedElements.forEach((element, index) => {
      const animationType = element.dataset.animate
      const delay = parseFloat(element.dataset.delay) || 0
      const preset = this.animationPresets[animationType]
      
      if (preset) {
        // Set initial state
        gsap.set(element, preset.from)
        
        // Create scroll trigger for each element
        ScrollTrigger.create({
          trigger: element,
          start: "top 85%",
          onEnter: () => {
            gsap.to(element, {
              ...preset.to,
              duration: preset.duration || 1.2,
              delay: delay,
              ease: preset.ease,
              repeat: preset.repeat,
              yoyo: preset.yoyo
            })
          }
        })
      }
    })
    
    // Store animation for cleanup
    this.animations.push(tl)
  }
  
  initParallaxEffects() {
    // Background parallax
    if (this.elements.parallaxBg) {
      gsap.to(this.elements.parallaxBg, {
        yPercent: -20,
        ease: "none",
        scrollTrigger: {
          trigger: this.section,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      })
    }
    
    // Individual parallax elements
    this.elements.parallaxElements.forEach(element => {
      const speed = parseFloat(element.dataset.parallaxElement) || 0.1
      
      gsap.to(element, {
        yPercent: -50 * speed,
        ease: "none",
        scrollTrigger: {
          trigger: element,
          start: "top bottom",
          end: "bottom top",
          scrub: 1
        }
      })
    })
    
    // Image hover parallax effect
    if (this.elements.fadeImg) {
      const imageContainer = this.elements.fadeImg.closest('.group')
      
      if (imageContainer) {
        imageContainer.addEventListener('mousemove', (e) => {
          const rect = imageContainer.getBoundingClientRect()
          const x = (e.clientX - rect.left) / rect.width - 0.5
          const y = (e.clientY - rect.top) / rect.height - 0.5
          
          gsap.to(this.elements.fadeImg, {
            x: x * 20,
            y: y * 20,
            duration: 0.3,
            ease: "power2.out"
          })
        })
        
        imageContainer.addEventListener('mouseleave', () => {
          gsap.to(this.elements.fadeImg, {
            x: 0,
            y: 0,
            duration: 0.5,
            ease: "power2.out"
          })
        })
      }
    }
  }
  
  initTextAnimations() {
    this.elements.textElements.forEach(element => {
      const preset = element.dataset.textPreset
      const splitType = element.dataset.splitType || 'chars'
      const stagger = parseFloat(element.dataset.stagger) || 0.02
      
      if (preset === 'luxury-reveal') {
        // Split text for character-by-character animation
        const split = new SplitType(element, { types: splitType })
        
        // Set initial state
        gsap.set(split.chars, { 
          opacity: 0, 
          y: 30,
          rotationX: -90,
          transformOrigin: "0% 50% -50px"
        })
        
        // Create scroll trigger for text reveal
        ScrollTrigger.create({
          trigger: element,
          start: "top 80%",
          onEnter: () => {
            gsap.to(split.chars, {
              opacity: 1,
              y: 0,
              rotationX: 0,
              duration: 0.8,
              stagger: stagger,
              ease: "back.out(1.7)"
            })
          }
        })
        
        // Store split instance for cleanup
        this.textSplits = this.textSplits || []
        this.textSplits.push(split)
      }
    })
  }
  
  initFeatureCards() {
    this.elements.featureCards.forEach((card, index) => {
      // Staggered entrance animation
      gsap.set(card, { 
        opacity: 0, 
        y: 40,
        scale: 0.9
      })
      
      ScrollTrigger.create({
        trigger: card,
        start: "top 85%",
        onEnter: () => {
          gsap.to(card, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.8,
            delay: index * 0.1,
            ease: "back.out(1.7)"
          })
        }
      })
      
      // Hover interactions with luxury micro-animations
      card.addEventListener('mouseenter', () => {
        gsap.to(card, {
          y: -8,
          scale: 1.02,
          duration: 0.3,
          ease: "power2.out"
        })
        
        // Animate icon
        const icon = card.querySelector('svg')
        if (icon) {
          gsap.to(icon, {
            scale: 1.1,
            rotation: 5,
            duration: 0.3,
            ease: "back.out(1.7)"
          })
        }
      })
      
      card.addEventListener('mouseleave', () => {
        gsap.to(card, {
          y: 0,
          scale: 1,
          duration: 0.4,
          ease: "power2.out"
        })
        
        // Reset icon
        const icon = card.querySelector('svg')
        if (icon) {
          gsap.to(icon, {
            scale: 1,
            rotation: 0,
            duration: 0.4,
            ease: "power2.out"
          })
        }
      })
    })
  }
  
  initThemeTransition() {
    // Listen for theme transition events
    window.addEventListener('themeTransition', (event) => {
      const { theme, colors } = event.detail
      
      if (theme === 'dusk' || theme === 'night') {
        this.applyDuskTheme(colors)
      }
    })
    
    // Apply dusk theme when section comes into view
    ScrollTrigger.create({
      trigger: this.section,
      start: "top 60%",
      end: "bottom 40%",
      onEnter: () => {
        this.section.classList.add('theme-dusk-active')
      },
      onLeave: () => {
        this.section.classList.remove('theme-dusk-active')
      },
      onEnterBack: () => {
        this.section.classList.add('theme-dusk-active')
      },
      onLeaveBack: () => {
        this.section.classList.remove('theme-dusk-active')
      }
    })
  }
  
  applyDuskTheme(colors) {
    // Animate theme-specific elements
    const accentElements = this.section.querySelectorAll('.text-theme-accent, .bg-theme-accent')
    
    gsap.to(accentElements, {
      color: colors.accent,
      backgroundColor: colors.accent,
      duration: 0.6,
      ease: "power2.out"
    })
  }
  
  // Public methods
  refresh() {
    ScrollTrigger.refresh()
  }
  
  destroy() {
    // Clean up animations
    this.animations.forEach(animation => {
      if (animation.kill) animation.kill()
    })
    
    // Clean up text splits
    if (this.textSplits) {
      this.textSplits.forEach(split => {
        if (split.revert) split.revert()
      })
    }
    
    // Clean up scroll triggers
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.trigger === this.section) {
        trigger.kill()
      }
    })
    
    this.isInitialized = false
  }
}

// Create and export singleton instance
const aboutSection = new AboutSection()

export function initAboutReveal() {
  aboutSection.init()
}

export default aboutSection
