import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

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

// Coordinates calculated against the actual SVG viewBox (0 0 674.71 628.37)
// Reference: Cape Byron (easternmost tip) ≈ SVG(671.96, 332.10) = 153.63°E, 28.63°S
// Scale: ~15.56 SVG units/° longitude, ~19.29 SVG units/° latitude-south
const locations: Location[] = [
  { id: 'anzac-square',  name: 'Anzac Square',         address: 'Brisbane CBD, QLD',      cx: 662, cy: 310, rating: '4.9', cluster: 'brisbane' },
  { id: 'queens-plaza',  name: 'Queens Plaza',          address: 'Brisbane CBD, QLD',      cx: 664, cy: 307, rating: '4.8', cluster: 'brisbane' },
  { id: 'garden-city',   name: 'Garden City',           address: 'Upper Mt Gravatt, QLD',  cx: 663, cy: 312, rating: '4.9', cluster: 'brisbane' },
  { id: 'indooroopilly', name: 'Indooroopilly',         address: 'Indooroopilly, QLD',     cx: 659, cy: 310, rating: '4.7', cluster: 'brisbane' },
  { id: 'chermside',     name: 'Westfield Chermside',   address: 'Chermside, QLD',         cx: 663, cy: 305, rating: '4.8', cluster: 'brisbane' },
  { id: 'robina',        name: 'Robina Town Centre',    address: 'Robina, QLD',            cx: 668, cy: 321, rating: '4.7', cluster: 'gold-coast' },
  { id: 'pacific-fair',  name: 'Pacific Fair',          address: 'Broadbeach, QLD',        cx: 669, cy: 324, rating: '4.8', cluster: 'gold-coast' },
  { id: 'maroochydore',  name: 'Sunshine Plaza',        address: 'Maroochydore, QLD',      cx: 663, cy: 291, rating: '4.9', cluster: 'sunshine-coast' },
  { id: 'kawana',        name: 'Kawana Waters',         address: 'Bokarina, QLD',          cx: 663, cy: 295, rating: '4.8', cluster: 'sunshine-coast' },
  { id: 'sydney-cbd',    name: 'Westfield Sydney',      address: 'Sydney CBD, NSW',        cx: 634, cy: 433, rating: '4.8', cluster: 'sydney' },
  { id: 'chatswood',     name: 'Chatswood Chase',       address: 'Chatswood, NSW',         cx: 634, cy: 430, rating: '4.7', cluster: 'sydney' },
  { id: 'parramatta',    name: 'Westfield Parramatta',  address: 'Parramatta, NSW',        cx: 631, cy: 432, rating: '4.8', cluster: 'sydney' },
  { id: 'ipswich',       name: 'Riverlink',             address: 'Ipswich, QLD',           cx: 657, cy: 313, rating: '4.7', cluster: 'brisbane' },
  { id: 'toowoomba',     name: 'Grand Central',         address: 'Toowoomba, QLD',         cx: 646, cy: 312, rating: '4.8', cluster: 'brisbane' },
  { id: 'broadbeach',    name: 'The Oasis',             address: 'Broadbeach, QLD',        cx: 670, cy: 322, rating: '4.7', cluster: 'gold-coast' },
];

export default function InkMapSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const [activeLocation, setActiveLocation] = useState<Location | null>(null);

  useEffect(() => {
    const triggers: ScrollTrigger[] = [];

    if (headerRef.current) {
      const hTween = gsap.fromTo(
        headerRef.current,
        { opacity: 0, y: 32 },
        {
          opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none none' },
        }
      );
      if (hTween.scrollTrigger) triggers.push(hTween.scrollTrigger);
    }

    const dots = sectionRef.current?.querySelectorAll('.location-dot');
    if (dots) {
      const dTween = gsap.fromTo(
        dots,
        { scale: 0, opacity: 0 },
        {
          scale: 1, opacity: 1, duration: 0.4, stagger: 0.06, ease: 'back.out(1.7)',
          scrollTrigger: { trigger: sectionRef.current, start: 'top 60%', toggleActions: 'play none none none' },
        }
      );
      if (dTween.scrollTrigger) triggers.push(dTween.scrollTrigger);
    }

    return () => { triggers.forEach((t) => t.kill()); };
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-36 overflow-hidden" style={{ backgroundColor: '#0D0A06' }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div ref={headerRef} className="text-center mb-12 lg:mb-16 opacity-0">
          <span className="label-style text-chi-cinnabar block mb-3">FIND YOUR NEAREST CLINIC</span>
          <h2 className="font-display text-chi-parchment" style={{ fontSize: 'clamp(40px, 4.5vw, 64px)', lineHeight: 0.95, letterSpacing: '-0.03em' }}>
            23 locations,<br />one philosophy.
          </h2>
        </div>

        {/* Desktop: Actual Australia SVG Map */}
        <div className="hidden lg:block" style={{ position: 'relative', maxWidth: '540px', width: '55%', margin: '0 auto' }}>
          <div style={{ position: 'relative', paddingBottom: '93.13%' }}>
            {/* Real Australia outline SVG as img */}
            <img
              src="/images/MrTim_Australia_Outline.svg"
              alt="Australia map"
              style={{
                position: 'absolute', inset: 0,
                width: '100%', height: '100%',
                filter: 'brightness(0) invert(1)',
                opacity: 0.28,
              }}
            />

            {/* Dots overlay — same viewBox as the SVG file */}
            <svg
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
              viewBox="0 0 674.71 628.37"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* State labels */}
              <text x="175" y="262" fill="rgba(255,255,255,0.18)" fontSize="11" fontFamily="Syne, sans-serif" letterSpacing="1">WA</text>
              <text x="340" y="170" fill="rgba(255,255,255,0.18)" fontSize="11" fontFamily="Syne, sans-serif" letterSpacing="1">NT</text>
              <text x="390" y="360" fill="rgba(255,255,255,0.18)" fontSize="11" fontFamily="Syne, sans-serif" letterSpacing="1">SA</text>
              <text x="548" y="248" fill="rgba(255,255,255,0.18)" fontSize="11" fontFamily="Syne, sans-serif" letterSpacing="1">QLD</text>
              <text x="560" y="388" fill="rgba(255,255,255,0.18)" fontSize="11" fontFamily="Syne, sans-serif" letterSpacing="1">NSW</text>
              <text x="522" y="476" fill="rgba(255,255,255,0.18)" fontSize="11" fontFamily="Syne, sans-serif" letterSpacing="1">VIC</text>
              <text x="542" y="576" fill="rgba(255,255,255,0.15)" fontSize="9"  fontFamily="Syne, sans-serif" letterSpacing="1">TAS</text>

              {/* Location dots */}
              {locations.map((loc) => (
                <g
                  key={loc.id}
                  className="location-dot"
                  style={{ transformOrigin: `${loc.cx}px ${loc.cy}px`, cursor: 'pointer' }}
                  onMouseEnter={() => setActiveLocation(loc)}
                  onMouseLeave={() => setActiveLocation(null)}
                >
                  <circle cx={loc.cx} cy={loc.cy} r="10" fill="none" stroke="#B8311F" strokeWidth="0.5" opacity="0.2">
                    <animate attributeName="r" values="7;12;7" dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.3;0;0.3" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                  <circle cx={loc.cx} cy={loc.cy} r="3.5" fill="#B8311F" />
                </g>
              ))}
            </svg>

            {/* Tooltip */}
            {activeLocation && (
              <div
                className="absolute z-10 p-4 rounded-chi pointer-events-none"
                style={{
                  backgroundColor: '#F5F0E3',
                  border: '1px solid rgba(201, 144, 58, 0.2)',
                  left: `${(activeLocation.cx / 674.71) * 100}%`,
                  top: `${(activeLocation.cy / 628.37) * 100}%`,
                  transform: 'translate(-108%, -120%)',
                  minWidth: '200px',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
                }}
              >
                <h4 className="font-display text-chi-ink text-base mb-0.5">{activeLocation.name}</h4>
                <p className="font-body text-chi-smoke text-xs mb-2">{activeLocation.address}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1">
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="#C9903A"><path d="M8 0l2.47 5.01L16 5.81l-4 3.9.94 5.5L8 12.88l-4.94 2.6.94-5.5-4-3.9 5.53-.8z" /></svg>
                    <span className="font-body text-chi-gold text-xs">{activeLocation.rating}</span>
                  </div>
                  <a href={`https://bookrelax.com.au/booking?clinic=${activeLocation.id}`} target="_blank" rel="noopener noreferrer" className="font-body text-chi-cinnabar text-xs hover:underline">Book →</a>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile: tab-filtered list */}
        <div className="lg:hidden"><MobileLocationList /></div>

        <div className="text-center mt-10">
          <a href="/locations" className="font-body text-chi-smoke text-sm hover:text-chi-cinnabar transition-colors duration-300">All 23 locations · View full list →</a>
        </div>
      </div>
    </section>
  );
}

function MobileLocationList() {
  const [activeTab, setActiveTab] = useState('all');
  const tabs = [
    { key: 'all', label: 'All' },
    { key: 'brisbane', label: 'Brisbane' },
    { key: 'gold-coast', label: 'Gold Coast' },
    { key: 'sunshine-coast', label: 'Sunshine Coast' },
    { key: 'sydney', label: 'Sydney' },
  ];

  const filtered = activeTab === 'all' ? locations : locations.filter((l) => l.cluster === activeTab);

  return (
    <div>
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="px-4 py-2 rounded-chi font-body text-[13px] uppercase tracking-wider whitespace-nowrap transition-all duration-200"
            style={{
              backgroundColor: activeTab === tab.key ? '#B8311F' : 'transparent',
              color: activeTab === tab.key ? '#F5F0E3' : '#8C8478',
              borderBottom: activeTab === tab.key ? 'none' : '2px solid transparent',
              fontWeight: activeTab === tab.key ? 500 : 400,
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="space-y-3">
        {filtered.map((loc) => (
          <div key={loc.id} className="flex items-center justify-between p-4 rounded-chi" style={{ backgroundColor: '#1A1208' }}>
            <div>
              <h4 className="font-display text-chi-parchment text-base">{loc.name}</h4>
              <p className="font-body text-chi-smoke text-sm">{loc.address}</p>
            </div>
            <a href={`https://bookrelax.com.au/booking?clinic=${loc.id}`} target="_blank" rel="noopener noreferrer" className="px-4 py-2 bg-chi-cinnabar text-chi-parchment font-body text-sm rounded-chi">Book</a>
          </div>
        ))}
      </div>
    </div>
  );
}
