import { gsap } from 'gsap';
import SplitType from 'split-type';

export function initIntro() {
  const intro = document.getElementById('intro');
  if (!intro) return;

  const startBtn = document.getElementById('startBtn');
  const dot = document.getElementById('dotCursor');

  // --- Sticky cursor (forked variant) ---
  const math = { lerp: (a, b, n) => (1 - n) * a + n * b };

  class StickyCursor {
    constructor() {
      this.el = dot; // element with data-cursor
      this.stickies = [...document.querySelectorAll('[data-hover]')];
      this.data = {
        mouse: { x: 0, y: 0 },
        current: { x: 0, y: 0 },
        last: { x: 0, y: 0 },
        ease: 0.15,
        dist: 40,
      };
      this.state = { stick: false };
      this.getTargets();
      window.addEventListener('mousemove', this.onMouseMove.bind(this), { passive: true });
      requestAnimationFrame(this.run.bind(this));
    }

    onMouseMove(e) {
      this.data.mouse.x = e.clientX;
      this.data.mouse.y = e.clientY;
      this.data.current.x = e.clientX;
      this.data.current.y = e.clientY;
    }

    getTargets() {
      this.targets = this.stickies.map((el) => {
        const bounds = el.getBoundingClientRect();
        return {
          el,
          x: bounds.left + bounds.width / 2,
          y: bounds.top + bounds.height / 2,
          minus: bounds.width / 2 + 10,
        };
      });
    }

    stick(target) {
      const dx = target.x - this.data.mouse.x;
      const dy = target.y - this.data.mouse.y;
      const h = Math.hypot(dx, dy);
      if (h < this.data.dist && !this.state.stick) {
        this.state.stick = true;
        this.data.ease = 0.075;
        this.data.current.x = target.x - target.minus;
        this.data.current.y = target.y;
        this.el.classList.add('is-active');
      } else if (this.state.stick && h >= this.data.dist) {
        this.state.stick = false;
        this.data.ease = 0.15;
        this.el.classList.remove('is-active');
      }
    }

    run() {
      this.targets.forEach((t) => this.stick(t));
      // move instantly (no lag)
      this.data.last.x = this.data.current.x;
      this.data.last.y = this.data.current.y;
      const offsetX = this.el.offsetWidth / 2;
      const offsetY = this.el.offsetHeight / 2;
      this.el.style.transform = `translate3d(${this.data.last.x - offsetX}px, ${this.data.last.y - offsetY}px,0)`;
      requestAnimationFrame(this.run.bind(this));
    }
  }

  new StickyCursor();

    // load and animate SVG logos
  const logoContainer = document.getElementById('logoContainer');
  const svgFiles = ['/logos/company.svg'];

  Promise.all(svgFiles.map((src) => fetch(src).then((r) => r.text()))).then((texts) => {
    texts.forEach((txt, idx) => {
      logoContainer.insertAdjacentHTML('beforeend', txt);
      const svg = logoContainer.lastElementChild;
      svg.classList.add('svgLogo');
      svg.style.width = '100%';
      svg.style.height = 'auto';
      // ensure visible fill colour
      svg.querySelectorAll('*').forEach(el=>{
        if(!el.getAttribute('fill') || el.getAttribute('fill')==='none'){
          el.setAttribute('fill','#000');
        }
      });
      svg.setAttribute('preserveAspectRatio', 'xMidYMid meet');

      // scale larger and invisible initially
      gsap.set(svg, { opacity: 0, scale:1.4, transformOrigin:'center' });

      // create stroke clone
      const strokeSvg = svg.cloneNode(true);
      gsap.set(strokeSvg,{scale:1.4,transformOrigin:'center'});
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
