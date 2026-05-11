import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const treatments = [
  {
    image: '/images/treatment-acupuncture.jpg',
    name: 'Acupuncture',
    benefit: 'Restore flow to blocked pathways',
    duration: '30 – 60 min',
    price: 'From $65',
  },
  {
    image: '/images/treatment-massage.jpg',
    name: 'Deep Tissue Massage',
    benefit: 'Release weeks of carried tension',
    duration: '30 – 90 min',
    price: 'From $55',
  },
  {
    image: '/images/treatment-headspa.jpg',
    name: 'Head Spa Therapy',
    benefit: 'Calm the mind, restore clarity',
    duration: '45 – 60 min',
    price: 'From $75',
  },
  {
    image: '/images/treatment-cupping.jpg',
    name: 'Cupping Therapy',
    benefit: 'Draw out stagnation, improve circulation',
    duration: '20 – 45 min',
    price: 'From $45',
  },
  {
    image: '/images/treatment-herbal.jpg',
    name: 'Herbal Medicine',
    benefit: 'Support healing from within',
    duration: 'Consultation',
    price: 'From $50',
  },
  {
    image: '/images/treatment-reflexology.jpg',
    name: 'Reflexology',
    benefit: 'Balance through the soles',
    duration: '30 – 60 min',
    price: 'From $50',
  },
];

export default function TreatmentsSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!headerRef.current) return;

    const tween = gsap.fromTo(
      headerRef.current,
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 80%',
          toggleActions: 'play none none none',
        },
      }
    );

    return () => { if (tween.scrollTrigger) tween.scrollTrigger.kill(); };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-20 lg:py-28"
      style={{ backgroundColor: '#F5F0E3' }}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div ref={headerRef} className="mb-12 opacity-0">
          <span className="label-style text-chi-cinnabar block mb-3">
            OUR TREATMENTS
          </span>
          <h2
            className="font-display text-chi-ink"
            style={{
              fontSize: 'clamp(40px, 4.5vw, 64px)',
              lineHeight: 0.95,
              letterSpacing: '-0.03em',
            }}
          >
            Six ways to
            <br />
            restore flow.
          </h2>
        </div>
      </div>

      {/* Horizontal scroll with CSS scroll-snap - NO GSAP pin */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div
          className="flex gap-6 overflow-x-auto pb-4 -mx-6 px-6 lg:mx-0 lg:px-0"
          style={{
            scrollSnapType: 'x mandatory',
            WebkitOverflowScrolling: 'touch',
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}
        >
          <style>{`div::-webkit-scrollbar { display: none; }`}</style>
          {treatments.map((treatment, i) => (
            <div
              key={i}
              className="flex-shrink-0 group snap-start overflow-hidden rounded-chi transition-all duration-300 chi-ease hover:-translate-y-2"
              style={{
                width: '300px',
                backgroundColor: '#EBE5D6',
                borderLeft: '2px solid transparent',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderLeftColor = '#B8311F';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.borderLeftColor = 'transparent';
              }}
            >
              {/* Image - 16:9 ratio */}
              <div className="relative overflow-hidden" style={{ aspectRatio: '16/9' }}>
                <img
                  src={treatment.image}
                  alt={treatment.name}
                  className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105 group-hover:contrast-110"
                  loading="lazy"
                />
              </div>

              {/* Content */}
              <div className="p-5" style={{ backgroundColor: '#F5F0E3' }}>
                <h3
                  className="font-display text-chi-ink mb-1"
                  style={{ fontSize: '22px', letterSpacing: '-0.01em' }}
                >
                  {treatment.name}
                </h3>
                <p className="font-subhead italic text-chi-smoke mb-4" style={{ fontSize: '16px' }}>
                  {treatment.benefit}
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <span
                    className="px-3 py-1 rounded-full font-body text-xs"
                    style={{ backgroundColor: '#EBE5D6', color: '#1A1208' }}
                  >
                    {treatment.duration}
                  </span>
                  <span
                    className="px-3 py-1 rounded-full font-body text-xs"
                    style={{ backgroundColor: '#EBE5D6', color: '#1A1208' }}
                  >
                    {treatment.price}
                  </span>
                  <a
                    href="https://bookrelax.com.au/booking"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="ml-auto font-body text-chi-cinnabar text-[13px] font-medium hover:underline"
                  >
                    Book This →
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
