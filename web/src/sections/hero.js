/**
 * Hero Section Component
 * Cinematic day-time experience with video background and parallax effects
 * Implements luxury Gold/White color scheme with day-time theme
 */

import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import VideoBackground from '../components/videoBackground.js'

class HeroSection {
  constructor() {
    this.heroElement = null
    this.videoBackground = null
    this.parallaxElements = []
    this.overlayElements = []
    this.isInitialized = false
    this.scrollTrigger = null
    this.parallaxTrigger = null
    
    // Day-time theme configuration
    this.dayTimeConfig = {
      overlayOpacity: 0.3,
      textColor: '#ffffff',
      accentColor: '#ecbb4f',
      shadowColor: 'rgba(0, 0, 0, 0.5)',
      gradientOverlay: 'linear-gradient(135deg, rgba(236, 187, 79, 0.1) 0%, rgba(0, 0, 0, 0.4) 100%)'
    }
  }

  /**
   * Initialize hero section
   */
  init() {
    if (this.isInitialized) return

    this.heroElement = document.getElementById('hero')
    if (!this.heroElement) {
      console.warn('Hero section not found')
      return
    }

    this.createHeroStructure()
    this.initVideoBackground()
    this.initParallaxEffects()
    this.initLuxuryOverlays()
    this.bindEvents()
    
    this.isInitialized = true
    console.log('🏛️ Hero section initialized with day-time cinematic experience')
  }

  /**
   * Create enhanced hero section HTML structure
   */
  createHeroStructure() {
    // Add semantic structure and day-time theme classes
    this.heroElement.classList.add(
      'hero-cinematic',
      'theme-day-time',
      'relative',
      'h-screen',
      'flex',
      'flex-col',
      'items-center',
      'justify-center',
      'text-center',
      'px-4',
      'overflow-hidden'
    )

    // Create luxury overlay container
    const overlayContainer = document.createElement('div')
    overlayContainer.className = 'hero-overlay-container absolute inset-0 z-5'
    overlayContainer.innerHTML = `
      <!-- Luxury gradient overlay -->
      <div class="hero-gradient-overlay absolute inset-0 bg-gradient-to-br from-gold-light/10 via-transparent to-black/40 z-10"></div>
      
      <!-- Cinematic vignette -->
      <div class="hero-vignette absolute inset-0 bg-radial-gradient from-transparent via-transparent to-black/30 z-15"></div>
      
      <!-- Depth particles for luxury effect -->
      <div class="hero-particles absolute inset-0 z-5" data-parallax-speed="0.3">
        <div class="particle particle-1 absolute w-2 h-2 bg-gold-primary/20 rounded-full blur-sm"></div>
        <div class="particle particle-2 absolute w-1 h-1 bg-gold-light/30 rounded-full blur-sm"></div>
        <div class="particle particle-3 absolute w-3 h-3 bg-gold-primary/15 rounded-full blur-sm"></div>
      </div>
    `

    // Insert overlay container before content
    const existingContent = this.heroElement.querySelector('.relative')
    if (existingContent) {
      this.heroElement.insertBefore(overlayContainer, existingContent)
    } else {
      this.heroElement.appendChild(overlayContainer)
    }

    // Enhance existing content container
    const contentContainer = this.heroElement.querySelector('.relative.z-10') || 
                           this.heroElement.querySelector('.relative')
    
    if (contentContainer) {
      contentContainer.classList.add(
        'hero-content',
        'z-20',
        'max-w-6xl',
        'mx-auto',
        'px-4',
        'sm:px-6',
        'lg:px-8'
      )
      
      // Add parallax data attributes to content elements
      contentContainer.setAttribute('data-parallax-speed', '0.1')
      contentContainer.setAttribute('data-parallax-direction', 'up')
    }

    // Store overlay elements for animations
    this.overlayElements = [
      overlayContainer.querySelector('.hero-gradient-overlay'),
      overlayContainer.querySelector('.hero-vignette'),
      overlayContainer.querySelector('.hero-particles')
    ].filter(Boolean)

    // Store parallax elements
    this.parallaxElements = this.heroElement.querySelectorAll('[data-parallax-speed]')
  }

  /**
   * Initialize video background with day-time activities
   */
  initVideoBackground() {
    // Enhanced video configuration for day-time luxury experience
    const videoConfig = {
      autoplay: true,
      muted: true,
      loop: true,
      playsinline: true,
      poster: this.heroElement.dataset.videoPoster,
      sources: this.parseVideoSources(),
      fallbackImage: this.heroElement.dataset.videoFallback,
      threshold: 0.1,
      rootMargin: '50px',
      enablePreloading: true,
      respectReducedMotion: true,
      mobileOptimizations: true
    }

    // Initialize video background component
    this.videoBackground = new VideoBackground(this.heroElement, videoConfig)

    // Listen for video events
    this.heroElement.addEventListener('videoplay', () => {
      this.onVideoPlay()
    })

    this.heroElement.addEventListener('videoerror', () => {
      this.onVideoError()
    })

    this.heroElement.addEventListener('loadingstatechange', (e) => {
      this.onVideoLoadingStateChange(e.detail.state)
    })
  }

  /**
   * Parse video sources from data attributes
   */
  parseVideoSources() {
    const sourcesData = this.heroElement.dataset.videoSources
    
    if (sourcesData) {
      try {
        return JSON.parse(sourcesData)
      } catch (e) {
        console.warn('Failed to parse video sources:', e)
      }
    }

    // Default day-time activity videos (luxury real estate focused)
    return [
      {
        src: 'https://videos.pexels.com/video-files/2022395/2022395-uhd_3840_2160_25fps.mp4',
        type: 'video/mp4',
        media: '(min-width: 768px)' // Desktop version
      },
      {
        src: 'https://videos.pexels.com/video-files/2022395/2022395-uhd_1920_1080_25fps.mp4',
        type: 'video/mp4',
        media: '(max-width: 767px)' // Mobile version
      }
    ]
  }

  /**
   * Initialize parallax effects for depth and immersion
   */
  initParallaxEffects() {
    if (this.parallaxElements.length === 0) return

    // Create parallax scroll trigger
    this.parallaxTrigger = ScrollTrigger.create({
      trigger: this.heroElement,
      start: 'top bottom',
      end: 'bottom top',
      scrub: true,
      onUpdate: (self) => {
        this.updateParallax(self.progress)
      }
    })

    // Set initial parallax positions
    this.parallaxElements.forEach((element) => {
      const speed = parseFloat(element.dataset.parallaxSpeed) || 0.5
      const direction = element.dataset.parallaxDirection || 'down'
      
      gsap.set(element, {
        y: direction === 'up' ? 50 : -50,
        willChange: 'transform'
      })
    })
  }

  /**
   * Update parallax positions based on scroll progress
   */
  updateParallax(progress) {
    this.parallaxElements.forEach((element) => {
      const speed = parseFloat(element.dataset.parallaxSpeed) || 0.5
      const direction = element.dataset.parallaxDirection || 'down'
      const maxOffset = 100
      
      let yOffset
      if (direction === 'up') {
        yOffset = -progress * maxOffset * speed
      } else {
        yOffset = progress * maxOffset * speed
      }
      
      gsap.set(element, {
        y: yOffset,
        ease: 'none'
      })
    })
  }

  /**
   * Initialize luxury overlay effects
   */
  initLuxuryOverlays() {
    // Animate overlay elements on load
    const tl = gsap.timeline({ delay: 0.5 })
    
    // Gradient overlay fade in
    tl.fromTo('.hero-gradient-overlay', 
      { opacity: 0 },
      { opacity: 1, duration: 2, ease: 'power2.out' }
    )
    
    // Vignette subtle animation
    tl.fromTo('.hero-vignette',
      { opacity: 0, scale: 1.1 },
      { opacity: 1, scale: 1, duration: 3, ease: 'power2.out' },
      '-=1.5'
    )
    
    // Particles floating animation
    this.animateParticles()
  }

  /**
   * Animate floating particles for luxury depth effect
   */
  animateParticles() {
    const particles = this.heroElement.querySelectorAll('.particle')
    
    particles.forEach((particle, index) => {
      // Random positioning
      gsap.set(particle, {
        left: `${Math.random() * 80 + 10}%`,
        top: `${Math.random() * 80 + 10}%`,
        opacity: 0
      })
      
      // Floating animation
      gsap.to(particle, {
        opacity: 1,
        duration: 2,
        delay: index * 0.5,
        ease: 'power2.out'
      })
      
      // Continuous floating motion
      gsap.to(particle, {
        y: '-=20',
        x: '+=10',
        duration: 4 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * 0.3
      })
      
      // Subtle scale pulsing
      gsap.to(particle, {
        scale: 1.2,
        duration: 3 + Math.random() * 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        delay: index * 0.7
      })
    })
  }

  /**
   * Video event handlers
   */
  onVideoPlay() {
    // Enhance overlay when video starts playing
    gsap.to('.hero-gradient-overlay', {
      opacity: 0.8,
      duration: 1,
      ease: 'power2.out'
    })
  }

  onVideoError() {
    // Show enhanced static fallback
    console.warn('Hero video failed to load, showing luxury fallback')
    
    // Add luxury static background
    this.heroElement.style.background = `
      linear-gradient(135deg, rgba(236, 187, 79, 0.1) 0%, rgba(0, 0, 0, 0.6) 100%),
      url('${this.heroElement.dataset.videoFallback || '/images/hero-fallback.jpg'}')
    `
    this.heroElement.style.backgroundSize = 'cover'
    this.heroElement.style.backgroundPosition = 'center'
  }

  onVideoLoadingStateChange(state) {
    // Update hero classes based on loading state
    this.heroElement.classList.remove('video-loading', 'video-loaded', 'video-error')
    this.heroElement.classList.add(`video-${state}`)
    
    if (state === 'loaded') {
      // Trigger entrance animations when video is ready
      this.triggerEntranceAnimations()
    }
  }

  /**
   * Trigger entrance animations for hero content
   */
  triggerEntranceAnimations() {
    const contentContainer = this.heroElement.querySelector('.hero-content')
    if (!contentContainer) return

    // Create entrance timeline
    const entranceTl = gsap.timeline({ delay: 0.3 })
    
    // Content container entrance
    entranceTl.fromTo(contentContainer,
      { opacity: 0, y: 50, scale: 0.95 },
      { opacity: 1, y: 0, scale: 1, duration: 1.5, ease: 'power2.out' }
    )
    
    // Initialize text animations after content is visible
    setTimeout(() => {
      this.initTextAnimations()
      this.initCallToActionInteractions()
      this.initScrollIndicator()
    }, 800)
    
    // Dispatch event for other components
    setTimeout(() => {
      const event = new CustomEvent('heroContentReady')
      document.dispatchEvent(event)
    }, 500)
  }

  /**
   * Initialize staggered text reveals using SplitType
   */
  initTextAnimations() {
    // Import SplitType dynamically to avoid issues
    import('split-type').then(({ default: SplitType }) => {
      // Animate main headline with luxury reveal
      const headline = this.heroElement.querySelector('.headline')
      if (headline) {
        const headlineSplit = new SplitType(headline, { types: 'chars' })
        
        gsap.set(headlineSplit.chars, {
          opacity: 0,
          y: 60,
          scale: 0.9,
          rotationX: 45
        })
        
        gsap.to(headlineSplit.chars, {
          opacity: 1,
          y: 0,
          scale: 1,
          rotationX: 0,
          duration: 1.2,
          stagger: 0.03,
          ease: 'power2.out',
          delay: 0.2
        })
      }
      
      // Animate subtitle with word reveals
      const subtitle = this.heroElement.querySelector('.hero-subtitle')
      if (subtitle) {
        const subtitleSplit = new SplitType(subtitle, { types: 'words' })
        
        gsap.set(subtitleSplit.words, {
          opacity: 0,
          y: 30,
          scale: 0.95
        })
        
        gsap.to(subtitleSplit.words, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          stagger: 0.08,
          ease: 'power2.out',
          delay: 0.8
        })
      }
    }).catch(error => {
      console.warn('Failed to load SplitType for hero animations:', error)
      // Fallback to simple animations
      this.initFallbackTextAnimations()
    })
  }

  /**
   * Fallback text animations without SplitType
   */
  initFallbackTextAnimations() {
    const headline = this.heroElement.querySelector('.headline')
    const subtitle = this.heroElement.querySelector('.hero-subtitle')
    
    if (headline) {
      gsap.fromTo(headline,
        { opacity: 0, y: 50, scale: 0.95 },
        { opacity: 1, y: 0, scale: 1, duration: 1.2, ease: 'power2.out', delay: 0.2 }
      )
    }
    
    if (subtitle) {
      gsap.fromTo(subtitle,
        { opacity: 0, y: 30 },
        { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out', delay: 0.8 }
      )
    }
  }

  /**
   * Initialize call-to-action button interactions with Gold accent hover effects
   */
  initCallToActionInteractions() {
    const ctaButtons = this.heroElement.querySelectorAll('.btn-luxury')
    
    ctaButtons.forEach((button, index) => {
      // Initial entrance animation
      gsap.fromTo(button,
        { opacity: 0, y: 30, scale: 0.9 },
        { 
          opacity: 1, 
          y: 0, 
          scale: 1, 
          duration: 0.8, 
          ease: 'back.out(1.7)', 
          delay: 1.2 + (index * 0.2) 
        }
      )
      
      // Create hover timeline
      const hoverTl = gsap.timeline({ paused: true })
      
      hoverTl
        .to(button, {
          scale: 1.05,
          y: -3,
          duration: 0.3,
          ease: 'power2.out'
        })
        .to(button.querySelector('svg'), {
          y: 3,
          duration: 0.3,
          ease: 'power2.out'
        }, 0)
      
      // Hover interactions
      button.addEventListener('mouseenter', () => {
        hoverTl.play()
        
        // Add gold glow effect
        gsap.to(button, {
          boxShadow: '0 10px 30px rgba(236, 187, 79, 0.4)',
          duration: 0.3,
          ease: 'power2.out'
        })
      })
      
      button.addEventListener('mouseleave', () => {
        hoverTl.reverse()
        
        // Remove glow effect
        gsap.to(button, {
          boxShadow: '0 5px 15px rgba(0, 0, 0, 0.2)',
          duration: 0.3,
          ease: 'power2.out'
        })
      })
      
      // Click interaction
      button.addEventListener('click', (e) => {
        // Prevent default for smooth scroll
        if (button.getAttribute('href').startsWith('#')) {
          e.preventDefault()
          
          // Create click animation
          gsap.to(button, {
            scale: 0.95,
            duration: 0.1,
            ease: 'power2.out',
            yoyo: true,
            repeat: 1
          })
          
          // Smooth scroll to target
          const targetId = button.getAttribute('href')
          const targetElement = document.querySelector(targetId)
          
          if (targetElement && window.AnantaApp) {
            setTimeout(() => {
              window.AnantaApp.scrollTo(targetElement, {
                duration: 1.5,
                offset: -80
              })
            }, 200)
          }
        }
      })
      
      // Add ripple effect on click
      this.addRippleEffect(button)
    })
  }

  /**
   * Add ripple effect to buttons
   */
  addRippleEffect(button) {
    button.addEventListener('click', (e) => {
      const rect = button.getBoundingClientRect()
      const x = e.clientX - rect.left
      const y = e.clientY - rect.top
      
      const ripple = document.createElement('span')
      ripple.className = 'ripple-effect'
      ripple.style.cssText = `
        position: absolute;
        border-radius: 50%;
        background: rgba(236, 187, 79, 0.6);
        transform: scale(0);
        animation: ripple 0.6s linear;
        left: ${x}px;
        top: ${y}px;
        width: 20px;
        height: 20px;
        margin-left: -10px;
        margin-top: -10px;
        pointer-events: none;
      `
      
      button.appendChild(ripple)
      
      setTimeout(() => {
        ripple.remove()
      }, 600)
    })
  }

  /**
   * Initialize scroll indicator with smooth bounce animation
   */
  initScrollIndicator() {
    const scrollIndicator = this.heroElement.querySelector('.scroll-indicator')
    if (!scrollIndicator) return
    
    // Entrance animation
    gsap.fromTo(scrollIndicator,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 1, ease: 'power2.out', delay: 2 }
    )
    
    // Continuous bounce animation
    gsap.to(scrollIndicator, {
      y: -10,
      duration: 2,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true
    })
    
    // Click interaction for scroll indicator
    scrollIndicator.addEventListener('click', () => {
      const nextSection = document.querySelector('#stats') || document.querySelector('#about')
      if (nextSection && window.AnantaApp) {
        window.AnantaApp.scrollTo(nextSection, {
          duration: 1.5,
          offset: -50
        })
      }
    })
    
    // Hide scroll indicator when user starts scrolling
    let scrollTimeout
    window.addEventListener('scroll', () => {
      clearTimeout(scrollTimeout)
      
      gsap.to(scrollIndicator, {
        opacity: 0.3,
        duration: 0.3
      })
      
      scrollTimeout = setTimeout(() => {
        gsap.to(scrollIndicator, {
          opacity: 1,
          duration: 0.3
        })
      }, 1000)
    })
  }

  /**
   * Bind event listeners
   */
  bindEvents() {
    // Listen for theme changes
    window.addEventListener('themeTransition', (e) => {
      this.updateTheme(e.detail.theme)
    })

    // Listen for resize events
    window.addEventListener('resize', () => {
      this.handleResize()
    })

    // Listen for visibility changes
    document.addEventListener('visibilitychange', () => {
      this.handleVisibilityChange()
    })
  }

  /**
   * Update hero theme based on scroll position
   */
  updateTheme(theme) {
    // Update hero classes for theme transition
    this.heroElement.classList.remove('theme-dawn', 'theme-day', 'theme-dusk', 'theme-night')
    this.heroElement.classList.add(`theme-${theme}`)
    
    // Update overlay opacity based on theme
    const overlayOpacity = this.getThemeOverlayOpacity(theme)
    gsap.to('.hero-gradient-overlay', {
      opacity: overlayOpacity,
      duration: 0.8,
      ease: 'power2.out'
    })
  }

  /**
   * Get overlay opacity for different themes
   */
  getThemeOverlayOpacity(theme) {
    const opacities = {
      dawn: 0.2,
      day: 0.3,
      dusk: 0.5,
      night: 0.7
    }
    return opacities[theme] || 0.3
  }

  /**
   * Handle resize events
   */
  handleResize() {
    // Refresh ScrollTrigger for parallax
    if (this.parallaxTrigger) {
      this.parallaxTrigger.refresh()
    }
  }

  /**
   * Handle visibility changes for performance
   */
  handleVisibilityChange() {
    if (document.hidden) {
      // Pause animations when tab is hidden
      gsap.globalTimeline.pause()
    } else {
      // Resume animations when tab is visible
      gsap.globalTimeline.resume()
    }
  }

  /**
   * Get hero element
   */
  getElement() {
    return this.heroElement
  }

  /**
   * Get video background instance
   */
  getVideoBackground() {
    return this.videoBackground
  }

  /**
   * Destroy hero section
   */
  destroy() {
    // Kill ScrollTrigger instances
    if (this.parallaxTrigger) {
      this.parallaxTrigger.kill()
      this.parallaxTrigger = null
    }

    // Destroy video background
    if (this.videoBackground) {
      this.videoBackground.destroy()
      this.videoBackground = null
    }

    // Clear parallax elements
    this.parallaxElements = []
    this.overlayElements = []

    // Remove event listeners
    window.removeEventListener('themeTransition', this.updateTheme)
    window.removeEventListener('resize', this.handleResize)
    document.removeEventListener('visibilitychange', this.handleVisibilityChange)

    this.isInitialized = false
  }
}

export default HeroSection