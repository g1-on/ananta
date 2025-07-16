import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger);

/**
 * Animation Controller with data-preset architecture
 * Inspired by ChungiYoo's approach to declarative animations
 */
class AnimationController {
  constructor() {
    this.animations = new Map();
    this.presets = new Map();
    this.isInitialized = false;
    
    // Initialize default presets
    this.initDefaultPresets();
  }

  /**
   * Initialize the animation controller
   */
  init() {
    if (this.isInitialized) return;
    
    this.scanAndInitialize();
    this.isInitialized = true;
  }

  /**
   * Scan DOM for data-preset attributes and initialize animations
   */
  scanAndInitialize() {
    const elements = document.querySelectorAll('[data-preset]');
    
    elements.forEach((element, index) => {
      const presetName = element.getAttribute('data-preset');
      const options = this.parseDataOptions(element);
      
      this.createAnimation(element, presetName, options, `preset-${index}`);
    });
  }

  /**
   * Parse data attributes for animation options
   * @param {HTMLElement} element - Target element
   * @returns {Object} Parsed options
   */
  parseDataOptions(element) {
    const options = {};
    
    // Parse common options
    if (element.hasAttribute('data-delay')) {
      options.delay = parseFloat(element.getAttribute('data-delay'));
    }
    
    if (element.hasAttribute('data-duration')) {
      options.duration = parseFloat(element.getAttribute('data-duration'));
    }
    
    if (element.hasAttribute('data-ease')) {
      options.ease = element.getAttribute('data-ease');
    }
    
    if (element.hasAttribute('data-stagger')) {
      options.stagger = parseFloat(element.getAttribute('data-stagger'));
    }
    
    if (element.hasAttribute('data-trigger-start')) {
      options.triggerStart = element.getAttribute('data-trigger-start');
    }
    
    if (element.hasAttribute('data-trigger-end')) {
      options.triggerEnd = element.getAttribute('data-trigger-end');
    }
    
    if (element.hasAttribute('data-scrub')) {
      options.scrub = element.getAttribute('data-scrub') === 'true' ? true : parseFloat(element.getAttribute('data-scrub'));
    }
    
    return options;
  }

  /**
   * Create animation based on preset
   * @param {HTMLElement} element - Target element
   * @param {string} presetName - Name of the preset
   * @param {Object} options - Animation options
   * @param {string} id - Unique animation ID
   */
  createAnimation(element, presetName, options = {}, id) {
    const preset = this.presets.get(presetName);
    
    if (!preset) {
      console.warn(`Animation preset "${presetName}" not found`);
      return;
    }
    
    // Merge preset with custom options
    const config = { ...preset.config, ...options };
    
    // Create the animation
    const animation = preset.create(element, config);
    
    // Store animation reference
    this.animations.set(id, animation);
    
    return animation;
  }

  /**
   * Initialize default animation presets
   */
  initDefaultPresets() {
    // Fade In preset
    this.registerPreset('fade-in', {
      config: {
        duration: 1,
        ease: 'power2.out',
        triggerStart: 'top 80%'
      },
      create: (element, config) => {
        gsap.set(element, { opacity: 0 });
        
        return ScrollTrigger.create({
          trigger: element,
          start: config.triggerStart,
          onEnter: () => {
            gsap.to(element, {
              opacity: 1,
              duration: config.duration,
              ease: config.ease,
              delay: config.delay || 0
            });
          }
        });
      }
    });

    // Fade Up preset
    this.registerPreset('fade-up', {
      config: {
        duration: 1,
        ease: 'power2.out',
        triggerStart: 'top 80%',
        y: 50
      },
      create: (element, config) => {
        gsap.set(element, { opacity: 0, y: config.y });
        
        return ScrollTrigger.create({
          trigger: element,
          start: config.triggerStart,
          onEnter: () => {
            gsap.to(element, {
              opacity: 1,
              y: 0,
              duration: config.duration,
              ease: config.ease,
              delay: config.delay || 0
            });
          }
        });
      }
    });

    // Scale In preset
    this.registerPreset('scale-in', {
      config: {
        duration: 1,
        ease: 'back.out(1.7)',
        triggerStart: 'top 80%',
        scale: 0.8
      },
      create: (element, config) => {
        gsap.set(element, { opacity: 0, scale: config.scale });
        
        return ScrollTrigger.create({
          trigger: element,
          start: config.triggerStart,
          onEnter: () => {
            gsap.to(element, {
              opacity: 1,
              scale: 1,
              duration: config.duration,
              ease: config.ease,
              delay: config.delay || 0
            });
          }
        });
      }
    });

    // Slide In Left preset
    this.registerPreset('slide-in-left', {
      config: {
        duration: 1,
        ease: 'power2.out',
        triggerStart: 'top 80%',
        x: -100
      },
      create: (element, config) => {
        gsap.set(element, { opacity: 0, x: config.x });
        
        return ScrollTrigger.create({
          trigger: element,
          start: config.triggerStart,
          onEnter: () => {
            gsap.to(element, {
              opacity: 1,
              x: 0,
              duration: config.duration,
              ease: config.ease,
              delay: config.delay || 0
            });
          }
        });
      }
    });

    // Slide In Right preset
    this.registerPreset('slide-in-right', {
      config: {
        duration: 1,
        ease: 'power2.out',
        triggerStart: 'top 80%',
        x: 100
      },
      create: (element, config) => {
        gsap.set(element, { opacity: 0, x: config.x });
        
        return ScrollTrigger.create({
          trigger: element,
          start: config.triggerStart,
          onEnter: () => {
            gsap.to(element, {
              opacity: 1,
              x: 0,
              duration: config.duration,
              ease: config.ease,
              delay: config.delay || 0
            });
          }
        });
      }
    });

    // Parallax preset
    this.registerPreset('parallax', {
      config: {
        ease: 'none',
        triggerStart: 'top bottom',
        triggerEnd: 'bottom top',
        scrub: true,
        y: -100
      },
      create: (element, config) => {
        return ScrollTrigger.create({
          trigger: element,
          start: config.triggerStart,
          end: config.triggerEnd,
          scrub: config.scrub,
          animation: gsap.to(element, {
            y: config.y,
            ease: config.ease
          })
        });
      }
    });

    // Stagger Children preset
    this.registerPreset('stagger-children', {
      config: {
        duration: 0.8,
        ease: 'power2.out',
        triggerStart: 'top 80%',
        stagger: 0.1,
        y: 30
      },
      create: (element, config) => {
        const children = element.children;
        gsap.set(children, { opacity: 0, y: config.y });
        
        return ScrollTrigger.create({
          trigger: element,
          start: config.triggerStart,
          onEnter: () => {
            gsap.to(children, {
              opacity: 1,
              y: 0,
              duration: config.duration,
              ease: config.ease,
              stagger: config.stagger,
              delay: config.delay || 0
            });
          }
        });
      }
    });

    // Rotate In preset
    this.registerPreset('rotate-in', {
      config: {
        duration: 1,
        ease: 'back.out(1.7)',
        triggerStart: 'top 80%',
        rotation: 180
      },
      create: (element, config) => {
        gsap.set(element, { opacity: 0, rotation: config.rotation });
        
        return ScrollTrigger.create({
          trigger: element,
          start: config.triggerStart,
          onEnter: () => {
            gsap.to(element, {
              opacity: 1,
              rotation: 0,
              duration: config.duration,
              ease: config.ease,
              delay: config.delay || 0
            });
          }
        });
      }
    });
  }

  /**
   * Register a new animation preset
   * @param {string} name - Preset name
   * @param {Object} preset - Preset configuration
   */
  registerPreset(name, preset) {
    this.presets.set(name, preset);
  }

  /**
   * Get animation by ID
   * @param {string} id - Animation ID
   * @returns {Object} Animation instance
   */
  getAnimation(id) {
    return this.animations.get(id);
  }

  /**
   * Kill animation by ID
   * @param {string} id - Animation ID
   */
  killAnimation(id) {
    const animation = this.animations.get(id);
    if (animation) {
      if (animation.kill) animation.kill();
      this.animations.delete(id);
    }
  }

  /**
   * Kill all animations
   */
  killAll() {
    this.animations.forEach((animation, id) => {
      if (animation.kill) animation.kill();
    });
    this.animations.clear();
  }

  /**
   * Refresh all ScrollTriggers
   */
  refresh() {
    ScrollTrigger.refresh();
  }

  /**
   * Reinitialize animations (useful after DOM changes)
   */
  reinitialize() {
    this.killAll();
    this.scanAndInitialize();
  }
}

// Create singleton instance
const animationController = new AnimationController();

export default animationController;