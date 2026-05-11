import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { Link } from 'react-router-dom';

gsap.registerPlugin(ScrollTrigger);

interface Location {
  id: string;
  name: string;
  address: string;
  cx: number;
  cy: number;
  rating: string;
  cluster: string;
}

const locations: Location[] = [
  { id: 'maroochydore',  name: 'Sunshine Plaza',        address: 'Maroochydore, QLD',     cx: 656, cy: 279, rating: '4.9', cluster: 'sunshine-coast' },
  { id: 'kawana',        name: 'Kawana Waters',          address: 'Bokarina, QLD',          cx: 667, cy: 287, rating: '4.8', cluster: 'sunshine-coast' },
  { id: 'anzac-square',  name: 'Anzac Square',           address: 'Brisbane CBD, QLD',      cx: 657, cy: 296, rating: '4.9', cluster: 'brisbane' },
  { id: 'queens-plaza',  name: 'Queens Plaza',           address: 'Brisbane CBD, QLD',      cx: 667, cy: 293, rating: '4.8', cluster: 'brisbane' },
  { id: 'chermside',     name: 'Westfield Chermside',    address: 'Chermside, QLD',         cx: 651, cy: 303, rating: '4.8', cluster: 'brisbane' },
  { id: 'garden-city',   name: 'Garden City',            address: 'Upper Mt Gravatt, QLD',  cx: 664, cy: 308, rating: '4.9', cluster: 'brisbane' },
  { id: 'indooroopilly', name: 'Indooroopilly',          address: 'Indooroopilly, QLD',     cx: 651, cy: 312, rating: '4.7', cluster: 'brisbane' },
  { id: 'ipswich',       name: 'Riverlink',              address: 'Ipswich, QLD',           cx: 641, cy: 316, rating: '4.7', cluster: 'brisbane' },
  { id: 'toowoomba',     name: 'Grand Central',          address: 'Toowoomba, QLD',         cx: 627, cy: 313, rating: '4.8', cluster: 'brisbane' },
  { id: 'robina',        name: 'Robina Town Centre',     address: 'Robina, QLD',            cx: 659, cy: 321, rating: '4.7', cluster: 'gold-coast' },
  { id: 'pacific-fair',  name: 'Pacific Fair',           address: 'Broadbeach, QLD',        cx: 669, cy: 318, rating: '4.8', cluster: 'gold-coast' },
  { id: 'broadbeach',    name: 'The Oasis',              address: 'Broadbeach, QLD',        cx: 665, cy: 328, rating: '4.7', cluster: 'gold-coast' },
  { id: 'sydney-cbd',    name: 'Westfield Sydney',       address: 'Sydney CBD, NSW',        cx: 634, cy: 438, rating: '4.8', cluster: 'sydney' },
  { id: 'chatswood',     name: 'Chatswood Chase',        address: 'Chatswood, NSW',         cx: 641, cy: 429, rating: '4.7', cluster: 'sydney' },
  { id: 'parramatta',    name: 'Westfield Parramatta',   address: 'Parramatta, NSW',        cx: 623, cy: 434, rating: '4.8', cluster: 'sydney' },
];

export default function InkMapSection() {
  const sectionRef       = useRef<HTMLDivElement>(null);
  const headerRef        = useRef<HTMLDivElement>(null);
  const [hoveredLocation, setHoveredLocation] = useState<Location | null>(null);
  const [lockedLocation,  setLockedLocation]  = useState<Location | null>(null);

  // What to display: locked takes priority over hovered
  const displayLocation = lockedLocation ?? hoveredLocation;

  const handleDotClick = (loc: Location, e: React.MouseEvent) => {
    e.stopPropagation();
    setLockedLocation(prev => prev?.id === loc.id ? null : loc);
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
    const dots = sectionRef.current?.querySelectorAll('.location-dot');
    if (dots) {
      const t = gsap.fromTo(dots, { scale: 0, opacity: 0 }, {
        scale: 1, opacity: 1, duration: 0.4, stagger: 0.05, ease: 'back.out(1.7)',
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
      onClick={() => setLockedLocation(null)}
    >
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">

        <div ref={headerRef} className="text-center mb-12 lg:mb-16 opacity-0">
          <span className="label-style text-chi-cinnabar block mb-3">FIND YOUR NEAREST CLINIC</span>
          <h2 className="font-display text-chi-parchment" style={{ fontSize: 'clamp(40px, 4.5vw, 64px)', lineHeight: 0.95, letterSpacing: '-0.03em' }}>
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

            {/* Real Australia SVG outline */}
            <img
              src="/images/MrTim_Australia_Outline.svg"
              alt="Australia map"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', filter: 'brightness(0) invert(1)', opacity: 0.28 }}
            />

            {/* Dot overlay — viewBox matches SVG file */}
            <svg
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
              viewBox="0 0 674.71 628.37"
              fill="none"
            >
              {/* State labels */}
              <text x="168" y="258" fill="rgba(255,255,255,0.16)" fontSize="11" fontFamily="Syne, sans-serif" letterSpacing="1">WA</text>
              <text x="338" y="168" fill="rgba(255,255,255,0.16)" fontSize="11" fontFamily="Syne, sans-serif" letterSpacing="1">NT</text>
              <text x="386" y="358" fill="rgba(255,255,255,0.16)" fontSize="11" fontFamily="Syne, sans-serif" letterSpacing="1">SA</text>
              <text x="546" y="246" fill="rgba(255,255,255,0.16)" fontSize="11" fontFamily="Syne, sans-serif" letterSpacing="1">QLD</text>
              <text x="558" y="385" fill="rgba(255,255,255,0.16)" fontSize="11" fontFamily="Syne, sans-serif" letterSpacing="1">NSW</text>
              <text x="520" y="474" fill="rgba(255,255,255,0.16)" fontSize="11" fontFamily="Syne, sans-serif" letterSpacing="1">VIC</text>
              <text x="540" y="574" fill="rgba(255,255,255,0.13)" fontSize="9"  fontFamily="Syne, sans-serif" letterSpacing="1">TAS</text>

              {locations.map((loc) => {
                const isLocked  = lockedLocation?.id === loc.id;
                const isActive  = isLocked || hoveredLocation?.id === loc.id;
                return (
                  <g
                    key={loc.id}
                    className="location-dot"
                    style={{ transformOrigin: `${loc.cx}px ${loc.cy}px`, cursor: 'pointer' }}
                    onMouseEnter={() => setHoveredLocation(loc)}
                    onMouseLeave={() => setHoveredLocation(null)}
                    onClick={e => handleDotClick(loc, e)}
                  >
                    {/* Animated pulse ring */}
                    <circle cx={loc.cx} cy={loc.cy} r="9" fill="none" stroke="#B8311F" strokeWidth="0.6" opacity="0">
                      <animate attributeName="r"       values="9;18;9"    dur="2.8s" repeatCount="indefinite" />
                      <animate attributeName="opacity" values="0.4;0;0.4" dur="2.8s" repeatCount="indefinite" />
                    </circle>
                    {/* Locked-state outer ring */}
                    {isLocked && (
                      <circle cx={loc.cx} cy={loc.cy} r="9" fill="none" stroke="#B8311F" strokeWidth="1.5" opacity="0.6" />
                    )}
                    {/* Solid dot */}
                    <circle
                      cx={loc.cx} cy={loc.cy} r="7"
                      fill={isActive ? '#FF4D2E' : '#B8311F'}
                      stroke="rgba(245,240,227,0.3)"
                      strokeWidth="0.8"
                      style={{ transition: 'fill 0.15s' }}
                    />
                  </g>
                );
              })}
            </svg>

            {/* ── Tooltip — original simple card design ── */}
            {displayLocation && (
              <div
                className="absolute z-10 p-4 rounded-chi"
                style={{
                  backgroundColor: '#F5F0E3',
                  border: '1px solid rgba(201, 144, 58, 0.2)',
                  left: `${(displayLocation.cx / 674.71) * 100}%`,
                  top:  `${(displayLocation.cy / 628.37) * 100}%`,
                  transform: 'translate(-50%, -120%)',
                  minWidth: '200px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                  pointerEvents: lockedLocation ? 'auto' : 'none',
                }}
                onClick={e => e.stopPropagation()}
              >
                <h4 className="font-display text-chi-ink text-base mb-0.5">{displayLocation.name}</h4>
                <p className="font-body text-chi-smoke text-xs mb-2">{displayLocation.address}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map(s => (
                      <svg key={s} width="12" height="12" viewBox="0 0 16 16" fill="#C9903A">
                        <path d="M8 0l2.47 5.01L16 5.81l-4 3.9.94 5.5L8 12.88l-4.94 2.6.94-5.5-4-3.9 5.53-.8z" />
                      </svg>
                    ))}
                    <span className="font-body text-xs ml-1" style={{ color: '#C9903A' }}>{displayLocation.rating}</span>
                  </div>
                  <Link
                    to={`/booking?clinic=${displayLocation.id}`}
                    className="font-body text-chi-cinnabar text-xs hover:underline"
                  >
                    Book →
                  </Link>
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

function MobileLocationList() {
  const [activeTab, setActiveTab] = useState('all');
  const tabs = [
    { key: 'all',            label: 'All'            },
    { key: 'brisbane',       label: 'Brisbane'       },
    { key: 'gold-coast',     label: 'Gold Coast'     },
    { key: 'sunshine-coast', label: 'Sunshine Coast' },
    { key: 'sydney',         label: 'Sydney'         },
  ];
  const filtered = activeTab === 'all' ? locations : locations.filter(l => l.cluster === activeTab);

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
