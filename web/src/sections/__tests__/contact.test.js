import { describe, it, expect, beforeEach, vi } from 'vitest';
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
  });

  it('shows success text after submit', async () => {
    initContactForm();
    document.querySelector('button').click();
    await vi.runAllTicks();
    expect(document.querySelector('[data-status]').textContent).toMatch(/thank you/i);
  });
});
