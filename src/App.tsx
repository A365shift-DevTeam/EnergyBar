import { useEffect } from 'react';
import { products } from './data/products';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProductPackScroll from './components/ProductPackScroll';
import StorySection from './components/StorySection';
import { useIsMobile } from './hooks/useIsMobile';
import { startSmoothScroll } from './lib/smoothScroll';

const product = products[0];

export default function App() {
  const isMobile = useIsMobile();

  useEffect(() => startSmoothScroll(), []);

  return (
    <div className="min-h-screen overflow-x-clip bg-brand-surface text-brand-ink antialiased">
      <Navbar />

      <main>
        <section id="hero" className="relative w-full">
          <ProductPackScroll
            product={product}
            mobileContent={<StorySection product={product} compact />}
          />
        </section>

        {!isMobile && (
          <section
            id="story-desktop"
            className="defer-render hidden lg:block bg-brand-parchment py-14 sm:py-16 md:py-20 lg:py-24 border-y border-brand-border"
          >
            <div className="section-wrap">
              <StorySection product={product} />
            </div>
          </section>
        )}

        <section id="freshness" className="defer-render py-14 sm:py-16 md:py-20 lg:py-24 bg-brand-surface">
          <div className="section-wrap max-w-5xl">
            <div className="grid-adaptive-2 items-start">
              <div>
                <div className="w-10 h-10 rounded-xl bg-brand-accent/10 border border-brand-accent/20 flex items-center justify-center mb-6">
                  <div className="w-2 h-2 rounded-full bg-brand-accent" />
                </div>
                <span className="label text-brand-accent block mb-3">Freshness Promise</span>
                <div className="h-px w-12 bg-brand-accent/30" />
              </div>

              <div>
                <h2 className="text-[34px] sm:text-[46px] md:text-[58px] font-serif text-brand-ink mb-5 sm:mb-6 tracking-tight leading-[1.08]">
                  {product.freshnessSection.title}
                </h2>
                <p className="text-[14px] sm:text-[15px] text-brand-ink/60 leading-relaxed font-light">
                  {product.freshnessSection.description}
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="craft" className="defer-render relative overflow-hidden grain py-14 sm:py-16 md:py-20 lg:py-24">
          <div className="absolute inset-0 bg-brand-forest" />
          <div
            className="absolute inset-0 opacity-10"
            style={{ background: product.gradient }}
          />

          <div className="relative z-10 section-wrap">
            <div className="grid-adaptive-2 items-start">
              <div>
                <span className="label text-brand-gold/70 block mb-6 sm:mb-10">
                  {product.craftSection.label}
                </span>
                <h3 className="text-[34px] sm:text-[46px] md:text-[58px] font-serif text-white mb-6 sm:mb-10 leading-[1.08] tracking-tight">
                  {product.craftSection.title}
                </h3>
                <p className="text-[14px] sm:text-[15px] text-white/50 leading-relaxed font-light mb-8 sm:mb-14 max-w-xl">
                  {product.craftSection.description}
                </p>

                <div className="grid-adaptive-3">
                  {product.craftSection.processingParams.map((param) => (
                    <span
                      key={param}
                      className="px-4 py-2.5 rounded-xl sm:rounded-2xl bg-white/5 border border-white/10 font-mono text-[10px] sm:text-xs uppercase tracking-[0.2em] text-white/50 flex items-center gap-2 min-h-12"
                    >
                      <div className="w-1 h-1 rounded-full bg-brand-gold shrink-0" />
                      {param}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <div className="bg-brand-parchment rounded-xl sm:rounded-2xl md:rounded-3xl overflow-hidden shadow-2xl shadow-black/30 p-5 sm:p-9 md:p-11 border border-brand-border">
                  <p className="label mb-5 sm:mb-6">What Makes It Special</p>
                  <div className="grid-adaptive-sidebar">
                    {product.features.map((f) => (
                      <div key={f} className="flex items-center gap-3 min-h-11">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-accent shrink-0" />
                        <span className="font-mono text-[10px] sm:text-xs text-brand-ink/70 tracking-wider">{f}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
