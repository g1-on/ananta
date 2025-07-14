import { gsap } from 'gsap';
import SplitType from 'split-type';

export function initIntro() {
  const intro = document.getElementById('intro');
  if (!intro) return;

  const startBtn   = document.getElementById('startBtn');
  const logoHolder = document.getElementById('logoContainer');
  let logoSvg = null;
  const dot        = document.getElementById('dotCursor');

  /* -------------------------------------------------------------
     1. Exact-follow custom cursor (arrow hidden via CSS)
  ------------------------------------------------------------- */
  dot.style.position  = 'fixed';
  dot.style.transform = 'translate(-50%, -50%)';
  window.addEventListener('mousemove', (e) => {
    dot.style.left = `${e.clientX}px`;
    dot.style.top  = `${e.clientY}px`;
  });

  /* -------------------------------------------------------------
     2. Load single company logo then fade in (no delay)
  ------------------------------------------------------------- */
  fetch('/logos/company.svg')
    .then((r) => r.text())
    .then((svgText) => {
      logoHolder.innerHTML = svgText;
      const svg = logoHolder.firstElementChild;
      if (svg) {
        svg.style.width  = '100%';
        svg.style.height = 'auto';
        svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');
        gsap.set(svg, { opacity: 1 });
        logoSvg = svg;
      }
    });

  /* -------------------------------------------------------------
     3. Click → logo shrink then circular mask reveal
  ------------------------------------------------------------- */
  startBtn.addEventListener('click', () => {
    // a) explode tagline text
    const split = new SplitType('#tagline', { types: 'chars' });
    gsap.fromTo(
      split.chars,
      { scale: 1,   opacity: 1 },
      { scale: 1.6, opacity: 0, duration: 0.6, stagger: 0.02, ease: 'power2.in' }
    );

    // b) shrink logo quickly, then expand mask
    const bounds = logoHolder.getBoundingClientRect();
    const cx = bounds.left + bounds.width  / 2;
    const cy = bounds.top  + bounds.height / 2;

    const tl = gsap.timeline({ defaults: { ease: 'power4.inOut' } });
    // shrink the entire logo container first
    tl.to(logoHolder, { scale: 0, duration: 0.3, transformOrigin: 'center center' });

    // create white mask overlay
    const mask = document.createElement('div');
    mask.style.position = 'fixed';
    mask.style.inset = '0';
    mask.style.background = '#ffffff';
    mask.style.zIndex = '60';
    document.body.appendChild(mask);

    tl.set(mask, { clipPath: `circle(0px at ${cx}px ${cy}px)` })
      .to(mask, { clipPath: `circle(150% at ${cx}px ${cy}px)`, duration: 0.9 })
      .add(() => {
        intro.remove();
        mask.remove();
        document.body.style.overflow = 'auto';
      });
  });
}
