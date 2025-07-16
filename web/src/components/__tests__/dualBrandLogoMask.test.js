import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import DualBrandLogoMask from '../dualBrandLogoMask.js'

// Mock GSAP
vi.mock('gsap', () => ({
  gsap: {
    timeline: vi.fn(() => ({
      to: vi.fn().mockReturnThis(),
      set: vi.fn().mockReturnThis(),
      play: vi.fn().mockReturnThis(),
      kill: vi.fn().mockReturnThis(),
      pause: vi.fn().mockReturnThis(),
      resume: vi.fn().mockReturnThis(),
      isActive: vi.fn(() => false),
      paused: vi.fn(() => false),
      onComplete: vi.fn()
    })),
    set: vi.fn(),
    to: vi.fn()
  }
}))

describe('Dual Brand Logo Mask', () => {
  let dualBrandMask
  let mockContainer

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = ''
    
    // Create mock container
    mockContainer = document.createElement('div')
    document.body.appendChild(mockContainer)
    
    // Initialize dual brand mask
    dualBrandMask = new DualBrandLogoMask()
  })

  afterEach(() => {
    // Cleanup
    if (dualBrandMask) {
      dualBrandMask.cleanup()
    }
    document.body.innerHTML = ''
  })

  it('should initialize with correct default properties', () => {
    expect(dualBrandMask.maskContainer).toBeNull()
    expect(dualBrandMask.isAnimating).toBe(false)
    expect(dualBrandMask.hasCompleted).toBe(false)
    expect(dualBrandMask.currentPhase).toBe('initial')
  })

  it('should create mask elements when initialized', () => {
    dualBrandMask.init()
    
    expect(dualBrandMask.maskContainer).not.toBeNull()
    expect(document.querySelector('.dual-brand-entry-mask')).not.toBeNull()
    expect(document.querySelector('.global-one-container')).not.toBeNull()
    expect(document.querySelector('.ananta-container')).not.toBeNull()
    expect(document.querySelector('.expanding-circle')).not.toBeNull()
    expect(document.querySelector('.click-to-enter')).not.toBeNull()
  })

  it('should have correct logo sources', () => {
    dualBrandMask.init()
    
    const globalOneLogo = document.querySelector('.global-one-logo')
    const anantaLogo = document.querySelector('.ananta-logo')
    
    expect(globalOneLogo.src).toContain('/logos/company.svg')
    expect(anantaLogo.src).toContain('/logos/ananta.svg')
  })

  it('should have proper accessibility attributes', () => {
    dualBrandMask.init()
    
    const mask = document.querySelector('.dual-brand-entry-mask')
    const clickToEnter = document.querySelector('.click-to-enter')
    
    expect(mask.getAttribute('role')).toBe('dialog')
    expect(mask.getAttribute('aria-label')).toBe('Brand introduction')
    expect(clickToEnter.getAttribute('role')).toBe('button')
    expect(clickToEnter.getAttribute('tabindex')).toBe('0')
  })

  it('should prevent scrolling when active', () => {
    const originalOverflow = document.body.style.overflow
    
    dualBrandMask.init()
    
    expect(document.body.style.overflow).toBe('hidden')
    
    // Cleanup should restore scrolling
    dualBrandMask.cleanup()
    expect(document.body.style.overflow).toBe('auto')
  })

  it('should handle click to enter', () => {
    dualBrandMask.init()
    dualBrandMask.currentPhase = 'ananta' // Set to ready state
    
    const clickToEnter = document.querySelector('.click-to-enter')
    const clickEvent = new Event('click')
    
    clickToEnter.dispatchEvent(clickEvent)
    
    // Should start expanding reveal
    expect(dualBrandMask.currentPhase).toBe('expanding')
  })

  it('should handle keyboard interaction', () => {
    dualBrandMask.init()
    dualBrandMask.currentPhase = 'ananta' // Set to ready state
    
    const clickToEnter = document.querySelector('.click-to-enter')
    const enterEvent = new KeyboardEvent('keypress', { key: 'Enter' })
    
    clickToEnter.dispatchEvent(enterEvent)
    
    // Should start expanding reveal
    expect(dualBrandMask.currentPhase).toBe('expanding')
  })

  it('should dispatch completion event', () => {
    let eventDispatched = false
    
    document.addEventListener('dualBrandMaskComplete', () => {
      eventDispatched = true
    })
    
    dualBrandMask.init()
    dualBrandMask.initMainSiteAnimations()
    
    expect(eventDispatched).toBe(true)
  })

  it('should not initialize if already completed', () => {
    dualBrandMask.hasCompleted = true
    dualBrandMask.init()
    
    expect(document.querySelector('.dual-brand-entry-mask')).toBeNull()
  })

  it('should cleanup properly', () => {
    dualBrandMask.init()
    
    expect(document.querySelector('.dual-brand-entry-mask')).not.toBeNull()
    
    dualBrandMask.cleanup()
    
    expect(document.querySelector('.dual-brand-entry-mask')).toBeNull()
    expect(dualBrandMask.hasCompleted).toBe(true)
    expect(dualBrandMask.currentPhase).toBe('complete')
  })

  it('should have skip functionality', () => {
    dualBrandMask.init()
    
    expect(dualBrandMask.hasCompleted).toBe(false)
    
    dualBrandMask.skip()
    
    expect(dualBrandMask.hasCompleted).toBe(true)
  })

  it('should support pause and resume', () => {
    dualBrandMask.init()
    
    // These should not throw errors
    expect(() => {
      dualBrandMask.pause()
      dualBrandMask.resume()
    }).not.toThrow()
  })
})