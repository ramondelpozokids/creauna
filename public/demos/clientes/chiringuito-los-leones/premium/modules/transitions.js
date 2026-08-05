/**
 * Premium transitions only for .ll-* nodes — does not alter existing animations.
 */
export function initTransitions() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.querySelectorAll('.ll-section .ll-container > *, .ll-panel, .ll-imenu__card, .ll-timeline__item, .ll-tour, .ll-smartform').forEach((node) => {
    if (!node.classList.contains('ll-reveal')) node.classList.add('ll-reveal');
  });

  if (reduce) {
    document.querySelectorAll('.ll-reveal').forEach((n) => n.classList.add('is-visible'));
    return;
  }

  const obs = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.ll-reveal').forEach((n) => obs.observe(n));

  // Very light parallax on marked premium media only
  const paras = Array.from(document.querySelectorAll('.ll-parallax'));
  if (!paras.length) return;

  let ticking = false;
  const onScroll = () => {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(() => {
      const vh = window.innerHeight;
      paras.forEach((node) => {
        const rect = node.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh) return;
        const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
        node.style.transform = `translate3d(0, ${progress * -12}px, 0)`;
      });
      ticking = false;
    });
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

/** Re-scan after dynamic injections */
export function refreshTransitions(root = document) {
  root.querySelectorAll('.ll-section .ll-panel, .ll-imenu__card, .ll-timeline__item').forEach((node) => {
    if (!node.classList.contains('ll-reveal')) {
      node.classList.add('ll-reveal');
    }
  });
  initTransitions();
}
