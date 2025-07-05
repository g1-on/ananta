import { describe, it, expect, beforeEach, vi } from 'vitest';
import { initStatsCounters } from '../stats.js';

function tickRAF(frames = 120) {
  for (let i = 0; i < frames; i++) {
    vi.advanceTimersByTime(16);
  }
}

describe('Stats Counters', () => {
  beforeEach(() => {
    document.body.innerHTML = '<span data-counter="1000">0</span>';
    global.IntersectionObserver = class {
      constructor(cb) { this.cb = cb; }
      observe(el) { this.cb([{ target: el, isIntersecting: true }], this); }
      unobserve() {}
      disconnect() {}
    };
    vi.useFakeTimers();
  });

  it('counts up to target value', () => {
    initStatsCounters();
    tickRAF();
    expect(document.querySelector('[data-counter]').textContent).toBe('1,000');
  });
});
