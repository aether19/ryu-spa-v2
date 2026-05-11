import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function HeroSection() {
  const lineRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLDivElement>(null);
  const sublineRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const qiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Cinnabar line draws in
    if (lineRef.current) {
      gsap.fromTo(
        lineRef.current,
        { width: '0%' },
        { width: '100%', duration: 1.1, ease: 'power2.out', delay: 0.5 }
      );
    }

    // Qi character scroll rotation
    const onScroll = () => {
      if (!qiRef.current) return;
      const scrollY = window.scrollY;
      qiRef.current.style.transform = `translate(-50%, -50%) rotate(${scrollY * 0.008}deg)`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="relative min-h-[100dvh] w-full overflow-hidden" style={{ backgroundColor: '#0D0A06' }}>
      {/* Desktop: diagonal split */}
      <div className="hidden lg:flex relative min-h-[100dvh] w-full">
        {/* Left panel (55%) - Hero image with diagonal clip */}
        <div
          className="relative w-[58%] min-h-full overflow-hidden"
          style={{
            clipPath: 'polygon(0 0, 100% 0, 85% 100%, 0 100%)',
          }}
        >
          <img
            src="/images/hero-hands.jpg"
            alt="Acupuncturist's hands placing fine needles"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: 'center 30%' }}
          />
          {/* Subtle darkening overlay */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, rgba(13,10,6,0.3) 0%, transparent 50%)' }} />
        </div>

        {/* Right panel (45%) - Content */}
        <div className="relative w-[45%] -ml-[3%] flex flex-col justify-center px-12 xl:px-16">
          {/* Qi watermark */}
          <div
            ref={qiRef}
            className="absolute top-1/2 left-1/2 pointer-events-none select-none font-display"
            style={{
              fontSize: '340px',
              color: '#B8311F',
              opacity: 0.055,
              lineHeight: 1,
              transform: 'translate(-50%, -50%)',
            }}
          >
            气
          </div>

          <div ref={headlineRef}>
            <h1
              className="relative font-display text-chi-parchment"
              style={{
                fontSize: '78px',
                lineHeight: 0.92,
                letterSpacing: '-0.03em',
                fontWeight: 400,
              }}
            >
              Your body has
              <br />
              been waiting
              <br />
              for this.
            </h1>
          </div>

          <div ref={lineRef} className="relative mt-8 h-px bg-chi-cinnabar" style={{ width: '0%' }} />

          <p ref={sublineRef} className="relative mt-6 font-body text-chi-smoke" style={{ fontSize: '14px', letterSpacing: '0.02em' }}>
            23 locations &nbsp;&middot;&nbsp; Brisbane &nbsp;&middot;&nbsp; Gold Coast &nbsp;&middot;&nbsp; Sunshine Coast &nbsp;&middot;&nbsp; Sydney
          </p>

          <div ref={ctaRef} className="relative mt-8 flex flex-wrap gap-4">
            <a
              href="/locations"
              className="inline-flex items-center px-7 py-3.5 bg-chi-cinnabar text-chi-parchment label-style hover:bg-chi-parchment hover:text-chi-ink transition-all duration-200 rounded-chi active:scale-[0.97]"
              style={{ fontSize: '13px' }}
            >
              Find My Location
            </a>
            <a
              href="/treatments"
              className="inline-flex items-center px-7 py-3.5 border-[1.5px] border-chi-cinnabar text-chi-cinnabar label-style hover:bg-chi-cinnabar/[0.08] transition-all duration-200 rounded-chi"
              style={{ fontSize: '13px' }}
            >
              Explore Treatments
            </a>
          </div>
        </div>
      </div>

      {/* Mobile: full-bleed image with gradient overlay */}
      <div className="lg:hidden relative min-h-[100dvh] flex flex-col justify-end">
        <img
          src="/images/hero-hands.jpg"
          alt="Acupuncturist's hands placing fine needles"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ background: 'linear-gradient(to top, rgba(13,10,6,0.92) 40%, rgba(13,10,6,0.4) 70%, transparent 100%)' }}
        />
        <div className="relative px-6 pb-16 pt-32">
          <h1
            className="font-display text-chi-parchment"
            style={{
              fontSize: 'clamp(40px, 12vw, 64px)',
              lineHeight: 0.92,
              letterSpacing: '-0.03em',
              fontWeight: 400,
            }}
          >
            Your body has
            <br />
            been waiting
            <br />
            for this.
          </h1>
          <div ref={lineRef} className="mt-6 h-px bg-chi-cinnabar" style={{ width: '60%' }} />
          <p className="mt-4 font-body text-chi-smoke" style={{ fontSize: '14px' }}>
            23 locations · Brisbane · Gold Coast · Sunshine Coast · Sydney
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <a
              href="/locations"
              className="inline-flex items-center px-6 py-3 bg-chi-cinnabar text-chi-parchment label-style rounded-chi"
              style={{ fontSize: '13px' }}
            >
              Find My Location
            </a>
            <a
              href="/treatments"
              className="inline-flex items-center px-6 py-3 border-[1.5px] border-chi-cinnabar text-chi-cinnabar label-style rounded-chi"
              style={{ fontSize: '13px' }}
            >
              Explore Treatments
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
