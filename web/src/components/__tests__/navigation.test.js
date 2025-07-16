import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { JSDOM } from 'jsdom'
import Navigation from '../navigation.js'

// Mock GSAP and ScrollTrigger
vi.mock('gsap', () => ({
  gsap: {
    registerPlugin: vi.fn(),
    timeline: vi.fn(() => ({
      fromTo: vi.fn().mockReturnThis(),
      to: vi.fn().mockReturnThis(),
      kill: vi.fn()
    })),
    set: vi.fn(),
    to: vi.fn(),
    fromTo: vi.fn(),
    ticker: {
      add: vi.fn(),
      lagSmoothing: vi.fn()
    }
  },
  ScrollTrigger: {
    create: vi.fn((config) => ({
      kill: vi.fn(),
      vars: config || {}
    })),
    getAll: vi.fn(() => []),
    refresh: vi.fn(),
    update: vi.fn()
  }
}))

vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: {
    create: vi.fn((config) => ({
      kill: vi.fn(),
      vars: config || {}
    })),
    getAll: vi.fn(() => []),
    refresh: vi.fn(),
    update: vi.fn()
  }
}))

describe('Navigation', () => {
  let navigation
  let dom
  
  beforeEach(() => {
    // Create a clean DOM environment
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <head><title>Test</title></head>
        <body>
          <section id="hero">Hero</section>
          <section id="about">About</section>
          <section id="stats">Stats</section>
          <section id="amenities">Amenities</section>
          <section id="location">Location</section>
          <section id="contact">Contact</section>
        </body>
      </html>
    `, {
      url: 'http://localhost:3000',
      pretendToBeVisual: true,
      resources: 'usable'
    })
    
    global.window = dom.window
    global.document = dom.window.document
    global.navigator = dom.window.navigator
    global.HTMLElement = dom.window.HTMLElement
    global.Element = dom.window.Element
    global.Node = dom.window.Node
    global.MouseEvent = dom.window.MouseEvent
    global.KeyboardEvent = dom.window.KeyboardEvent
    global.CustomEvent = dom.window.CustomEvent
    
    // Mock window.AnantaApp
    global.window.AnantaApp = {
      lenis: {
        scrollTo: vi.fn()
      }
    }
    
    // Mock console methods
    global.console.log = vi.fn()
    global.console.error = vi.fn()
    global.console.warn = vi.fn()
  })
  
  afterEach(() => {
    if (navigation) {
      navigation.destroy()
      navigation = null
    }
    
    // Clean up DOM
    if (dom) {
      dom.window.close()
    }
  })
  
  describe('Initialization', () => {
    it('should initialize navigation system', () => {
      navigation = new Navigation()
      
      expect(navigation.nav).toBeTruthy()
      expect(navigation.navItems).toBeTruthy()
      expect(navigation.hamburger).toBeTruthy()
      expect(navigation.mobileMenu).toBeTruthy()
    })
    
    it('should create navigation HTML structure', () => {
      navigation = new Navigation()
      
      const nav = document.querySelector('[data-nav]')
      expect(nav).toBeTruthy()
      
      const logo = document.querySelector('.nav-logo')
      expect(logo).toBeTruthy()
      
      const desktopNav = document.querySelector('.nav-desktop')
      expect(desktopNav).toBeTruthy()
      
      const hamburger = document.querySelector('[data-hamburger]')
      expect(hamburger).toBeTruthy()
      
      const mobileMenu = document.querySelector('[data-mobile-menu]')
      expect(mobileMenu).toBeTruthy()
    })
    
    it('should have correct navigation links', () => {
      navigation = new Navigation()
      
      const navLinks = document.querySelectorAll('.nav-link')
      expect(navLinks.length).toBe(6) // Home, About, Features, Amenities, Location, Contact
      
      const expectedSections = ['hero', 'about', 'stats', 'amenities', 'location', 'contact']
      navLinks.forEach((link, index) => {
        expect(link.dataset.section).toBe(expectedSections[index])
      })
    })
  })
  
  describe('Mobile Menu', () => {
    beforeEach(() => {
      navigation = new Navigation()
    })
    
    it('should toggle mobile menu on hamburger click', () => {
      const hamburger = document.querySelector('[data-hamburger]')
      
      expect(navigation.isOpen).toBe(false)
      
      hamburger.click()
      
      expect(navigation.isOpen).toBe(true)
      expect(hamburger.classList.contains('hamburger-active')).toBe(true)
    })
    
    it('should close mobile menu on close button click', () => {
      // Open menu first
      navigation.openMobileMenu()
      expect(navigation.isOpen).toBe(true)
      
      const closeButton = document.querySelector('[data-mobile-close]')
      closeButton.click()
      
      expect(navigation.isOpen).toBe(false)
    })
    
    it('should close mobile menu on overlay click', () => {
      // Open menu first
      navigation.openMobileMenu()
      expect(navigation.isOpen).toBe(true)
      
      const overlay = document.querySelector('.mobile-menu-overlay')
      overlay.click()
      
      expect(navigation.isOpen).toBe(false)
    })
    
    it('should close mobile menu on escape key', () => {
      // Open menu first
      navigation.openMobileMenu()
      expect(navigation.isOpen).toBe(true)
      
      const escapeEvent = new KeyboardEvent('keydown', { key: 'Escape' })
      document.dispatchEvent(escapeEvent)
      
      expect(navigation.isOpen).toBe(false)
    })
  })
  
  describe('Navigation Links', () => {
    beforeEach(() => {
      navigation = new Navigation()
    })
    
    it('should handle navigation link clicks', () => {
      const aboutLink = document.querySelector('[data-section="about"]')
      const aboutSection = document.getElementById('about')
      
      expect(aboutSection).toBeTruthy()
      
      // Mock scrollIntoView
      aboutSection.scrollIntoView = vi.fn()
      
      aboutLink.click()
      
      // Should call smooth scroll (fallback since AnantaApp.lenis is mocked)
      expect(aboutSection.scrollIntoView).toHaveBeenCalledWith({
        behavior: 'smooth',
        block: 'start'
      })
    })
    
    it('should close mobile menu when navigation link is clicked', () => {
      // Open mobile menu first
      navigation.openMobileMenu()
      expect(navigation.isOpen).toBe(true)
      
      const mobileLink = document.querySelector('.mobile-nav-link[data-section="about"]')
      mobileLink.click()
      
      expect(navigation.isOpen).toBe(false)
    })
  })
  
  describe('Active Section Tracking', () => {
    beforeEach(() => {
      navigation = new Navigation()
    })
    
    it('should set active section', () => {
      navigation.setActiveSection('about')
      
      expect(navigation.currentSection).toBe('about')
      
      const aboutLinks = document.querySelectorAll('[data-section="about"]')
      aboutLinks.forEach(link => {
        expect(link.classList.contains('nav-link-active')).toBe(true)
      })
    })
    
    it('should remove active state from other sections', () => {
      // Set initial active section
      navigation.setActiveSection('hero')
      
      const heroLinks = document.querySelectorAll('[data-section="hero"]')
      heroLinks.forEach(link => {
        expect(link.classList.contains('nav-link-active')).toBe(true)
      })
      
      // Change to different section
      navigation.setActiveSection('about')
      
      heroLinks.forEach(link => {
        expect(link.classList.contains('nav-link-active')).toBe(false)
      })
    })
  })
  
  describe('Scroll State', () => {
    beforeEach(() => {
      navigation = new Navigation()
    })
    
    it('should update navigation appearance on scroll', () => {
      expect(navigation.isScrolled).toBe(false)
      
      // Simulate scroll state change
      navigation.isScrolled = true
      navigation.updateNavAppearance()
      
      expect(navigation.nav.classList.contains('nav-scrolled')).toBe(true)
    })
  })
  
  describe('Cleanup', () => {
    it('should clean up properly on destroy', () => {
      navigation = new Navigation()
      
      const nav = document.querySelector('[data-nav]')
      expect(nav).toBeTruthy()
      
      navigation.destroy()
      
      const navAfterDestroy = document.querySelector('[data-nav]')
      expect(navAfterDestroy).toBeFalsy()
    })
  })
  
  describe('Responsive Behavior', () => {
    beforeEach(() => {
      navigation = new Navigation()
    })
    
    it('should close mobile menu on window resize to desktop', () => {
      // Open mobile menu
      navigation.openMobileMenu()
      expect(navigation.isOpen).toBe(true)
      
      // Mock window.innerWidth for desktop size
      Object.defineProperty(window, 'innerWidth', {
        writable: true,
        configurable: true,
        value: 1024
      })
      
      // Trigger resize event
      const resizeEvent = new Event('resize')
      window.dispatchEvent(resizeEvent)
      
      expect(navigation.isOpen).toBe(false)
    })
  })
})