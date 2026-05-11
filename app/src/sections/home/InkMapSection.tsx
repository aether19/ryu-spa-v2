import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

// ─── Data ─────────────────────────────────────────────────────────────────────
// Geographically close clinics are grouped into clusters so each dot is
// clearly separated from its neighbours (min ~21 SVG units between centres).

interface ClinicEntry { id: string; name: string; address: string; rating: string; }

interface Cluster {
  id: string;
  label: string;   // area name shown in tooltip header
  cx: number;
  cy: number;
  clinics: ClinicEntry[];
}

const clusters: Cluster[] = [
  {
    id: 'sunshine-coast', label: 'Sunshine Coast', cx: 652, cy: 272,
    clinics: [
      { id: 'maroochydore', name: 'Sunshine Plaza',  address: 'Maroochydore, QLD', rating: '4.9' },
      { id: 'kawana',       name: 'Kawana Waters',   address: 'Bokarina, QLD',     rating: '4.8' },
    ],
  },
  {
    id: 'brisbane-north', label: 'Brisbane North', cx: 635, cy: 285,
    clinics: [
      { id: 'chermside', name: 'Westfield Chermside', address: 'Chermside, QLD', rating: '4.8' },
    ],
  },
  {
    id: 'brisbane-cbd', label: 'Brisbane CBD', cx: 654, cy: 294,
    clinics: [
      { id: 'anzac-square', name: 'Anzac Square', address: 'Brisbane CBD, QLD', rating: '4.9' },
      { id: 'queens-plaza', name: 'Queens Plaza', address: 'Brisbane CBD, QLD', rating: '4.8' },
    ],
  },
  {
    id: 'toowoomba', label: 'Toowoomba', cx: 607, cy: 309,
    clinics: [
      { id: 'toowoomba', name: 'Grand Central', address: 'Toowoomba, QLD', rating: '4.8' },
    ],
  },
  {
    id: 'brisbane-west', label: 'Brisbane West', cx: 627, cy: 315,
    clinics: [
      { id: 'indooroopilly', name: 'Indooroopilly', address: 'Indooroopilly, QLD', rating: '4.7' },
      { id: 'ipswich',       name: 'Riverlink',     address: 'Ipswich, QLD',       rating: '4.7' },
    ],
  },
  {
    id: 'brisbane-south', label: 'Brisbane South', cx: 663, cy: 313,
    clinics: [
      { id: 'garden-city', name: 'Garden City', address: 'Upper Mt Gravatt, QLD', rating: '4.9' },
    ],
  },
  {
    id: 'gold-coast', label: 'Gold Coast', cx: 657, cy: 333,
    clinics: [
      { id: 'robina',       name: 'Robina Town Centre', address: 'Robina, QLD',     rating: '4.7' },
      { id: 'pacific-fair', name: 'Pacific Fair',       address: 'Broadbeach, QLD', rating: '4.8' },
      { id: 'broadbeach',   name: 'The Oasis',          address: 'Broadbeach, QLD', rating: '4.7' },
    ],
  },
  {
    id: 'sydney', label: 'Sydney', cx: 629, cy: 434,
    clinics: [
      { id: 'sydney-cbd', name: 'Westfield Sydney',     address: 'Sydney CBD, NSW', rating: '4.8' },
      { id: 'chatswood',  name: 'Chatswood Chase',      address: 'Chatswood, NSW',  rating: '4.7' },
      { id: 'parramatta', name: 'Westfield Parramatta', address: 'Parramatta, NSW', rating: '4.8' },
    ],
  },
];

// Flat list still used for mobile
const allClinics = clusters.flatMap(c => c.clinics.map(cl => ({ ...cl, cluster: c.id })));

// ─── Component ────────────────────────────────────────────────────────────────

export default function InkMapSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef  = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState<Cluster | null>(null);
  const [locked,  setLocked]  = useState<Cluster | null>(null);

  const display = locked ?? hovered;

  const handleDotClick = (c: Cluster, e: React.MouseEvent) => {
    e.stopPropagation();
    setLocked(prev => prev?.id === c.id ? null : c);
  };

  useEffect(() => {
    const triggers: ScrollTrigger[] = [];
    if (headerRef.current) {
      const t = gsap.fromTo(headerRef.current, { opacity: 0, y: 32 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none none' },
      });
      if (t.scrollTrigger) triggers.push(t.scrollTrigger);
    }
    const dots = sectionRef.current?.querySelectorAll('.loc-dot');
    if (dots) {
      const t = gsap.fromTo(dots, { scale: 0, opacity: 0 }, {
        scale: 1, opacity: 1, duration: 0.4, stagger: 0.07, ease: 'back.out(1.7)',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', toggleActions: 'play none none none' },
      });
      if (t.scrollTrigger) triggers.push(t.scrollTrigger);
    }
    return () => { triggers.forEach(t => t.kill()); };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative py-24 lg:py-36 overflow-hidden"
      style={{ backgroundColor: '#0D0A06' }}
      onClick={() => setLocked(null)}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">

        <div ref={headerRef} className="text-center mb-12 lg:mb-16 opacity-0">
          <span className="label-style text-chi-cinnabar block mb-3">FIND YOUR NEAREST CLINIC</span>
          <h2 className="font-display text-chi-parchment" style={{ fontSize: 'clamp(40px,4.5vw,64px)', lineHeight: 0.95, letterSpacing: '-0.03em' }}>
            23 locations,<br />one philosophy.
          </h2>
        </div>

        {/* Desktop map */}
        <div
          className="hidden lg:block"
          style={{ position: 'relative', maxWidth: '520px', width: '52%', margin: '0 auto' }}
          onClick={e => e.stopPropagation()}
        >
          <div style={{ position: 'relative', paddingBottom: '93.13%' }}>

            <img
              src="/images/MrTim_Australia_Outline.svg"
              alt="Australia map"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', filter: 'brightness(0) invert(1)', opacity: 0.28 }}
            />

            <svg
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
              viewBox="0 0 674.71 628.37"
              fill="none"
            >
              {/* State labels */}
              <text x="168" y="258" fill="rgba(255,255,255,0.16)" fontSize="11" fontFamily="Syne,sans-serif" letterSpacing="1">WA</text>
              <text x="338" y="168" fill="rgba(255,255,255,0.16)" fontSize="11" fontFamily="Syne,sans-serif" letterSpacing="1">NT</text>
              <text x="386" y="358" fill="rgba(255,255,255,0.16)" fontSize="11" fontFamily="Syne,sans-serif" letterSpacing="1">SA</text>
              <text x="546" y="246" fill="rgba(255,255,255,0.16)" fontSize="11" fontFamily="Syne,sans-serif" letterSpacing="1">QLD</text>
              <text x="558" y="385" fill="rgba(255,255,255,0.16)" fontSize="11" fontFamily="Syne,sans-serif" letterSpacing="1">NSW</text>
              <text x="520" y="474" fill="rgba(255,255,255,0.16)" fontSize="11" fontFamily="Syne,sans-serif" letterSpacing="1">VIC</text>
              <text x="540" y="574" fill="rgba(255,255,255,0.13)" fontSize="9"  fontFamily="Syne,sans-serif" letterSpacing="1">TAS</text>

              {clusters.map(c => {
                const isLocked  = locked?.id === c.id;
                const isActive  = isLocked || hovered?.id === c.id;
                const multi     = c.clinics.length > 1;

                return (
                  <g
                    key={c.id}
                    className="loc-dot"
                    style={{ transformOrigin: `${c.cx}px ${c.cy}px`, cursor: 'pointer' }}
                    onMouseEnter={() => setHovered(c)}
                    onMouseLeave={() => setHovered(null)}
                    onClick={e => handleDotClick(c, e)}
                  >
                    {/* Pulse ring */}
                    <circle cx={c.cx} cy={c.cy} r="9" fill="none" stroke="#B8311F" strokeWidth="0.6" opacity="0">
                      <animate attributeName="r"       values="9;20;9"    dur="2.8s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.4;0;0.4" dur="2.8s" repeatCount="indefinite" />
                    </circle>
                    {/* Lock ring */}
                    {isLocked && <circle cx={c.cx} cy={c.cy} r="11" fill="none" stroke="#B8311F" strokeWidth="1.5" opacity="0.6" />}
                    {/* Solid dot — slightly larger for multi-location clusters */}
                    <circle
                      cx={c.cx} cy={c.cy}
                      r={multi ? 8 : 6}
                      fill={isActive ? '#FF4D2E' : '#B8311F'}
                      stroke="rgba(245,240,227,0.35)"
                      strokeWidth="1"
                      style={{ transition: 'fill 0.15s' }}
                    />
                    {/* Count badge for multi-clinic clusters */}
                    {multi && (
                      <text
                        x={c.cx} y={c.cy + 4}
                        textAnchor="middle"
                        fill="#F5F0E3"
                        fontSize="7"
                        fontFamily="Syne,sans-serif"
                        fontWeight="600"
                        style={{ pointerEvents: 'none', userSelect: 'none' }}
                      >
                        {c.clinics.length}
                      </text>
                    )}
                  </g>
                );
              })}
            </svg>

            {/* Tooltip */}
            {display && (
              <div
                className="absolute z-10 rounded-chi"
                style={{
                  backgroundColor: '#F5F0E3',
                  border: '1px solid rgba(201,144,58,0.2)',
                  left: `${(display.cx / 674.71) * 100}%`,
                  top:  `${(display.cy / 628.37) * 100}%`,
                  transform: 'translate(-50%, -115%)',
                  minWidth: '220px',
                  maxWidth: '260px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  pointerEvents: locked ? 'auto' : 'none',
                }}
                onClick={e => e.stopPropagation()}
              >
                {/* Header */}
                <div className="flex items-center justify-between px-4 pt-3 pb-2" style={{ borderBottom: '1px solid rgba(0,0,0,0.07)' }}>
                  <span className="font-display text-chi-ink text-sm">{display.label}</span>
                  <span className="font-body text-chi-mist text-xs">{display.clinics.length} {display.clinics.length === 1 ? 'location' : 'locations'}</span>
                </div>
                {/* Clinic list */}
                <div className="py-1">
                  {display.clinics.map((cl, i) => (
                    <div
                      key={cl.id}
                      className="flex items-center justify-between px-4 py-2"
                      style={{ borderBottom: i < display.clinics.length - 1 ? '1px solid rgba(0,0,0,0.05)' : 'none' }}
                    >
                      <div>
                        <p className="font-display text-chi-ink text-xs leading-tight">{cl.name}</p>
                        <div className="flex items-center gap-0.5 mt-0.5">
                          {[1,2,3,4,5].map(s => (
                            <svg key={s} width="8" height="8" viewBox="0 0 16 16" fill="#C9903A">
                              <path d="M8 0l2.47 5.01L16 5.81l-4 3.9.94 5.5L8 12.88l-4.94 2.6.94-5.5-4-3.9 5.53-.8z"/>
                            </svg>
                          ))}
                          <span className="font-body text-[10px] ml-0.5" style={{ color: '#C9903A' }}>{cl.rating}</span>
                        </div>
                      </div>
                      <Link
                        to={`/booking?clinic=${cl.id}`}
                        className="font-body text-chi-cinnabar text-xs hover:underline ml-3 flex-shrink-0"
                      >
                        Book →
                      </Link>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile list */}
        <div className="lg:hidden"><MobileLocationList /></div>

        <div className="text-center mt-10">
          <a href="/locations" className="font-body text-chi-smoke text-sm hover:text-chi-cinnabar transition-colors duration-300">
            All 23 locations · View full list →
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Mobile list ──────────────────────────────────────────────────────────────

function MobileLocationList() {
  const [activeTab, setActiveTab] = useState('all');
  const tabs = [
    { key: 'all',            label: 'All'            },
    { key: 'brisbane-cbd',   label: 'Brisbane'       },
    { key: 'gold-coast',     label: 'Gold Coast'     },
    { key: 'sunshine-coast', label: 'Sunshine Coast' },
    { key: 'sydney',         label: 'Sydney'         },
  ];

  const filtered = activeTab === 'all'
    ? allClinics
    : allClinics.filter(l => {
        if (activeTab === 'brisbane-cbd')
          return ['brisbane-cbd','brisbane-north','brisbane-west','brisbane-south','toowoomba'].includes(l.cluster);
        return l.cluster === activeTab;
      });

  return (
    <div>
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map(tab => (
          <button key={tab.key} onClick={() => setActiveTab(tab.key)}
            className="px-4 py-2 rounded-chi font-body text-[13px] uppercase tracking-wider whitespace-nowrap transition-all duration-200"
            style={{ backgroundColor: activeTab === tab.key ? '#B8311F' : 'transparent', color: activeTab === tab.key ? '#F5F0E3' : '#8C8478' }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map(loc => (
          <div key={loc.id} className="flex items-center justify-between p-4 rounded-chi" style={{ backgroundColor: '#1A1208' }}>
            <div>
              <h4 className="font-display text-chi-parchment text-base">{loc.name}</h4>
              <p className="font-body text-chi-smoke text-sm">{loc.address}</p>
            </div>
            <Link to={`/booking?clinic=${loc.id}`} className="px-4 py-2 bg-chi-cinnabar text-chi-parchment font-body text-sm rounded-chi">Book</Link>
          </div>
        ))}
      </div>
    </div>
  );
}
