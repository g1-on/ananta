/**
 * Video Background Component Tests
 * Tests for the optimized video background system
 */

import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import VideoBackground from '../videoBackground.js'

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation((callback, options) => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
  root: null,
  rootMargin: options?.rootMargin || '0px',
  thresholds: options?.threshold || [0]
}))

// Mock HTMLVideoElement methods
Object.defineProperty(HTMLVideoElement.prototype, 'play', {
  writable: true,
  value: vi.fn().mockImplementation(() => Promise.resolve())
})

Object.defineProperty(HTMLVideoElement.prototype, 'pause', {
  writable: true,
  value: vi.fn()
})

Object.defineProperty(HTMLVideoElement.prototype, 'load', {
  writable: true,
  value: vi.fn()
})

describe('VideoBackground', () => {
  let container
  let videoBackground
  
  beforeEach(() => {
    // Create test container
    container = document.createElement('div')
    container.className = 'video-container'
    document.body.appendChild(container)
  })
  
  afterEach(() => {
    // Cleanup
    if (videoBackground) {
      videoBackground.destroy()
      videoBackground = null
    }
    
    if (container && container.parentNode) {
      container.parentNode.removeChild(container)
    }
    
    vi.clearAllMocks()
  })
  
  describe('Initialization', () => {
    it('should create video background instance', () => {
      videoBackground = new VideoBackground(container)
      
      expect(videoBackground).toBeDefined()
      expect(videoBackground.element).toBe(container)
      expect(videoBackground.isLoaded).toBe(false)
      expect(videoBackground.isPlaying).toBe(false)
    })
    
    it('should create video element with correct attributes', () => {
      videoBackground = new VideoBackground(container, {
        autoplay: true,
        muted: true,
        loop: true,
        playsinline: true
      })
      
      const video = container.querySelector('video')
      expect(video).toBeDefined()
      expect(video.muted).toBe(true)
      expect(video.loop).toBe(true)
      expect(video.playsInline).toBe(true)
    })
    
    it('should add loading class initially', () => {
      videoBackground = new VideoBackground(container)
      
      expect(container.classList.contains('video-loading')).toBe(true)
    })
    
    it('should setup intersection observer', () => {
      videoBackground = new VideoBackground(container)
      
      expect(IntersectionObserver).toHaveBeenCalled()
      expect(videoBackground.observer).toBeDefined()
    })
  })
  
  describe('Video Sources', () => {
    it('should handle multiple video sources', () => {
      const sources = [
        { src: 'video.webm', type: 'video/webm' },
        { src: 'video.mp4', type: 'video/mp4' }
      ]
      
      videoBackground = new VideoBackground(container, { sources })
      
      const video = container.querySelector('video')
      const sourceElements = video.querySelectorAll('source')
      
      expect(sourceElements).toHaveLength(2)
      expect(sourceElements[0].src).toContain('video.webm')
      expect(sourceElements[0].type).toBe('video/webm')
      expect(sourceElements[1].src).toContain('video.mp4')
      expect(sourceElements[1].type).toBe('video/mp4')
    })
    
    it('should determine correct MIME type from extension', () => {
      videoBackground = new VideoBackground(container)
      
      expect(videoBackground.getMimeType('mp4')).toBe('video/mp4')
      expect(videoBackground.getMimeType('webm')).toBe('video/webm')
      expect(videoBackground.getMimeType('ogg')).toBe('video/ogg')
      expect(videoBackground.getMimeType('unknown')).toBe('video/mp4')
    })
  })
  
  describe('Poster Image', () => {
    it('should create poster image when provided', () => {
      videoBackground = new VideoBackground(container, {
        poster: 'poster.jpg'
      })
      
      const poster = container.querySelector('.video-poster')
      expect(poster).toBeDefined()
      expect(poster.src).toContain('poster.jpg')
    })
    
    it('should not create poster image when not provided', () => {
      videoBackground = new VideoBackground(container)
      
      const poster = container.querySelector('.video-poster')
      expect(poster).toBeNull()
    })
  })
  
  describe('Loading States', () => {
    it('should set loading state correctly', () => {
      videoBackground = new VideoBackground(container)
      
      videoBackground.setLoadingState('loaded')
      expect(container.classList.contains('video-loaded')).toBe(true)
      expect(container.classList.contains('video-loading')).toBe(false)
      
      videoBackground.setLoadingState('error')
      expect(container.classList.contains('video-error')).toBe(true)
      expect(container.classList.contains('video-loaded')).toBe(false)
    })
    
    it('should dispatch loading state change events', () => {
      videoBackground = new VideoBackground(container)
      
      const eventSpy = vi.fn()
      container.addEventListener('loadingstatechange', eventSpy)
      
      videoBackground.setLoadingState('loaded')
      
      expect(eventSpy).toHaveBeenCalledWith(
        expect.objectContaining({
          detail: expect.objectContaining({
            state: 'loaded'
          })
        })
      )
    })
  })
  
  describe('Video Controls', () => {
    beforeEach(() => {
      videoBackground = new VideoBackground(container)
      videoBackground.isLoaded = true
    })
    
    it('should play video when play() is called', async () => {
      await videoBackground.play()
      
      const video = container.querySelector('video')
      expect(video.play).toHaveBeenCalled()
    })
    
    it('should pause video when pause() is called', () => {
      videoBackground.isPlaying = true
      videoBackground.pause()
      
      const video = container.querySelector('video')
      expect(video.pause).toHaveBeenCalled()
    })
    
    it('should stop video and reset time when stop() is called', () => {
      const video = container.querySelector('video')
      videoBackground.stop()
      
      expect(video.pause).toHaveBeenCalled()
      expect(video.currentTime).toBe(0)
    })
    
    it('should mute and unmute video', () => {
      const video = container.querySelector('video')
      
      videoBackground.mute()
      expect(video.muted).toBe(true)
      
      videoBackground.unmute()
      expect(video.muted).toBe(false)
    })
    
    it('should set volume correctly', () => {
      const video = container.querySelector('video')
      
      videoBackground.setVolume(0.5)
      expect(video.volume).toBe(0.5)
      
      // Test bounds
      videoBackground.setVolume(1.5)
      expect(video.volume).toBe(1)
      
      videoBackground.setVolume(-0.5)
      expect(video.volume).toBe(0)
    })
  })
  
  describe('Event Handling', () => {
    beforeEach(() => {
      videoBackground = new VideoBackground(container)
    })
    
    it('should handle video play event', () => {
      const video = container.querySelector('video')
      const eventSpy = vi.fn()
      container.addEventListener('videoplay', eventSpy)
      
      // Simulate video play event
      video.dispatchEvent(new Event('play'))
      
      expect(videoBackground.isPlaying).toBe(true)
      expect(container.classList.contains('video-playing')).toBe(true)
      expect(eventSpy).toHaveBeenCalled()
    })
    
    it('should handle video pause event', () => {
      const video = container.querySelector('video')
      const eventSpy = vi.fn()
      container.addEventListener('videopause', eventSpy)
      
      videoBackground.isPlaying = true
      
      // Simulate video pause event
      video.dispatchEvent(new Event('pause'))
      
      expect(videoBackground.isPlaying).toBe(false)
      expect(container.classList.contains('video-paused')).toBe(true)
      expect(eventSpy).toHaveBeenCalled()
    })
    
    it('should handle video error event', () => {
      const video = container.querySelector('video')
      const eventSpy = vi.fn()
      container.addEventListener('videoerror', eventSpy)
      
      // Simulate video error event
      const errorEvent = new Event('error')
      video.dispatchEvent(errorEvent)
      
      expect(videoBackground.loadingState).toBe('error')
      expect(container.classList.contains('video-error')).toBe(true)
      expect(eventSpy).toHaveBeenCalled()
    })
    
    it('should handle video canplay event', () => {
      const video = container.querySelector('video')
      
      // Simulate video canplay event
      video.dispatchEvent(new Event('canplay'))
      
      expect(videoBackground.isLoaded).toBe(true)
      expect(videoBackground.loadingState).toBe('loaded')
      expect(container.classList.contains('video-loaded')).toBe(true)
    })
  })
  
  describe('Intersection Observer', () => {
    beforeEach(() => {
      videoBackground = new VideoBackground(container)
    })
    
    it('should handle enter view', () => {
      const loadVideoSpy = vi.spyOn(videoBackground, 'loadVideo')
      
      videoBackground.onEnterView()
      
      expect(loadVideoSpy).toHaveBeenCalled()
    })
    
    it('should handle leave view', () => {
      const pauseSpy = vi.spyOn(videoBackground, 'pause')
      
      videoBackground.onLeaveView()
      
      expect(pauseSpy).toHaveBeenCalled()
    })
    
    it('should play video when entering view if already loaded and autoplay enabled', () => {
      videoBackground.isLoaded = true
      videoBackground.options.autoplay = true
      const playSpy = vi.spyOn(videoBackground, 'play')
      
      videoBackground.onEnterView()
      
      expect(playSpy).toHaveBeenCalled()
    })
  })
  
  describe('Error Handling', () => {
    beforeEach(() => {
      videoBackground = new VideoBackground(container, {
        fallbackImage: 'fallback.jpg'
      })
    })
    
    it('should show fallback image on error', () => {
      videoBackground.showFallback()
      
      const fallback = container.querySelector('.video-fallback')
      expect(fallback).toBeDefined()
      expect(fallback.src).toContain('fallback.jpg')
    })
    
    it('should handle autoplay restrictions', () => {
      videoBackground.handleAutoplayRestriction()
      
      const playButton = container.querySelector('.video-play-button')
      expect(playButton).toBeDefined()
      expect(playButton.getAttribute('aria-label')).toBe('Play video')
    })
  })
  
  describe('Cleanup', () => {
    beforeEach(() => {
      videoBackground = new VideoBackground(container)
    })
    
    it('should cleanup properly when destroyed', () => {
      const video = container.querySelector('video')
      const observer = videoBackground.observer
      
      videoBackground.destroy()
      
      expect(observer.disconnect).toHaveBeenCalled()
      expect(video.pause).toHaveBeenCalled()
      expect(videoBackground.observer).toBeNull()
      expect(videoBackground.video).toBeNull()
    })
    
    it('should remove all state classes when destroyed', () => {
      container.classList.add('video-loading', 'video-loaded', 'video-playing')
      
      videoBackground.destroy()
      
      expect(container.classList.contains('video-loading')).toBe(false)
      expect(container.classList.contains('video-loaded')).toBe(false)
      expect(container.classList.contains('video-playing')).toBe(false)
    })
  })
})