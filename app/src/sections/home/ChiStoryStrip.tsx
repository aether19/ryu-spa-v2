import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export default function ChiStoryStrip() {
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!stripRef.current) return;
    const tween = gsap.fromTo(stripRef.current, { opacity: 0 }, {
      opacity: 1, duration: 0.7,
      scrollTrigger: { trigger: stripRef.current, start: 'top 90%', toggleActions: 'play none none none' },
    });
    return () => { if (tween.scrollTrigger) tween.scrollTrigger.kill(); };
  }, []);

  return (
    <div ref={stripRef} className="relative py-20 lg:py-24 opacity-0" style={{ backgroundColor: '#0D0A06' }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-0">
          <div className="lg:w-[35%] text-center lg:text-left">
            <span className="font-display text-chi-parchment" style={{ fontSize: 'clamp(48px, 5vw, 64px)', lineHeight: 0.88, letterSpacing: '-0.03em' }}>Since 2004</span>
          </div>
          <div className="hidden lg:block w-px mx-12" style={{ height: '48px', backgroundColor: 'rgba(255,255,255,0.15)' }} />
          <div className="lg:hidden w-16 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.15)' }} />
          <div className="lg:flex-1 text-center lg:text-left">
            <p className="font-body text-chi-mist" style={{ fontSize: '16px', lineHeight: 1.7 }}>
              20+ years of trusted wellness.<br className="hidden lg:block" /> Qualified practitioners. A philosophy that works.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
