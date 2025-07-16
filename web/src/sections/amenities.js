import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AMENITY_CATEGORIES, amenityFilter, getFeaturedAmenities } from '../data/amenities.js';

gsap.registerPlugin(ScrollTrigger);

/**
 * Amenities Showcase Component
 * Implements horizontal scrolling gallery with category filtering
 * Features dusk theme transition and luxury styling
 */
class AmenitiesShowcase {
  constructor() {
    this.container = null;
    this.scrollTrack = null;
    this.filterButtons = [];
    this.amenityCards = [];
    this.currentFilter = 'all';
    this.scrollTrigger = null;
    this.isInitialized = false;
  }

  init() {
    this.container = document.querySelector('[data-amenities-section]');
    if (!this.container) {
      console.warn('Amenities section not found');
      return;
    }

    this.createAmenitiesStructure();
    this.initializeFiltering();
    this.initializeHorizontalScroll();
    this.initializeAnimations();
    this.bindEvents();
    
    this.isInitialized = true;
    console.log('🏊‍♂️ Amenities showcase initialized with categories and filtering');
  }

  createAmenitiesStructure() {
    // Create the complete amenities section structure
    this.container.innerHTML = `
      <div class="amenities-content">
        <!-- Section Header -->
        <div class="amenities-header text-center mb-16" data-animate="fade-up">
          <div class="section-badge">
            <span class="badge-text">World-Class Amenities</span>
          </div>
          <h2 class="section-title" data-text-animation="chars">
            Exclusive Lifestyle Experiences
          </h2>
          <p class="section-description max-w-3xl mx-auto">
            Discover an unparalleled collection of premium amenities designed to elevate your lifestyle, 
            from RC toy competitions to luxury wellness facilities.
          </p>
        </div>

        <!-- Category Filters -->
        <div class="amenities-filters mb-12" data-animate="fade-up" data-delay="0.2">
          <div class="filter-container">
            <button class="filter-btn active" data-filter="all" data-cursor="hover">
              <span>All Amenities</span>
              <div class="filter-indicator"></div>
            </button>
            ${AMENITY_CATEGORIES.map(category => `
              <button class="filter-btn" data-filter="${category.id}" data-cursor="hover">
                <span>${category.name}</span>
                <div class="filter-indicator"></div>
              </button>
            `).join('')}
          </div>
        </div>

        <!-- Horizontal Scroll Container -->
        <div class="amenities-scroll-container" data-amenities-scroll>
          <div class="amenities-track" data-scroll-track>
            ${this.generateAmenityCards()}
          </div>
          
          <!-- Scroll Indicators -->
          <div class="scroll-indicators">
            <div class="scroll-progress">
              <div class="scroll-progress-bar"></div>
            </div>
            <div class="scroll-controls">
              <button class="scroll-btn scroll-prev" data-cursor="hover" aria-label="Previous amenities">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7"></path>
                </svg>
              </button>
              <button class="scroll-btn scroll-next" data-cursor="hover" aria-label="Next amenities">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Featured Amenities Grid (Mobile Fallback) -->
        <div class="amenities-grid md:hidden">
          ${this.generateMobileGrid()}
        </div>
      </div>
    `;

    // Store references
    this.scrollTrack = this.container.querySelector('[data-scroll-track]');
    this.filterButtons = this.container.querySelectorAll('.filter-btn');
    this.amenityCards = this.container.querySelectorAll('.amenity-card');
  }

  generateAmenityCards() {
    let cards = '';
    
    AMENITY_CATEGORIES.forEach(category => {
      category.items.forEach(amenity => {
        cards += `
          <div class="amenity-card" 
               data-category="${category.id}" 
               data-amenity-id="${amenity.id}"
               data-cursor="hover">
            
            <!-- Media Container -->
            <div class="amenity-media">
              <div class="media-placeholder" data-media-type="${amenity.media.type}">
                ${amenity.media.type === 'video' ? `
                  <div class="video-placeholder">
                    <div class="play-button" data-cursor="play">
                      <svg class="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <div class="video-overlay"></div>
                  </div>
                ` : `
                  <div class="image-placeholder">
                    <div class="placeholder-icon">
                      <svg class="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  </div>
                `}
                
                <!-- Category Badge -->
                <div class="category-badge" style="--category-color: ${category.color}">
                  ${category.name}
                </div>
                
                <!-- Featured Badge -->
                ${amenity.featured ? '<div class="featured-badge">Featured</div>' : ''}
              </div>
            </div>

            <!-- Content -->
            <div class="amenity-content">
              <div class="amenity-header">
                <h3 class="amenity-title">${amenity.title}</h3>
                <div class="amenity-specs">
                  ${Object.entries(amenity.specifications).slice(0, 2).map(([key, value]) => `
                    <span class="spec-item">
                      <span class="spec-label">${key}:</span>
                      <span class="spec-value">${value}</span>
                    </span>
                  `).join('')}
                </div>
              </div>
              
              <p class="amenity-description">${amenity.description}</p>
              
              <div class="amenity-features">
                ${amenity.features.slice(0, 3).map(feature => `
                  <div class="feature-item">
                    <div class="feature-icon">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span>${feature}</span>
                  </div>
                `).join('')}
              </div>

              <div class="amenity-actions">
                <button class="btn-secondary" data-amenity-details="${amenity.id}" data-cursor="hover">
                  <span>View Details</span>
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
                  </svg>
                </button>
              </div>
            </div>
          </div>
        `;
      });
    });

    return cards;
  }

  generateMobileGrid() {
    const featured = getFeaturedAmenities();
    return featured.map(amenity => `
      <div class="mobile-amenity-card" data-amenity-id="${amenity.id}">
        <div class="mobile-media">
          <div class="media-placeholder" data-media-type="${amenity.media.type}">
            ${amenity.media.type === 'video' ? `
              <div class="video-placeholder">
                <div class="play-button">
                  <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                </div>
              </div>
            ` : `
              <div class="image-placeholder">
                <div class="placeholder-icon">
                  <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
              </div>
            `}
          </div>
        </div>
        <div class="mobile-content">
          <h3 class="mobile-title">${amenity.title}</h3>
          <p class="mobile-description">${amenity.description}</p>
        </div>
      </div>
    `).join('');
  }

  initializeFiltering() {
    this.filterButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const filter = button.dataset.filter;
        this.setActiveFilter(filter);
        this.filterAmenities(filter);
      });
    });
  }

  setActiveFilter(filter) {
    this.currentFilter = filter;
    
    // Update button states
    this.filterButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });
  }

  filterAmenities(filter) {
    const cards = this.container.querySelectorAll('.amenity-card');
    
    cards.forEach(card => {
      const category = card.dataset.category;
      const shouldShow = filter === 'all' || category === filter;
      
      if (shouldShow) {
        gsap.to(card, {
          opacity: 1,
          scale: 1,
          duration: 0.5,
          ease: 'power2.out'
        });
        card.style.display = 'block';
      } else {
        gsap.to(card, {
          opacity: 0,
          scale: 0.8,
          duration: 0.3,
          ease: 'power2.in',
          onComplete: () => {
            card.style.display = 'none';
          }
        });
      }
    });

    // Refresh horizontal scroll after filtering
    setTimeout(() => {
      this.refreshHorizontalScroll();
    }, 600);
  }

  initializeHorizontalScroll() {
    // Only initialize on desktop
    if (window.innerWidth < 768) return;

    const container = this.container.querySelector('[data-amenities-scroll]');
    const track = this.scrollTrack;
    
    if (!container || !track) return;

    // Calculate scroll distance
    const getScrollDistance = () => {
      const containerWidth = container.clientWidth;
      const trackWidth = track.scrollWidth;
      return trackWidth - containerWidth;
    };

    // Create scroll trigger
    this.scrollTrigger = ScrollTrigger.create({
      trigger: container,
      start: 'top center',
      end: () => `+=${getScrollDistance()}`,
      scrub: 1,
      pin: true,
      anticipatePin: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const distance = getScrollDistance();
        
        gsap.set(track, {
          x: -distance * progress
        });
        
        // Update progress indicator
        this.updateScrollProgress(progress);
      }
    });

    // Manual scroll controls
    this.initScrollControls();
  }

  initScrollControls() {
    const prevBtn = this.container.querySelector('.scroll-prev');
    const nextBtn = this.container.querySelector('.scroll-next');
    
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => this.scrollPrevious());
      nextBtn.addEventListener('click', () => this.scrollNext());
    }
  }

  scrollPrevious() {
    const cardWidth = 400; // Approximate card width + gap
    const currentX = gsap.getProperty(this.scrollTrack, 'x');
    const newX = Math.min(0, currentX + cardWidth);
    
    gsap.to(this.scrollTrack, {
      x: newX,
      duration: 0.8,
      ease: 'power2.out'
    });
  }

  scrollNext() {
    const cardWidth = 400;
    const maxScroll = -(this.scrollTrack.scrollWidth - this.container.clientWidth);
    const currentX = gsap.getProperty(this.scrollTrack, 'x');
    const newX = Math.max(maxScroll, currentX - cardWidth);
    
    gsap.to(this.scrollTrack, {
      x: newX,
      duration: 0.8,
      ease: 'power2.out'
    });
  }

  updateScrollProgress(progress) {
    const progressBar = this.container.querySelector('.scroll-progress-bar');
    if (progressBar) {
      gsap.set(progressBar, {
        scaleX: progress
      });
    }
  }

  refreshHorizontalScroll() {
    if (this.scrollTrigger) {
      this.scrollTrigger.refresh();
    }
  }

  initializeAnimations() {
    // Enhanced entrance animations with dusk theme transition
    this.initSectionEntranceAnimations();
    this.initCardEntranceAnimations();
    this.initCardHoverAnimations();
    this.initDuskThemeTransition();
  }

  initSectionEntranceAnimations() {
    const header = this.container.querySelector('.amenities-header');
    const filters = this.container.querySelector('.amenities-filters');
    const scrollContainer = this.container.querySelector('.amenities-scroll-container');
    const backgroundElements = this.container.querySelectorAll('.absolute');

    // Main entrance timeline
    const entranceTl = gsap.timeline({
      scrollTrigger: {
        trigger: this.container,
        start: 'top 80%',
        once: true,
        onEnter: () => {
          // Trigger dusk theme transition
          this.triggerDuskTransition();
        }
      }
    });

    // Set initial states
    gsap.set([header, filters, scrollContainer], {
      opacity: 0,
      y: 50
    });

    gsap.set(backgroundElements, {
      opacity: 0,
      scale: 0.8
    });

    // Animate entrance with luxury timing
    entranceTl
      .to(backgroundElements, {
        opacity: 0.1,
        scale: 1,
        duration: 1.5,
        ease: 'power2.out',
        stagger: 0.2
      })
      .to(header, {
        opacity: 1,
        y: 0,
        duration: 1.2,
        ease: 'power2.out'
      }, '-=1')
      .to(filters, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out'
      }, '-=0.6')
      .to(scrollContainer, {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power2.out'
      }, '-=0.4');

    // Section title character animation
    const sectionTitle = header.querySelector('.section-title');
    if (sectionTitle) {
      this.animateTextReveal(sectionTitle, 0.8);
    }
  }

  initCardEntranceAnimations() {
    // Staggered card entrance animations
    const cards = this.container.querySelectorAll('.amenity-card');
    
    gsap.set(cards, {
      opacity: 0,
      y: 30,
      scale: 0.95
    });

    ScrollTrigger.create({
      trigger: this.container.querySelector('.amenities-track'),
      start: 'top 70%',
      once: true,
      onEnter: () => {
        gsap.to(cards, {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.8,
          ease: 'back.out(1.7)',
          stagger: {
            amount: 1.2,
            from: 'start'
          }
        });
      }
    });
  }

  initDuskThemeTransition() {
    // Progressive dusk theme transition as section comes into view
    ScrollTrigger.create({
      trigger: this.container,
      start: 'top 60%',
      end: 'bottom 40%',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        this.updateDuskTheme(progress);
      }
    });
  }

  triggerDuskTransition() {
    // Dispatch custom event for theme system
    const event = new CustomEvent('sectionThemeTransition', {
      detail: {
        section: 'amenities',
        theme: 'dusk',
        progress: 0
      }
    });
    document.dispatchEvent(event);
  }

  updateDuskTheme(progress) {
    // Update theme colors based on scroll progress
    const duskColors = {
      bg: this.interpolateColor('#f8f8f8', '#2a2a2a', progress),
      bgSecondary: this.interpolateColor('#e8e8e8', '#1a1a1a', progress),
      bgTertiary: this.interpolateColor('#d8d8d8', '#0a0a0a', progress),
      text: this.interpolateColor('#1a1a1a', '#e0e0e0', progress),
      textSecondary: this.interpolateColor('#666666', '#b0b0b0', progress)
    };

    // Apply theme colors to section
    this.container.style.setProperty('--theme-bg', duskColors.bg);
    this.container.style.setProperty('--theme-bg-secondary', duskColors.bgSecondary);
    this.container.style.setProperty('--theme-bg-tertiary', duskColors.bgTertiary);
    this.container.style.setProperty('--theme-text', duskColors.text);
    this.container.style.setProperty('--theme-text-secondary', duskColors.textSecondary);

    // Update cards with dusk theme
    const cards = this.container.querySelectorAll('.amenity-card');
    cards.forEach(card => {
      const cardBg = this.interpolateColor('rgba(255, 255, 255, 0.9)', 'rgba(255, 255, 255, 0.1)', progress);
      const borderColor = this.interpolateColor('rgba(236, 187, 79, 0.1)', 'rgba(236, 187, 79, 0.2)', progress);
      
      card.style.background = cardBg;
      card.style.borderColor = borderColor;
    });

    // Dispatch theme progress event
    const event = new CustomEvent('sectionThemeTransition', {
      detail: {
        section: 'amenities',
        theme: 'dusk',
        progress: progress
      }
    });
    document.dispatchEvent(event);
  }

  interpolateColor(color1, color2, factor) {
    // Simple color interpolation for theme transitions
    if (color1.startsWith('rgba') || color2.startsWith('rgba')) {
      return factor < 0.5 ? color1 : color2;
    }
    
    // For hex colors, return intermediate color
    const hex1 = color1.replace('#', '');
    const hex2 = color2.replace('#', '');
    
    const r1 = parseInt(hex1.substr(0, 2), 16);
    const g1 = parseInt(hex1.substr(2, 2), 16);
    const b1 = parseInt(hex1.substr(4, 2), 16);
    
    const r2 = parseInt(hex2.substr(0, 2), 16);
    const g2 = parseInt(hex2.substr(2, 2), 16);
    const b2 = parseInt(hex2.substr(4, 2), 16);
    
    const r = Math.round(r1 + (r2 - r1) * factor);
    const g = Math.round(g1 + (g2 - g1) * factor);
    const b = Math.round(b1 + (b2 - b1) * factor);
    
    return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
  }

  animateTextReveal(element, delay = 0) {
    // Character-by-character text reveal animation
    const text = element.textContent;
    element.innerHTML = '';
    
    const chars = text.split('').map(char => {
      const span = document.createElement('span');
      span.textContent = char === ' ' ? '\u00A0' : char;
      span.style.opacity = '0';
      span.style.transform = 'translateY(20px)';
      element.appendChild(span);
      return span;
    });

    gsap.to(chars, {
      opacity: 1,
      y: 0,
      duration: 0.05,
      stagger: 0.02,
      ease: 'power2.out',
      delay: delay
    });
  }

  initCardHoverAnimations() {
    this.amenityCards.forEach(card => {
      const media = card.querySelector('.amenity-media');
      const content = card.querySelector('.amenity-content');
      const categoryBadge = card.querySelector('.category-badge');
      const featuredBadge = card.querySelector('.featured-badge');
      const actionButton = card.querySelector('.btn-secondary');
      
      // Enhanced hover animations with gold highlights
      card.addEventListener('mouseenter', () => {
        // Media scaling and overlay
        gsap.to(media, {
          scale: 1.05,
          duration: 0.4,
          ease: 'power2.out'
        });
        
        // Content lift with gold glow
        gsap.to(content, {
          y: -8,
          duration: 0.4,
          ease: 'power2.out'
        });
        
        // Category badge gold highlight
        if (categoryBadge) {
          gsap.to(categoryBadge, {
            backgroundColor: 'rgba(236, 187, 79, 0.9)',
            color: '#000000',
            scale: 1.05,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
        
        // Featured badge animation
        if (featuredBadge) {
          gsap.to(featuredBadge, {
            scale: 1.1,
            boxShadow: '0 0 20px rgba(236, 187, 79, 0.5)',
            duration: 0.3,
            ease: 'power2.out'
          });
        }
        
        // Action button enhancement
        if (actionButton) {
          gsap.to(actionButton, {
            backgroundColor: 'rgba(236, 187, 79, 0.15)',
            borderColor: '#ecbb4f',
            scale: 1.02,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
        
        // Card border glow effect
        gsap.to(card, {
          boxShadow: '0 20px 60px rgba(236, 187, 79, 0.25), 0 0 0 1px rgba(236, 187, 79, 0.3)',
          duration: 0.4,
          ease: 'power2.out'
        });
      });
      
      card.addEventListener('mouseleave', () => {
        // Reset all animations
        gsap.to(media, {
          scale: 1,
          duration: 0.4,
          ease: 'power2.out'
        });
        
        gsap.to(content, {
          y: 0,
          duration: 0.4,
          ease: 'power2.out'
        });
        
        if (categoryBadge) {
          gsap.to(categoryBadge, {
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            color: 'var(--category-color, #ecbb4f)',
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
        
        if (featuredBadge) {
          gsap.to(featuredBadge, {
            scale: 1,
            boxShadow: 'none',
            duration: 0.3,
            ease: 'power2.out'
          });
        }
        
        if (actionButton) {
          gsap.to(actionButton, {
            backgroundColor: 'transparent',
            borderColor: 'rgba(236, 187, 79, 0.3)',
            scale: 1,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
        
        gsap.to(card, {
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
          duration: 0.4,
          ease: 'power2.out'
        });
      });
      
      // Click animation for card interaction
      card.addEventListener('mousedown', () => {
        gsap.to(card, {
          scale: 0.98,
          duration: 0.1,
          ease: 'power2.out'
        });
      });
      
      card.addEventListener('mouseup', () => {
        gsap.to(card, {
          scale: 1,
          duration: 0.2,
          ease: 'back.out(1.7)'
        });
      });
    });
  }

  bindEvents() {
    // Amenity detail buttons
    const detailButtons = this.container.querySelectorAll('[data-amenity-details]');
    detailButtons.forEach(button => {
      button.addEventListener('click', (e) => {
        e.preventDefault();
        const amenityId = button.dataset.amenityDetails;
        this.showAmenityDetails(amenityId);
      });
    });

    // Responsive handling
    window.addEventListener('resize', () => {
      this.handleResize();
    });
  }

  showAmenityDetails(amenityId) {
    const amenity = this.getAmenityById(amenityId);
    if (!amenity) {
      console.warn(`Amenity not found: ${amenityId}`);
      return;
    }

    this.createAmenityModal(amenity);
  }

  getAmenityById(id) {
    for (const category of AMENITY_CATEGORIES) {
      const amenity = category.items.find(item => item.id === id);
      if (amenity) return amenity;
    }
    return null;
  }

  createAmenityModal(amenity) {
    // Remove existing modal if present
    const existingModal = document.querySelector('.amenity-modal');
    if (existingModal) {
      existingModal.remove();
    }

    // Create modal structure
    const modal = document.createElement('div');
    modal.className = 'amenity-modal';
    modal.innerHTML = `
      <div class="modal-backdrop" data-cursor="default"></div>
      <div class="modal-container" data-cursor="default">
        <div class="modal-header">
          <button class="modal-close" data-cursor="hover" aria-label="Close modal">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        <div class="modal-content">
          <!-- Media Section -->
          <div class="modal-media">
            <div class="media-container">
              ${amenity.media.type === 'video' ? `
                <div class="video-container">
                  <div class="video-placeholder-large">
                    <div class="play-button-large" data-cursor="play">
                      <svg class="w-16 h-16" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M8 5v14l11-7z"/>
                      </svg>
                    </div>
                    <div class="video-overlay-large"></div>
                  </div>
                  <div class="media-caption">
                    <span class="media-type-badge">Video</span>
                    <span class="media-title">${amenity.media.placeholder}</span>
                  </div>
                </div>
              ` : `
                <div class="image-container">
                  <div class="image-placeholder-large">
                    <div class="placeholder-icon-large">
                      <svg class="w-24 h-24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" 
                              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                  </div>
                  <div class="media-caption">
                    <span class="media-type-badge">Image</span>
                    <span class="media-title">${amenity.media.placeholder}</span>
                  </div>
                </div>
              `}
            </div>
          </div>
          
          <!-- Details Section -->
          <div class="modal-details">
            <div class="details-header">
              <div class="category-info">
                <span class="category-name">${this.getCategoryName(amenity.category)}</span>
                ${amenity.featured ? '<span class="featured-indicator">Featured Amenity</span>' : ''}
              </div>
              <h2 class="amenity-title-large">${amenity.title}</h2>
              <p class="amenity-description-large">${amenity.description}</p>
            </div>
            
            <!-- Features Grid -->
            <div class="features-section">
              <h3 class="section-subtitle">Features & Facilities</h3>
              <div class="features-grid">
                ${amenity.features.map(feature => `
                  <div class="feature-card">
                    <div class="feature-icon-large">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                      </svg>
                    </div>
                    <span class="feature-text">${feature}</span>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <!-- Specifications -->
            <div class="specifications-section">
              <h3 class="section-subtitle">Specifications</h3>
              <div class="specs-grid">
                ${Object.entries(amenity.specifications).map(([key, value]) => `
                  <div class="spec-card">
                    <div class="spec-label">${key.charAt(0).toUpperCase() + key.slice(1)}</div>
                    <div class="spec-value">${value}</div>
                  </div>
                `).join('')}
              </div>
            </div>
            
            <!-- Action Buttons -->
            <div class="modal-actions">
              <button class="btn-primary" data-cursor="hover">
                <span>Schedule Visit</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3a1 1 0 011-1h6a1 1 0 011 1v4m-6 0h6m-6 0V6a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1h5m6 0v1a1 1 0 001 1h6a1 1 0 001-1v-4a1 1 0 00-1-1h-5m-6 0H9a1 1 0 01-1-1v-4a1 1 0 011-1h6a1 1 0 011 1v4a1 1 0 01-1 1h-1z"></path>
                </svg>
              </button>
              <button class="btn-secondary-modal" data-cursor="hover">
                <span>Download Brochure</span>
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Add to DOM
    document.body.appendChild(modal);

    // Initialize modal animations and events
    this.initializeModal(modal, amenity);
  }

  getCategoryName(categoryId) {
    const category = AMENITY_CATEGORIES.find(cat => cat.id === categoryId);
    return category ? category.name : 'Amenity';
  }

  initializeModal(modal, amenity) {
    const backdrop = modal.querySelector('.modal-backdrop');
    const container = modal.querySelector('.modal-container');
    const closeBtn = modal.querySelector('.modal-close');
    const mediaSection = modal.querySelector('.modal-media');
    const detailsSection = modal.querySelector('.modal-details');

    // Prevent body scroll
    document.body.style.overflow = 'hidden';

    // Initial state
    gsap.set(modal, { opacity: 0 });
    gsap.set(container, { scale: 0.8, y: 50 });
    gsap.set(mediaSection, { x: -50, opacity: 0 });
    gsap.set(detailsSection, { x: 50, opacity: 0 });

    // Entrance animation
    const tl = gsap.timeline();
    
    tl.to(modal, {
      opacity: 1,
      duration: 0.3,
      ease: 'power2.out'
    })
    .to(container, {
      scale: 1,
      y: 0,
      duration: 0.5,
      ease: 'back.out(1.7)'
    }, '-=0.1')
    .to(mediaSection, {
      x: 0,
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out'
    }, '-=0.3')
    .to(detailsSection, {
      x: 0,
      opacity: 1,
      duration: 0.4,
      ease: 'power2.out'
    }, '-=0.2');

    // Stagger feature cards
    const featureCards = modal.querySelectorAll('.feature-card');
    gsap.from(featureCards, {
      y: 20,
      opacity: 0,
      duration: 0.3,
      stagger: 0.05,
      ease: 'power2.out',
      delay: 0.6
    });

    // Stagger spec cards
    const specCards = modal.querySelectorAll('.spec-card');
    gsap.from(specCards, {
      y: 20,
      opacity: 0,
      duration: 0.3,
      stagger: 0.05,
      ease: 'power2.out',
      delay: 0.8
    });

    // Close modal events
    const closeModal = () => {
      const exitTl = gsap.timeline({
        onComplete: () => {
          modal.remove();
          document.body.style.overflow = 'auto';
        }
      });

      exitTl.to(detailsSection, {
        x: 50,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in'
      })
      .to(mediaSection, {
        x: -50,
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in'
      }, '-=0.2')
      .to(container, {
        scale: 0.8,
        y: 50,
        duration: 0.4,
        ease: 'power2.in'
      }, '-=0.2')
      .to(modal, {
        opacity: 0,
        duration: 0.3,
        ease: 'power2.in'
      }, '-=0.2');
    };

    // Event listeners
    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);
    
    // Escape key
    const handleEscape = (e) => {
      if (e.key === 'Escape') {
        closeModal();
        document.removeEventListener('keydown', handleEscape);
      }
    };
    document.addEventListener('keydown', handleEscape);

    // Action button events
    const scheduleBtn = modal.querySelector('.btn-primary');
    const brochureBtn = modal.querySelector('.btn-secondary-modal');

    if (scheduleBtn) {
      scheduleBtn.addEventListener('click', () => {
        console.log(`Schedule visit for: ${amenity.title}`);
        // Implement scheduling functionality
      });
    }

    if (brochureBtn) {
      brochureBtn.addEventListener('click', () => {
        console.log(`Download brochure for: ${amenity.title}`);
        // Implement download functionality
      });
    }
  }

  handleResize() {
    // Refresh scroll trigger on resize
    if (this.scrollTrigger) {
      this.scrollTrigger.refresh();
    }
  }

  destroy() {
    if (this.scrollTrigger) {
      this.scrollTrigger.kill();
    }
    
    // Remove event listeners
    this.filterButtons.forEach(button => {
      button.removeEventListener('click', this.setActiveFilter);
    });
  }
}

// Create and export instance
const amenitiesShowcase = new AmenitiesShowcase();

// Legacy function for backward compatibility
export function initAmenitiesScroll() {
  amenitiesShowcase.init();
}

// Export the class and instance
export { AmenitiesShowcase };
export default amenitiesShowcase;
