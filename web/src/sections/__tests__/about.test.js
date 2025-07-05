import { describe, it, expect, beforeEach } from 'vitest';
import { initAboutReveal } from '../about.js';

describe('About reveal', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <section id="about">
        <li data-list-item class="opacity-0 -translate-x-6"></li>
      </section>`;
    global.IntersectionObserver = class {
      constructor(cb) { this.cb = cb; }
      observe(el) { this.cb([{ target: el, isIntersecting: true }], this); }
      unobserve() {}
      disconnect() {}
    };
  });

  it('adds reveal classes on intersect', () => {
    initAboutReveal();
    const li = document.querySelector('[data-list-item]');
    expect(li.classList.contains('opacity-100')).toBe(true);
  });
});
