/**
 * Video Background Manager
 * Manages multiple video backgrounds across the site with performance optimizations
 */

import VideoBackground from '../components/videoBackground.js'

class VideoBackgroundManager {
  constructor() {
    this.videoBackgrounds = new Map()
    this.isInitialized = false
    this.performanceMode = this.detectPerformanceMode()
    
    // Performance settings based on device capabilities
    this.settings = {
      maxConcurrentVideos: this.performanceMode === 'high' ? 3 : 1,
      preloadDistance: this.performanceMode === 'high' ? '100px' : '50px',
      qualityPreference: this.performanceMode === 'high' ? 'high' : 'medium'
    }
  }
  
  init() {
    if (this.isInitialized) return
    
    this.findVideoBackgrounds()
    this.setupGlobalEventListeners()
    this.isInitialized = true
    
    console.log(`🎬 Video Background Manager initialized with ${this.videoBackgrounds.size} videos`)
  }
  
  detectPerformanceMode() {
    // Detect device performance capabilities
    const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection
    const memory = navigator.deviceMemory || 4
    const cores = navigator.hardwareConcurrency || 4
    
    // Check for mobile devices
    const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    
    // Check connection speed
    const isSlowConnection = connection && (
      connection.effectiveType === 'slow-2g' ||
      connection.effectiveType === '2g' ||
      connection.effectiveType === '3g'
    )
    
    // Determine performance mode
    if (prefersReducedMotion || isSlowConnection || (isMobile && memory < 4) || cores < 4) {
      return 'low'
    } else if (memory >= 8 && cores >= 8 && !isMobile) {
      return 'high'
    } else {
      return 'medium'
    }
  }
  
  findVideoBackgrounds() {
    // Find all elements that should have video backgrounds
    const videoElements = document.querySelectorAll('[data-video-background]')
    
    videoElements.forEach((element, index) => {
      this.createVideoBackground(element, index)
    })
    
    // Also handle existing video elements in hero section
    const existingVideos = document.querySelectorAll('video[src], video source')
    existingVideos.forEach((video, index) => {
      const container = video.closest('section') || video.parentElement
      if (container && !container.hasAttribute('data-video-background')) {
        container.setAttribute('data-video-background', 'true')
        this.createVideoBackground(container, `existing-${index}`, video)
      }
    })
  }
  
  createVideoBackground(element, id, existingVideo = null) {
    const options = this.getVideoOptions(element)
    
    // If there's an existing video, extract its properties
    if (existingVideo) {
      options.sources = this.extractVideoSources(existingVideo)
      options.poster = existingVideo.poster
      options.autoplay = existingVideo.autoplay
      options.muted = existingVideo.muted
      options.loop = existingVideo.loop
      
      // Remove the existing video element
      existingVideo.remove()
    }
    
    const videoBackground = new VideoBackground(element, options)
    this.videoBackgrounds.set(id, videoBackground)
    
    // Set up event listeners for this video
    this.setupVideoEventListeners(element, videoBackground)
  }
  
  extractVideoSources(videoElement) {
    const sources = []
    
    // Get sources from source elements
    const sourceElements = videoElement.querySelectorAll('source')
    sourceElements.forEach(source => {
      sources.push({
        src: source.src,
        type: source.type,
        media: source.media
      })
    })
    
    // If no sources, use video src
    if (sources.length === 0 && videoElement.src) {
      sources.push({
        src: videoElement.src,
        type: videoElement.type || 'video/mp4'
      })
    }
    
    return sources
  }
  
  getVideoOptions(element) {
    const dataset = element.dataset
    
    return {
      autoplay: dataset.videoAutoplay !== 'false',
      muted: dataset.videoMuted !== 'false',
      loop: dataset.videoLoop !== 'false',
      playsinline: dataset.videoPlaysinline !== 'false',
      preload: dataset.videoPreload || (this.performanceMode === 'low' ? 'none' : 'metadata'),
      poster: dataset.videoPoster || null,
      fallbackImage: dataset.videoFallback || null,
      threshold: parseFloat(dataset.videoThreshold) || 0.1,
      rootMargin: dataset.videoRootMargin || this.settings.preloadDistance,
      sources: this.parseVideoSources(dataset.videoSources)
    }
  }
  
  parseVideoSources(sourcesData) {
    if (!sourcesData) return []
    
    try {
      return JSON.parse(sourcesData)
    } catch (e) {
      console.warn('Invalid video sources data:', sourcesData)
      return []
    }
  }
  
  setupVideoEventListeners(element, videoBackground) {
    // Listen for video events
    element.addEventListener('videoplay', (e) => {
      this.onVideoPlay(e.detail.videoBackground)
    })
    
    element.addEventListener('videopause', (e) => {
      this.onVideoPause(e.detail.videoBackground)
    })
    
    element.addEventListener('videoerror', (e) => {
      this.onVideoError(e.detail.videoBackground, e.detail.error)
    })
    
    element.addEventListener('loadingstatechange', (e) => {
      this.onLoadingStateChange(e.detail.videoBackground, e.detail.state)
    })
  }
  
  setupGlobalEventListeners() {
    // Handle visibility change (tab switching)
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pauseAllVideos()
      } else {
        this.resumeVisibleVideos()
      }
    })
    
    // Handle page unload
    window.addEventListener('beforeunload', () => {
      this.pauseAllVideos()
    })
    
    // Handle reduced motion changes
    const mediaQuery = window.matchMedia('(prefers-reduced-motion: reduce)')
    mediaQuery.addListener((e) => {
      if (e.matches) {
        this.pauseAllVideos()
      }
    })
    
    // Handle connection changes
    if (navigator.connection) {
      navigator.connection.addEventListener('change', () => {
        this.handleConnectionChange()
      })
    }
  }
  
  onVideoPlay(videoBackground) {
    // Limit concurrent playing videos for performance
    const playingVideos = Array.from(this.videoBackgrounds.values())
      .filter(vb => vb.isPlaying)
    
    if (playingVideos.length > this.settings.maxConcurrentVideos) {
      // Pause the oldest playing video
      const oldestVideo = playingVideos[0]
      oldestVideo.pause()
    }
  }
  
  onVideoPause(videoBackground) {
    // Video paused, no action needed
  }
  
  onVideoError(videoBackground, error) {
    console.error('Video background error:', error)
    
    // Try to recover by reloading
    setTimeout(() => {
      if (videoBackground.loadingState === 'error') {
        videoBackground.loadVideo()
      }
    }, 5000)
  }
  
  onLoadingStateChange(videoBackground, state) {
    console.log('Video loading state changed:', state)
  }
  
  pauseAllVideos() {
    this.videoBackgrounds.forEach(videoBackground => {
      videoBackground.pause()
    })
  }
  
  resumeVisibleVideos() {
    this.videoBackgrounds.forEach(videoBackground => {
      if (videoBackground.isInView && videoBackground.options.autoplay) {
        videoBackground.play()
      }
    })
  }
  
  handleConnectionChange() {
    const connection = navigator.connection
    const isSlowConnection = connection && (
      connection.effectiveType === 'slow-2g' ||
      connection.effectiveType === '2g'
    )
    
    if (isSlowConnection) {
      // Pause all videos on slow connection
      this.pauseAllVideos()
    }
  }
  
  // Public methods
  getVideoBackground(id) {
    return this.videoBackgrounds.get(id)
  }
  
  playVideo(id) {
    const videoBackground = this.videoBackgrounds.get(id)
    if (videoBackground) {
      videoBackground.play()
    }
  }
  
  pauseVideo(id) {
    const videoBackground = this.videoBackgrounds.get(id)
    if (videoBackground) {
      videoBackground.pause()
    }
  }
  
  muteAll() {
    this.videoBackgrounds.forEach(videoBackground => {
      videoBackground.mute()
    })
  }
  
  unmuteAll() {
    this.videoBackgrounds.forEach(videoBackground => {
      videoBackground.unmute()
    })
  }
  
  setGlobalVolume(volume) {
    this.videoBackgrounds.forEach(videoBackground => {
      videoBackground.setVolume(volume)
    })
  }
  
  destroy() {
    this.videoBackgrounds.forEach(videoBackground => {
      videoBackground.destroy()
    })
    
    this.videoBackgrounds.clear()
    this.isInitialized = false
  }
}

// Create singleton instance
const videoBackgroundManager = new VideoBackgroundManager()

export default videoBackgroundManager