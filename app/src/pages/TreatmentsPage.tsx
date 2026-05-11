import { useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// ─── Treatment data ───────────────────────────────────────────────────────────

const treatments = [
  { id: 'acupuncture', image: '/images/treatment-acupuncture.jpg', name: 'Acupuncture',        benefit: 'Restore flow to blocked pathways',        description: "Fine needles are placed at strategic points along the body's meridian lines to restore the natural flow of Qi. Each session is tailored to your specific condition and constitution.", who: 'Those with chronic pain, stress, insomnia, digestive issues, or seeking preventative care.', duration: '30 – 60 min', price: 'From $65',  regions: ['head','neck','back','arms','legs'] },
  { id: 'deep-tissue', image: '/images/treatment-massage.jpg',     name: 'Deep Tissue Massage', benefit: 'Release weeks of carried tension',         description: 'Intensive manipulation of deeper muscle layers to release chronic tension patterns. Our therapists use slow, firm strokes to target specific areas of tightness.',                 who: 'Athletes, desk workers, anyone carrying physical stress in their shoulders, back, or neck.',    duration: '30 – 90 min', price: 'From $55',  regions: ['neck','back','shoulders','legs'] },
  { id: 'head-spa', image: '/images/treatment-headspa.jpg',     name: 'Head Spa Therapy',    benefit: 'Calm the mind, restore clarity',           description: 'A deeply therapeutic scalp and head treatment combining acupressure, aromatherapy, and specialised massage techniques to release mental tension and promote clarity.',  who: 'Those experiencing stress, headaches, mental fatigue, or seeking a deeply calming experience.',  duration: '45 – 60 min', price: 'From $75',  regions: ['head'] },
  { id: 'cupping', image: '/images/treatment-cupping.jpg',     name: 'Cupping Therapy',     benefit: 'Draw out stagnation, improve circulation', description: 'Glass cups create suction on the skin to draw stagnant blood and energy to the surface, promoting fresh circulation and rapid healing in treated areas.',                    who: 'Those with muscle stiffness, respiratory conditions, or seeking enhanced recovery after exercise.', duration: '20 – 45 min', price: 'From $45', regions: ['back','shoulders'] },
  { id: 'herbal', image: '/images/treatment-herbal.jpg',      name: 'Herbal Medicine',     benefit: 'Support healing from within',              description: "Personalised herbal formulations based on your TCM diagnosis. Each prescription is compounded specifically for your constitution and current health concerns.",              who: "Those with ongoing health conditions, seeking to support their body's natural healing processes.", duration: 'Consultation', price: 'From $50', regions: ['internal'] },
  { id: 'reflexology', image: '/images/treatment-reflexology.jpg', name: 'Reflexology',         benefit: 'Balance through the soles',                description: 'Pressure point therapy on the feet that corresponds to different organs and systems throughout the body. Restores balance and promotes overall wellbeing.',                    who: 'Those seeking relaxation, improved sleep, digestive support, or a gentle entry into body-based therapies.', duration: '30 – 60 min', price: 'From $50', regions: ['feet'] },
];

// ─── Body region definitions ──────────────────────────────────────────────────
//
// Image: sss.svg served at 800 × 1200 (2 : 3 ratio).
// Container: 260 px wide, paddingBottom 160% → height ≈ 416 px.
// Overlay viewBox: "0 0 100 160"  (same 2:3 proportion scaled to easy units).
//
// Coordinate method — every measurement is a % of the IMAGE dimensions:
//   cx = (x_px / 800) * 100     cy = (y_px / 1200) * 160
//
// Approximate pixel landmarks observed in the sss.svg figure (800 × 1200 frame):
//
//  Region           x_px   y_px    → cx    cy
//  ──────────────── ─────  ──────    ─────  ────
//  Head center       400    95       50     12.7
//  Neck center       400   185       50     24.7
//  L shoulder cap    230   228       28.8   30.4
//  R shoulder cap    570   228       71.3   30.4
//  Chest / back      400   355       50     47.3
//  L arm (elbow)     168   440       21     58.7
//  R arm (elbow)     632   440       79     58.7
//  Core / abdomen    400   530       50     70.7
//  Upper legs        400   710       50     94.7
//  Lower legs        400   900       50    120
//  Feet              400  1085       50    144.7
//
// Radii are generous to make hover comfortable without bleeding into wrong area.

const bodyRegions: {
  id: string;
  label: string;
  circles: { cx: number; cy: number; r: number }[];
}[] = [
  {
    id: 'head',
    label: 'Head',
    circles: [{ cx: 50, cy: 12.7, r: 9.5 }],
  },
  {
    id: 'neck',
    label: 'Neck',
    circles: [{ cx: 50, cy: 24.7, r: 4.5 }],
  },
  {
    id: 'shoulders',
    label: 'Shoulders',
    // One circle per shoulder cap
    circles: [
      { cx: 28.5, cy: 30.5, r: 8.5 },
      { cx: 71.5, cy: 30.5, r: 8.5 },
    ],
  },
  {
    id: 'back',
    label: 'Back',
    circles: [{ cx: 50, cy: 47, r: 14 }],
  },
  {
    id: 'arms',
    label: 'Arms',
    // One circle per arm at elbow level
    circles: [
      { cx: 21, cy: 58.5, r: 8 },
      { cx: 79, cy: 58.5, r: 8 },
    ],
  },
  {
    id: 'legs',
    label: 'Legs',
    circles: [{ cx: 50, cy: 95, r: 18 }],
  },
  {
    id: 'feet',
    label: 'Feet',
    circles: [{ cx: 50, cy: 144, r: 8 }],
  },
];

const tooltipMap: Record<string, { name: string; benefit: string }> = {
  head:      { name: 'Head Spa Therapy',    benefit: 'Calm the mind, restore clarity'     },
  neck:      { name: 'Deep Tissue Massage', benefit: 'Release tension in the neck'         },
  shoulders: { name: 'Deep Tissue Massage', benefit: 'Targeted shoulder relief'            },
  back:      { name: 'Acupuncture',         benefit: 'Restore flow to blocked pathways'   },
  arms:      { name: 'Cupping Therapy',     benefit: 'Draw out stagnation'                },
  legs:      { name: 'Reflexology',         benefit: 'Balance through the soles'          },
  feet:      { name: 'Reflexology',         benefit: 'Balance through the soles'          },
};

// Soft rose-pink blob matching the reference hover style
const FILL   = 'rgba(210, 82, 68, 0.22)';
const STROKE = 'rgba(200, 70, 55, 0.35)';

// ─── Component ────────────────────────────────────────────────────────────────

export default function TreatmentsPage() {
  const [hoveredRegion, setHoveredRegion] = useState<string | null>(null);
  const [tooltip, setTooltip]             = useState<{ x: number; y: number; text: string } | null>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const triggers: ScrollTrigger[] = [];
    document.querySelectorAll('.reveal-anim').forEach(el => {
      const t = gsap.fromTo(el, { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
      });
      if (t.scrollTrigger) triggers.push(t.scrollTrigger);
    });
    return () => { triggers.forEach(t => t.kill()); };
  }, []);

  const handleRegionHover = (id: string, e: React.MouseEvent) => {
    setHoveredRegion(id);
    const d = tooltipMap[id];
    if (d) setTooltip({ x: e.clientX + 14, y: e.clientY - 44, text: `${d.name} — ${d.benefit}` });
  };

  const clearHover = () => { setHoveredRegion(null); setTooltip(null); };

  return (
    <main>
      {/* ── Hero ── */}
      <section className="relative pt-32 lg:pt-40 pb-16 lg:pb-24" style={{ backgroundColor: '#0D0A06' }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <span className="reveal-anim label-style text-chi-cinnabar block mb-4 opacity-0">OUR TREATMENTS</span>
          <h1 className="reveal-anim font-display text-chi-parchment mb-6 opacity-0"
            style={{ fontSize: 'clamp(48px,6vw,72px)', lineHeight: 0.88, letterSpacing: '-0.04em' }}>
            Ancient methods.<br />Modern results.
          </h1>
          <p className="reveal-anim font-body text-chi-mist max-w-lg opacity-0" style={{ fontSize: '16px', lineHeight: 1.8 }}>
            Six core treatments. Qualified practitioners.<br />Evidence-informed Traditional Chinese Medicine.
          </p>
        </div>
      </section>

      {/* ── Body Map ── */}
      <section className="py-16 lg:py-24" style={{ backgroundColor: '#F5F0E3' }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="reveal-anim flex flex-col lg:flex-row items-center gap-12 lg:gap-20">

            {/*
              Body figure — Desktop only.
              Container is 260 px wide. paddingBottom 160% → height = 416 px.
              This matches the 2:3 image ratio (800 × 1200 → 260 × 416 at scale).
              The overlay SVG uses viewBox "0 0 100 160" so circles coordinates
              are simply (x% × 1, y% × 1.6) — trivially readable.
            */}
            <div className="hidden lg:block flex-shrink-0" style={{ width: '260px', position: 'relative' }}>
              <div style={{ position: 'relative', paddingBottom: '160%' }}>

                {/* The new clean body SVG vector */}
                <img
                  src="https://cdn.builder.io/api/v1/image/assets%2Fd10e1c74920a4c19987eb605d5fcf4d5%2F52b1508288e841899591fac8ab828ad3?format=webp&width=800&height=1200"
                  alt="Body diagram"
                  style={{
                    position: 'absolute', inset: 0,
                    width: '100%', height: '100%',
                    objectFit: 'fill',      // fills exactly — no letterbox shift
                  }}
                />

                {/*
                  Hover overlay SVG.
                  viewBox "0 0 100 160" — mirrors the image frame in easy-to-read units.
                  A coordinate like cx=50, cy=12 means "50% across, 7.5% down the image".
                */}
                <svg
                  style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
                  viewBox="0 0 100 160"
                >
                  {bodyRegions.map(region => {
                    const active = hoveredRegion === region.id;
                    return (
                      <g
                        key={region.id}
                        style={{ cursor: 'pointer' }}
                        onMouseEnter={e   => handleRegionHover(region.id, e)}
                        onMouseLeave={()  => clearHover()}
                        onMouseMove={e    => {
                          if (hoveredRegion === region.id) {
                            const d = tooltipMap[region.id];
                            if (d) setTooltip({ x: e.clientX + 14, y: e.clientY - 44, text: `${d.name} — ${d.benefit}` });
                          }
                        }}
                      >
                        {region.circles.map((c, ci) => (
                          <circle
                            key={ci}
                            cx={c.cx} cy={c.cy} r={c.r}
                            fill={active ? FILL   : 'transparent'}
                            stroke={active ? STROKE : 'transparent'}
                            strokeWidth="0.6"
                            style={{ transition: 'fill 0.2s ease, stroke 0.2s ease' }}
                          />
                        ))}
                      </g>
                    );
                  })}
                </svg>

                {/* Floating tooltip */}
                {tooltip && (
                  <div
                    className="fixed z-50 px-4 py-2 rounded-chi pointer-events-none"
                    style={{ backgroundColor: '#1A1208', border: '1px solid rgba(201,144,58,0.2)', left: tooltip.x, top: tooltip.y }}
                  >
                    <p className="font-body text-chi-parchment text-xs whitespace-nowrap">{tooltip.text}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Legend */}
            <div className="flex-1">
              <h3 className="font-display text-chi-ink text-2xl mb-3">Hover to explore</h3>
              <p className="font-body text-chi-smoke mb-6" style={{ lineHeight: 1.8 }}>
                Move your cursor over different body regions to discover which treatments target each area.
                Every treatment is designed to restore flow and balance.
              </p>
              <div className="grid grid-cols-2 gap-2">
                {bodyRegions.map(region => (
                  <div
                    key={region.id}
                    className="flex items-center gap-2 px-3 py-2 rounded-chi transition-all duration-200 cursor-pointer"
                    style={{ backgroundColor: hoveredRegion === region.id ? 'rgba(210,82,68,0.08)' : '#EBE5D6' }}
                    onMouseEnter={e  => handleRegionHover(region.id, e)}
                    onMouseLeave={()  => clearHover()}
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: hoveredRegion === region.id ? '#D25244' : '#B8311F' }}
                    />
                    <span className="font-body text-chi-ink text-sm">{region.label}</span>
                  </div>
                ))}
              </div>
              <p className="font-body text-chi-smoke text-[13px] mt-6">
                <a href="#all-treatments" className="text-chi-cinnabar hover:underline">Or browse all treatments below ↓</a>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Treatment Detail Cards ── */}
      <section id="all-treatments" className="py-16 lg:py-24" style={{ backgroundColor: '#EBE5D6' }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          {treatments.map((treatment, i) => (
            <div key={i}>
              <div className={`reveal-anim flex flex-col ${i % 2 === 0 ? 'lg:flex-row' : 'lg:flex-row-reverse'} gap-0`}>
                <div className="w-full lg:w-[40%] h-64 lg:h-auto lg:min-h-[400px]">
                  <img src={treatment.image} alt={treatment.name} className="w-full h-full object-cover" loading="lazy" style={{ filter: 'sepia(15%)' }} />
                </div>
                <div className="w-full lg:w-[60%] flex flex-col justify-center p-8 lg:p-14" style={{ backgroundColor: '#F5F0E3' }}>
                  <h3 className="font-display text-chi-ink mb-2" style={{ fontSize: 'clamp(28px,3vw,40px)', lineHeight: 0.95, letterSpacing: '-0.02em' }}>{treatment.name}</h3>
                  <p className="font-subhead italic text-chi-smoke text-lg mb-4">{treatment.benefit}</p>
                  <p className="font-body text-chi-ink mb-3" style={{ fontSize: '16px', lineHeight: 1.7 }}>{treatment.description}</p>
                  <p className="font-body text-chi-smoke text-sm mb-5" style={{ lineHeight: 1.6 }}>
                    <span className="text-chi-cinnabar font-medium">Who it is for:</span> {treatment.who}
                  </p>
                  <div className="flex items-center gap-3 flex-wrap mb-5">
                    <span className="px-3 py-1 rounded-full font-body text-xs" style={{ backgroundColor: '#EBE5D6', color: '#1A1208' }}>{treatment.duration}</span>
                    <span className="px-3 py-1 rounded-full font-body text-xs" style={{ backgroundColor: '#EBE5D6', color: '#1A1208' }}>{treatment.price}</span>
                  </div>
                  <a href={`/booking?service=${treatment.id}`} className="inline-flex items-center font-body text-chi-cinnabar text-sm font-medium hover:underline w-fit">
                    Book This Treatment →
                  </a>
                </div>
              </div>
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
