import { gsap } from 'gsap';
import SplitType from 'split-type';

export function initIntro() {
  const intro = document.getElementById('intro');
  if (!intro) return;

  const startBtn   = document.getElementById('startBtn');
  const logoHolder = document.getElementById('logoContainer');
  const dot        = document.getElementById('dotCursor');

  /* ------------------------------------------------------------------
     1. Exact-follow custom cursor
  ------------------------------------------------------------------ */
  dot.style.position  = 'fixed';
  dot.style.transform = 'translate(-50%, -50%)'; // keep centre aligned
  window.addEventListener('mousemove', (e) => {
    dot.style.left = `${e.clientX}px`;
    dot.style.top  = `${e.clientY}px`;
  });

  /* ------------------------------------------------------------------
     2. Load one company logo and fade it in
  ------------------------------------------------------------------ */
  fetch('/logos/company.svg')
    .then((r) => r.text())
    .then((svgText) => {
      logoHolder.innerHTML = svgText;
      const svg = logoHolder.firstElementChild;
      if (svg) {
        svg.style.width  = '100%';
        svg.style.height = 'auto';
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        gsap.fromTo(svg, { opacity: 0 }, { opacity: 1, duration: 1 });
      }
    });

  /* ------------------------------------------------------------------
     3. Click animation – tagline explode, overlay fade
  ------------------------------------------------------------------ */
  startBtn.addEventListener('click', () => {
    const split = new SplitType('#tagline', { types: 'chars' });
    gsap.fromTo(
      split.chars,
      { scale: 1,   opacity: 1 },
      { scale: 1.6, opacity: 0, duration: 0.6, stagger: 0.02, ease: 'power2.in' }
    );

    gsap.timeline({ defaults: { ease: 'power4.inOut' }, delay: 0.6 })
      .to(startBtn, { scale: 20, duration: 1 })
      .to(intro,    { opacity: 0, duration: 0.6 }, '-=0.4')
      .set(intro,   { display: 'none' })
      .set(document.body, { overflow: 'auto' });
  });
}
