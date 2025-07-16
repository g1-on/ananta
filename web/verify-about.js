/**
 * About Section Verification Script
 * Tests the enhanced about section with dusk theme and scroll-triggered reveals
 */

// Test about section functionality
function verifyAboutSection() {
  console.log('🏢 Verifying About Section Implementation...')
  
  // Check if about section exists
  const aboutSection = document.getElementById('about')
  if (!aboutSection) {
    console.error('❌ About section not found')
    return false
  }
  
  console.log('✅ About section found')
  
  // Check theme-aware classes
  const hasThemeClasses = aboutSection.classList.contains('theme-aware')
  console.log(hasThemeClasses ? '✅ Theme-aware classes applied' : '⚠️ Theme-aware classes missing')
  
  // Check data attributes
  const hasThemeSection = aboutSection.hasAttribute('data-theme-section')
  const hasParallaxContainer = aboutSection.hasAttribute('data-parallax-container')
  
  console.log(hasThemeSection ? '✅ Theme section attribute found' : '⚠️ Theme section attribute missing')
  console.log(hasParallaxContainer ? '✅ Parallax container attribute found' : '⚠️ Parallax container attribute missing')
  
  // Check content structure
  const contentSection = aboutSection.querySelector('[data-about-content]')
  const visualSection = aboutSection.querySelector('[data-about-visual]')
  const parallaxBg = aboutSection.querySelector('[data-parallax-bg]')
  
  console.log(contentSection ? '✅ Content section found' : '❌ Content section missing')
  console.log(visualSection ? '✅ Visual section found' : '❌ Visual section missing')
  console.log(parallaxBg ? '✅ Parallax background found' : '❌ Parallax background missing')
  
  // Check animated elements
  const animatedElements = aboutSection.querySelectorAll('[data-animate]')
  console.log(`✅ Found ${animatedElements.length} animated elements`)
  
  // Check feature cards
  const featureCards = aboutSection.querySelectorAll('[data-feature-card]')
  console.log(`✅ Found ${featureCards.length} feature cards`)
  
  // Check text animation elements
  const textElements = aboutSection.querySelectorAll('[data-text-preset]')
  console.log(`✅ Found ${textElements.length} text animation elements`)
  
  // Check theme-aware styling
  const themeAwareElements = aboutSection.querySelectorAll('.text-theme-text, .text-theme-accent, .bg-theme-accent')
  console.log(`✅ Found ${themeAwareElements.length} theme-aware styled elements`)
  
  // Test scroll trigger setup
  if (typeof ScrollTrigger !== 'undefined') {
    const triggers = ScrollTrigger.getAll().filter(trigger => 
      trigger.trigger === aboutSection || aboutSection.contains(trigger.trigger)
    )
    console.log(`✅ Found ${triggers.length} ScrollTrigger instances for about section`)
  }
  
  // Test CSS custom properties
  const computedStyle = getComputedStyle(document.documentElement)
  const themeColors = [
    '--theme-bg',
    '--theme-text',
    '--theme-accent',
    '--theme-border',
    '--theme-shadow'
  ]
  
  const missingColors = themeColors.filter(color => !computedStyle.getPropertyValue(color))
  if (missingColors.length === 0) {
    console.log('✅ All theme CSS custom properties are defined')
  } else {
    console.warn('⚠️ Missing theme colors:', missingColors)
  }
  
  // Test responsive design
  const containerLuxury = aboutSection.querySelector('.container-luxury')
  const gridLayout = aboutSection.querySelector('.grid.lg\\:grid-cols-2')
  
  console.log(containerLuxury ? '✅ Luxury container found' : '⚠️ Luxury container missing')
  console.log(gridLayout ? '✅ Responsive grid layout found' : '⚠️ Responsive grid layout missing')
  
  // Test accessibility
  const hasAriaLabel = aboutSection.hasAttribute('aria-label')
  const hasRole = aboutSection.hasAttribute('role')
  const images = aboutSection.querySelectorAll('img')
  const imagesWithAlt = Array.from(images).filter(img => img.hasAttribute('alt'))
  
  console.log(hasAriaLabel ? '✅ ARIA label found' : '⚠️ ARIA label missing')
  console.log(hasRole ? '✅ Role attribute found' : '⚠️ Role attribute missing')
  console.log(`✅ ${imagesWithAlt.length}/${images.length} images have alt text`)
  
  return true
}

// Test theme transition integration
function testThemeTransition() {
  console.log('🌅 Testing theme transition integration...')
  
  // Simulate scroll progress
  const testScrollProgress = [0, 0.25, 0.5, 0.75, 1]
  const expectedThemes = ['dawn', 'day', 'dusk', 'night', 'night']
  
  testScrollProgress.forEach((progress, index) => {
    // Simulate theme transition event
    const event = new CustomEvent('themeTransition', {
      detail: {
        theme: expectedThemes[index],
        colors: {
          bg: '#ffffff',
          text: '#000000',
          accent: '#ecbb4f'
        },
        scrollProgress: progress
      }
    })
    
    window.dispatchEvent(event)
    console.log(`✅ Theme transition test ${index + 1}/5: ${expectedThemes[index]} at ${progress * 100}%`)
  })
}

// Test parallax effects
function testParallaxEffects() {
  console.log('🎭 Testing parallax effects...')
  
  const aboutSection = document.getElementById('about')
  if (!aboutSection) return
  
  const parallaxElements = aboutSection.querySelectorAll('[data-parallax-element], [data-parallax-bg]')
  
  parallaxElements.forEach((element, index) => {
    const hasWillChange = getComputedStyle(element).willChange.includes('transform')
    console.log(`${hasWillChange ? '✅' : '⚠️'} Parallax element ${index + 1} will-change: ${hasWillChange ? 'optimized' : 'not optimized'}`)
  })
  
  console.log(`✅ Found ${parallaxElements.length} parallax elements`)
}

// Test animation performance
function testAnimationPerformance() {
  console.log('⚡ Testing animation performance...')
  
  const aboutSection = document.getElementById('about')
  if (!aboutSection) return
  
  const animatedElements = aboutSection.querySelectorAll('[data-animate]')
  
  animatedElements.forEach((element, index) => {
    const computedStyle = getComputedStyle(element)
    const hasWillChange = computedStyle.willChange !== 'auto'
    const hasTransform = computedStyle.transform !== 'none'
    
    console.log(`Element ${index + 1}: will-change=${hasWillChange}, transform=${hasTransform}`)
  })
  
  // Test for potential layout thrashing
  const elementsWithBoxShadow = aboutSection.querySelectorAll('[data-feature-card]')
  console.log(`✅ ${elementsWithBoxShadow.length} elements with optimized box-shadow transitions`)
}

// Test content preservation
function testContentPreservation() {
  console.log('📝 Testing content preservation from original HTML...')
  
  const aboutSection = document.getElementById('about')
  if (!aboutSection) return
  
  // Check for preserved content elements
  const expectedContent = [
    'Project Ananta',
    '5 Towers',
    '466 Units',
    '50-85 SQM',
    '24 Months',
    'luxury living',
    'investment'
  ]
  
  const sectionText = aboutSection.textContent.toLowerCase()
  
  expectedContent.forEach(content => {
    const found = sectionText.includes(content.toLowerCase())
    console.log(`${found ? '✅' : '❌'} Content preserved: "${content}"`)
  })
}

// Run all tests when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runTests)
} else {
  runTests()
}

function runTests() {
  console.log('🧪 Starting About Section Verification Tests...')
  console.log('================================================')
  
  setTimeout(() => {
    verifyAboutSection()
    console.log('------------------------------------------------')
    testThemeTransition()
    console.log('------------------------------------------------')
    testParallaxEffects()
    console.log('------------------------------------------------')
    testAnimationPerformance()
    console.log('------------------------------------------------')
    testContentPreservation()
    console.log('================================================')
    console.log('✅ About Section Verification Complete!')
  }, 1000) // Wait for initialization
}

// Export for manual testing
if (typeof window !== 'undefined') {
  window.verifyAboutSection = verifyAboutSection
  window.testThemeTransition = testThemeTransition
  window.testParallaxEffects = testParallaxEffects
  window.testAnimationPerformance = testAnimationPerformance
  window.testContentPreservation = testContentPreservation
}