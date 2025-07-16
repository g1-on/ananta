/**
 * Amenities Content Structure
 * Organized by categories with placeholder media references
 * Following luxury real estate standards with RC Toy competitions and premium facilities
 */

export const AMENITY_CATEGORIES = [
  {
    id: 'sports-recreation',
    name: 'Sports & Recreation',
    description: 'World-class sporting facilities and recreational activities',
    theme: 'dusk',
    color: '#ecbb4f',
    items: [
      {
        id: 'rc-toy-competitions',
        title: 'RC Toy Competitions',
        description: 'State-of-the-art remote control racing arena with professional tracks and competition facilities',
        category: 'sports-recreation',
        featured: true,
        media: {
          type: 'video',
          placeholder: 'rc-toys-competition.mp4',
          poster: 'rc-toys-poster.jpg',
          alt: 'Remote control car racing competition at Project Ananta'
        },
        features: [
          'Professional RC racing tracks',
          'Competition-grade timing systems',
          'Spectator viewing areas',
          'Equipment rental and maintenance',
          'Regular tournaments and events'
        ],
        specifications: {
          area: '2,500 sq ft',
          capacity: '50 participants',
          trackLength: '200 meters',
          facilities: 'Indoor & Outdoor tracks'
        }
      },
      {
        id: 'swimming-pool',
        title: 'Olympic Swimming Pool',
        description: 'Olympic-sized swimming facility with separate pools for adults and children',
        category: 'sports-recreation',
        featured: true,
        media: {
          type: 'image',
          placeholder: 'olympic-pool.jpg',
          alt: 'Olympic-sized swimming pool with luxury poolside amenities'
        },
        features: [
          'Olympic-sized main pool (50m)',
          'Children\'s splash pool',
          'Poolside cabanas',
          'Professional lifeguard services',
          'Swimming coaching available'
        ],
        specifications: {
          mainPool: '50m x 25m',
          depth: '1.2m to 3m',
          kidsPool: '15m x 10m',
          capacity: '100 swimmers'
        }
      },
      {
        id: 'tennis-courts',
        title: 'Professional Tennis Courts',
        description: 'Championship-standard tennis courts with professional lighting and surfaces',
        category: 'sports-recreation',
        featured: false,
        media: {
          type: 'image',
          placeholder: 'tennis-courts.jpg',
          alt: 'Professional tennis courts with night lighting'
        },
        features: [
          'Hard court surfaces',
          'Professional lighting',
          'Equipment rental',
          'Coaching services',
          'Tournament hosting'
        ],
        specifications: {
          courts: '4 courts',
          surface: 'Hard court',
          lighting: 'LED floodlights',
          booking: '24/7 online booking'
        }
      },
      {
        id: 'basketball-court',
        title: 'Basketball Court',
        description: 'Full-size basketball court with professional flooring and equipment',
        category: 'sports-recreation',
        featured: false,
        media: {
          type: 'image',
          placeholder: 'basketball-court.jpg',
          alt: 'Professional basketball court with modern facilities'
        },
        features: [
          'Full-size court',
          'Professional flooring',
          'Adjustable hoops',
          'Spectator seating',
          'Equipment storage'
        ],
        specifications: {
          size: '28m x 15m',
          flooring: 'Maple hardwood',
          hoops: 'Adjustable height',
          capacity: '200 spectators'
        }
      }
    ]
  },
  {
    id: 'wellness-fitness',
    name: 'Wellness & Fitness',
    description: 'Comprehensive wellness facilities for mind, body, and soul',
    theme: 'dusk',
    color: '#d4af37',
    items: [
      {
        id: 'spa-wellness-center',
        title: 'Luxury Spa & Wellness Center',
        description: 'World-class spa facility offering comprehensive wellness treatments and therapies',
        category: 'wellness-fitness',
        featured: true,
        media: {
          type: 'image',
          placeholder: 'luxury-spa.jpg',
          alt: 'Luxury spa treatment room with premium amenities'
        },
        features: [
          'Full-service spa treatments',
          'Massage therapy rooms',
          'Steam and sauna facilities',
          'Aromatherapy sessions',
          'Wellness consultations'
        ],
        specifications: {
          area: '3,000 sq ft',
          rooms: '8 treatment rooms',
          facilities: 'Steam, Sauna, Jacuzzi',
          services: '15+ treatment types'
        }
      },
      {
        id: 'fitness-center',
        title: 'State-of-the-Art Fitness Center',
        description: 'Modern fitness facility with latest equipment and personal training services',
        category: 'wellness-fitness',
        featured: true,
        media: {
          type: 'image',
          placeholder: 'modern-gym.jpg',
          alt: 'Modern fitness center with premium equipment'
        },
        features: [
          'Latest cardio equipment',
          'Strength training machines',
          'Free weights section',
          'Personal training services',
          'Group fitness classes'
        ],
        specifications: {
          area: '4,000 sq ft',
          equipment: '50+ machines',
          trainers: 'Certified professionals',
          hours: '5 AM - 11 PM'
        }
      },
      {
        id: 'yoga-meditation-studio',
        title: 'Yoga & Meditation Studio',
        description: 'Serene spaces designed for yoga practice, meditation, and mindfulness',
        category: 'wellness-fitness',
        featured: false,
        media: {
          type: 'image',
          placeholder: 'yoga-studio.jpg',
          alt: 'Peaceful yoga and meditation studio with natural lighting'
        },
        features: [
          'Spacious yoga halls',
          'Meditation gardens',
          'Professional instructors',
          'Equipment provided',
          'Multiple class timings'
        ],
        specifications: {
          studios: '2 large studios',
          capacity: '30 per session',
          classes: 'Daily sessions',
          styles: 'Hatha, Vinyasa, Meditation'
        }
      },
      {
        id: 'physiotherapy-center',
        title: 'Physiotherapy & Rehabilitation Center',
        description: 'Professional physiotherapy services with modern equipment and qualified therapists',
        category: 'wellness-fitness',
        featured: false,
        media: {
          type: 'image',
          placeholder: 'physiotherapy.jpg',
          alt: 'Modern physiotherapy center with rehabilitation equipment'
        },
        features: [
          'Qualified physiotherapists',
          'Modern rehabilitation equipment',
          'Sports injury treatment',
          'Post-surgery recovery',
          'Preventive care programs'
        ],
        specifications: {
          area: '1,500 sq ft',
          therapists: '4 qualified professionals',
          equipment: 'Latest rehabilitation tech',
          services: 'Comprehensive care'
        }
      }
    ]
  },
  {
    id: 'entertainment-social',
    name: 'Entertainment & Social',
    description: 'Premium entertainment and social gathering spaces for all ages',
    theme: 'night',
    color: '#ffd700',
    items: [
      {
        id: 'grand-clubhouse',
        title: 'Grand Clubhouse',
        description: 'Elegant clubhouse with multiple halls for social gatherings and events',
        category: 'entertainment-social',
        featured: true,
        media: {
          type: 'image',
          placeholder: 'grand-clubhouse.jpg',
          alt: 'Elegant grand clubhouse with luxury interiors'
        },
        features: [
          'Multiple banquet halls',
          'Private dining rooms',
          'Business meeting facilities',
          'Catering services',
          'Event planning assistance'
        ],
        specifications: {
          area: '8,000 sq ft',
          halls: '3 banquet halls',
          capacity: '200-500 guests',
          facilities: 'Full catering kitchen'
        }
      },
      {
        id: 'childrens-play-area',
        title: 'Children\'s Adventure Playground',
        description: 'Safe and engaging play areas designed for children of all ages',
        category: 'entertainment-social',
        featured: true,
        media: {
          type: 'image',
          placeholder: 'kids-playground.jpg',
          alt: 'Modern children\'s playground with safe play equipment'
        },
        features: [
          'Age-appropriate play equipment',
          'Soft play areas for toddlers',
          'Adventure climbing structures',
          'Sand pit and water play',
          'Supervised play sessions'
        ],
        specifications: {
          area: '5,000 sq ft',
          zones: '3 age-specific zones',
          safety: 'Certified equipment',
          supervision: 'Trained staff available'
        }
      },
      {
        id: 'multipurpose-halls',
        title: 'Multipurpose Event Halls',
        description: 'Versatile event spaces for celebrations, meetings, and community gatherings',
        category: 'entertainment-social',
        featured: false,
        media: {
          type: 'image',
          placeholder: 'event-halls.jpg',
          alt: 'Multipurpose event halls with modern amenities'
        },
        features: [
          'Flexible seating arrangements',
          'Audio-visual equipment',
          'Stage and presentation area',
          'Climate control',
          'Parking facilities'
        ],
        specifications: {
          halls: '2 multipurpose halls',
          capacity: '100-300 guests',
          equipment: 'Full AV setup',
          booking: 'Advance reservation'
        }
      },
      {
        id: 'library-reading-room',
        title: 'Community Library & Reading Room',
        description: 'Quiet spaces for reading, studying, and intellectual pursuits',
        category: 'entertainment-social',
        featured: false,
        media: {
          type: 'image',
          placeholder: 'library.jpg',
          alt: 'Modern community library with comfortable reading areas'
        },
        features: [
          'Extensive book collection',
          'Digital resources',
          'Quiet study areas',
          'Internet access',
          'Newspaper and magazines'
        ],
        specifications: {
          area: '2,000 sq ft',
          books: '5,000+ titles',
          seating: '50 reading spots',
          hours: '6 AM - 10 PM'
        }
      },
      {
        id: 'gaming-lounge',
        title: 'Gaming & Entertainment Lounge',
        description: 'Modern gaming facility with console games, board games, and entertainment systems',
        category: 'entertainment-social',
        featured: false,
        media: {
          type: 'image',
          placeholder: 'gaming-lounge.jpg',
          alt: 'Modern gaming lounge with entertainment systems'
        },
        features: [
          'Gaming consoles',
          'Board game collection',
          'Comfortable seating',
          'Snack bar',
          'Tournament hosting'
        ],
        specifications: {
          area: '1,200 sq ft',
          consoles: '10+ gaming stations',
          games: '100+ titles',
          capacity: '40 users'
        }
      }
    ]
  }
]

// Utility functions for amenity data management
export const getAmenityById = (id) => {
  for (const category of AMENITY_CATEGORIES) {
    const amenity = category.items.find(item => item.id === id)
    if (amenity) return amenity
  }
  return null
}

export const getAmenitiesByCategory = (categoryId) => {
  const category = AMENITY_CATEGORIES.find(cat => cat.id === categoryId)
  return category ? category.items : []
}

export const getFeaturedAmenities = () => {
  const featured = []
  AMENITY_CATEGORIES.forEach(category => {
    featured.push(...category.items.filter(item => item.featured))
  })
  return featured
}

export const getAmenitiesByTheme = (theme) => {
  return AMENITY_CATEGORIES.filter(category => category.theme === theme)
}

// Category filtering system
export class AmenityFilter {
  constructor() {
    this.activeFilters = new Set()
    this.searchTerm = ''
  }

  addFilter(categoryId) {
    this.activeFilters.add(categoryId)
    return this.getFilteredAmenities()
  }

  removeFilter(categoryId) {
    this.activeFilters.delete(categoryId)
    return this.getFilteredAmenities()
  }

  toggleFilter(categoryId) {
    if (this.activeFilters.has(categoryId)) {
      return this.removeFilter(categoryId)
    } else {
      return this.addFilter(categoryId)
    }
  }

  clearFilters() {
    this.activeFilters.clear()
    this.searchTerm = ''
    return this.getFilteredAmenities()
  }

  setSearchTerm(term) {
    this.searchTerm = term.toLowerCase()
    return this.getFilteredAmenities()
  }

  getFilteredAmenities() {
    let filteredCategories = AMENITY_CATEGORIES

    // Apply category filters
    if (this.activeFilters.size > 0) {
      filteredCategories = filteredCategories.filter(category => 
        this.activeFilters.has(category.id)
      )
    }

    // Apply search filter
    if (this.searchTerm) {
      filteredCategories = filteredCategories.map(category => ({
        ...category,
        items: category.items.filter(item => 
          item.title.toLowerCase().includes(this.searchTerm) ||
          item.description.toLowerCase().includes(this.searchTerm) ||
          item.features.some(feature => feature.toLowerCase().includes(this.searchTerm))
        )
      })).filter(category => category.items.length > 0)
    }

    return filteredCategories
  }

  getActiveFilters() {
    return Array.from(this.activeFilters)
  }

  hasActiveFilters() {
    return this.activeFilters.size > 0 || this.searchTerm.length > 0
  }
}

// Export default amenity filter instance
export const amenityFilter = new AmenityFilter()