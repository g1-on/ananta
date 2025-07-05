import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export function initAmenitiesScroll() {
  const container = document.querySelector('[data-amenities-scroll]');
  if (!container) return;

  // Only run on medium screens and up
  if (window.innerWidth < 768) return;

  const wrapper = container.querySelector('[data-scroll-track]');
  const totalWidth = wrapper.scrollWidth;

  gsap.to(wrapper, {
    x: () => -(totalWidth - container.clientWidth),
    ease: 'none',
    scrollTrigger: {
      trigger: container,
      start: 'top top',
      end: () => `+=${totalWidth}`,
      scrub: true,
      pin: true,
      anticipatePin: 1,
    },
  });
}
