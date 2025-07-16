// Test setup file for Vitest
import { vi } from 'vitest'

// Mock GSAP for testing
vi.mock('gsap', () => ({
  gsap: {
    registerPlugin: vi.fn(),
    set: vi.fn(),
    to: vi.fn(),
    from: vi.fn(),
    timeline: vi.fn(() => ({
      to: vi.fn(),
      from: vi.fn(),
      set: vi.fn(),
    })),
    ticker: {
      add: vi.fn(),
      lagSmoothing: vi.fn(),
    },
  },
  ScrollTrigger: {
    create: vi.fn(),
    refresh: vi.fn(),
    getAll: vi.fn(() => []),
  },
}))

// Mock Lenis smooth scroll
vi.mock('@studio-freight/lenis', () => ({
  default: vi.fn().mockImplementation(() => ({
    on: vi.fn(),
    raf: vi.fn(),
    scrollTo: vi.fn(),
    destroy: vi.fn(),
  })),
}))

// Mock SplitType
vi.mock('split-type', () => ({
  default: vi.fn().mockImplementation(() => ({
    chars: [],
    words: [],
    lines: [],
  })),
}))

// Mock imagesLoaded
vi.mock('imagesloaded', () => ({
  default: vi.fn((element, callback) => {
    if (typeof callback === 'function') {
      setTimeout(callback, 0)
    }
    return {
      on: vi.fn(),
    }
  }),
}))

// Mock Leaflet for map testing
vi.mock('leaflet', () => ({
  map: vi.fn(() => ({
    setView: vi.fn(),
    addLayer: vi.fn(),
    remove: vi.fn(),
  })),
  tileLayer: vi.fn(() => ({
    addTo: vi.fn(),
  })),
  marker: vi.fn(() => ({
    addTo: vi.fn(),
    bindPopup: vi.fn(),
  })),
}))

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
}
vi.stubGlobal('localStorage', localStorageMock)

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: vi.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
})

// Mock IntersectionObserver
global.IntersectionObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock ResizeObserver
global.ResizeObserver = vi.fn().mockImplementation(() => ({
  observe: vi.fn(),
  unobserve: vi.fn(),
  disconnect: vi.fn(),
}))

// Mock requestAnimationFrame
global.requestAnimationFrame = vi.fn(cb => setTimeout(cb, 16))
global.cancelAnimationFrame = vi.fn()

// Setup DOM testing utilities
beforeEach(() => {
  // Clear all mocks before each test
  vi.clearAllMocks()
  
  // Reset localStorage mock
  localStorageMock.getItem.mockReturnValue(null)
  
  // Reset document body
  document.body.innerHTML = ''
  document.head.innerHTML = ''
})

// Global test utilities
global.createMockElement = (tag = 'div', attributes = {}) => {
  const element = document.createElement(tag)
  Object.entries(attributes).forEach(([key, value]) => {
    element.setAttribute(key, value)
  })
  return element
}

global.waitFor = (ms = 0) => new Promise(resolve => setTimeout(resolve, ms))

// Console error suppression for expected errors in tests
const originalError = console.error
beforeAll(() => {
  console.error = (...args) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render is no longer supported')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})