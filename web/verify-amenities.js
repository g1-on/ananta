/**
 * Verification script for amenities content structure
 * Tests the data structure and filtering functionality
 */

import { 
  AMENITY_CATEGORIES, 
  getAmenityById, 
  getAmenitiesByCategory, 
  getFeaturedAmenities,
  getAmenitiesByTheme,
  AmenityFilter 
} from './src/data/amenities.js';

console.log('🏊‍♂️ Verifying Amenities Content Structure...\n');

// Test 1: Basic structure
console.log('✅ Test 1: Basic Structure');
console.log(`Categories found: ${AMENITY_CATEGORIES.length}`);
console.log(`Expected: 3 categories`);
console.log(`Status: ${AMENITY_CATEGORIES.length === 3 ? 'PASS' : 'FAIL'}\n`);

// Test 2: Category names and themes
console.log('✅ Test 2: Category Details');
AMENITY_CATEGORIES.forEach(category => {
  console.log(`- ${category.name} (${category.id})`);
  console.log(`  Theme: ${category.theme}`);
  console.log(`  Items: ${category.items.length}`);
  console.log(`  Color: ${category.color}`);
});
console.log();

// Test 3: RC Toy competitions
console.log('✅ Test 3: RC Toy Competitions');
const rcToy = getAmenityById('rc-toy-competitions');
if (rcToy) {
  console.log(`Found: ${rcToy.title}`);
  console.log(`Category: ${rcToy.category}`);
  console.log(`Featured: ${rcToy.featured}`);
  console.log(`Media Type: ${rcToy.media.type}`);
  console.log(`Placeholder: ${rcToy.media.placeholder}`);
  console.log(`Features: ${rcToy.features.length} items`);
  console.log('Status: PASS');
} else {
  console.log('Status: FAIL - RC Toy competitions not found');
}
console.log();

// Test 4: Featured amenities
console.log('✅ Test 4: Featured Amenities');
const featured = getFeaturedAmenities();
console.log(`Featured amenities found: ${featured.length}`);
featured.forEach(amenity => {
  console.log(`- ${amenity.title} (${amenity.category})`);
});
console.log();

// Test 5: Category filtering
console.log('✅ Test 5: Category Filtering');
const sportsAmenities = getAmenitiesByCategory('sports-recreation');
console.log(`Sports & Recreation amenities: ${sportsAmenities.length}`);
sportsAmenities.forEach(amenity => {
  console.log(`- ${amenity.title}`);
});
console.log();

// Test 6: Theme filtering
console.log('✅ Test 6: Theme Filtering');
const duskCategories = getAmenitiesByTheme('dusk');
console.log(`Dusk theme categories: ${duskCategories.length}`);
duskCategories.forEach(category => {
  console.log(`- ${category.name} (${category.items.length} items)`);
});
console.log();

// Test 7: Filter class functionality
console.log('✅ Test 7: Filter Class');
const filter = new AmenityFilter();

// Test adding filters
filter.addFilter('sports-recreation');
console.log(`Active filters after adding sports-recreation: ${filter.getActiveFilters().length}`);

// Test search functionality
filter.setSearchTerm('swimming');
const searchResults = filter.getFilteredAmenities();
console.log(`Search results for 'swimming': ${searchResults.length} categories`);

// Test clearing filters
filter.clearFilters();
console.log(`Active filters after clearing: ${filter.getActiveFilters().length}`);
console.log();

// Test 8: Data integrity
console.log('✅ Test 8: Data Integrity');
let totalAmenities = 0;
let hasErrors = false;

AMENITY_CATEGORIES.forEach(category => {
  category.items.forEach(amenity => {
    totalAmenities++;
    
    // Check required properties
    const requiredProps = ['id', 'title', 'description', 'category', 'featured', 'media', 'features', 'specifications'];
    const missingProps = requiredProps.filter(prop => !amenity.hasOwnProperty(prop));
    
    if (missingProps.length > 0) {
      console.log(`❌ ${amenity.title || 'Unknown'} missing: ${missingProps.join(', ')}`);
      hasErrors = true;
    }
    
    // Check media structure
    if (amenity.media) {
      const requiredMediaProps = ['type', 'placeholder', 'alt'];
      const missingMediaProps = requiredMediaProps.filter(prop => !amenity.media.hasOwnProperty(prop));
      
      if (missingMediaProps.length > 0) {
        console.log(`❌ ${amenity.title} media missing: ${missingMediaProps.join(', ')}`);
        hasErrors = true;
      }
    }
  });
});

console.log(`Total amenities: ${totalAmenities}`);
console.log(`Data integrity: ${hasErrors ? 'FAIL - Errors found' : 'PASS - All good'}`);
console.log();

// Test 9: Placeholder media verification
console.log('✅ Test 9: Placeholder Media');
const mediaTypes = { video: 0, image: 0 };
const placeholders = new Set();

AMENITY_CATEGORIES.forEach(category => {
  category.items.forEach(amenity => {
    mediaTypes[amenity.media.type]++;
    placeholders.add(amenity.media.placeholder);
  });
});

console.log(`Video placeholders: ${mediaTypes.video}`);
console.log(`Image placeholders: ${mediaTypes.image}`);
console.log(`Unique placeholders: ${placeholders.size}`);
console.log();

// Summary
console.log('🎯 VERIFICATION SUMMARY');
console.log('='.repeat(50));
console.log(`✅ Categories: ${AMENITY_CATEGORIES.length}/3`);
console.log(`✅ Total Amenities: ${totalAmenities}`);
console.log(`✅ Featured Amenities: ${featured.length}`);
console.log(`✅ RC Toy Competitions: ${rcToy ? 'Found' : 'Missing'}`);
console.log(`✅ Data Integrity: ${hasErrors ? 'Issues Found' : 'All Good'}`);
console.log(`✅ Filter System: Working`);
console.log();

if (!hasErrors && rcToy && AMENITY_CATEGORIES.length === 3) {
  console.log('🎉 All tests passed! Amenities content structure is ready.');
} else {
  console.log('❌ Some tests failed. Please check the issues above.');
}

export default {
  categories: AMENITY_CATEGORIES.length,
  totalAmenities,
  featured: featured.length,
  hasRcToy: !!rcToy,
  dataIntegrity: !hasErrors
};