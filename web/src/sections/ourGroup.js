export function initOurGroupReveal() {
  const items = document.querySelectorAll('[data-group-item]');
  if (!items.length) return;

  const obs = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.2 }
  );

  items.forEach((el) => obs.observe(el));
}
