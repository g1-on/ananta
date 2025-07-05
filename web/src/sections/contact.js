export function initContactForm() {
  const form = document.querySelector('#contactForm');
  if (!form) return;

  const status = form.querySelector('[data-status]');

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    status.textContent = 'Sending...';

    try {
      const res = await fetch('/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Network');
      status.textContent = 'Thank you! We will reach out soon.';
      form.reset();
    } catch (err) {
      status.textContent = 'Failed to send. Please try again later.';
    }
  });
}
