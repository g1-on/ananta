import SplitType from 'split-type';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

/**
 * Text Animation Controller using SplitType
 * Provides various text reveal animations with character-by-character control
 */
class TextAnimations {
  constructor() {
    this.splitInstances = new Map();
    this.animations = new Map();
    this.isInitialized = false;
  }

  /**
   * Initialize text animations
   */
  init() {
    if (this.isInitialized) return;
    
    this.scanAndInitialize();
    this.isInitialized = true;
  }

  /**
   * Scan DOM for text animation elements and initialize them
   */
  scanAndInitialize() {
    // Initialize elements with data-text-preset
    const presetElements = document.querySelectorAll('[data-text-preset]');
    presetElements.forEach((element, index) => {
      const preset = element.getAttribute('data-text-preset');
      const options = this.parseTextOptions(element);
      this.createTextAnimation(element, preset, options, `text-preset-${index}`);
    });

    // Initialize legacy elements with data-animate="text"
    const legacyElements = document.querySelectorAll('[data-animate="text"]');
    legacyElements.forEach((element, index) => {
      const options = this.parseTextOptions(element);
      this.createTextAnimation(element, 'reveal-chars', options, `text-legacy-${index}`);
    });

    // Initialize headline elements
    const headlines = document.querySelectorAll('.headline');
    headlines.forEach((element, index) => {
      this.createTextAnimation(element, 'reveal-chars-stagger', {}, `headline-${index}`);
    });
  }

  /**
   * Parse data attributes for text animation options
   * @param {HTMLElement} element - Target element
   * @returns {Object} Parsed options
   */
  parseTextOptions(element) {
    const options = {};
    
    // Parse split type options
    if (element.hasAttribute('data-split-type')) {
      options.splitType = element.getAttribute('data-split-type');
    }
    
    // Parse animation options
    if (element.hasAttribute('data-delay')) {
      options.delay = parseFloat(element.getAttribute('data-delay'));
    }
    
    if (element.hasAttribute('data-duration')) {
      options.duration = parseFloat(element.getAttribute('data-duration'));
    }
    
    if (element.hasAttribute('data-stagger')) {
      options.stagger = parseFloat(element.getAttribute('data-stagger'));
    }
    
    if (element.hasAttribute('data-ease')) {
      options.ease = element.getAttribute('data-ease');
    }
    
    if (element.hasAttribute('data-trigger-start')) {
      options.triggerStart = element.getAttribute('data-trigger-start');
    }
    
    if (element.hasAttribute('data-y-offset')) {
      options.yOffset = parseFloat(element.getAttribute('data-y-offset'));
    }
    
    if (element.hasAttribute('data-x-offset')) {
      options.xOffset = parseFloat(element.getAttribute('data-x-offset'));
    }
    
    return options;
  }

  /**
   * Create text animation based on preset
   * @param {HTMLElement} element - Target element
   * @param {string} preset - Animation preset name
   * @param {Object} options - Animation options
   * @param {string} id - Unique animation ID
   */
  createTextAnimation(element, preset, options = {}, id) {
    const presetConfig = this.getPresetConfig(preset);
    if (!presetConfig) {
      console.warn(`Text animation preset "${preset}" not found`);
      return;
    }

    // Merge preset with custom options
    const config = { ...presetConfig, ...options };

    // Create SplitType instance
    const splitType = config.splitType || 'chars';
    const split = new SplitType(element, { types: splitType });
    
    // Store split instance
    this.splitInstances.set(id, split);

    // Create animation based on preset
    const animation = this.createPresetAnimation(split, config, element);
    
    // Store animation reference
    this.animations.set(id, animation);

    return { split, animation };
  }

  /**
   * Get preset configuration
   * @param {string} preset - Preset name
   * @returns {Object} Preset configuration
   */
  getPresetConfig(preset) {
    const presets = {
      'reveal-chars': {
        splitType: 'chars',
        duration: 0.8,
        stagger: 0.02,
        ease: 'power2.out',
        triggerStart: 'top 80%',
        yOffset: 50,
        opacity: 0
      },
      'reveal-words': {
        splitType: 'words',
        duration: 0.6,
        stagger: 0.1,
        ease: 'power2.out',
        triggerStart: 'top 80%',
        yOffset: 30,
        opacity: 0
      },
      'reveal-lines': {
        splitType: 'lines',
        duration: 0.8,
        stagger: 0.15,
        ease: 'power2.out',
        triggerStart: 'top 80%',
        yOffset: 40,
        opacity: 0
      },
      'reveal-chars-stagger': {
        splitType: 'chars',
        duration: 1.2,
        stagger: 0.03,
        ease: 'power4.out',
        triggerStart: 'top 80%',
        yOffset: 80,
        opacity: 0
      },
      'typewriter': {
        splitType: 'chars',
        duration: 0.05,
        stagger: 0.05,
        ease: 'none',
        triggerStart: 'top 80%',
        opacity: 0
      },
      'wave': {
        splitType: 'chars',
        duration: 0.6,
        stagger: 0.02,
        ease: 'back.out(1.7)',
        triggerStart: 'top 80%',
        yOffset: -20,
        scale: 0.8,
        opacity: 0
      },
      'slide-up': {
        splitType: 'words',
        duration: 0.8,
        stagger: 0.08,
        ease: 'power3.out',
        triggerStart: 'top 80%',
        yOffset: 100,
        opacity: 0
      },
      'fade-in-random': {
        splitType: 'chars',
        duration: 0.05,
        stagger: 'random(0.01, 0.1)',
        ease: 'power2.out',
        triggerStart: 'top 80%',
        opacity: 0
      },
      'rotate-in': {
        splitType: 'chars',
        duration: 0.8,
        stagger: 0.03,
        ease: 'back.out(1.7)',
        triggerStart: 'top 80%',
        rotation: 90,
        opacity: 0
      },
      'luxury-reveal': {
        splitType: 'chars',
        duration: 1,
        stagger: 0.02,
        ease: 'power2.out',
        triggerStart: 'top 85%',
        yOffset: 60,
        opacity: 0,
        scale: 0.9
      }
    };

    return presets[preset];
  }

  /**
   * Create animation based on preset configuration
   * @param {Object} split - SplitType instance
   * @param {Object} config - Animation configuration
   * @param {HTMLElement} element - Original element
   * @returns {Object} ScrollTrigger instance
   */
  createPresetAnimation(split, config, element) {
    const targets = split[config.splitType.slice(0, -1)] || split.chars;
    
    // Set initial state
    const initialProps = {
      opacity: config.opacity !== undefined ? config.opacity : 1
    };
    
    if (config.yOffset) initialProps.y = config.yOffset;
    if (config.xOffset) initialProps.x = config.xOffset;
    if (config.scale) initialProps.scale = config.scale;
    if (config.rotation) initialProps.rotation = config.rotation;
    
    gsap.set(targets, initialProps);

    // Create animation
    const animationProps = {
      opacity: 1,
      duration: config.duration,
      stagger: config.stagger,
      ease: config.ease,
      delay: config.delay || 0
    };
    
    if (config.yOffset) animationProps.y = 0;
    if (config.xOffset) animationProps.x = 0;
    if (config.scale) animationProps.scale = 1;
    if (config.rotation) animationProps.rotation = 0;

    return ScrollTrigger.create({
      trigger: element,
      start: config.triggerStart,
      onEnter: () => {
        gsap.to(targets, animationProps);
      }
    });
  }

  /**
   * Create custom text animation
   * @param {HTMLElement} element - Target element
   * @param {Object} config - Animation configuration
   * @param {string} id - Unique animation ID
   */
  createCustomAnimation(element, config, id) {
    const split = new SplitType(element, { types: config.splitType || 'chars' });
    this.splitInstances.set(id, split);

    const targets = split[config.splitType?.slice(0, -1) || 'chars'];
    
    // Set initial state
    gsap.set(targets, config.from || {});

    // Create animation
    const animation = ScrollTrigger.create({
      trigger: element,
      start: config.triggerStart || 'top 80%',
      end: config.triggerEnd,
      scrub: config.scrub,
      onEnter: () => {
        gsap.to(targets, config.to || {});
      }
    });

    this.animations.set(id, animation);
    return { split, animation };
  }

  /**
   * Get split instance by ID
   * @param {string} id - Animation ID
   * @returns {Object} SplitType instance
   */
  getSplit(id) {
    return this.splitInstances.get(id);
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
   * Kill animation and split instance by ID
   * @param {string} id - Animation ID
   */
  kill(id) {
    const animation = this.animations.get(id);
    const split = this.splitInstances.get(id);
    
    if (animation && animation.kill) animation.kill();
    if (split && split.revert) split.revert();
    
    this.animations.delete(id);
    this.splitInstances.delete(id);
  }

  /**
   * Kill all text animations
   */
  killAll() {
    this.animations.forEach((animation) => {
      if (animation.kill) animation.kill();
    });
    
    this.splitInstances.forEach((split) => {
      if (split.revert) split.revert();
    });
    
    this.animations.clear();
    this.splitInstances.clear();
  }

  /**
   * Refresh all text animations
   */
  refresh() {
    ScrollTrigger.refresh();
  }

  /**
   * Reinitialize all text animations
   */
  reinitialize() {
    this.killAll();
    this.scanAndInitialize();
  }
}

// Create singleton instance
const textAnimations = new TextAnimations();

export default textAnimations;