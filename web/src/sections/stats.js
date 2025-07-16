import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

// Enhanced statistics section with luxury animations and theme transitions
export function initStatsCounters() {
  const statsSection = document.getElementById('stats')
  const counters = document.querySelectorAll('[data-counter]')
  const progressBars = document.querySelectorAll('[data-progress]')
  const statCards = document.querySelectorAll('.stat-card')
  
  if (!statsSection || !counters.length) return

  // Initialize stats section animations
  initStatsLayout()
  initCounterAnimations()
  initProgressBarAnimations()
  initCardHoverEffects()
  initEntranceAnimations()
  initThemeTransition()
  initMicroInteractions()
  
  console.log('📊 Enhanced statistics section with visual enhancements and micro-interactions initialized')
}

function initStatsLayout() {
  const statsSection = document.getElementById('stats')
  if (!statsSection) return
  
  // Set initial states for animation
  gsap.set('.stat-card', {
    opacity: 0,
    y: 50,
    scale: 0.9
  })
  
  gsap.set('.stat-counter', {
    opacity: 0,
    scale: 0.8
  })
  
  gsap.set('.stat-progress-bar', {
    scaleX: 0,
    transformOrigin: 'left center'
  })
}

function initCounterAnimations() {
  const counters = document.querySelectorAll('[data-counter]')
  
  counters.forEach((counter, index) => {
    const target = parseInt(counter.dataset.counter, 10)
    const suffix = counter.dataset.suffix || ''
    const prefix = counter.dataset.prefix || ''
    const duration = parseFloat(counter.dataset.duration) || 2.5
    const delay = parseFloat(counter.dataset.delay) || (index * 0.2)
    
    // Create counter animation with luxury timing
    ScrollTrigger.create({
      trigger: counter,
      start: 'top 80%',
      onEnter: () => {
        // Fade in counter first
        gsap.to(counter, {
          opacity: 1,
          scale: 1,
          duration: 0.6,
          delay: delay,
          ease: 'back.out(1.7)'
        })
        
        // Then animate the number
        gsap.to({ value: 0 }, {
          value: target,
          duration: duration,
          delay: delay + 0.3,
          ease: 'power2.out',
          onUpdate: function() {
            const currentValue = Math.floor(this.targets()[0].value)
            counter.textContent = prefix + currentValue.toLocaleString() + suffix
          },
          onComplete: () => {
            // Add a subtle pulse effect when complete
            gsap.to(counter, {
              scale: 1.05,
              duration: 0.2,
              yoyo: true,
              repeat: 1,
              ease: 'power2.inOut'
            })
          }
        })
      }
    })
  })
}

function initProgressBarAnimations() {
  const progressBars = document.querySelectorAll('[data-progress]')
  
  progressBars.forEach((bar, index) => {
    const progress = parseFloat(bar.dataset.progress) || 100
    const duration = parseFloat(bar.dataset.duration) || 2
    const delay = parseFloat(bar.dataset.delay) || (index * 0.3)
    
    ScrollTrigger.create({
      trigger: bar,
      start: 'top 85%',
      onEnter: () => {
        gsap.to(bar, {
          scaleX: progress / 100,
          duration: duration,
          delay: delay,
          ease: 'power2.out'
        })
      }
    })
  })
}

function initCardHoverEffects() {
  const statCards = document.querySelectorAll('.stat-card')
  
  statCards.forEach((card) => {
    // Create hover timeline
    const hoverTl = gsap.timeline({ paused: true })
    
    hoverTl
      .to(card, {
        y: -8,
        scale: 1.02,
        duration: 0.3,
        ease: 'power2.out'
      })
      .to(card.querySelector('.stat-icon'), {
        scale: 1.1,
        rotation: 5,
        duration: 0.3,
        ease: 'back.out(1.7)'
      }, 0)
      .to(card.querySelector('.stat-counter'), {
        scale: 1.05,
        duration: 0.3,
        ease: 'power2.out'
      }, 0)
    
    // Mouse events
    card.addEventListener('mouseenter', () => {
      hoverTl.play()
      
      // Add gold glow effect
      gsap.to(card, {
        boxShadow: '0 20px 40px rgba(236, 187, 79, 0.2), 0 0 0 1px rgba(236, 187, 79, 0.1)',
        duration: 0.3,
        ease: 'power2.out'
      })
    })
    
    card.addEventListener('mouseleave', () => {
      hoverTl.reverse()
      
      // Remove glow effect
      gsap.to(card, {
        boxShadow: '0 4px 6px var(--theme-shadow)',
        duration: 0.3,
        ease: 'power2.out'
      })
    })
  })
}

function initEntranceAnimations() {
  const statsSection = document.getElementById('stats')
  const statCards = document.querySelectorAll('.stat-card')
  
  if (!statsSection || !statCards.length) return
  
  // Create master timeline for section entrance with luxury timing
  const masterTl = gsap.timeline({
    scrollTrigger: {
      trigger: statsSection,
      start: 'top 75%',
      end: 'bottom 25%',
      toggleActions: 'play none none reverse',
      onEnter: () => {
        // Add theme transition class when entering
        statsSection.classList.add('stats-entering')
      },
      onLeave: () => {
        statsSection.classList.remove('stats-entering')
      }
    }
  })
  
  // Phase 1: Section background and decorative elements
  masterTl
    .from(statsSection, {
      opacity: 0,
      scale: 0.95,
      duration: 1.2,
      ease: 'power3.out'
    })
    .from(statsSection.querySelector('::before'), {
      opacity: 0,
      scale: 0.8,
      duration: 1.0,
      ease: 'power2.out'
    }, '-=0.8')
    
  // Phase 2: Section title with luxury reveal
  const sectionTitle = statsSection.querySelector('.section-title')
  if (sectionTitle) {
    masterTl
      .from(sectionTitle, {
        opacity: 0,
        y: 40,
        scale: 0.9,
        duration: 1.0,
        ease: 'back.out(1.7)'
      }, '-=0.6')
      .from(sectionTitle.querySelector('::after'), {
        scaleX: 0,
        duration: 0.8,
        ease: 'power2.out'
      }, '-=0.3')
  }
  
  // Phase 3: Staggered card entrance with luxury easing
  masterTl
    .to('.stat-card', {
      opacity: 1,
      y: 0,
      scale: 1,
      rotationX: 0,
      duration: 1.2,
      stagger: {
        amount: 1.2,
        from: 'start',
        ease: 'power3.out',
        // Custom stagger function for luxury timing
        each: 0.3
      },
      ease: 'back.out(1.4)'
    }, '-=0.8')
    
  // Phase 4: Individual card element animations
  statCards.forEach((card, index) => {
    const delay = index * 0.15
    
    // Icon entrance
    masterTl
      .from(card.querySelector('.stat-icon'), {
        opacity: 0,
        scale: 0.5,
        rotation: -180,
        duration: 0.8,
        ease: 'back.out(2.7)'
      }, `-=${1.0 - delay}`)
      
    // Counter entrance
    masterTl
      .from(card.querySelector('.stat-counter'), {
        opacity: 0,
        scale: 0.3,
        y: 20,
        duration: 0.6,
        ease: 'back.out(1.7)'
      }, `-=${0.8 - delay}`)
      
    // Label and description entrance
    masterTl
      .from([card.querySelector('.stat-label'), card.querySelector('.stat-description')], {
        opacity: 0,
        y: 15,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out'
      }, `-=${0.6 - delay}`)
      
    // Progress bar container entrance
    masterTl
      .from(card.querySelector('.stat-progress-container'), {
        opacity: 0,
        scaleX: 0,
        duration: 0.4,
        ease: 'power2.out'
      }, `-=${0.4 - delay}`)
  })
  
  // Phase 5: Final flourish - add subtle floating animation
  masterTl
    .to('.stat-card', {
      y: -2,
      duration: 2,
      ease: 'sine.inOut',
      stagger: {
        amount: 0.8,
        repeat: -1,
        yoyo: true
      }
    }, '-=0.5')
}

// Enhanced theme transition function
function initThemeTransition() {
  const statsSection = document.getElementById('stats')
  if (!statsSection) return
  
  // Create scroll-based theme transition
  ScrollTrigger.create({
    trigger: statsSection,
    start: 'top 80%',
    end: 'bottom 20%',
    onUpdate: (self) => {
      const progress = self.progress
      
      // Transition from day to dusk theme based on scroll progress
      if (progress < 0.3) {
        statsSection.className = statsSection.className.replace(/stats-(day|dusk)-theme/g, '') + ' stats-day-theme'
      } else if (progress >= 0.3 && progress < 0.7) {
        // Transition phase - blend themes
        statsSection.className = statsSection.className.replace(/stats-(day|dusk)-theme/g, '') + ' stats-day-theme stats-transitioning'
      } else {
        statsSection.className = statsSection.className.replace(/stats-(day|dusk)-theme/g, '') + ' stats-dusk-theme'
      }
      
      // Update CSS custom properties for smooth theme transition
      const dayToNightRatio = Math.min(progress * 1.5, 1)
      document.documentElement.style.setProperty('--stats-theme-progress', dayToNightRatio)
    }
  })
}

// Enhanced micro-interactions
function initMicroInteractions() {
  const statCards = document.querySelectorAll('.stat-card')
  
  statCards.forEach((card, index) => {
    // Create individual hover timeline for each card
    const hoverTl = gsap.timeline({ paused: true })
    const icon = card.querySelector('.stat-icon')
    const counter = card.querySelector('.stat-counter')
    const label = card.querySelector('.stat-label')
    const description = card.querySelector('.stat-description')
    const progressBar = card.querySelector('.stat-progress-bar')
    
    // Build complex hover animation sequence
    hoverTl
      .to(card, {
        y: -12,
        scale: 1.03,
        duration: 0.4,
        ease: 'power2.out'
      })
      .to(icon, {
        scale: 1.15,
        rotation: 8,
        y: -2,
        duration: 0.3,
        ease: 'back.out(1.7)'
      }, 0)
      .to(counter, {
        scale: 1.08,
        y: -1,
        duration: 0.3,
        ease: 'power2.out'
      }, 0.1)
      .to([label, description], {
        y: -1,
        duration: 0.2,
        stagger: 0.05,
        ease: 'power2.out'
      }, 0.15)
      .to(progressBar, {
        scaleY: 1.2,
        duration: 0.2,
        ease: 'power2.out'
      }, 0.2)
    
    // Mouse events with luxury timing
    card.addEventListener('mouseenter', () => {
      hoverTl.play()
      
      // Add dynamic glow effect
      gsap.to(card, {
        boxShadow: `
          0 25px 50px rgba(236, 187, 79, 0.2),
          0 15px 30px rgba(255, 215, 0, 0.1),
          0 0 0 2px rgba(236, 187, 79, 0.3),
          inset 0 1px 0 rgba(255, 255, 255, 0.2)
        `,
        duration: 0.3,
        ease: 'power2.out'
      })
    })
    
    card.addEventListener('mouseleave', () => {
      hoverTl.reverse()
      
      // Remove glow effect
      gsap.to(card, {
        boxShadow: '0 4px 6px var(--theme-shadow)',
        duration: 0.3,
        ease: 'power2.out'
      })
    })
    
    // Add click interaction
    card.addEventListener('click', () => {
      // Pulse effect on click
      gsap.to(card, {
        scale: 0.98,
        duration: 0.1,
        ease: 'power2.out',
        yoyo: true,
        repeat: 1
      })
      
      // Counter pulse
      gsap.to(counter, {
        scale: 1.15,
        duration: 0.2,
        ease: 'back.out(2.7)',
        yoyo: true,
        repeat: 1
      })
    })
  })
}

// Enhanced stats data structure for dynamic content
export const statsData = [
  {
    id: 'towers',
    value: 5,
    label: 'Luxury Towers',
    icon: '🏢',
    suffix: '',
    progress: 100,
    description: 'Premium residential towers'
  },
  {
    id: 'units',
    value: 800,
    label: 'Service Apartments',
    icon: '🏠',
    suffix: '+',
    progress: 85,
    description: 'Well-appointed living spaces'
  },
  {
    id: 'amenities',
    value: 18,
    label: 'World-Class Amenities',
    icon: '⭐',
    suffix: '',
    progress: 100,
    description: 'Exclusive lifestyle facilities'
  },
  {
    id: 'maintenance',
    value: 0,
    label: 'Maintenance Cost',
    icon: '💰',
    prefix: '₹',
    suffix: '',
    progress: 100,
    description: 'Lifetime maintenance-free living'
  }
]

// Function to create enhanced stats HTML structure
export function createStatsSection() {
  const statsSection = document.getElementById('stats')
  if (!statsSection) return
  
  // Enhanced HTML structure with luxury styling
  statsSection.innerHTML = `
    <div class="container-luxury">
      <div class="text-center mb-16">
        <h2 class="section-title text-responsive-lg font-montserrat font-light mb-4 theme-aware-text">
          Project Highlights
        </h2>
        <p class="text-lg theme-aware-text-secondary max-w-2xl mx-auto font-montserrat font-light">
          Discover the exceptional features that make Project Ananta a landmark destination for luxury living
        </p>
      </div>
      
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        ${statsData.map((stat, index) => `
          <div class="stat-card card-luxury p-8 text-center group cursor-pointer" 
               data-stat-id="${stat.id}"
               data-cursor="hover">
            <div class="stat-icon text-4xl mb-4 transition-transform duration-300">
              ${stat.icon}
            </div>
            
            <div class="stat-counter text-4xl md:text-5xl font-bold accent-gold mb-2 font-montserrat font-light"
                 data-counter="${stat.value}"
                 data-prefix="${stat.prefix || ''}"
                 data-suffix="${stat.suffix || ''}"
                 data-duration="2.5"
                 data-delay="${index * 0.2}">
              ${stat.prefix || ''}0${stat.suffix || ''}
            </div>
            
            <h3 class="stat-label text-sm uppercase tracking-wider theme-aware-text font-montserrat font-medium mb-3">
              ${stat.label}
            </h3>
            
            <p class="stat-description text-xs theme-aware-text-secondary font-montserrat font-light mb-4">
              ${stat.description}
            </p>
            
            <div class="stat-progress-container w-full h-1 bg-gray-200 rounded-full overflow-hidden">
              <div class="stat-progress-bar h-full bg-gradient-to-r from-gold-primary to-gold-light rounded-full"
                   data-progress="${stat.progress}"
                   data-duration="2"
                   data-delay="${index * 0.3}">
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `
}
