import Lenis from '@studio-freight/lenis';
import { gsap } from 'gsap';
import SplitType from 'split-type';
import imagesLoaded from 'imagesloaded';
import { initStatsCounters } from './sections/stats.js';
import { initAboutReveal } from './sections/about.js';
import { initAmenitiesScroll } from './sections/amenities.js';
import { initTestimonialsMarquee } from './sections/testimonials.js';

// Tailwind CSS is imported via link tag.

// init Lenis
const lenis = new Lenis({
  lerp: 0.1,
  smooth: true,
});
function raf(time) {
  lenis.raf(time);
  requestAnimationFrame(raf);
}
requestAnimationFrame(raf);

// Wait for images before starting animations
imagesLoaded(document.body, { background: true }, () => {
  document.body.classList.add('loaded');

  // SplitText
  document.querySelectorAll('.headline').forEach((el) => {
    const split = new SplitType(el, { types: 'chars' });
    gsap.from(split.chars, {
      y: 80,
      opacity: 0,
      stagger: 0.03,
      duration: 1.2,
      ease: 'power4.out',
    });
    initStatsCounters();
  initAboutReveal();
  initAmenitiesScroll();
  initTestimonialsMarquee();
});
});
