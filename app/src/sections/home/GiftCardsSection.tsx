import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function GiftCardsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!contentRef.current) return;
    const tween = gsap.fromTo(contentRef.current, { opacity: 0, y: 32 }, {
      opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
      scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none none' },
    });
    return () => { if (tween.scrollTrigger) tween.scrollTrigger.kill(); };
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-28 overflow-hidden" style={{ backgroundColor: '#9A6B2A' }}>
      <div ref={contentRef} className="max-w-[1280px] mx-auto px-6 lg:px-10 opacity-0">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div className="flex-1 text-center lg:text-left">
            <span className="label-style block mb-4" style={{ color: 'rgba(255,255,255,0.6)' }}>GIFT CARDS</span>
            <h2 className="font-display text-white mb-6" style={{ fontSize: 'clamp(40px, 4vw, 56px)', lineHeight: 0.95, letterSpacing: '-0.03em' }}>
              Give the gift of flow.
            </h2>
            <p className="font-body mb-8" style={{ fontSize: '16px', lineHeight: 1.8, color: 'rgba(255,255,255,0.75)' }}>
              E-Vouchers starting from $40.<br />Share the experience of restored energy with someone you care about.
            </p>
            <a href="/gift-cards" className="inline-flex items-center px-8 py-3.5 bg-chi-cinnabar text-chi-parchment font-body text-[13px] font-medium uppercase tracking-wider rounded-chi hover:bg-chi-parchment hover:text-chi-ink transition-all duration-200">
              Purchase Gift Card
            </a>
          </div>
          <div className="flex-shrink-0 w-[280px] lg:w-[340px] opacity-10">
            <img src="/images/gift-card.png" alt="" className="w-full h-auto" style={{ transform: 'rotate(8deg)', filter: 'brightness(0) invert(1)' }} />
          </div>
        </div>
      </div>
    </section>
  );
}
