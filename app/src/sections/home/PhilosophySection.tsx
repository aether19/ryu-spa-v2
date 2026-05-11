import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const pillars = [
  {
    icon: (
      <span style={{ fontSize: '30px', color: '#B8311F', lineHeight: 1, display: 'block', fontFamily: 'serif' }}>復</span>
    ),
    title: 'Restore',
    description: 'Muscle tension, chronic pain, fatigue',
  },
  {
    icon: (
      <span style={{ fontSize: '30px', color: '#B8311F', lineHeight: 1, display: 'block', fontFamily: 'serif' }}>衡</span>
    ),
    title: 'Balance',
    description: 'Nervous system, immunity, hormonal harmony',
  },
  {
    icon: (
      <span style={{ fontSize: '30px', color: '#B8311F', lineHeight: 1, display: 'block', fontFamily: 'serif' }}>新</span>
    ),
    title: 'Renew',
    description: 'Circulation, cellular repair, deep relaxation',
  },
];

export default function PhilosophySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const quoteRef = useRef<HTMLDivElement>(null);
  const columnsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const triggers: ScrollTrigger[] = [];

    if (quoteRef.current) {
      const qTween = gsap.fromTo(
        quoteRef.current,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: quoteRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
      if (qTween.scrollTrigger) triggers.push(qTween.scrollTrigger);
    }

    const cols = columnsRef.current?.querySelectorAll('.pillar');
    if (cols) {
      const cTween = gsap.fromTo(
        cols,
        { opacity: 0, y: 24 },
        {
          opacity: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.09,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: columnsRef.current,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        }
      );
      if (cTween.scrollTrigger) triggers.push(cTween.scrollTrigger);
    }

    return () => { triggers.forEach((t) => t.kill()); };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-36 overflow-hidden"
      style={{ backgroundColor: '#0D0A06' }}
    >
      {/* Qi ghost watermark */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none font-display"
        style={{ fontSize: '280px', color: 'rgba(245, 240, 227, 0.04)', lineHeight: 1 }}
      >
        气
      </div>

      <div className="relative max-w-[1280px] mx-auto px-6 lg:px-10">
        <div ref={quoteRef} className="text-center mb-16 lg:mb-20 opacity-0">
          <blockquote
            className="font-subhead italic text-chi-parchment"
            style={{ fontSize: 'clamp(32px, 3.5vw, 52px)', lineHeight: 1.15 }}
          >
            "Qi flows where attention goes."
          </blockquote>
        </div>

        <div ref={columnsRef} className="grid grid-cols-1 md:grid-cols-3 gap-12 lg:gap-16">
          {pillars.map((pillar) => (
            <div key={pillar.title} className="pillar text-center opacity-0">
              <div className="flex justify-center mb-5">{pillar.icon}</div>
              <h3
                className="font-display text-chi-parchment mb-3"
                style={{ fontSize: '24px', letterSpacing: '-0.01em' }}
              >
                {pillar.title}
              </h3>
              <p className="font-body text-chi-mist" style={{ fontSize: '15px', lineHeight: 1.8 }}>
                {pillar.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
