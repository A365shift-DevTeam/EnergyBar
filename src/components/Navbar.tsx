import { useEffect, useState } from 'react';
import { Leaf, Menu, X, ArrowRight } from 'lucide-react';
import { useIsMobile } from '../hooks/useIsMobile';
import { scrollToSection as scrollToSmooth } from '../lib/smoothScroll';

const NAV_ITEMS = [
  { label: 'Home', id: 'hero' },
  { label: 'Story', id: 'story' },
  { label: 'Freshness', id: 'freshness' },
  { label: 'Craft', id: 'craft' },
] as const;

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [solid, setSolid] = useState(false);
  const isMobile = useIsMobile();

  // Stay transparent while the hero frame animation is still scrubbing.
  useEffect(() => {
    let animationFrame = 0;

    const update = () => {
      animationFrame = 0;
      const hero = document.getElementById('hero');
      if (!hero) return;
      const heroEnd = hero.offsetTop + hero.offsetHeight - window.innerHeight;
      setSolid(window.scrollY >= heroEnd - 1);
    };

    const requestUpdate = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(update);
    };

    window.addEventListener('scroll', requestUpdate, { passive: true });
    window.addEventListener('resize', requestUpdate, { passive: true });
    update();

    return () => {
      window.removeEventListener('scroll', requestUpdate);
      window.removeEventListener('resize', requestUpdate);
      if (animationFrame) window.cancelAnimationFrame(animationFrame);
    };
  }, [isMobile]);

  // On desktop the transparent bar floats over the dark full-screen frames.
  const onDark = !solid && !isMobile;

  const scrollToSection = (id: string) => {
    setMenuOpen(false);
    scrollToSmooth(id);
  };

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 h-[var(--nav-height)] border-b transition-[background-color,border-color,backdrop-filter] duration-500 ${
          solid
            ? 'bg-brand-surface/95 backdrop-blur-xl border-brand-border'
            : 'bg-transparent border-transparent'
        }`}
      >
        {onDark && (
          <div
            aria-hidden
            className="absolute inset-x-0 top-0 h-[180%] pointer-events-none bg-gradient-to-b from-black/35 to-transparent"
          />
        )}
        <div className="relative max-w-7xl mx-auto h-full px-4 sm:px-6 md:px-10 flex items-center justify-between">
          <button
            onClick={() => scrollToSection('hero')}
            className="flex items-center gap-2.5 min-h-11 active:opacity-70 transition-opacity"
          >
            <div className="w-7 h-7 rounded-md bg-brand-forest flex items-center justify-center shrink-0">
              <Leaf className="w-3.5 h-3.5 text-brand-accent" strokeWidth={1.5} />
            </div>
            <div className="flex flex-col leading-none text-left">
              <span
                className={`text-[12px] sm:text-[13px] font-display font-700 tracking-[0.1em] uppercase transition-colors duration-500 ${
                  onDark ? 'text-white' : 'text-brand-ink'
                }`}
              >
                Energy<span className="font-400 opacity-50">Bar</span>
              </span>
              <span
                className={`mt-0.5 text-[8px] sm:text-[9px] font-mono tracking-[0.35em] uppercase transition-colors duration-500 ${
                  onDark ? 'text-white/55' : 'text-brand-ink/45'
                }`}
              >
                Est. 2018
              </span>
            </div>
          </button>

          <div className="hidden md:flex items-center gap-7">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className={`text-[10px] font-mono uppercase tracking-[0.3em] transition-colors min-h-11 flex items-center ${
                  onDark ? 'text-white/65 hover:text-white' : 'text-brand-ink/45 hover:text-brand-ink'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-1.5 sm:gap-2">
            <button
              onClick={() => scrollToSection('story')}
              className="inline-flex items-center gap-1.5 px-3 sm:px-4 h-8 sm:h-9 rounded-full bg-brand-accent text-white text-[10px] sm:text-xs font-mono uppercase tracking-[0.2em] font-bold active:scale-95 transition-transform min-w-11 justify-center"
            >
              <span className="sm:hidden">Start</span>
              <span className="hidden sm:inline">Explore Story</span>
              <ArrowRight className="w-3 h-3" />
            </button>

            <button
              onClick={() => setMenuOpen((open) => !open)}
              className={`md:hidden w-10 h-10 flex items-center justify-center active:bg-brand-border/50 rounded-lg transition-colors ${
                onDark ? 'text-white' : 'text-brand-ink'
              }`}
              aria-label="Toggle menu"
            >
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {menuOpen && (
        <div className="fixed inset-0 z-[70] bg-brand-surface md:hidden flex flex-col pt-24 px-6">
          <button
            onClick={() => setMenuOpen(false)}
            className="absolute top-6 right-4 w-11 h-11 flex items-center justify-center text-brand-ink"
            aria-label="Close menu"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="flex flex-col gap-2">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="text-left py-4 text-sm font-mono uppercase tracking-[0.25em] text-brand-ink/70 hover:text-brand-ink border-b border-brand-border active:text-brand-accent min-h-12"
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
