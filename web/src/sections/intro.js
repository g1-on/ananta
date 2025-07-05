import { gsap } from 'gsap';
import SplitType from 'split-type';

export function initIntro() {
  const intro = document.getElementById('intro');
  if (!intro) return;

  const startBtn = document.getElementById('startBtn');
  const dot = document.getElementById('dotCursor');

  // follow cursor with slight delay
  let pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let currentX = pos.x;
  let currentY = pos.y;
  window.addEventListener('mousemove', (e) => {
    pos.x = e.clientX;
    pos.y = e.clientY;
  });
  const qx = gsap.quickSetter(dot,'x','px');
  const qy = gsap.quickSetter(dot,'y','px');
  gsap.ticker.add(() => {
    currentX += (pos.x - currentX) * 0.2;
    currentY += (pos.y - currentY) * 0.2;
    qx(currentX - dot.offsetWidth/2);
    qy(currentY - dot.offsetHeight/2);
  });

    // load and animate SVG logos
  const logoContainer = document.getElementById('logoContainer');
  const svgFiles = [
    '/logos/ananta.svg',
    '/logos/company.svg',
  ];

  Promise.all(svgFiles.map((src) => fetch(src).then((r) => r.text()))).then((texts) => {
    texts.forEach((txt, idx) => {
      logoContainer.insertAdjacentHTML('beforeend', txt);
      const svg = logoContainer.lastElementChild;
      svg.classList.add('svgLogo');
      svg.style.width = '100%';
      svg.style.height = 'auto';
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

      // make fill version invisible initially
      gsap.set(svg, { opacity: 0 });

      // create stroke clone
      const strokeSvg = svg.cloneNode(true);
      strokeSvg.classList.add('strokeLogo');
      strokeSvg.querySelectorAll('*').forEach((el) => {
        el.setAttribute('fill', 'none');
        el.setAttribute('stroke', '#000');
        el.setAttribute('stroke-width', '4');
      });
      logoContainer.insertBefore(strokeSvg, svg);

      // animate paths
      const paths = strokeSvg.querySelectorAll('path, polygon, line, polyline, circle, rect');
      paths.forEach((p) => {
        const len = typeof p.getTotalLength === 'function' ? p.getTotalLength() : 1000;
        gsap.set(p, { strokeDasharray: len, strokeDashoffset: len });
      });
      gsap.to(paths, {
        strokeDashoffset: 0,
        duration: 2,
        stagger: 0.01,
        ease: 'none',
        onComplete: () => {
          gsap.to(svg, { opacity: 1, duration: 0.6 });
          gsap.to(strokeSvg, { opacity: 0, duration: 0.6, delay: 0.3 });
        },
      });
    });
  });

  startBtn.addEventListener('click', () => {
    // tagline explode animation
    const split = new SplitType('#tagline', { types: 'chars' });
    gsap.fromTo(split.chars, {scale:1, opacity:1}, {scale:1.6, opacity:0, duration:0.6, stagger:0.02, ease:'power2.in'});

    const tl = gsap.timeline({ defaults: { ease: 'power4.inOut' }, delay:0.6 });
    tl.to(startBtn, { scale: 20, duration: 1 })
      .to(intro, { opacity: 0, duration: 0.6 }, '-=0.4')
      .set(intro, { display: 'none' })
      .set(document.body, { overflow: 'auto' });
  });
}
