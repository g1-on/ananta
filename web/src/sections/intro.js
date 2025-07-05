import { gsap } from 'gsap';

export function initIntro() {
  const intro = document.getElementById('intro');
  if (!intro) return;

  const startBtn = document.getElementById('startBtn');
  const dot = document.getElementById('dotCursor');

  // follow cursor
  const setX = gsap.quickSetter(dot, 'x', 'px');
  const setY = gsap.quickSetter(dot, 'y', 'px');
  let mouseX = 0;
  let mouseY = 0;
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
  });
  gsap.ticker.add(() => {
    setX(mouseX - 8); // center
    setY(mouseY - 8);
  });

  startBtn.addEventListener('click', () => {
    const tl = gsap.timeline({ defaults: { ease: 'power4.inOut' } });
    tl.to(startBtn, { scale: 20, duration: 1 })
      .to(intro, { opacity: 0, duration: 0.6 }, '-=0.4')
      .set(intro, { display: 'none' })
      .set(document.body, { overflow: 'auto' });
  });
}
