/**
 * Test suite for amenities data structure and filtering system
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { 
  AMENITY_CATEGORIES, 
  getAmenityById, 
  getAmenitiesByCategory, 
  getFeaturedAmenities,
  getAmenitiesByTheme,
  AmenityFilter 
} from '../amenities.js';

describe('Amenities Data Structure', () => {
  it('should have the correct number of categories', () => {
    expect(AMENITY_CATEGORIES).toHaveLength(3);
  });

  it('should have all required category properties', () => {
    AMENITY_CATEGORIES.forEach(category => {
      expect(category).toHaveProperty('id');
      expect(category).toHaveProperty('name');
      expect(category).toHaveProperty('description');
      expect(category).toHaveProperty('theme');
      expect(category).toHaveProperty('color');
      expect(category).toHaveProperty('items');
      expect(Array.isArray(category.items)).toBe(true);
    });
  });

  it('should include RC Toy competitions in Sports & Recreation', () => {
    const sportsCategory = AMENITY_CATEGORIES.find(cat => cat.id === 'sports-recreation');
    expect(sportsCategory).toBeDefined();
    
    const rcToyAmenity = sportsCategory.items.find(item => item.id === 'rc-toy-competitions');
    expect(rcToyAmenity).toBeDefined();
    expect(rcToyAmenity.title).toBe('RC Toy Competitions');
    expect(rcToyAmenity.featured).toBe(true);
    expect(rcToyAmenity.media.type).toBe('video');
  });

  it('should have all amenity items with required properties', () => {
    AMENITY_CATEGORIES.forEach(category => {
      category.items.forEach(amenity => {
        expect(amenity).toHaveProperty('id');
        expect(amenity).toHaveProperty('title');
        expect(amenity).toHaveProperty('description');
        expect(amenity).toHaveProperty('category');
        expect(amenity).toHaveProperty('featured');
        expect(amenity).toHaveProperty('media');
        expect(amenity).toHaveProperty('features');
        expect(amenity).toHaveProperty('specifications');
        
        // Check media structure
        expect(amenity.media).toHaveProperty('type');
        expect(amenity.media).toHaveProperty('placeholder');
        expect(amenity.media).toHaveProperty('alt');
        
        // Check features is array
        expect(Array.isArray(amenity.features)).toBe(true);
        
        // Check specifications is object
        expect(typeof amenity.specifications).toBe('object');
      });
    });
  });
});

describe('Amenity Utility Functions', () => {
  describe('getAmenityById', () => {
    it('should return correct amenity by id', () => {
      const amenity = getAmenityById('rc-toy-competitions');
      expect(amenity).toBeDefined();
      expect(amenity.title).toBe('RC Toy Competitions');
    });

    it('should return null for non-existent id', () => {
      const amenity = getAmenityById('non-existent');
      expect(amenity).toBeNull();
    });
  });

  describe('getAmenitiesByCategory', () => {
    it('should return amenities for valid category', () => {
      const amenities = getAmenitiesByCategory('sports-recreation');
      expect(Array.isArray(amenities)).toBe(true);
      expect(amenities.length).toBeGreaterThan(0);
      
      amenities.forEach(amenity => {
        expect(amenity.category).toBe('sports-recreation');
      });
    });

    it('should return empty array for invalid category', () => {
      const amenities = getAmenitiesByCategory('invalid-category');
      expect(amenities).toEqual([]);
    });
  });

  describe('getFeaturedAmenities', () => {
    it('should return only featured amenities', () => {
      const featured = getFeaturedAmenities();
      expect(Array.isArray(featured)).toBe(true);
      expect(featured.length).toBeGreaterThan(0);
      
      featured.forEach(amenity => {
        expect(amenity.featured).toBe(true);
      });
    });

    it('should include RC Toy competitions as featured', () => {
      const featured = getFeaturedAmenities();
      const rcToy = featured.find(amenity => amenity.id === 'rc-toy-competitions');
      expect(rcToy).toBeDefined();
    });
  });

  describe('getAmenitiesByTheme', () => {
    it('should return categories with dusk theme', () => {
      const duskCategories = getAmenitiesByTheme('dusk');
      expect(Array.isArray(duskCategories)).toBe(true);
      
      duskCategories.forEach(category => {
        expect(category.theme).toBe('dusk');
      });
    });
  });
});

describe('AmenityFilter Class', () => {
  let filter;

  beforeEach(() => {
    filter = new AmenityFilter();
  });

  describe('Filter Management', () => {
    it('should initialize with no active filters', () => {
      expect(filter.hasActiveFilters()).toBe(false);
      expect(filter.getActiveFilters()).toEqual([]);
    });

    it('should add and remove filters correctly', () => {
      filter.addFilter('sports-recreation');
      expect(filter.hasActiveFilters()).toBe(true);
      expect(filter.getActiveFilters()).toContain('sports-recreation');

      filter.removeFilter('sports-recreation');
      expect(filter.hasActiveFilters()).toBe(false);
      expect(filter.getActiveFilters()).not.toContain('sports-recreation');
    });

    it('should toggle filters correctly', () => {
      // Toggle on
      filter.toggleFilter('wellness-fitness');
      expect(filter.getActiveFilters()).toContain('wellness-fitness');

      // Toggle off
      filter.toggleFilter('wellness-fitness');
      expect(filter.getActiveFilters()).not.toContain('wellness-fitness');
    });

    it('should clear all filters', () => {
      filter.addFilter('sports-recreation');
      filter.addFilter('wellness-fitness');
      filter.setSearchTerm('test');

      filter.clearFilters();
      expect(filter.hasActiveFilters()).toBe(false);
      expect(filter.getActiveFilters()).toEqual([]);
    });
  });

  describe('Search Functionality', () => {
    it('should filter by search term', () => {
      filter.setSearchTerm('swimming');
      const filtered = filter.getFilteredAmenities();
      
      // Should find categories with swimming-related amenities
      const hasSwimmingAmenity = filtered.some(category =>
        category.items.some(item =>
          item.title.toLowerCase().includes('swimming') ||
          item.description.toLowerCase().includes('swimming')
        )
      );
      expect(hasSwimmingAmenity).toBe(true);
    });

    it('should return empty results for non-matching search', () => {
      filter.setSearchTerm('nonexistentamenity');
      const filtered = filter.getFilteredAmenities();
      expect(filtered).toEqual([]);
    });
  });

  describe('Combined Filtering', () => {
    it('should apply both category and search filters', () => {
      filter.addFilter('sports-recreation');
      filter.setSearchTerm('tennis');
      
      const filtered = filter.getFilteredAmenities();
      
      // Should only return sports-recreation category with tennis items
      filtered.forEach(category => {
        expect(category.id).toBe('sports-recreation');
        category.items.forEach(item => {
          const matchesSearch = 
            item.title.toLowerCase().includes('tennis') ||
            item.description.toLowerCase().includes('tennis') ||
            item.features.some(feature => feature.toLowerCase().includes('tennis'));
          expect(matchesSearch).toBe(true);
        });
      });
    });
  });
});

describe('Content Categories Structure', () => {
  it('should have Sports & Recreation category with correct items', () => {
    const category = AMENITY_CATEGORIES.find(cat => cat.id === 'sports-recreation');
    expect(category.name).toBe('Sports & Recreation');
    expect(category.theme).toBe('dusk');
    
    const expectedItems = ['rc-toy-competitions', 'swimming-pool', 'tennis-courts', 'basketball-court'];
    const actualItems = category.items.map(item => item.id);
    
    expectedItems.forEach(expectedId => {
      expect(actualItems).toContain(expectedId);
    });
  });

  it('should have Wellness & Fitness category with correct items', () => {
    const category = AMENITY_CATEGORIES.find(cat => cat.id === 'wellness-fitness');
    expect(category.name).toBe('Wellness & Fitness');
    expect(category.theme).toBe('dusk');
    
    const expectedItems = ['spa-wellness-center', 'fitness-center', 'yoga-meditation-studio', 'physiotherapy-center'];
    const actualItems = category.items.map(item => item.id);
    
    expectedItems.forEach(expectedId => {
      expect(actualItems).toContain(expectedId);
    });
  });

  it('should have Entertainment & Social category with correct items', () => {
    const category = AMENITY_CATEGORIES.find(cat => cat.id === 'entertainment-social');
    expect(category.name).toBe('Entertainment & Social');
    expect(category.theme).toBe('night');
    
    const expectedItems = ['grand-clubhouse', 'childrens-play-area', 'multipurpose-halls', 'library-reading-room', 'gaming-lounge'];
    const actualItems = category.items.map(item => item.id);
    
    expectedItems.forEach(expectedId => {
      expect(actualItems).toContain(expectedId);
    });
  });
});

describe('Placeholder Media References', () => {
  it('should have placeholder media for all amenities', () => {
    AMENITY_CATEGORIES.forEach(category => {
      category.items.forEach(amenity => {
        expect(amenity.media.placeholder).toBeDefined();
        expect(typeof amenity.media.placeholder).toBe('string');
        expect(amenity.media.placeholder.length).toBeGreaterThan(0);
      });
    });
  });

  it('should have video placeholder for RC Toy competitions', () => {
    const rcToy = getAmenityById('rc-toy-competitions');
    expect(rcToy.media.type).toBe('video');
    expect(rcToy.media.placeholder).toBe('rc-toys-competition.mp4');
    expect(rcToy.media.poster).toBe('rc-toys-poster.jpg');
  });

  it('should have appropriate alt text for all media', () => {
    AMENITY_CATEGORIES.forEach(category => {
      category.items.forEach(amenity => {
        expect(amenity.media.alt).toBeDefined();
        expect(typeof amenity.media.alt).toBe('string');
        expect(amenity.media.alt.length).toBeGreaterThan(0);
      });
    });
  });
});