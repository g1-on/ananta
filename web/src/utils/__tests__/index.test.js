// Test file for utility functions
import { describe, it, expect, vi } from 'vitest'
import { debounce, throttle, isInViewport, scrollToElement } from '../index.js'

describe('Utility Functions', () => {
  describe('debounce', () => {
    it('should delay function execution', async () => {
      const mockFn = vi.fn()
      const debouncedFn = debounce(mockFn, 100)
      
      debouncedFn()
      debouncedFn()
      debouncedFn()
      
      expect(mockFn).not.toHaveBeenCalled()
      
      await new Promise(resolve => setTimeout(resolve, 150))
      expect(mockFn).toHaveBeenCalledTimes(1)
    })
  })
  
  describe('throttle', () => {
    it('should limit function execution frequency', async () => {
      const mockFn = vi.fn()
      const throttledFn = throttle(mockFn, 100)
      
      throttledFn()
      throttledFn()
      throttledFn()
      
      expect(mockFn).toHaveBeenCalledTimes(1)
      
      await new Promise(resolve => setTimeout(resolve, 150))
      throttledFn()
      expect(mockFn).toHaveBeenCalledTimes(2)
    })
  })
  
  describe('isInViewport', () => {
    it('should check if element is in viewport', () => {
      const mockElement = {
        getBoundingClientRect: () => ({
          top: 100,
          left: 100,
          bottom: 200,
          right: 200
        })
      }
      
      // Mock window dimensions
      Object.defineProperty(window, 'innerHeight', { value: 800, writable: true })
      Object.defineProperty(window, 'innerWidth', { value: 1200, writable: true })
      
      const result = isInViewport(mockElement)
      expect(result).toBe(true)
    })
  })
  
  describe('scrollToElement', () => {
    it('should scroll to element smoothly', () => {
      const mockElement = {
        getBoundingClientRect: () => ({ top: 500 })
      }
      
      const scrollToSpy = vi.fn()
      Object.defineProperty(window, 'scrollTo', { value: scrollToSpy, writable: true })
      Object.defineProperty(window, 'pageYOffset', { value: 0, writable: true })
      
      document.querySelector = vi.fn().mockReturnValue(mockElement)
      
      scrollToElement('#test-element')
      
      expect(scrollToSpy).toHaveBeenCalledWith({
        top: 500,
        behavior: 'smooth'
      })
    })
  })
})