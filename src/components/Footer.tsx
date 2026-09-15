import { Instagram, Twitter, Facebook, ArrowRight, Leaf } from 'lucide-react';
import { scrollToSection } from '../lib/smoothScroll';

const SECTION_LINKS = [
  { label: 'Energy Bar', id: 'hero' },
  { label: 'Our Story', id: 'story' },
  { label: 'Freshness', id: 'freshness' },
  { label: 'Craft', id: 'craft' },
];

export default function Footer() {
  return (
    <footer id="contact" className="defer-render bg-brand-forest text-white relative overflow-hidden">
      <div className="h-px w-full bg-gradient-to-r from-transparent via-brand-accent/40 to-transparent" />

      <div className="section-wrap py-14 sm:py-16 md:py-20">
        <div className="grid-adaptive-4 mb-14 sm:mb-20">
          <div className="sm:col-span-2 lg:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-lg bg-brand-accent flex items-center justify-center">
                <Leaf className="w-4 h-4 text-brand-forest" strokeWidth={1.5} />
              </div>
              <div>
                <h2 className="text-[14px] sm:text-[15px] font-display font-700 tracking-[0.12em] uppercase text-white">
                  Energy<span className="font-400 opacity-50">Bar</span>
                </h2>
                <p className="font-mono text-[10px] tracking-[0.35em] uppercase text-brand-accent/70">Est. 2018</p>
              </div>
            </div>
            <p className="text-[14px] sm:text-[15px] text-white/50 max-w-sm leading-relaxed font-light mb-8">
              On a mission to bring ancient Indian grain wisdom to your modern plate. Smarter snacking, cleaner life.
            </p>
            <div className="flex gap-3">
              {[Instagram, Twitter, Facebook].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="w-11 h-11 rounded-lg border border-white/10 flex items-center justify-center text-white/40 hover:text-white hover:border-brand-accent/40 hover:bg-brand-accent/10 transition-all duration-300 active:scale-95"
                >
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="label text-brand-accent/70 mb-5 sm:mb-6">Explore</p>
            <ul className="space-y-3">
              {SECTION_LINKS.map((link) => (
                <li key={link.id}>
                  <button
                    onClick={() => scrollToSection(link.id)}
                    className="text-[14px] sm:text-[15px] text-white/45 hover:text-white transition-colors duration-300 font-light min-h-11 flex items-center active:text-brand-accent"
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="label text-brand-accent/70 mb-5 sm:mb-6">Stay in the Loop</p>
            <p className="text-[14px] sm:text-[15px] text-white/40 mb-6 leading-relaxed font-light">
              Drop alerts, grain wisdom, and seasonal recipes.
            </p>
            <div className="relative border-b border-white/20 focus-within:border-brand-accent/60 transition-colors">
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full bg-transparent py-3 sm:py-3.5 text-[14px] text-white placeholder:text-white/25 focus:outline-none font-mono min-h-12"
              />
              <button className="absolute right-0 top-1/2 -translate-y-1/2 w-11 h-11 flex items-center justify-center text-brand-accent/60 hover:text-brand-accent transition-colors active:scale-95">
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/8 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="label text-white/25">
            © 2024 Energy Bar. All Rights Reserved.
          </p>
          <div className="flex gap-6">
            {['Privacy Policy', 'Terms'].map((l) => (
              <a
                key={l}
                href="#"
                className="label text-white/25 hover:text-white/60 transition-colors min-h-11 flex items-center"
              >
                {l}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
