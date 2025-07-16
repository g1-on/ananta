import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { initStatsCounters, createStatsSection, statsData } from '../stats.js';

// Mock GSAP and ScrollTrigger for testing
const mockGsap = {
  set: vi.fn(),
  to: vi.fn((target, props) => {
    // Simulate GSAP animation completion
    if (props.onUpdate) props.onUpdate()
    if (props.onComplete) props.onComplete()
    return Promise.resolve()
  }),
  from: vi.fn(),
  timeline: vi.fn(() => ({
    to: vi.fn().mockReturnThis(),
    from: vi.fn().mockReturnThis()
  }))
}

const mockScrollTrigger = {
  create: vi.fn((config) => {
    // Simulate scroll trigger activation
    if (config.onEnter) {
      setTimeout(() => config.onEnter(), 0)
    }
    return { kill: vi.fn() }
  }),
  refresh: vi.fn()
}

describe('Enhanced Stats Counters', () => {
  beforeEach(() => {
    // Set up DOM with stats section
    document.body.innerHTML = `
      <section id="stats" class="section-padding theme-aware text-center stats-day-theme">
        <!-- Content will be dynamically generated -->
      </section>
    `;
    
    // Mock GSAP globals
    global.gsap = mockGsap
    global.ScrollTrigger = mockScrollTrigger
    
    // Mock IntersectionObserver
    global.IntersectionObserver = class {
      constructor(cb) { this.cb = cb; }
      observe(el) { 
        // Simulate intersection after a delay
        setTimeout(() => {
          this.cb([{ target: el, isIntersecting: true }], this)
        }, 0)
      }
      unobserve() {}
      disconnect() {}
    };
    
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
    // Clear mocks
    mockGsap.set.mockClear()
    mockGsap.to.mockClear()
    mockScrollTrigger.create.mockClear()
  });

  it('creates enhanced stats section with correct structure', () => {
    // Create the enhanced stats section
    createStatsSection()
    
    const statsSection = document.getElementById('stats')
    expect(statsSection).toBeTruthy()
    
    // Check for stat cards
    const statCards = document.querySelectorAll('.stat-card')
    expect(statCards).toHaveLength(4)
    
    // Check for counters
    const counters = document.querySelectorAll('[data-counter]')
    expect(counters).toHaveLength(4)
    
    // Check for progress bars
    const progressBars = document.querySelectorAll('[data-progress]')
    expect(progressBars).toHaveLength(4)
    
    // Verify stats data structure
    expect(statsData).toHaveLength(4)
    expect(statsData[0]).toHaveProperty('value')
    expect(statsData[0]).toHaveProperty('label')
    expect(statsData[0]).toHaveProperty('icon')
  })

  it('initializes GSAP animations correctly', async () => {
    // Create stats section first
    createStatsSection()
    
    // Initialize stats counters
    initStatsCounters()
    
    // Wait for async operations
    await vi.runAllTimersAsync()
    
    // Verify GSAP methods were called
    expect(mockGsap.set).toHaveBeenCalled()
    expect(mockScrollTrigger.create).toHaveBeenCalled()
    
    // Verify ScrollTrigger was created for counters
    const scrollTriggerCalls = mockScrollTrigger.create.mock.calls
    expect(scrollTriggerCalls.length).toBeGreaterThan(0)
    
    // Verify at least one ScrollTrigger has onEnter callback
    const hasOnEnterCallback = scrollTriggerCalls.some(call => 
      call[0] && typeof call[0].onEnter === 'function'
    )
    expect(hasOnEnterCallback).toBe(true)
  })

  it('handles counter animations with luxury timing', async () => {
    createStatsSection()
    initStatsCounters()
    
    await vi.runAllTimersAsync()
    
    // Verify GSAP.to was called for counter animations
    expect(mockGsap.to).toHaveBeenCalled()
    
    // Check if counter animation properties are correct
    const gsapToCalls = mockGsap.to.mock.calls
    const counterAnimationCall = gsapToCalls.find(call => 
      call[0] && typeof call[0] === 'object' && 'value' in call[0]
    )
    
    expect(counterAnimationCall).toBeTruthy()
    if (counterAnimationCall) {
      const animationProps = counterAnimationCall[1]
      expect(animationProps).toHaveProperty('duration')
      expect(animationProps).toHaveProperty('ease')
      expect(animationProps.ease).toBe('power2.out')
    }
  })

  it('applies theme-aware styling', () => {
    createStatsSection()
    
    // Check for theme-aware classes
    const themeAwareElements = document.querySelectorAll('.theme-aware-text, .theme-aware-text-secondary')
    expect(themeAwareElements.length).toBeGreaterThan(0)
    
    // Check for day theme class
    const statsSection = document.getElementById('stats')
    expect(statsSection.classList.contains('stats-day-theme')).toBe(true)
    
    // Check for luxury card styling
    const luxuryCards = document.querySelectorAll('.card-luxury')
    expect(luxuryCards.length).toBeGreaterThan(0)
  })

  it('includes accessibility features', () => {
    createStatsSection()
    
    // Check for proper ARIA labels and semantic structure
    const statCards = document.querySelectorAll('.stat-card')
    statCards.forEach(card => {
      expect(card.getAttribute('data-cursor')).toBe('hover')
    })
    
    // Check for descriptive text
    const descriptions = document.querySelectorAll('.stat-description')
    expect(descriptions.length).toBe(4)
    
    descriptions.forEach(desc => {
      expect(desc.textContent.length).toBeGreaterThan(0)
    })
  })

  it('implements visual enhancements and micro-interactions', async () => {
    createStatsSection()
    initStatsCounters()
    
    await vi.runAllTimersAsync()
    
    // Verify theme transition ScrollTrigger was created
    const scrollTriggerCalls = mockScrollTrigger.create.mock.calls
    const themeTransitionTrigger = scrollTriggerCalls.find(call => 
      call[0] && call[0].onUpdate && typeof call[0].onUpdate === 'function'
    )
    expect(themeTransitionTrigger).toBeTruthy()
    
    // Verify entrance animations with staggered timing
    const gsapToCalls = mockGsap.to.mock.calls
    const staggeredAnimation = gsapToCalls.find(call => 
      call[1] && call[1].stagger && typeof call[1].stagger === 'object'
    )
    expect(staggeredAnimation).toBeTruthy()
    
    if (staggeredAnimation) {
      const staggerConfig = staggeredAnimation[1].stagger
      expect(staggerConfig).toHaveProperty('amount')
      expect(staggerConfig).toHaveProperty('ease')
    }
    
    // Verify luxury easing is used
    const luxuryEasingAnimation = gsapToCalls.find(call => 
      call[1] && (call[1].ease === 'back.out(1.4)' || call[1].ease === 'back.out(1.7)')
    )
    expect(luxuryEasingAnimation).toBeTruthy()
  })

  it('handles hover interactions and gold highlights', () => {
    createStatsSection()
    initStatsCounters()
    
    const statCards = document.querySelectorAll('.stat-card')
    expect(statCards.length).toBeGreaterThan(0)
    
    // Test hover event handling
    const firstCard = statCards[0]
    const mouseEnterEvent = new MouseEvent('mouseenter', { bubbles: true })
    const mouseLeaveEvent = new MouseEvent('mouseleave', { bubbles: true })
    
    // Simulate hover
    firstCard.dispatchEvent(mouseEnterEvent)
    
    // Verify GSAP animations were called for hover effects
    expect(mockGsap.to).toHaveBeenCalled()
    
    // Simulate hover leave
    firstCard.dispatchEvent(mouseLeaveEvent)
    
    // Should have additional GSAP calls for hover leave
    expect(mockGsap.to.mock.calls.length).toBeGreaterThan(1)
  })

  it('supports theme transitions from day to dusk', async () => {
    createStatsSection()
    initStatsCounters()
    
    await vi.runAllTimersAsync()
    
    const statsSection = document.getElementById('stats')
    
    // Verify initial day theme
    expect(statsSection.classList.contains('stats-day-theme')).toBe(true)
    
    // Verify theme transition ScrollTrigger exists
    const scrollTriggerCalls = mockScrollTrigger.create.mock.calls
    const themeTransitionCall = scrollTriggerCalls.find(call => 
      call[0] && call[0].onUpdate
    )
    
    expect(themeTransitionCall).toBeTruthy()
    
    // Simulate scroll progress for theme transition
    if (themeTransitionCall) {
      const mockSelf = { progress: 0.8 } // Simulate 80% scroll progress
      themeTransitionCall[0].onUpdate(mockSelf)
      
      // Should transition to dusk theme at high scroll progress
      expect(statsSection.classList.contains('stats-dusk-theme')).toBe(true)
    }
  })
});
