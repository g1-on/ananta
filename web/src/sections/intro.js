import { gsap } from 'gsap';

export function initIntro() {
  const intro = document.getElementById('intro');
  if (!intro) return;

  const startBtn = document.getElementById('startBtn');
  const dot = document.getElementById('dotCursor');

  // follow cursor with slight delay
  let pos = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  window.addEventListener('mousemove', (e) => {
    pos.x = e.clientX;
    pos.y = e.clientY;
  });
  gsap.ticker.add(() => {
    gsap.to(dot, {
      x: pos.x - dot.offsetWidth / 2,
      y: pos.y - dot.offsetHeight / 2,
      duration: 0.15,
      ease: 'power2.out',
      overwrite: true,
    });
  });

  // subtle logo animation pulsing
  const logo = startBtn.querySelector('img');
  if (logo) {
    gsap.to(logo, { scale: 1.07, duration: 1.5, yoyo: true, repeat: -1, ease: 'sine.inOut' });
  }

  startBtn.addEventListener('click', () => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.inOut' } });
    tl.to(startBtn, { scale: 20, duration: 1 })
      .to(intro, { opacity: 0, duration: 0.6 }, '-=0.4')
      .set(intro, { display: 'none' })
      .set(document.body, { overflow: 'auto' });
  });
}
