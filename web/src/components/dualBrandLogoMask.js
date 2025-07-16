import { gsap } from 'gsap'

/**
 * Dual Brand Logo Entry Mask System
 * Implements Global One Consulting logo entrance with "Presents" transition
 * Creates smooth transition from Global One to Ananta branding
 * Adds click or scroll to enter functionality with expanding circle reveal
 * Integrates dual brand timeline with main site animation initialization
 */
class DualBrandLogoMask {
  constructor() {
    this.maskContainer = null
    this.globalOneContainer = null
    this.anantaContainer = null
    this.expandingCircle = null
    this.clickToEnter = null
    this.isAnimating = false
    this.timeline = null
    this.hasCompleted = false
    
    // Animation states
    this.currentPhase = 'initial' // initial, globalOne, presents, ananta, expanding, complete
    
    // Bind methods
    this.handleClick = this.handleClick.bind(this)
    this.handleScroll = this.handleScroll.bind(this)
    this.handleKeyPress = this.handleKeyPress.bind(this)
  }

  init() {
    // Don't initialize if already completed
    if (this.hasCompleted) return
    
    this.createMaskElements()
    this.setupEventListeners()
    this.setupDualBrandTimeline()
    this.startEntrySequence()
    
    console.log('🎭 Dual Brand Logo Mask initialized')
  }

  createMaskElements() {
    // Create full-screen mask container with dual branding
    this.maskContainer = document.createElement('div')
    this.maskContainer.className = 'dual-brand-entry-mask'
    this.maskContainer.setAttribute('role', 'dialog')
    this.maskContainer.setAttribute('aria-label', 'Brand introduction')
    this.maskContainer.innerHTML = `
      <div class="mask-background"></div>
      
      <!-- Custom Cursor -->
      <div class="dual-brand-cursor"></div>
      
      <!-- Global One Consulting Container -->
      <div class="global-one-container">
        <div class="logo-wrapper">
          <img src="/logos/company.svg" alt="Global One Consulting" class="global-one-logo">
        </div>
        <div class="company-text">Global One</div>
        <div class="presents-text">Presents</div>
      </div>
      
      <!-- Ananta Container -->
      <div class="ananta-container">
        <div class="logo-wrapper">
          <img src="/logos/ananta.svg" alt="अनंता" class="ananta-logo">
        </div>
        <div class="project-subtitle">Luxury Service Apartments</div>
      </div>
      
      <!-- Expanding Circle Reveal -->
      <div class="expanding-circle"></div>
      
      <!-- Click to Enter -->
      <div class="click-to-enter" tabindex="0" role="button" aria-label="Click or scroll to enter the website">
        <span class="enter-text">Click or Scroll to Enter</span>
        <div class="enter-indicator"></div>
      </div>
    `
    
    // Insert at the beginning of body
    document.body.insertBefore(this.maskContainer, document.body.firstChild)
    
    // Get references to key elements
    this.globalOneContainer = this.maskContainer.querySelector('.global-one-container')
    this.anantaContainer = this.maskContainer.querySelector('.ananta-container')
    this.expandingCircle = this.maskContainer.querySelector('.expanding-circle')
    this.clickToEnter = this.maskContainer.querySelector('.click-to-enter')
    this.customCursor = this.maskContainer.querySelector('.dual-brand-cursor')
  }

  setupEventListeners() {
    // Click to enter
    this.clickToEnter.addEventListener('click', this.handleClick)
    this.clickToEnter.addEventListener('keypress', this.handleKeyPress)
    
    // Custom cursor tracking
    this.handleMouseMove = this.handleMouseMove.bind(this)
    this.handleMouseEnter = this.handleMouseEnter.bind(this)
    this.handleMouseLeave = this.handleMouseLeave.bind(this)
    this.handleMouseDown = this.handleMouseDown.bind(this)
    this.handleMouseUp = this.handleMouseUp.bind(this)
    
    document.addEventListener('mousemove', this.handleMouseMove)
    this.clickToEnter.addEventListener('mouseenter', this.handleMouseEnter)
    this.clickToEnter.addEventListener('mouseleave', this.handleMouseLeave)
    document.addEventListener('mousedown', this.handleMouseDown)
    document.addEventListener('mouseup', this.handleMouseUp)
    
    // Scroll to enter (throttled)
    let scrollTimeout = null
    const throttledScroll = () => {
      if (scrollTimeout) return
      scrollTimeout = setTimeout(() => {
        this.handleScroll()
        scrollTimeout = null
      }, 100)
    }
    
    window.addEventListener('wheel', throttledScroll, { passive: true })
    window.addEventListener('touchmove', throttledScroll, { passive: true })
    
    // Prevent scrolling during mask
    document.body.style.overflow = 'hidden'
  }

  handleClick() {
    if (this.currentPhase === 'ananta' && !this.isAnimating) {
      this.startExpandingReveal()
    }
  }

  handleKeyPress(e) {
    if ((e.key === 'Enter' || e.key === ' ') && this.currentPhase === 'ananta' && !this.isAnimating) {
      e.preventDefault()
      this.startExpandingReveal()
    }
  }

  handleScroll() {
    if (this.currentPhase === 'ananta' && !this.isAnimating) {
      this.startExpandingReveal()
    }
  }

  handleMouseMove(e) {
    if (this.customCursor) {
      this.customCursor.style.left = e.clientX + 'px'
      this.customCursor.style.top = e.clientY + 'px'
    }
  }

  handleMouseEnter() {
    if (this.customCursor) {
      this.customCursor.classList.add('hover')
    }
  }

  handleMouseLeave() {
    if (this.customCursor) {
      this.customCursor.classList.remove('hover')
    }
  }

  handleMouseDown() {
    if (this.customCursor) {
      this.customCursor.classList.add('click')
    }
  }

  handleMouseUp() {
    if (this.customCursor) {
      this.customCursor.classList.remove('click')
    }
  }

  setupDualBrandTimeline() {
    this.timeline = gsap.timeline({
      onComplete: () => this.onTimelineComplete()
    })

    // Set initial states
    gsap.set('.dual-brand-entry-mask', { 
      opacity: 1, 
      zIndex: 9999,
      pointerEvents: 'all'
    })
    
    // Global One elements
    gsap.set('.global-one-container', { opacity: 0, scale: 0.8 })
    gsap.set('.global-one-logo', { opacity: 0, scale: 0.8, rotation: -10 })
    gsap.set('.company-text', { opacity: 0, y: 30 })
    gsap.set('.presents-text', { opacity: 0, y: 20 })
    
    // Ananta elements
    gsap.set('.ananta-container', { opacity: 0, scale: 0.8 })
    gsap.set('.ananta-logo', { opacity: 0, scale: 0.8, rotation: 10 })
    gsap.set('.project-subtitle', { opacity: 0, y: 20 })
    
    // Other elements
    gsap.set('.expanding-circle', { scale: 0, opacity: 0 })
    gsap.set('.click-to-enter', { opacity: 0, y: 50 })

    // Phase 1: Global One Consulting entrance
    this.timeline
      .to('.global-one-container', {
        opacity: 1,
        scale: 1,
        duration: 0.8,
        ease: "power2.out",
        onStart: () => { this.currentPhase = 'globalOne' }
      })
      .to('.global-one-logo', {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 1.2,
        ease: "back.out(1.7)"
      }, "-=0.4")
      .to('.company-text', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.6")
      
      // Hold for brand recognition
      .to({}, { duration: 1.8 })
      
      // Phase 2: "Presents" text
      .to('.presents-text', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out",
        onStart: () => { this.currentPhase = 'presents' }
      })
      
      // Hold presents
      .to({}, { duration: 1.2 })
      
      // Phase 3: Transition to Ananta
      .to('.global-one-container', {
        opacity: 0,
        scale: 0.9,
        y: -30,
        duration: 0.8,
        ease: "power2.in"
      })
      .to('.ananta-container', {
        opacity: 1,
        scale: 1,
        duration: 1,
        ease: "power2.out",
        onStart: () => { this.currentPhase = 'ananta' }
      }, "-=0.4")
      .to('.ananta-logo', {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 1.4,
        ease: "back.out(1.7)"
      }, "-=0.6")
      .to('.project-subtitle', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.8")
      
      // Phase 4: Show click to enter
      .to('.click-to-enter', {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power2.out"
      }, "-=0.4")
  }

  startEntrySequence() {
    this.isAnimating = true
    this.timeline.play()
  }

  onTimelineComplete() {
    this.isAnimating = false
    
    // Show cursor only when Ananta phase is ready for interaction
    if (this.customCursor) {
      this.customCursor.classList.add('show')
    }
    
    // Add pulsing animation to click to enter
    gsap.to('.enter-indicator', {
      scale: 1.2,
      opacity: 0.7,
      duration: 1.5,
      ease: "power2.inOut",
      repeat: -1,
      yoyo: true
    })
    
    console.log('🎭 Dual brand timeline complete - ready for user interaction')
  }

  startExpandingReveal() {
    if (this.isAnimating) return
    
    this.isAnimating = true
    this.currentPhase = 'expanding'
    
    console.log('🎭 Starting expanding circle reveal')
    
    // Create expanding reveal timeline
    const revealTimeline = gsap.timeline({
      onComplete: () => this.revealMainSite()
    })
    
    revealTimeline
      // Hide click to enter
      .to('.click-to-enter', {
        opacity: 0,
        y: -20,
        duration: 0.4,
        ease: "power2.in"
      })
      
      // Start expanding circle
      .to('.expanding-circle', {
        opacity: 1,
        scale: 0.1,
        duration: 0.2,
        ease: "power2.out"
      })
      .to('.expanding-circle', {
        scale: 100,
        duration: 1.8,
        ease: "power2.inOut"
      })
      
      // Fade out Ananta elements during expansion
      .to('.ananta-container', {
        opacity: 0,
        scale: 1.1,
        duration: 0.8,
        ease: "power2.in"
      }, "-=1.4")
  }

  revealMainSite() {
    console.log('🎭 Revealing main site')
    
    // Fade out mask and reveal main content
    gsap.to('.dual-brand-entry-mask', {
      opacity: 0,
      duration: 0.8,
      ease: "power2.out",
      onComplete: () => {
        this.cleanup()
        this.initMainSiteAnimations()
      }
    })
  }

  cleanup() {
    // Remove mask from DOM
    if (this.maskContainer && this.maskContainer.parentNode) {
      this.maskContainer.parentNode.removeChild(this.maskContainer)
    }
    
    // Restore scrolling
    document.body.style.overflow = 'auto'
    
    // Remove event listeners
    window.removeEventListener('wheel', this.handleScroll)
    window.removeEventListener('touchmove', this.handleScroll)
    document.removeEventListener('mousemove', this.handleMouseMove)
    document.removeEventListener('mousedown', this.handleMouseDown)
    document.removeEventListener('mouseup', this.handleMouseUp)
    
    // Mark as completed
    this.hasCompleted = true
    this.currentPhase = 'complete'
    
    console.log('🎭 Dual brand logo mask cleanup complete')
  }

  initMainSiteAnimations() {
    // Dispatch custom event to signal main site can start
    const event = new CustomEvent('dualBrandMaskComplete', {
      detail: { 
        timestamp: Date.now(),
        phase: 'complete'
      }
    })
    
    document.dispatchEvent(event)
    
    // Add loaded class to body for CSS transitions
    document.body.classList.add('dual-brand-complete')
    
    console.log('🎭 Main site animations initialized')
  }

  // Public methods for external control
  skip() {
    if (this.hasCompleted) return
    
    console.log('🎭 Skipping dual brand intro')
    
    // Kill current timeline
    if (this.timeline) {
      this.timeline.kill()
    }
    
    // Immediately reveal main site
    this.revealMainSite()
  }

  pause() {
    if (this.timeline && this.timeline.isActive()) {
      this.timeline.pause()
    }
  }

  resume() {
    if (this.timeline && this.timeline.paused()) {
      this.timeline.resume()
    }
  }

  // Accessibility method
  announcePhase(phase) {
    const announcements = {
      globalOne: 'Global One Consulting logo displayed',
      presents: 'Presents text shown',
      ananta: 'Ananta project logo displayed, ready to enter',
      expanding: 'Transitioning to main website',
      complete: 'Welcome to Ananta website'
    }
    
    // Create temporary announcement for screen readers
    const announcement = document.createElement('div')
    announcement.setAttribute('aria-live', 'polite')
    announcement.setAttribute('aria-atomic', 'true')
    announcement.className = 'sr-only'
    announcement.textContent = announcements[phase] || ''
    
    document.body.appendChild(announcement)
    
    setTimeout(() => {
      if (announcement.parentNode) {
        announcement.parentNode.removeChild(announcement)
      }
    }, 1000)
  }
}

export default DualBrandLogoMask