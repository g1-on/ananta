import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

class Navigation {
  constructor() {
    this.nav = null
    this.navItems = []
    this.hamburger = null
    this.mobileMenu = null
    this.isOpen = false
    this.currentSection = null
    this.sections = []
    this.timeline = null
    this.scrollThreshold = 100
    this.isScrolled = false
    
    this.init()
  }
  
  init() {
    this.createNavigation()
    this.setupEventListeners()
    this.initScrollTriggers()
    this.initSectionTracking()
    
    console.log('🧭 Navigation system initialized')
  }
  
  createNavigation() {
    // Create navigation HTML structure
    const navHTML = `
      <nav class="navigation fixed top-0 left-0 w-full z-50 transition-all duration-500 ease-luxury" data-nav>
        <div class="nav-container max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div class="nav-content flex items-center justify-between h-16 md:h-20">
            <!-- Logo -->
            <div class="nav-logo flex-shrink-0">
              <a href="#hero" class="flex items-center space-x-3 group" data-cursor="hover">
                <img src="/logos/ananta.svg" alt="अनंता" class="h-8 w-8 md:h-10 md:w-10 transition-transform duration-300 group-hover:scale-110">
                <span class="font-tiro text-xl md:text-2xl font-normal text-gradient-gold">अनंता</span>
              </a>
            </div>
            
            <!-- Desktop Navigation -->
            <div class="nav-desktop hidden md:flex items-center space-x-8">
              <a href="#hero" class="nav-link" data-section="hero" data-cursor="hover">Home</a>
              <a href="#about" class="nav-link" data-section="about" data-cursor="hover">About</a>
              <a href="#stats" class="nav-link" data-section="stats" data-cursor="hover">Features</a>
              <a href="#amenities" class="nav-link" data-section="amenities" data-cursor="hover">Amenities</a>
              <a href="#location" class="nav-link" data-section="location" data-cursor="hover">Location</a>
              <a href="#contact" class="nav-link" data-section="contact" data-cursor="hover">Contact</a>
            </div>
            
            <!-- CTA Button -->
            <div class="nav-cta hidden md:block">
              <a href="#contact" class="btn-luxury text-sm" data-cursor="hover">
                Get in Touch
              </a>
            </div>
            
            <!-- Mobile Hamburger -->
            <div class="nav-mobile md:hidden">
              <button class="hamburger" data-hamburger data-cursor="hover" aria-label="Toggle navigation">
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
                <span class="hamburger-line"></span>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Mobile Menu -->
        <div class="mobile-menu md:hidden" data-mobile-menu>
          <div class="mobile-menu-overlay"></div>
          <div class="mobile-menu-content">
            <div class="mobile-menu-header">
              <div class="mobile-logo flex items-center space-x-3">
                <img src="/logos/ananta.svg" alt="अनंता" class="h-8 w-8">
                <span class="font-tiro text-xl font-normal text-gradient-gold">अनंता</span>
              </div>
              <button class="mobile-close" data-mobile-close data-cursor="hover" aria-label="Close navigation">
                <span class="close-line"></span>
                <span class="close-line"></span>
              </button>
            </div>
            <nav class="mobile-nav">
              <a href="#hero" class="mobile-nav-link" data-section="hero" data-cursor="hover">Home</a>
              <a href="#about" class="mobile-nav-link" data-section="about" data-cursor="hover">About</a>
              <a href="#stats" class="mobile-nav-link" data-section="stats" data-cursor="hover">Features</a>
              <a href="#amenities" class="mobile-nav-link" data-section="amenities" data-cursor="hover">Amenities</a>
              <a href="#location" class="mobile-nav-link" data-section="location" data-cursor="hover">Location</a>
              <a href="#contact" class="mobile-nav-link" data-section="contact" data-cursor="hover">Contact</a>
            </nav>
            <div class="mobile-cta">
              <a href="#contact" class="btn-luxury w-full text-center" data-cursor="hover">
                Get in Touch
              </a>
            </div>
          </div>
        </div>
      </nav>
    `
    
    // Insert navigation at the beginning of body
    document.body.insertAdjacentHTML('afterbegin', navHTML)
    
    // Cache DOM elements
    this.nav = document.querySelector('[data-nav]')
    this.navItems = document.querySelectorAll('.nav-link, .mobile-nav-link')
    this.hamburger = document.querySelector('[data-hamburger]')
    this.mobileMenu = document.querySelector('[data-mobile-menu]')
    this.mobileClose = document.querySelector('[data-mobile-close]')
    
    // Get all sections for tracking
    this.sections = Array.from(document.querySelectorAll('section[id]'))
  }
  
  setupEventListeners() {
    // Hamburger menu toggle
    if (this.hamburger) {
      this.hamburger.addEventListener('click', () => this.toggleMobileMenu())
    }
    
    // Mobile close button
    if (this.mobileClose) {
      this.mobileClose.addEventListener('click', () => this.closeMobileMenu())
    }
    
    // Mobile menu overlay click
    const overlay = this.mobileMenu?.querySelector('.mobile-menu-overlay')
    if (overlay) {
      overlay.addEventListener('click', () => this.closeMobileMenu())
    }
    
    // Navigation link clicks
    this.navItems.forEach(link => {
      link.addEventListener('click', (e) => this.handleNavClick(e))
    })
    
    // Escape key to close mobile menu
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && this.isOpen) {
        this.closeMobileMenu()
      }
    })
    
    // Window resize handler
    window.addEventListener('resize', () => {
      if (window.innerWidth >= 768 && this.isOpen) {
        this.closeMobileMenu()
      }
    })
  }
  
  initScrollTriggers() {
    // Navigation background change on scroll
    ScrollTrigger.create({
      start: this.scrollThreshold,
      end: 'bottom bottom',
      onUpdate: (self) => {
        const shouldBeScrolled = self.scroll() > this.scrollThreshold
        
        if (shouldBeScrolled !== this.isScrolled) {
          this.isScrolled = shouldBeScrolled
          this.updateNavAppearance()
        }
      }
    })
  }
  
  initSectionTracking() {
    // Create scroll triggers for each section to track active section
    this.sections.forEach((section, index) => {
      ScrollTrigger.create({
        trigger: section,
        start: 'top 50%',
        end: 'bottom 50%',
        onEnter: () => this.setActiveSection(section.id),
        onEnterBack: () => this.setActiveSection(section.id)
      })
    })
  }
  
  updateNavAppearance() {
    if (this.isScrolled) {
      // Scrolled state - add background and shadow
      gsap.to(this.nav, {
        backgroundColor: 'rgba(0, 0, 0, 0.95)',
        backdropFilter: 'blur(20px)',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.1)',
        duration: 0.3,
        ease: 'power2.out'
      })
      
      this.nav.classList.add('nav-scrolled')
    } else {
      // Top state - transparent
      gsap.to(this.nav, {
        backgroundColor: 'rgba(0, 0, 0, 0)',
        backdropFilter: 'blur(0px)',
        boxShadow: '0 0 0 rgba(0, 0, 0, 0)',
        duration: 0.3,
        ease: 'power2.out'
      })
      
      this.nav.classList.remove('nav-scrolled')
    }
  }
  
  setActiveSection(sectionId) {
    if (this.currentSection === sectionId) return
    
    this.currentSection = sectionId
    
    // Update active states
    this.navItems.forEach(link => {
      const isActive = link.dataset.section === sectionId
      
      if (isActive) {
        link.classList.add('nav-link-active')
        // Animate active indicator
        gsap.to(link, {
          color: 'var(--theme-accent)',
          duration: 0.3,
          ease: 'power2.out'
        })
      } else {
        link.classList.remove('nav-link-active')
        gsap.to(link, {
          color: 'var(--theme-text)',
          duration: 0.3,
          ease: 'power2.out'
        })
      }
    })
  }
  
  handleNavClick(e) {
    e.preventDefault()
    
    const link = e.currentTarget
    const targetId = link.getAttribute('href').substring(1)
    const targetSection = document.getElementById(targetId)
    
    if (targetSection) {
      // Close mobile menu if open
      if (this.isOpen) {
        this.closeMobileMenu()
      }
      
      // Smooth scroll to section
      if (window.AnantaApp && window.AnantaApp.lenis) {
        window.AnantaApp.lenis.scrollTo(targetSection, {
          duration: 1.5,
          easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
        })
      } else {
        // Fallback smooth scroll
        targetSection.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        })
      }
      
      // Add click animation
      gsap.to(link, {
        scale: 0.95,
        duration: 0.1,
        yoyo: true,
        repeat: 1,
        ease: 'power2.inOut'
      })
    }
  }
  
  toggleMobileMenu() {
    if (this.isOpen) {
      this.closeMobileMenu()
    } else {
      this.openMobileMenu()
    }
  }
  
  openMobileMenu() {
    this.isOpen = true
    
    // Prevent body scroll
    document.body.style.overflow = 'hidden'
    
    // Add active class
    this.hamburger.classList.add('hamburger-active')
    this.mobileMenu.classList.add('mobile-menu-active')
    
    // Create opening animation timeline
    this.timeline = gsap.timeline()
    
    // Animate overlay
    this.timeline.fromTo('.mobile-menu-overlay', 
      { opacity: 0 },
      { opacity: 1, duration: 0.3, ease: 'power2.out' }
    )
    
    // Animate menu content
    this.timeline.fromTo('.mobile-menu-content',
      { x: '100%' },
      { x: '0%', duration: 0.4, ease: 'power2.out' },
      '-=0.1'
    )
    
    // Animate navigation links
    const mobileLinks = this.mobileMenu.querySelectorAll('.mobile-nav-link')
    this.timeline.fromTo(mobileLinks,
      { opacity: 0, x: 50 },
      { 
        opacity: 1, 
        x: 0, 
        duration: 0.3, 
        stagger: 0.1, 
        ease: 'power2.out' 
      },
      '-=0.2'
    )
    
    // Animate CTA button
    this.timeline.fromTo('.mobile-cta',
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' },
      '-=0.1'
    )
  }
  
  closeMobileMenu() {
    if (!this.isOpen) return
    
    this.isOpen = false
    
    // Create closing animation timeline
    this.timeline = gsap.timeline({
      onComplete: () => {
        // Re-enable body scroll
        document.body.style.overflow = ''
        
        // Remove active classes
        this.hamburger.classList.remove('hamburger-active')
        this.mobileMenu.classList.remove('mobile-menu-active')
      }
    })
    
    // Animate navigation links out
    const mobileLinks = this.mobileMenu.querySelectorAll('.mobile-nav-link')
    this.timeline.to(mobileLinks, {
      opacity: 0,
      x: 50,
      duration: 0.2,
      stagger: 0.05,
      ease: 'power2.in'
    })
    
    // Animate CTA button out
    this.timeline.to('.mobile-cta', {
      opacity: 0,
      y: 20,
      duration: 0.2,
      ease: 'power2.in'
    }, '-=0.1')
    
    // Animate menu content out
    this.timeline.to('.mobile-menu-content', {
      x: '100%',
      duration: 0.3,
      ease: 'power2.in'
    }, '-=0.1')
    
    // Animate overlay out
    this.timeline.to('.mobile-menu-overlay', {
      opacity: 0,
      duration: 0.2,
      ease: 'power2.in'
    }, '-=0.1')
  }
  
  // Public methods
  refresh() {
    ScrollTrigger.refresh()
  }
  
  destroy() {
    // Clean up scroll triggers
    ScrollTrigger.getAll().forEach(trigger => {
      if (trigger.vars.trigger === this.nav || 
          this.sections.includes(trigger.vars.trigger)) {
        trigger.kill()
      }
    })
    
    // Clean up timeline
    if (this.timeline) {
      this.timeline.kill()
    }
    
    // Remove navigation from DOM
    if (this.nav) {
      this.nav.remove()
    }
    
    // Re-enable body scroll
    document.body.style.overflow = ''
  }
}

export default Navigation