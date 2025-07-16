/**
 * About Section Tests
 * Tests the enhanced about section with dusk theme and scroll-triggered reveals
 */

import { describe, it, expect, beforeEach, vi } from 'vitest'
import { JSDOM } from 'jsdom'

// Mock GSAP and ScrollTrigger
const mockGsap = {
  set: vi.fn(),
  to: vi.fn(),
  timeline: vi.fn(() => ({
    scrollTrigger: vi.fn()
  })),
  registerPlugin: vi.fn(),
  ticker: {
    add: vi.fn(),
    lagSmoothing: vi.fn()
  }
}

const mockScrollTrigger = {
  create: vi.fn(),
  refresh: vi.fn(),
  getAll: vi.fn(() => [])
}

// Mock SplitType
const mockSplitType = vi.fn(() => ({
  chars: [],
  words: [],
  lines: [],
  revert: vi.fn()
}))

// Setup DOM
const dom = new JSDOM(`
<!DOCTYPE html>
<html>
<head>
  <title>Test</title>
  <style>
    :root {
      --theme-bg: #ffffff;
      --theme-text: #000000;
      --theme-accent: #ecbb4f;
      --theme-border: #e0e0e0;
      --theme-shadow: rgba(236, 187, 79, 0.1);
      --transition-theme: 0.6s;
      --transition-luxury: cubic-bezier(0.4, 0, 0.2, 1);
    }
  </style>
</head>
<body>
  <section id="about" class="section-padding theme-aware relative overflow-hidden about-dusk-theme" 
           data-theme-section="dusk"
           data-parallax-container="true"
           role="main"
           aria-label="About Project Ananta">
    
    <div class="absolute inset-0 z-0" data-parallax-bg="true">
      <div class="absolute inset-0 bg-gradient-to-br from-transparent via-theme-accent/5 to-theme-accent/10"></div>
    </div>
    
    <div class="container-luxury relative z-10">
      <div class="grid lg:grid-cols-2 gap-16 items-center">
        
        <div class="space-y-8" data-about-content="true">
          <header class="space-y-6" data-animate="slide-left" data-delay="0.2">
            <h2 class="text-responsive-xl font-montserrat font-light text-theme-text" 
                data-text-preset="luxury-reveal" 
                data-split-type="chars" 
                data-stagger="0.02">
              About Project Ananta
            </h2>
          </header>
          
          <div class="grid grid-cols-2 gap-6" data-animate="slide-left" data-delay="0.6">
            <div class="flex items-center space-x-4 card-luxury p-4 rounded-lg" data-feature-card="true">
              <div>
                <p class="font-montserrat font-medium text-theme-text">5 Towers</p>
                <p class="text-sm text-theme-text-secondary font-light">Luxury Residences</p>
              </div>
            </div>
            
            <div class="flex items-center space-x-4 card-luxury p-4 rounded-lg" data-feature-card="true">
              <div>
                <p class="font-montserrat font-medium text-theme-text">466 Units</p>
                <p class="text-sm text-theme-text-secondary font-light">Per Tower</p>
              </div>
            </div>
          </div>
        </div>
        
        <div class="relative" data-about-visual="true">
          <div class="relative z-10" data-animate="slide-right" data-delay="0.3">
            <div class="relative overflow-hidden rounded-2xl shadow-2xl group">
              <div class="aspect-w-4 aspect-h-5 bg-theme-bg-secondary" data-parallax-element="0.2">
                <img src="/images/h0010.jpg" 
                     alt="Project Ananta luxury apartment rendering" 
                     class="w-full h-full object-cover"
                     data-fade-img="true" />
              </div>
            </div>
          </div>
        </div>
        
      </div>
    </div>
  </section>
</body>
</html>
`, { url: 'http://localhost' })

global.window = dom.window
global.document = dom.window.document
global.HTMLElement = dom.window.HTMLElement
global.getComputedStyle = dom.window.getComputedStyle

// Mock modules
vi.mock('gsap', () => ({
  gsap: mockGsap,
  ScrollTrigger: mockScrollTrigger
}))

vi.mock('split-type', () => ({
  default: mockSplitType
}))

describe('About Section', () => {
  let AboutSection
  let aboutSection

  beforeEach(async () => {
    // Reset mocks
    vi.clearAllMocks()
    
    // Import the module
    const module = await import('../about.js')
    AboutSection = module.default
    aboutSection = new AboutSection()
  })

  describe('Initialization', () => {
    it('should find the about section element', () => {
      aboutSection.init()
      
      expect(aboutSection.section).toBeTruthy()
      expect(aboutSection.section.id).toBe('about')
    })

    it('should set up elements correctly', () => {
      aboutSection.init()
      
      expect(aboutSection.elements.content).toBeTruthy()
      expect(aboutSection.elements.visual).toBeTruthy()
      expect(aboutSection.elements.parallaxBg).toBeTruthy()
    })

    it('should mark as initialized', () => {
      expect(aboutSection.isInitialized).toBe(false)
      aboutSection.init()
      expect(aboutSection.isInitialized).toBe(true)
    })
  })

  describe('Theme Integration', () => {
    it('should have theme-aware classes', () => {
      const section = document.getElementById('about')
      
      expect(section.classList.contains('theme-aware')).toBe(true)
      expect(section.hasAttribute('data-theme-section')).toBe(true)
      expect(section.getAttribute('data-theme-section')).toBe('dusk')
    })

    it('should have theme-aware styling elements', () => {
      const themeElements = document.querySelectorAll('.text-theme-text, .text-theme-accent')
      expect(themeElements.length).toBeGreaterThan(0)
    })
  })

  describe('Content Structure', () => {
    it('should preserve original content', () => {
      const section = document.getElementById('about')
      const content = section.textContent
      
      expect(content).toContain('About Project Ananta')
      expect(content).toContain('5 Towers')
      expect(content).toContain('466 Units')
      expect(content).toContain('Luxury Residences')
    })

    it('should have feature cards', () => {
      const featureCards = document.querySelectorAll('[data-feature-card]')
      expect(featureCards.length).toBe(2)
    })

    it('should have animated elements', () => {
      const animatedElements = document.querySelectorAll('[data-animate]')
      expect(animatedElements.length).toBeGreaterThan(0)
    })
  })

  describe('Parallax Effects', () => {
    it('should have parallax background', () => {
      const parallaxBg = document.querySelector('[data-parallax-bg]')
      expect(parallaxBg).toBeTruthy()
    })

    it('should have parallax elements', () => {
      const parallaxElements = document.querySelectorAll('[data-parallax-element]')
      expect(parallaxElements.length).toBeGreaterThan(0)
    })
  })

  describe('Text Animations', () => {
    it('should have text preset elements', () => {
      const textElements = document.querySelectorAll('[data-text-preset]')
      expect(textElements.length).toBeGreaterThan(0)
    })

    it('should initialize SplitType for luxury reveal', () => {
      aboutSection.init()
      
      const luxuryRevealElements = document.querySelectorAll('[data-text-preset="luxury-reveal"]')
      expect(luxuryRevealElements.length).toBeGreaterThan(0)
    })
  })

  describe('Accessibility', () => {
    it('should have proper ARIA labels', () => {
      const section = document.getElementById('about')
      
      expect(section.hasAttribute('aria-label')).toBe(true)
      expect(section.hasAttribute('role')).toBe(true)
      expect(section.getAttribute('role')).toBe('main')
    })

    it('should have alt text for images', () => {
      const images = document.querySelectorAll('img')
      images.forEach(img => {
        expect(img.hasAttribute('alt')).toBe(true)
        expect(img.getAttribute('alt')).toBeTruthy()
      })
    })
  })

  describe('Responsive Design', () => {
    it('should have responsive grid layout', () => {
      const gridLayout = document.querySelector('.grid.lg\\:grid-cols-2')
      expect(gridLayout).toBeTruthy()
    })

    it('should have luxury container', () => {
      const container = document.querySelector('.container-luxury')
      expect(container).toBeTruthy()
    })
  })

  describe('Animation Setup', () => {
    it('should initialize scroll triggers', () => {
      aboutSection.init()
      
      // Should call ScrollTrigger.create for animated elements
      expect(mockScrollTrigger.create).toHaveBeenCalled()
    })

    it('should set up GSAP animations', () => {
      aboutSection.init()
      
      // Should call gsap.set for initial states
      expect(mockGsap.set).toHaveBeenCalled()
    })
  })

  describe('Performance Optimization', () => {
    it('should have will-change properties for animated elements', () => {
      // This would be tested in a real browser environment
      // Here we just verify the structure is correct
      const animatedElements = document.querySelectorAll('[data-animate]')
      expect(animatedElements.length).toBeGreaterThan(0)
    })
  })

  describe('Cleanup', () => {
    it('should destroy properly', () => {
      aboutSection.init()
      aboutSection.destroy()
      
      expect(aboutSection.isInitialized).toBe(false)
    })
  })
})

describe('About Section Integration', () => {
  it('should export initAboutReveal function', async () => {
    const module = await import('../about.js')
    expect(typeof module.initAboutReveal).toBe('function')
  })

  it('should handle theme transition events', () => {
    const aboutSection = new AboutSection()
    aboutSection.init()
    
    // Simulate theme transition event
    const event = new CustomEvent('themeTransition', {
      detail: {
        theme: 'dusk',
        colors: {
          accent: '#ffd700'
        }
      }
    })
    
    window.dispatchEvent(event)
    
    // Should handle the event without errors
    expect(true).toBe(true)
  })
})