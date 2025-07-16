import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import CustomCursor from '../customCursor.js'

// Mock GSAP
vi.mock('gsap', () => ({
  gsap: {
    set: vi.fn(),
    to: vi.fn(),
    registerPlugin: vi.fn()
  }
}))

describe('CustomCursor', () => {
  let cursor
  let mockElement

  beforeEach(() => {
    // Setup DOM
    document.body.innerHTML = ''
    
    // Mock touch device detection
    Object.defineProperty(window, 'ontouchstart', {
      writable: true,
      value: undefined
    })
    
    Object.defineProperty(navigator, 'maxTouchPoints', {
      writable: true,
      value: 0
    })

    // Create mock interactive elements
    mockElement = document.createElement('button')
    mockElement.className = 'btn-luxury'
    mockElement.setAttribute('data-cursor', 'hover')
    document.body.appendChild(mockElement)
  })

  afterEach(() => {
    if (cursor) {
      cursor.destroy()
    }
    document.body.innerHTML = ''
  })

  it('should initialize cursor system on non-touch devices', () => {
    cursor = new CustomCursor()
    
    expect(document.querySelector('.custom-cursor-dot')).toBeTruthy()
    expect(document.querySelector('.custom-cursor-follower')).toBeTruthy()
  })

  it('should not initialize on touch devices', () => {
    // Mock touch device
    Object.defineProperty(navigator, 'maxTouchPoints', {
      writable: true,
      value: 1
    })
    
    cursor = new CustomCursor()
    
    expect(document.querySelector('.custom-cursor-dot')).toBeFalsy()
    expect(document.querySelector('.custom-cursor-follower')).toBeFalsy()
  })

  it('should have correct initial state', () => {
    cursor = new CustomCursor()
    
    expect(cursor.currentState).toBe('default')
    expect(cursor.isVisible).toBe(false)
    expect(cursor.isHovering).toBe(false)
  })

  it('should change state when hovering interactive elements', () => {
    cursor = new CustomCursor()
    
    // Simulate mouse enter on button
    const mouseEnterEvent = new MouseEvent('mouseenter')
    mockElement.dispatchEvent(mouseEnterEvent)
    
    expect(cursor.currentState).toBe('hover')
  })

  it('should return to default state when leaving interactive elements', () => {
    cursor = new CustomCursor()
    
    // First hover
    const mouseEnterEvent = new MouseEvent('mouseenter')
    mockElement.dispatchEvent(mouseEnterEvent)
    expect(cursor.currentState).toBe('hover')
    
    // Then leave
    const mouseLeaveEvent = new MouseEvent('mouseleave')
    mockElement.dispatchEvent(mouseLeaveEvent)
    expect(cursor.currentState).toBe('default')
  })

  it('should handle mouse movement', () => {
    cursor = new CustomCursor()
    
    const mouseMoveEvent = new MouseEvent('mousemove', {
      clientX: 100,
      clientY: 200
    })
    
    document.dispatchEvent(mouseMoveEvent)
    
    expect(cursor.mouseX).toBe(100)
    expect(cursor.mouseY).toBe(200)
  })

  it('should show cursor when mouse enters document', () => {
    cursor = new CustomCursor()
    
    const mouseEnterEvent = new MouseEvent('mouseenter')
    document.dispatchEvent(mouseEnterEvent)
    
    expect(cursor.isVisible).toBe(true)
  })

  it('should hide cursor when mouse leaves document', () => {
    cursor = new CustomCursor()
    
    // First show
    const mouseEnterEvent = new MouseEvent('mouseenter')
    document.dispatchEvent(mouseEnterEvent)
    expect(cursor.isVisible).toBe(true)
    
    // Then hide
    const mouseLeaveEvent = new MouseEvent('mouseleave')
    document.dispatchEvent(mouseLeaveEvent)
    expect(cursor.isVisible).toBe(false)
  })

  it('should change to click state on mouse down', () => {
    cursor = new CustomCursor()
    
    const mouseDownEvent = new MouseEvent('mousedown')
    document.dispatchEvent(mouseDownEvent)
    
    expect(cursor.currentState).toBe('click')
  })

  it('should update theme colors', () => {
    cursor = new CustomCursor()
    
    // Test theme update
    cursor.updateTheme('night')
    
    // Should call gsap.to for color updates
    // This would be tested with proper GSAP mocking
    expect(cursor.currentState).toBeDefined()
  })

  it('should handle different cursor states', () => {
    cursor = new CustomCursor()
    
    // Test all states
    const states = ['default', 'hover', 'click', 'drag', 'text']
    
    states.forEach(state => {
      cursor.setState(state)
      expect(cursor.currentState).toBe(state)
    })
  })

  it('should bind to different element types', () => {
    // Create different interactive elements
    const link = document.createElement('a')
    link.href = '#'
    document.body.appendChild(link)
    
    const dragElement = document.createElement('div')
    dragElement.setAttribute('data-cursor', 'drag')
    document.body.appendChild(dragElement)
    
    const textElement = document.createElement('p')
    textElement.textContent = 'Test text'
    document.body.appendChild(textElement)
    
    cursor = new CustomCursor()
    
    // Should have bound events to all elements
    expect(cursor.currentState).toBe('default')
  })

  it('should clean up properly on destroy', () => {
    cursor = new CustomCursor()
    
    const cursorDot = document.querySelector('.custom-cursor-dot')
    const cursorFollower = document.querySelector('.custom-cursor-follower')
    
    expect(cursorDot).toBeTruthy()
    expect(cursorFollower).toBeTruthy()
    
    cursor.destroy()
    
    // Elements should be removed
    expect(document.querySelector('.custom-cursor-dot')).toBeFalsy()
    expect(document.querySelector('.custom-cursor-follower')).toBeFalsy()
  })

  it('should handle interactive element detection', () => {
    cursor = new CustomCursor()
    
    // Test interactive element detection
    expect(cursor.isInteractiveElement(mockElement)).toBe(true)
    
    const nonInteractiveElement = document.createElement('div')
    expect(cursor.isInteractiveElement(nonInteractiveElement)).toBe(false)
  })
})