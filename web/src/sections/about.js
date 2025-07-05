export function initAboutReveal() {
  const aboutSection = document.getElementById('about');
  if (!aboutSection) return;

  const listItems = aboutSection.querySelectorAll('[data-list-item]');
  const img = aboutSection.querySelector('[data-fade-img]');

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('translate-x-0', 'opacity-100');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2, rootMargin: '0px 0px -20% 0px' }
  );

  listItems.forEach((li) => {
    obs.observe(li);
  });

  // simple cross-fade when section enters view
  if (img) {
    const imgObserver = new IntersectionObserver(
      (entries) => {
        const [entry] = entries;
        if (entry.isIntersecting) {
          img.classList.add('opacity-100', 'scale-100');
          imgObserver.disconnect();
        }
      },
      { threshold: 0.3 }
    );
    imgObserver.observe(img);
  }
}
