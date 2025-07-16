import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { initContactForm } from '../contact.js';

describe('Contact form', () => {
  beforeEach(() => {
    document.body.innerHTML = `
      <form id="contactForm">
        <input name="name" value="John" />
        <input name="email" value="john@example.com" />
        <textarea name="message">hi</textarea>
        <button type="submit"></button>
        <p data-status></p>
      </form>`;
    global.fetch = vi.fn(() => Promise.resolve({ ok: true }));
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.useRealTimers();
  });

  it('shows success text after submit', async () => {
    initContactForm();
    
    // Trigger form submission
    const form = document.querySelector('#contactForm');
    const submitEvent = new Event('submit', { bubbles: true, cancelable: true });
    form.dispatchEvent(submitEvent);
    
    // Wait for async operations to complete
    await vi.runAllTimersAsync();
    
    expect(document.querySelector('[data-status]').textContent).toMatch(/thank you/i);
  });
});
