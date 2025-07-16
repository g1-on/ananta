/**
 * Video Background System Verification Script
 * Tests the video background component functionality
 */

import VideoBackground from './src/components/videoBackground.js'
import videoBackgroundManager from './src/utils/videoBackgroundManager.js'

// Test configuration
const testConfig = {
  testVideoUrl: 'https://videos.pexels.com/video-files/2022395/2022395-uhd_3840_2160_25fps.mp4',
  testPosterUrl: 'https://images.pexels.com/photos/2022395/pexels-photo-2022395.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080'
}

class VideoBackgroundVerifier {
  constructor() {
    this.tests = []
    this.results = {
      passed: 0,
      failed: 0,
      total: 0
    }
  }
  
  async runAllTests() {
    console.log('🎬 Starting Video Background System Verification...\n')
    
    // Test 1: Basic component creation
    await this.testBasicComponentCreation()
    
    // Test 2: Mobile detection
    await this.testMobileDetection()
    
    // Test 3: Performance optimization
    await this.testPerformanceOptimization()
    
    // Test 4: Video source handling
    await this.testVideoSourceHandling()
    
    // Test 5: Loading states
    await this.testLoadingStates()
    
    // Test 6: Manager functionality
    await this.testManagerFunctionality()
    
    // Test 7: Error handling
    await this.testErrorHandling()
    
    // Test 8: Cleanup
    await this.testCleanup()
    
    this.printResults()
  }
  
  async testBasicComponentCreation() {
    console.log('Testing basic component creation...')
    
    try {
      const container = document.createElement('div')
      container.className = 'test-video-container'
      document.body.appendChild(container)
      
      const videoBackground = new VideoBackground(container, {
        sources: [{
          src: testConfig.testVideoUrl,
          type: 'video/mp4'
        }],
        poster: testConfig.testPosterUrl
      })
      
      // Check if video element was created
      const video = container.querySelector('video')
      this.assert(video !== null, 'Video element should be created')
      this.assert(video.muted === true, 'Video should be muted by default')
      this.assert(video.loop === true, 'Video should loop by default')
      
      // Check if poster was created
      const poster = container.querySelector('.video-poster')
      this.assert(poster !== null, 'Poster element should be created')
      
      // Check loading state
      this.assert(container.classList.contains('video-loading'), 'Container should have loading class')
      
      videoBackground.destroy()
      container.remove()
      
      this.pass('Basic component creation')
    } catch (error) {
      this.fail('Basic component creation', error.message)
    }
  }
  
  async testMobileDetection() {
    console.log('Testing mobile detection...')
    
    try {
      const container = document.createElement('div')
      document.body.appendChild(container)
      
      const videoBackground = new VideoBackground(container)
      
      // Test mobile detection method
      const isMobile = videoBackground.detectMobile()
      this.assert(typeof isMobile === 'boolean', 'Mobile detection should return boolean')
      
      // Test reduced motion detection
      const prefersReducedMotion = videoBackground.detectReducedMotion()
      this.assert(typeof prefersReducedMotion === 'boolean', 'Reduced motion detection should return boolean')
      
      // Test connection speed detection
      const connectionSpeed = videoBackground.detectConnectionSpeed()
      this.assert(['fast', 'medium', 'slow', 'unknown'].includes(connectionSpeed), 'Connection speed should be valid')
      
      videoBackground.destroy()
      container.remove()
      
      this.pass('Mobile detection')
    } catch (error) {
      this.fail('Mobile detection', error.message)
    }
  }
  
  async testPerformanceOptimization() {
    console.log('Testing performance optimization...')
    
    try {
      const container = document.createElement('div')
      document.body.appendChild(container)
      
      // Test with reduced motion preference
      const videoBackground = new VideoBackground(container, {
        respectReducedMotion: true
      })
      
      // Check if preload setting is optimized
      const preloadSetting = videoBackground.getOptimalPreloadSetting()
      this.assert(['none', 'metadata', 'auto'].includes(preloadSetting), 'Preload setting should be valid')
      
      // Test mobile optimizations
      if (videoBackground.isMobile) {
        this.assert(videoBackground.options.threshold === 0.2, 'Mobile threshold should be higher')
        this.assert(videoBackground.options.rootMargin === '25px', 'Mobile root margin should be smaller')
      }
      
      videoBackground.destroy()
      container.remove()
      
      this.pass('Performance optimization')
    } catch (error) {
      this.fail('Performance optimization', error.message)
    }
  }
  
  async testVideoSourceHandling() {
    console.log('Testing video source handling...')
    
    try {
      const container = document.createElement('div')
      document.body.appendChild(container)
      
      const sources = [
        { src: 'test.webm', type: 'video/webm' },
        { src: 'test.mp4', type: 'video/mp4' }
      ]
      
      const videoBackground = new VideoBackground(container, { sources })
      
      const video = container.querySelector('video')
      const sourceElements = video.querySelectorAll('source')
      
      this.assert(sourceElements.length === 2, 'Should create correct number of source elements')
      this.assert(sourceElements[0].type === 'video/webm', 'First source should be WebM')
      this.assert(sourceElements[1].type === 'video/mp4', 'Second source should be MP4')
      
      // Test MIME type detection
      this.assert(videoBackground.getMimeType('mp4') === 'video/mp4', 'Should detect MP4 MIME type')
      this.assert(videoBackground.getMimeType('webm') === 'video/webm', 'Should detect WebM MIME type')
      
      videoBackground.destroy()
      container.remove()
      
      this.pass('Video source handling')
    } catch (error) {
      this.fail('Video source handling', error.message)
    }
  }
  
  async testLoadingStates() {
    console.log('Testing loading states...')
    
    try {
      const container = document.createElement('div')
      document.body.appendChild(container)
      
      const videoBackground = new VideoBackground(container)
      
      // Test initial state
      this.assert(videoBackground.loadingState === 'loading', 'Initial state should be loading')
      this.assert(container.classList.contains('video-loading'), 'Should have loading class')
      
      // Test state changes
      videoBackground.setLoadingState('loaded')
      this.assert(videoBackground.loadingState === 'loaded', 'State should change to loaded')
      this.assert(container.classList.contains('video-loaded'), 'Should have loaded class')
      this.assert(!container.classList.contains('video-loading'), 'Should not have loading class')
      
      videoBackground.setLoadingState('error')
      this.assert(videoBackground.loadingState === 'error', 'State should change to error')
      this.assert(container.classList.contains('video-error'), 'Should have error class')
      
      videoBackground.destroy()
      container.remove()
      
      this.pass('Loading states')
    } catch (error) {
      this.fail('Loading states', error.message)
    }
  }
  
  async testManagerFunctionality() {
    console.log('Testing manager functionality...')
    
    try {
      // Create test containers
      const container1 = document.createElement('div')
      container1.setAttribute('data-video-background', 'true')
      container1.setAttribute('data-video-sources', JSON.stringify([{
        src: testConfig.testVideoUrl,
        type: 'video/mp4'
      }]))
      document.body.appendChild(container1)
      
      const container2 = document.createElement('div')
      container2.setAttribute('data-video-background', 'true')
      container2.setAttribute('data-video-poster', testConfig.testPosterUrl)
      document.body.appendChild(container2)
      
      // Initialize manager
      videoBackgroundManager.init()
      
      this.assert(videoBackgroundManager.isInitialized === true, 'Manager should be initialized')
      this.assert(videoBackgroundManager.videoBackgrounds.size >= 2, 'Manager should track video backgrounds')
      
      // Test performance mode detection
      const performanceMode = videoBackgroundManager.performanceMode
      this.assert(['low', 'medium', 'high'].includes(performanceMode), 'Performance mode should be valid')
      
      // Cleanup
      videoBackgroundManager.destroy()
      container1.remove()
      container2.remove()
      
      this.pass('Manager functionality')
    } catch (error) {
      this.fail('Manager functionality', error.message)
    }
  }
  
  async testErrorHandling() {
    console.log('Testing error handling...')
    
    try {
      const container = document.createElement('div')
      document.body.appendChild(container)
      
      const videoBackground = new VideoBackground(container, {
        sources: [{ src: 'invalid-video.mp4', type: 'video/mp4' }],
        fallbackImage: 'fallback.jpg'
      })
      
      // Test fallback handling
      videoBackground.showFallback()
      const fallback = container.querySelector('.video-fallback')
      this.assert(fallback !== null, 'Fallback image should be created')
      
      // Test autoplay restriction handling
      videoBackground.handleAutoplayRestriction()
      const playButton = container.querySelector('.video-play-button')
      this.assert(playButton !== null, 'Play button should be created for autoplay restrictions')
      
      videoBackground.destroy()
      container.remove()
      
      this.pass('Error handling')
    } catch (error) {
      this.fail('Error handling', error.message)
    }
  }
  
  async testCleanup() {
    console.log('Testing cleanup...')
    
    try {
      const container = document.createElement('div')
      document.body.appendChild(container)
      
      const videoBackground = new VideoBackground(container, {
        poster: testConfig.testPosterUrl
      })
      
      // Add some elements that should be cleaned up
      container.classList.add('video-loading', 'video-loaded', 'video-playing')
      
      // Destroy and check cleanup
      videoBackground.destroy()
      
      this.assert(videoBackground.video === null, 'Video should be null after destroy')
      this.assert(videoBackground.poster === null, 'Poster should be null after destroy')
      this.assert(videoBackground.observer === null, 'Observer should be null after destroy')
      this.assert(!container.classList.contains('video-loading'), 'Loading class should be removed')
      this.assert(!container.classList.contains('video-loaded'), 'Loaded class should be removed')
      this.assert(!container.classList.contains('video-playing'), 'Playing class should be removed')
      
      container.remove()
      
      this.pass('Cleanup')
    } catch (error) {
      this.fail('Cleanup', error.message)
    }
  }
  
  assert(condition, message) {
    if (!condition) {
      throw new Error(`Assertion failed: ${message}`)
    }
  }
  
  pass(testName) {
    console.log(`✅ ${testName} - PASSED`)
    this.results.passed++
    this.results.total++
  }
  
  fail(testName, error) {
    console.log(`❌ ${testName} - FAILED: ${error}`)
    this.results.failed++
    this.results.total++
  }
  
  printResults() {
    console.log('\n🎬 Video Background System Verification Results:')
    console.log(`Total tests: ${this.results.total}`)
    console.log(`Passed: ${this.results.passed}`)
    console.log(`Failed: ${this.results.failed}`)
    console.log(`Success rate: ${((this.results.passed / this.results.total) * 100).toFixed(1)}%`)
    
    if (this.results.failed === 0) {
      console.log('\n🎉 All tests passed! Video background system is working correctly.')
    } else {
      console.log('\n⚠️ Some tests failed. Please check the implementation.')
    }
  }
}

// Run verification when script is loaded
if (typeof window !== 'undefined') {
  const verifier = new VideoBackgroundVerifier()
  verifier.runAllTests()
}

export default VideoBackgroundVerifier