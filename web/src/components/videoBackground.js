/**
 * Video Background Component
 * Optimized video background system with lazy loading, multiple format support,
 * and performance optimizations for luxury website experience
 */

class VideoBackground {
  constructor(element, options = {}) {
    this.element = element
    this.video = null
    this.poster = null
    this.isLoaded = false
    this.isPlaying = false
    this.isInView = false
    this.observer = null
    this.loadingState = 'idle' // idle, loading, loaded, error
    this.preloadTimer = null
    this.visibilityTimer = null
    
    // Device and performance detection
    this.isMobile = this.detectMobile()
    this.prefersReducedMotion = this.detectReducedMotion()
    this.isLowPowerMode = this.detectLowPowerMode()
    this.connectionSpeed = this.detectConnectionSpeed()
    
    // Configuration options with mobile optimizations
    this.options = {
      autoplay: true,
      muted: true,
      loop: true,
      playsinline: true,
      preload: this.getOptimalPreloadSetting(),
      poster: null,
      sources: [],
      fallbackImage: null,
      loadingClass: 'video-loading',
      loadedClass: 'video-loaded',
      errorClass: 'video-error',
      playingClass: 'video-playing',
      pausedClass: 'video-paused',
      threshold: this.isMobile ? 0.2 : 0.1,
      rootMargin: this.isMobile ? '25px' : '50px',
      enablePreloading: !this.isMobile || this.connectionSpeed === 'fast',
      pauseOnVisibilityChange: true,
      respectReducedMotion: true,
      mobileOptimizations: true,
      ...options
    }
    
    this.init()
  }
  
  init() {
    // Check if video should be disabled due to reduced motion or performance constraints
    if (this.shouldDisableVideo()) {
      this.showStaticFallback()
      return
    }
    
    this.createVideoElement()
    this.setupIntersectionObserver()
    this.setupVisibilityHandling()
    this.setupPreloadSystem()
    this.bindEvents()
    
    // Add initial loading state
    this.element.classList.add(this.options.loadingClass)
    this.setLoadingState('loading')
  }
  
  createVideoElement() {
    // Create video element
    this.video = document.createElement('video')
    this.video.className = 'video-background absolute inset-0 w-full h-full object-cover'
    this.video.muted = this.options.muted
    this.video.loop = this.options.loop
    this.video.playsInline = this.options.playsinline
    this.video.preload = this.options.preload
    this.video.setAttribute('data-video-background', 'true')
    
    // Set poster if provided
    if (this.options.poster) {
      this.video.poster = this.options.poster
    }
    
    // Create poster image element for better loading states
    if (this.options.poster) {
      this.createPosterElement()
    }
    
    // Add video sources
    this.addVideoSources()
    
    // Insert video into container
    this.element.appendChild(this.video)
    
    // Apply mobile optimizations
    this.applyMobileOptimizations()
    
    // Start performance monitoring
    this.monitorPerformance()
  }
  
  createPosterElement() {
    this.poster = document.createElement('img')
    this.poster.className = 'video-poster absolute inset-0 w-full h-full object-cover transition-opacity duration-500'
    this.poster.src = this.options.poster
    this.poster.alt = 'Video background poster'
    this.poster.loading = 'lazy'
    
    // Handle poster load
    this.poster.onload = () => {
      this.poster.classList.add('loaded')
    }
    
    this.poster.onerror = () => {
      this.poster.style.display = 'none'
    }
    
    this.element.appendChild(this.poster)
  }
  
  addVideoSources() {
    // Support multiple video formats for better browser compatibility
    const sources = this.options.sources.length > 0 ? this.options.sources : this.getDefaultSources()
    
    sources.forEach(source => {
      const sourceElement = document.createElement('source')
      sourceElement.src = source.src
      sourceElement.type = source.type
      
      // Add media queries for responsive videos if specified
      if (source.media) {
        sourceElement.media = source.media
      }
      
      this.video.appendChild(sourceElement)
    })
  }
  
  getDefaultSources() {
    // Extract sources from data attributes or existing src
    const sources = []
    const videoSrc = this.element.dataset.videoSrc || this.video.src
    
    if (videoSrc) {
      // Try to determine format from extension
      const extension = videoSrc.split('.').pop().toLowerCase()
      const mimeType = this.getMimeType(extension)
      
      sources.push({
        src: videoSrc,
        type: mimeType
      })
      
      // Add WebM version if MP4 is provided
      if (extension === 'mp4') {
        const webmSrc = videoSrc.replace('.mp4', '.webm')
        sources.unshift({
          src: webmSrc,
          type: 'video/webm'
        })
      }
    }
    
    return sources
  }
  
  getMimeType(extension) {
    const mimeTypes = {
      'mp4': 'video/mp4',
      'webm': 'video/webm',
      'ogg': 'video/ogg',
      'mov': 'video/quicktime',
      'avi': 'video/x-msvideo'
    }
    
    return mimeTypes[extension] || 'video/mp4'
  }
  
  setupIntersectionObserver() {
    // Use Intersection Observer for lazy loading and play/pause control
    this.observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        this.isInView = entry.isIntersecting
        
        if (entry.isIntersecting) {
          this.onEnterView()
        } else {
          this.onLeaveView()
        }
      })
    }, {
      threshold: this.options.threshold,
      rootMargin: this.options.rootMargin
    })
    
    this.observer.observe(this.element)
  }
  
  onEnterView() {
    if (!this.isLoaded) {
      this.loadVideo()
    } else if (this.options.autoplay) {
      this.play()
    }
  }
  
  onLeaveView() {
    // Pause video when out of view for performance
    this.pause()
  }
  
  loadVideo() {
    if (this.loadingState === 'loading' || this.loadingState === 'loaded') {
      return
    }
    
    this.setLoadingState('loading')
    
    // Load the video
    this.video.load()
  }
  
  bindEvents() {
    // Video load events
    this.video.addEventListener('loadstart', () => {
      this.setLoadingState('loading')
    })
    
    this.video.addEventListener('loadedmetadata', () => {
      this.onVideoLoadedMetadata()
    })
    
    this.video.addEventListener('loadeddata', () => {
      this.onVideoLoadedData()
    })
    
    this.video.addEventListener('canplay', () => {
      this.onVideoCanPlay()
    })
    
    this.video.addEventListener('canplaythrough', () => {
      this.onVideoCanPlayThrough()
    })
    
    // Playback events
    this.video.addEventListener('play', () => {
      this.onVideoPlay()
    })
    
    this.video.addEventListener('pause', () => {
      this.onVideoPause()
    })
    
    this.video.addEventListener('ended', () => {
      this.onVideoEnded()
    })
    
    // Error handling
    this.video.addEventListener('error', (e) => {
      this.onVideoError(e)
    })
    
    this.video.addEventListener('stalled', () => {
      this.onVideoStalled()
    })
    
    // Progress events
    this.video.addEventListener('progress', () => {
      this.onVideoProgress()
    })
    
    this.video.addEventListener('waiting', () => {
      this.onVideoWaiting()
    })
  }
  
  onVideoLoadedMetadata() {
    console.log('Video metadata loaded:', this.video.videoWidth, 'x', this.video.videoHeight)
  }
  
  onVideoLoadedData() {
    console.log('Video data loaded')
  }
  
  onVideoCanPlay() {
    this.setLoadingState('loaded')
    this.isLoaded = true
    
    // Hide poster image
    if (this.poster) {
      this.poster.style.opacity = '0'
      setTimeout(() => {
        this.poster.style.display = 'none'
      }, 500)
    }
    
    // Auto-play if in view and autoplay is enabled
    if (this.isInView && this.options.autoplay) {
      this.play()
    }
  }
  
  onVideoCanPlayThrough() {
    console.log('Video can play through without buffering')
  }
  
  onVideoPlay() {
    this.isPlaying = true
    this.element.classList.add(this.options.playingClass)
    this.element.classList.remove(this.options.pausedClass)
    
    // Dispatch custom event
    this.dispatchEvent('videoplay')
  }
  
  onVideoPause() {
    this.isPlaying = false
    this.element.classList.add(this.options.pausedClass)
    this.element.classList.remove(this.options.playingClass)
    
    // Dispatch custom event
    this.dispatchEvent('videopause')
  }
  
  onVideoEnded() {
    this.isPlaying = false
    this.dispatchEvent('videoended')
  }
  
  onVideoError(e) {
    console.error('Video error:', e)
    this.setLoadingState('error')
    
    // Show fallback image if available
    this.showFallback()
    
    // Dispatch custom event
    this.dispatchEvent('videoerror', { error: e })
  }
  
  onVideoStalled() {
    console.warn('Video stalled')
  }
  
  onVideoProgress() {
    // Update loading progress if needed
    if (this.video.buffered.length > 0) {
      const bufferedEnd = this.video.buffered.end(this.video.buffered.length - 1)
      const duration = this.video.duration
      const progress = (bufferedEnd / duration) * 100
      
      this.dispatchEvent('videoprogress', { progress })
    }
  }
  
  onVideoWaiting() {
    console.log('Video waiting for data')
  }
  
  setLoadingState(state) {
    // Remove all state classes
    this.element.classList.remove(
      this.options.loadingClass,
      this.options.loadedClass,
      this.options.errorClass
    )
    
    // Add current state class
    switch (state) {
      case 'loading':
        this.element.classList.add(this.options.loadingClass)
        break
      case 'loaded':
        this.element.classList.add(this.options.loadedClass)
        break
      case 'error':
        this.element.classList.add(this.options.errorClass)
        break
    }
    
    this.loadingState = state
    this.dispatchEvent('loadingstatechange', { state })
  }
  
  showFallback() {
    if (this.options.fallbackImage) {
      const fallback = document.createElement('img')
      fallback.className = 'video-fallback absolute inset-0 w-full h-full object-cover'
      fallback.src = this.options.fallbackImage
      fallback.alt = 'Video background fallback'
      
      this.element.appendChild(fallback)
    } else if (this.poster) {
      // Show poster as fallback
      this.poster.style.display = 'block'
      this.poster.style.opacity = '1'
    }
  }
  
  // Public methods
  play() {
    if (this.video && this.isLoaded) {
      const playPromise = this.video.play()
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            console.log('Video playing successfully')
          })
          .catch(error => {
            console.warn('Video play failed:', error)
            // Handle autoplay restrictions
            if (error.name === 'NotAllowedError') {
              this.handleAutoplayRestriction()
            }
          })
      }
    }
  }
  
  pause() {
    if (this.video && this.isPlaying) {
      this.video.pause()
    }
  }
  
  stop() {
    if (this.video) {
      this.video.pause()
      this.video.currentTime = 0
    }
  }
  
  mute() {
    if (this.video) {
      this.video.muted = true
    }
  }
  
  unmute() {
    if (this.video) {
      this.video.muted = false
    }
  }
  
  setVolume(volume) {
    if (this.video) {
      this.video.volume = Math.max(0, Math.min(1, volume))
    }
  }
  
  handleAutoplayRestriction() {
    // Add play button overlay for user interaction
    const playButton = document.createElement('button')
    playButton.className = 'video-play-button absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white text-6xl hover:bg-opacity-70 transition-all duration-300 z-10'
    playButton.innerHTML = '▶'
    playButton.setAttribute('aria-label', 'Play video')
    
    playButton.addEventListener('click', () => {
      this.play()
      playButton.remove()
    })
    
    this.element.appendChild(playButton)
  }
  
  // Device and performance detection methods
  detectMobile() {
    return /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  }
  
  detectReducedMotion() {
    return window.matchMedia('(prefers-reduced-motion: reduce)').matches
  }
  
  detectLowPowerMode() {
    // Check for battery API and low battery
    if ('getBattery' in navigator) {
      navigator.getBattery().then(battery => {
        return battery.level < 0.2 || battery.charging === false
      })
    }
    
    // Check for data saver mode
    if ('connection' in navigator && navigator.connection.saveData) {
      return true
    }
    
    return false
  }
  
  detectConnectionSpeed() {
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    
    if (!connection) return 'unknown'
    
    const effectiveType = connection.effectiveType
    
    if (effectiveType === '4g') return 'fast'
    if (effectiveType === '3g') return 'medium'
    if (effectiveType === '2g' || effectiveType === 'slow-2g') return 'slow'
    
    return 'medium'
  }
  
  getOptimalPreloadSetting() {
    if (this.prefersReducedMotion) return 'none'
    if (this.isMobile && this.connectionSpeed === 'slow') return 'none'
    if (this.isLowPowerMode) return 'none'
    if (this.isMobile) return 'metadata'
    
    return 'metadata'
  }
  
  shouldDisableVideo() {
    // Disable video if reduced motion is preferred and respectReducedMotion is enabled
    if (this.prefersReducedMotion && this.options.respectReducedMotion) {
      return true
    }
    
    // Disable on very slow connections
    if (this.connectionSpeed === 'slow') {
      return true
    }
    
    // Disable in low power mode
    if (this.isLowPowerMode) {
      return true
    }
    
    return false
  }
  
  showStaticFallback() {
    // Show poster or fallback image instead of video
    if (this.options.poster) {
      const staticImage = document.createElement('img')
      staticImage.className = 'video-static-fallback absolute inset-0 w-full h-full object-cover'
      staticImage.src = this.options.poster
      staticImage.alt = 'Video background (static)'
      staticImage.loading = 'lazy'
      
      this.element.appendChild(staticImage)
    } else if (this.options.fallbackImage) {
      const staticImage = document.createElement('img')
      staticImage.className = 'video-static-fallback absolute inset-0 w-full h-full object-cover'
      staticImage.src = this.options.fallbackImage
      staticImage.alt = 'Video background (static)'
      staticImage.loading = 'lazy'
      
      this.element.appendChild(staticImage)
    }
    
    this.element.classList.add('video-disabled')
    console.log('Video disabled due to performance constraints or user preferences')
  }
  
  setupVisibilityHandling() {
    if (!this.options.pauseOnVisibilityChange) return
    
    // Handle page visibility changes
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.onPageHidden()
      } else {
        this.onPageVisible()
      }
    })
    
    // Handle window focus/blur
    window.addEventListener('blur', () => this.onPageHidden())
    window.addEventListener('focus', () => this.onPageVisible())
  }
  
  onPageHidden() {
    if (this.isPlaying) {
      this.pause()
      this.wasPlayingBeforeHidden = true
    }
  }
  
  onPageVisible() {
    if (this.wasPlayingBeforeHidden && this.isInView && this.options.autoplay) {
      // Delay resume to avoid issues
      this.visibilityTimer = setTimeout(() => {
        this.play()
        this.wasPlayingBeforeHidden = false
      }, 100)
    }
  }
  
  setupPreloadSystem() {
    if (!this.options.enablePreloading) return
    
    // Preload video when it's about to come into view
    const preloadObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && !this.isLoaded && this.loadingState === 'idle') {
          // Delay preloading to avoid blocking other resources
          this.preloadTimer = setTimeout(() => {
            this.loadVideo()
          }, 500)
        }
      })
    }, {
      threshold: 0,
      rootMargin: this.isMobile ? '100px' : '200px'
    })
    
    preloadObserver.observe(this.element)
  }
  
  // Enhanced mobile optimizations
  applyMobileOptimizations() {
    if (!this.isMobile || !this.options.mobileOptimizations) return
    
    // Reduce video quality on mobile if possible
    if (this.video) {
      // Prefer smaller video sources on mobile
      const sources = this.video.querySelectorAll('source')
      sources.forEach(source => {
        const src = source.src
        if (src.includes('_mobile') || src.includes('_small')) {
          // Prioritize mobile-optimized sources
          source.parentNode.insertBefore(source, source.parentNode.firstChild)
        }
      })
      
      // Set mobile-specific attributes
      this.video.setAttribute('webkit-playsinline', 'true')
      this.video.setAttribute('x5-playsinline', 'true') // For WeChat browser
      
      // Reduce frame rate on older mobile devices
      if (this.isOldMobileDevice()) {
        this.video.style.filter = 'blur(0.5px)' // Slight blur to reduce rendering load
      }
    }
  }
  
  isOldMobileDevice() {
    const userAgent = navigator.userAgent
    
    // Check for older iOS devices
    if (/iPhone|iPad|iPod/.test(userAgent)) {
      const match = userAgent.match(/OS (\d+)_/)
      if (match && parseInt(match[1]) < 13) return true
    }
    
    // Check for older Android devices
    if (/Android/.test(userAgent)) {
      const match = userAgent.match(/Android (\d+)\./)
      if (match && parseInt(match[1]) < 8) return true
    }
    
    return false
  }
  
  // Performance monitoring
  monitorPerformance() {
    if (!window.performance || !window.performance.mark) return
    
    // Mark video loading start
    performance.mark('video-load-start')
    
    this.video.addEventListener('canplay', () => {
      performance.mark('video-load-end')
      
      try {
        performance.measure('video-load-time', 'video-load-start', 'video-load-end')
        const measure = performance.getEntriesByName('video-load-time')[0]
        
        if (measure.duration > 3000) {
          console.warn('Video took too long to load:', measure.duration + 'ms')
          this.handleSlowLoading()
        }
      } catch (e) {
        // Performance API not fully supported
      }
    })
  }
  
  handleSlowLoading() {
    // Switch to lower quality or show static fallback
    if (this.isMobile) {
      console.log('Switching to static fallback due to slow loading')
      this.destroy()
      this.showStaticFallback()
    }
  }
  
  // Utility methods
  dispatchEvent(eventName, detail = {}) {
    const event = new CustomEvent(eventName, {
      detail: {
        videoBackground: this,
        ...detail
      }
    })
    
    this.element.dispatchEvent(event)
  }
  
  // Cleanup
  destroy() {
    // Clear timers
    if (this.preloadTimer) {
      clearTimeout(this.preloadTimer)
      this.preloadTimer = null
    }
    
    if (this.visibilityTimer) {
      clearTimeout(this.visibilityTimer)
      this.visibilityTimer = null
    }
    
    // Disconnect observers
    if (this.observer) {
      this.observer.disconnect()
      this.observer = null
    }
    
    // Clean up video element
    if (this.video) {
      this.video.pause()
      this.video.removeAttribute('src')
      this.video.load()
      this.video.remove()
      this.video = null
    }
    
    // Clean up poster
    if (this.poster) {
      this.poster.remove()
      this.poster = null
    }
    
    // Remove static fallback if present
    const staticFallback = this.element.querySelector('.video-static-fallback')
    if (staticFallback) {
      staticFallback.remove()
    }
    
    // Remove play button if present
    const playButton = this.element.querySelector('.video-play-button')
    if (playButton) {
      playButton.remove()
    }
    
    // Remove all classes
    this.element.classList.remove(
      this.options.loadingClass,
      this.options.loadedClass,
      this.options.errorClass,
      this.options.playingClass,
      this.options.pausedClass,
      'video-disabled'
    )
    
    // Clear performance marks
    if (window.performance && window.performance.clearMarks) {
      try {
        performance.clearMarks('video-load-start')
        performance.clearMarks('video-load-end')
        performance.clearMeasures('video-load-time')
      } catch (e) {
        // Performance API cleanup failed, continue
      }
    }
  }
}

export default VideoBackground