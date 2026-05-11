import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const treatments = [
  {
    image: '/images/treatment-acupuncture.jpg', name: 'Acupuncture', benefit: 'Restore flow to blocked pathways',
    description: 'Fine needles are placed at strategic points along the body\'s meridian lines to restore the natural flow of Qi. Each session is tailored to your specific condition and constitution.',
    who: 'Those with chronic pain, stress, insomnia, digestive issues, or seeking preventative care.',
    duration: '30 – 60 min', price: 'From $65', regions: ['head', 'neck', 'back', 'arms', 'legs'],
  },
  {
    image: '/images/treatment-massage.jpg', name: 'Deep Tissue Massage', benefit: 'Release weeks of carried tension',
    description: 'Intensive manipulation of deeper muscle layers to release chronic tension patterns. Our therapists use slow, firm strokes to target specific areas of tightness.',
    who: 'Athletes, desk workers, anyone carrying physical stress in their shoulders, back, or neck.',
    duration: '30 – 90 min', price: 'From $55', regions: ['neck', 'back', 'shoulders', 'legs'],
  },
  {
    image: '/images/treatment-headspa.jpg', name: 'Head Spa Therapy', benefit: 'Calm the mind, restore clarity',
    description: 'A deeply therapeutic scalp and head treatment combining acupressure, aromatherapy, and specialised massage techniques to release mental tension and promote clarity.',
    who: 'Those experiencing stress, headaches, mental fatigue, or seeking a deeply calming experience.',
    duration: '45 – 60 min', price: 'From $75', regions: ['head'],
  },
  {
    image: '/images/treatment-cupping.jpg', name: 'Cupping Therapy', benefit: 'Draw out stagnation, improve circulation',
    description: 'Glass cups create suction on the skin to draw stagnant blood and energy to the surface, promoting fresh circulation and rapid healing in treated areas.',
    who: 'Those with muscle stiffness, respiratory conditions, or seeking enhanced recovery after exercise.',
    duration: '20 – 45 min', price: 'From $45', regions: ['back', 'shoulders'],
  },
  {
    image: '/images/treatment-herbal.jpg', name: 'Herbal Medicine', benefit: 'Support healing from within',
    description: 'Personalised herbal formulations based on your TCM diagnosis. Each prescription is compounded specifically for your constitution and current health concerns.',
    who: 'Those with ongoing health conditions, seeking to support their body\'s natural healing processes.',
    duration: 'Consultation', price: 'From $50', regions: ['internal'],
  },
  {
    image: '/images/treatment-reflexology.jpg', name: 'Reflexology', benefit: 'Balance through the soles',
    description: 'Pressure point therapy on the feet that corresponds to different organs and systems throughout the body. Restores balance and promotes overall wellbeing.',
    who: 'Those seeking relaxation, improved sleep, digestive support, or a gentle entry into body-based therapies.',
    duration: '30 – 60 min', price: 'From $50', regions: ['feet'],
  },
];

const bodyRegions = [
  { id: 'head', label: 'Head', cx: 100, cy: 40, r: 25 },
  { id: 'neck', label: 'Neck', cx: 100, cy: 75, r: 12 },
  { id: 'shoulders', label: 'Shoulders', cx: 100, cy: 95, r: 30 },
  { id: 'back', label: 'Back', cx: 100, cy: 140, r: 35 },
  { id: 'arms', label: 'Arms', cx: 55, cy: 130, r: 20 },
  { id: 'legs', label: 'Legs', cx: 100, cy: 220, r: 30 },
  { id: 'feet', label: 'Feet', cx: 100, cy: 310, r: 20 },
];

const tooltipMap: Record<string, { name: string; benefit: string }> = {
  head: { name: 'Head Spa Therapy', benefit: 'Calm the mind, restore clarity' },
  neck: { name: 'Deep Tissue Massage', benefit: 'Release weeks of carried tension' },
  shoulders: { name: 'Deep Tissue Massage', benefit: 'Targeted shoulder relief' },
  back: { name: 'Acupuncture', benefit: 'Restore flow to blocked pathways' },
  arms: { name: 'Cupping Therapy', benefit: 'Draw out stagnation' },
  legs: { name: 'Reflexology', benefit: 'Balance through the soles' },
  feet: { name: 'Reflexology', benefit: 'Balance through the soles' },
};

export default function TreatmentsPage() {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; text: string } | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const triggers: ScrollTrigger[] = [];
    document.querySelectorAll('.reveal-anim').forEach((el) => {
      const tween = gsap.fromTo(el, { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
      });
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    });
    return () => { triggers.forEach((t) => t.kill()); };
  }, []);

  const handleRegionHover = (regionId: string, e: React.MouseEvent) => {
    setHoveredRegion(regionId);
    const data = tooltipMap[regionId];
    if (data) {
      setTooltip({ x: e.clientX, y: e.clientY - 60, text: `${data.name} — ${data.benefit}` });
    }
  };

  return (
    <main>
      {/* Hero */}
      <section className="relative pt-32 lg:pt-40 pb-16 lg:pb-24" style={{ backgroundColor: '#0D0A06' }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <span className="reveal-anim label-style text-chi-cinnabar block mb-4 opacity-0">OUR TREATMENTS</span>
          <h1 className="reveal-anim font-display text-chi-parchment mb-6 opacity-0" style={{ fontSize: 'clamp(48px, 6vw, 72px)', lineHeight: 0.88, letterSpacing: '-0.04em' }}>
            Ancient methods.<br />Modern results.
          </h1>
          <p className="reveal-anim font-body text-chi-mist max-w-lg opacity-0" style={{ fontSize: '16px', lineHeight: 1.8 }}>
            Six core treatments. Qualified practitioners.<br />Evidence-informed Traditional Chinese Medicine.
          </p>
        </div>
      </section>

      {/* Body Map */}
      <section className="py-16 lg:py-24" style={{ backgroundColor: '#F5F0E3' }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="reveal-anim flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            {/* SVG Body - Desktop */}
            <div className="hidden lg:block relative flex-shrink-0">
              <svg width="200" height="380" viewBox="0 0 200 380">
                <ellipse cx="100" cy="45" rx="28" ry="32" fill="none" stroke="#CEC5B0" strokeWidth="0.8" />
                <path d="M85 75 Q100 70 115 75 L120 100 Q100 95 80 100 Z" fill="none" stroke="#CEC5B0" strokeWidth="0.8" />
                <path d="M80 100 Q60 110 55 140 L50 200 Q100 210 150 200 L145 140 Q140 110 120 100 Z" fill="none" stroke="#CEC5B0" strokeWidth="0.8" />
                <path d="M55 120 Q30 140 25 180 Q20 200 30 220" fill="none" stroke="#CEC5B0" strokeWidth="0.8" />
                <path d="M145 120 Q170 140 175 180 Q180 200 170 220" fill="none" stroke="#CEC5B0" strokeWidth="0.8" />
                <path d="M70 205 Q65 250 60 300 Q55 340 65 370" fill="none" stroke="#CEC5B0" strokeWidth="0.8" />
                <path d="M130 205 Q135 250 140 300 Q145 340 135 370" fill="none" stroke="#CEC5B0" strokeWidth="0.8" />

                {bodyRegions.map((region) => {
                  const isHovered = hoveredRegion === region.id;
                  return (
                    <g
                      key={region.id}
                      className="cursor-pointer"
                      onMouseEnter={(e) => handleRegionHover(region.id, e)}
                      onMouseLeave={() => { setHoveredRegion(null); setTooltip(null); }}
                      onMouseMove={(e) => {
                        if (hoveredRegion === region.id) {
                          const data = tooltipMap[region.id];
                          if (data) setTooltip({ x: e.clientX + 10, y: e.clientY - 40, text: `${data.name} — ${data.benefit}` });
                        }
                      }}
                    >
                      <circle cx={region.cx} cy={region.cy} r={region.r} fill={isHovered ? 'rgba(184, 49, 31, 0.12)' : 'transparent'} stroke={isHovered ? '#B8311F' : 'transparent'} strokeWidth="1" className="transition-all duration-300" />
                    </g>
                  );
                })}
              </svg>

              {tooltip && (
                <div className="fixed z-50 px-4 py-2 rounded-chi pointer-events-none" style={{ backgroundColor: '#1A1208', border: '1px solid rgba(201, 144, 58, 0.2)', left: tooltip.x, top: tooltip.y }}>
                  <p className="font-body text-chi-parchment text-xs whitespace-nowrap">{tooltip.text}</p>
                </div>
              )}
            </div>

            {/* Legend */}
            <div className="flex-1">
              <h3 className="font-display text-chi-ink text-2xl mb-3">Hover to explore</h3>
              <p className="font-body text-chi-smoke mb-6" style={{ lineHeight: 1.8 }}>
                Move your cursor over different body regions to discover which treatments target each area. Every treatment is designed to restore flow and balance.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {bodyRegions.map((region) => (
                  <div
                    key={region.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-chi transition-all duration-200 cursor-pointer"
                    style={{ backgroundColor: hoveredRegion === region.id ? 'rgba(184, 49, 31, 0.08)' : '#EBE5D6' }}
                    onMouseEnter={(e) => handleRegionHover(region.id, e)}
                    onMouseLeave={() => { setHoveredRegion(null); setTooltip(null); }}
                  >
                    <span className="w-2 h-2 rounded-full bg-chi-cinnabar" />
                    <span className="font-body text-chi-ink text-sm">{region.label}</span>
                  </div>
                ))}
              </div>
              <p className="font-body text-chi-smoke text-[13px] mt-6"><a href="#all-treatments" className="text-chi-cinnabar hover:underline">Or browse all treatments below ↓</a></p>
            </div>
          </div>
        </div>
      </section>

      {/* Treatment Detail Cards - alternating layout */}
      <section id="all-treatments" className="py-16 lg:py-24" style={{ backgroundColor: '#EBE5D6' }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          {treatments.map((treatment, i) => (
            <div key={i}>
              <div className={`reveal-anim flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-0 mb-0`}>
                {/* Image */}
                <div className="w-full lg:w-[40%] h-64 lg:h-auto lg:min-h-[400px]">
                  <img src={treatment.image} alt={treatment.name} className="w-full h-full object-cover" loading="lazy" style={{ filter: 'sepia(15%)' }} />
                </div>
                {/* Content */}
                <div className="w-full lg:w-[60%] flex flex-col justify-center p-8 lg:p-14" style={{ backgroundColor: '#F5F0E3' }}>
                  <h3 className="font-display text-chi-ink mb-2" style={{ fontSize: 'clamp(28px, 3vw, 40px)', lineHeight: 0.95, letterSpacing: '-0.02em' }}>{treatment.name}</h3>
                  <p className="font-subhead italic text-chi-smoke text-lg mb-4">{treatment.benefit}</p>
                  <p className="font-body text-chi-ink mb-3" style={{ fontSize: '16px', lineHeight: 1.7 }}>{treatment.description}</p>
                  <p className="font-body text-chi-smoke text-sm mb-5" style={{ lineHeight: 1.6 }}><span className="text-chi-cinnabar font-medium">Who it is for:</span> {treatment.who}</p>
                  <div className="flex items-center gap-3 flex-wrap mb-5">
                    <span className="px-3 py-1 rounded-full font-body text-xs" style={{ backgroundColor: '#EBE5D6', color: '#1A1208' }}>{treatment.duration}</span>
                    <span className="px-3 py-1 rounded-full font-body text-xs" style={{ backgroundColor: '#EBE5D6', color: '#1A1208' }}>{treatment.price}</span>
                  </div>
                  <a href="https://bookrelax.com.au/booking" target="_blank" rel="noopener noreferrer" className="inline-flex items-center font-body text-chi-cinnabar text-sm font-medium hover:underline w-fit">
                    Book This Treatment →
                  </a>
                </div>
              </div>
              {/* Divider */}
              {i < treatments.length - 1 && (
                <div className="reveal-anim flex items-center justify-center py-6" style={{ backgroundColor: '#F5F0E3' }}>
                  <div className="w-2 h-2 rounded-full bg-chi-mist" />
                </div>
              )}
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
