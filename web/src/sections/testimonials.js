import { gsap } from 'gsap';

export function initTestimonialsMarquee() {
  const container = document.querySelector('[data-testimonials]');
  if (!container) return;
  const track = container.querySelector('[data-track]');
  if (!track) return;

  // Clone children to create seamless loop
  const items = Array.from(track.children);
  items.forEach((item) => {
    const clone = item.cloneNode(true);
    clone.setAttribute('aria-hidden', 'true');
    track.appendChild(clone);
  });

  const totalWidth = track.scrollWidth / 2; // original width
  const duration = 20;

  gsap.to(track, {
    x: -totalWidth,
    ease: 'none',
    duration,
    repeat: -1,
  });
}
