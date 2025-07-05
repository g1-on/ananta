import { describe, it, beforeEach, expect } from 'vitest';
import { initOurGroupReveal } from '../ourGroup.js';

describe('Our Group reveal', () => {
  beforeEach(() => {
    document.body.innerHTML = '<div data-group-item class="opacity-0 translate-y-6"></div>';
    global.IntersectionObserver = class {
      constructor(cb) { this.cb = cb; }
      observe(el) { this.cb([{ target: el, isIntersecting: true }], this); }
      unobserve() {}
    };
  });

  it('reveals on intersect', () => {
    initOurGroupReveal();
    const el = document.querySelector('[data-group-item]');
    expect(el.classList.contains('opacity-100')).toBe(true);
  });
});
