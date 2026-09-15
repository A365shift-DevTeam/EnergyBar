import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

let lenis: Lenis | null = null;

export function startSmoothScroll() {
  if (lenis || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return () => {};

  // Touch devices keep native momentum scrolling (Lenis default); wheel and keyboard get smoothed.
  lenis = new Lenis({ autoRaf: true, lerp: 0.1 });

  return () => {
    lenis?.destroy();
    lenis = null;
  };
}

export function scrollToSection(id: string) {
  const target =
    document.getElementById(id) ||
    (id === 'story' ? document.getElementById('story-desktop') : null);
  if (!target) return;

  const offset = document.querySelector('nav')?.offsetHeight ?? 64;

  if (lenis) {
    const instance = lenis;
    // Deferred sections (content-visibility: auto) change height as they render mid-scroll,
    // so re-aim once the first pass lands.
    const settle = (attempt: number) => {
      const drift = target.getBoundingClientRect().top - offset;
      if (Math.abs(drift) > 2 && attempt < 3 && instance === lenis) {
        instance.scrollTo(target, { offset: -offset, duration: 0.5, onComplete: () => settle(attempt + 1) });
      }
    };
    instance.scrollTo(target, { offset: -offset, onComplete: () => settle(0) });
  } else {
    const top = target.getBoundingClientRect().top + window.scrollY - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}
