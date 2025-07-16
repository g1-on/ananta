import Lenis from '@studio-freight/lenis';

/**
 * Smooth scrolling system using Lenis
 * Provides buttery smooth scrolling experience with momentum and easing
 */
class SmoothScroll {
  constructor() {
    this.lenis = null;
    this.isInitialized = false;
  }

  /**
   * Initialize Lenis smooth scrolling
   * @param {Object} options - Configuration options for Lenis
   */
  init(options = {}) {
    const defaultOptions = {
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      direction: 'vertical',
      gestureDirection: 'vertical',
      smooth: true,
      mouseMultiplier: 1,
      smoothTouch: false,
      touchMultiplier: 2,
      infinite: false,
    };

    const config = { ...defaultOptions, ...options };

    this.lenis = new Lenis(config);
    this.isInitialized = true;

    // Start the animation loop
    this.raf();

    // Add scroll event listener for other animations
    this.lenis.on('scroll', (e) => {
      this.onScroll(e);
    });

    return this.lenis;
  }

  /**
   * Animation frame loop for Lenis
   */
  raf(time) {
    if (this.lenis) {
      this.lenis.raf(time);
    }
    requestAnimationFrame((time) => this.raf(time));
  }

  /**
   * Scroll event handler - can be extended for other animations
   * @param {Object} e - Scroll event data
   */
  onScroll(e) {
    // Dispatch custom scroll event for other components
    window.dispatchEvent(new CustomEvent('smoothScroll', {
      detail: {
        scroll: e.scroll,
        limit: e.limit,
        velocity: e.velocity,
        direction: e.direction,
        progress: e.progress
      }
    }));
  }

  /**
   * Scroll to a specific target
   * @param {string|HTMLElement} target - Target element or selector
   * @param {Object} options - Scroll options
   */
  scrollTo(target, options = {}) {
    if (!this.lenis) return;

    const defaultOptions = {
      offset: 0,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    };

    this.lenis.scrollTo(target, { ...defaultOptions, ...options });
  }

  /**
   * Stop smooth scrolling
   */
  stop() {
    if (this.lenis) {
      this.lenis.stop();
    }
  }

  /**
   * Start smooth scrolling
   */
  start() {
    if (this.lenis) {
      this.lenis.start();
    }
  }

  /**
   * Destroy the smooth scroll instance
   */
  destroy() {
    if (this.lenis) {
      this.lenis.destroy();
      this.lenis = null;
      this.isInitialized = false;
    }
  }

  /**
   * Get current scroll position
   * @returns {number} Current scroll position
   */
  getScroll() {
    return this.lenis ? this.lenis.scroll : 0;
  }

  /**
   * Get scroll limit
   * @returns {number} Maximum scroll value
   */
  getLimit() {
    return this.lenis ? this.lenis.limit : 0;
  }

  /**
   * Get scroll progress (0-1)
   * @returns {number} Scroll progress
   */
  getProgress() {
    return this.lenis ? this.lenis.progress : 0;
  }
}

// Create singleton instance
const smoothScroll = new SmoothScroll();

export default smoothScroll;