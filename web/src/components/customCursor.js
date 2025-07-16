import { gsap } from 'gsap'

/**
 * Custom Cursor System inspired by ChungiYoo with luxury gold theme
 * Features smooth tracking, hover transformations, and interaction variations
 */
class CustomCursor {
  constructor() {
    this.cursor = null
    this.follower = null
    this.isHovering = false
    this.currentState = 'default'
    this.mouseX = 0
    this.mouseY = 0
    this.followerX = 0
    this.followerY = 0
    this.isVisible = false
    this.animationId = null
    
    // Cursor states configuration
    this.states = {
      default: {
        size: 8,
        followerSize: 32,
        opacity: 1,
        scale: 1,
        mixBlendMode: 'difference'
      },
      hover: {
        size: 4,
        followerSize: 48,
        opacity: 0.8,
        scale: 1.2,
        mixBlendMode: 'difference'
      },
      click: {
        size: 12,
        followerSize: 24,
        opacity: 1,
        scale: 0.8,
        mixBlendMode: 'difference'
      },
      drag: {
        size: 6,
        followerSize: 40,
        opacity: 0.9,
        scale: 1.1,
        mixBlendMode: 'multiply'
      },
      text: {
        size: 2,
        followerSize: 20,
        opacity: 0.6,
        scale: 1,
        mixBlendMode: 'difference'
      }
    }
    
    this.init()
  }
  
  init() {
    // Only initialize if device has mouse
    if (this.isTouchDevice()) {
      return
    }
    
    this.createCursorElements()
    this.bindEvents()
    this.startAnimation()
    
    console.log('🎯 Custom cursor system initialized')
  }
  
  isTouchDevice() {
    return (
      'ontouchstart' in window ||
      navigator.maxTouchPoints > 0 ||
      navigator.msMaxTouchPoints > 0 ||
      window.matchMedia('(pointer: coarse)').matches
    )
  }
  
  createCursorElements() {
    // Create cursor dot
    this.cursor = document.createElement('div')
    this.cursor.className = 'custom-cursor-dot'
    this.cursor.setAttribute('aria-hidden', 'true')
    
    // Create cursor follower
    this.follower = document.createElement('div')
    this.follower.className = 'custom-cursor-follower'
    this.follower.setAttribute('aria-hidden', 'true')
    
    // Add to DOM
    document.body.appendChild(this.cursor)
    document.body.appendChild(this.follower)
    
    // Set initial styles
    this.setCursorStyles()
    this.setState('default')
  }
  
  setCursorStyles() {
    // Cursor dot styles
    gsap.set(this.cursor, {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '8px',
      height: '8px',
      backgroundColor: '#ecbb4f',
      borderRadius: '50%',
      pointerEvents: 'none',
      zIndex: 9999,
      opacity: 0,
      scale: 1,
      mixBlendMode: 'difference'
    })
    
    // Cursor follower styles
    gsap.set(this.follower, {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '32px',
      height: '32px',
      border: '1px solid #ecbb4f',
      borderRadius: '50%',
      pointerEvents: 'none',
      zIndex: 9998,
      opacity: 0,
      scale: 1,
      mixBlendMode: 'difference'
    })
  }
  
  bindEvents() {
    // Mouse movement
    document.addEventListener('mousemove', this.onMouseMove.bind(this))
    
    // Mouse enter/leave document
    document.addEventListener('mouseenter', this.onMouseEnter.bind(this))
    document.addEventListener('mouseleave', this.onMouseLeave.bind(this))
    
    // Mouse down/up for click state
    document.addEventListener('mousedown', this.onMouseDown.bind(this))
    document.addEventListener('mouseup', this.onMouseUp.bind(this))
    
    // Hover effects for interactive elements
    this.bindHoverElements()
    
    // Drag events
    this.bindDragElements()
    
    // Text selection events
    this.bindTextElements()
  }
  
  bindHoverElements() {
    // Define interactive selectors
    const interactiveSelectors = [
      'a',
      'button',
      '[data-cursor="hover"]',
      '.btn-luxury',
      '[role="button"]',
      'input[type="submit"]',
      'input[type="button"]',
      '.cursor-hover'
    ]
    
    const interactiveElements = document.querySelectorAll(interactiveSelectors.join(', '))
    
    interactiveElements.forEach(element => {
      element.addEventListener('mouseenter', () => this.setState('hover'))
      element.addEventListener('mouseleave', () => this.setState('default'))
    })
  }
  
  bindDragElements() {
    const draggableSelectors = [
      '[draggable="true"]',
      '[data-cursor="drag"]',
      '.draggable',
      '[data-amenities-scroll]',
      '[data-testimonials]'
    ]
    
    const draggableElements = document.querySelectorAll(draggableSelectors.join(', '))
    
    draggableElements.forEach(element => {
      element.addEventListener('mouseenter', () => this.setState('drag'))
      element.addEventListener('mouseleave', () => this.setState('default'))
    })
  }
  
  bindTextElements() {
    const textSelectors = [
      'p',
      'span',
      'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
      '[data-cursor="text"]',
      '.text-selectable'
    ]
    
    const textElements = document.querySelectorAll(textSelectors.join(', '))
    
    textElements.forEach(element => {
      element.addEventListener('mouseenter', () => {
        if (!element.closest('a, button, [data-cursor="hover"]')) {
          this.setState('text')
        }
      })
      element.addEventListener('mouseleave', () => {
        if (!element.closest('a, button, [data-cursor="hover"]')) {
          this.setState('default')
        }
      })
    })
  }
  
  onMouseMove(e) {
    this.mouseX = e.clientX
    this.mouseY = e.clientY
    
    // Update cursor dot position immediately
    gsap.set(this.cursor, {
      x: this.mouseX - 4, // Center the 8px dot
      y: this.mouseY - 4
    })
  }
  
  onMouseEnter() {
    this.isVisible = true
    gsap.to([this.cursor, this.follower], {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out'
    })
  }
  
  onMouseLeave() {
    this.isVisible = false
    gsap.to([this.cursor, this.follower], {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out'
    })
  }
  
  onMouseDown() {
    this.setState('click')
  }
  
  onMouseUp() {
    // Return to previous state (hover or default)
    const hoveredElement = document.elementFromPoint(this.mouseX, this.mouseY)
    if (hoveredElement && this.isInteractiveElement(hoveredElement)) {
      this.setState('hover')
    } else {
      this.setState('default')
    }
  }
  
  isInteractiveElement(element) {
    const interactiveSelectors = [
      'a', 'button', '[data-cursor="hover"]', '.btn-luxury',
      '[role="button"]', 'input[type="submit"]', 'input[type="button"]'
    ]
    
    return interactiveSelectors.some(selector => 
      element.matches(selector) || element.closest(selector)
    )
  }
  
  setState(newState) {
    if (this.currentState === newState) return
    
    this.currentState = newState
    const state = this.states[newState]
    
    if (!state) return
    
    // Animate cursor dot
    gsap.to(this.cursor, {
      width: state.size,
      height: state.size,
      scale: state.scale,
      opacity: this.isVisible ? state.opacity : 0,
      mixBlendMode: state.mixBlendMode,
      duration: 0.3,
      ease: 'power2.out'
    })
    
    // Animate cursor follower
    gsap.to(this.follower, {
      width: state.followerSize,
      height: state.followerSize,
      scale: state.scale,
      opacity: this.isVisible ? state.opacity * 0.6 : 0,
      mixBlendMode: state.mixBlendMode,
      duration: 0.4,
      ease: 'power2.out'
    })
    
    // Update cursor position offset based on new size
    const offset = state.size / 2
    gsap.set(this.cursor, {
      x: this.mouseX - offset,
      y: this.mouseY - offset
    })
  }
  
  startAnimation() {
    const animate = () => {
      // Smooth follower movement with easing
      this.followerX += (this.mouseX - this.followerX) * 0.1
      this.followerY += (this.mouseY - this.followerY) * 0.1
      
      // Update follower position
      const followerSize = this.states[this.currentState].followerSize
      gsap.set(this.follower, {
        x: this.followerX - (followerSize / 2),
        y: this.followerY - (followerSize / 2)
      })
      
      this.animationId = requestAnimationFrame(animate)
    }
    
    animate()
  }
  
  // Public methods for external control
  hide() {
    gsap.to([this.cursor, this.follower], {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out'
    })
  }
  
  show() {
    if (this.isVisible) {
      gsap.to([this.cursor, this.follower], {
        opacity: this.states[this.currentState].opacity,
        duration: 0.3,
        ease: 'power2.out'
      })
    }
  }
  
  updateTheme(theme) {
    // Update cursor colors based on theme
    const themeColors = {
      dawn: '#ecbb4f',
      day: '#d4af37', 
      dusk: '#ffd700',
      night: '#ecbb4f'
    }
    
    const color = themeColors[theme] || '#ecbb4f'
    
    gsap.to(this.cursor, {
      backgroundColor: color,
      duration: 0.5,
      ease: 'power2.out'
    })
    
    gsap.to(this.follower, {
      borderColor: color,
      duration: 0.5,
      ease: 'power2.out'
    })
  }
  
  destroy() {
    // Clean up
    if (this.animationId) {
      cancelAnimationFrame(this.animationId)
    }
    
    // Remove event listeners
    document.removeEventListener('mousemove', this.onMouseMove.bind(this))
    document.removeEventListener('mouseenter', this.onMouseEnter.bind(this))
    document.removeEventListener('mouseleave', this.onMouseLeave.bind(this))
    document.removeEventListener('mousedown', this.onMouseDown.bind(this))
    document.removeEventListener('mouseup', this.onMouseUp.bind(this))
    
    // Remove DOM elements
    if (this.cursor && this.cursor.parentNode) {
      this.cursor.parentNode.removeChild(this.cursor)
    }
    if (this.follower && this.follower.parentNode) {
      this.follower.parentNode.removeChild(this.follower)
    }
  }
}

export default CustomCursor