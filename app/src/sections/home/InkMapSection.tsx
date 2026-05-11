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

const locations: Location[] = [
  { id: 'anzac-square', name: 'Anzac Square', address: 'Brisbane CBD, QLD', cx: 480, cy: 208, rating: '4.9', cluster: 'brisbane' },
  { id: 'queens-plaza', name: 'Queens Plaza', address: 'Brisbane CBD, QLD', cx: 485, cy: 203, rating: '4.8', cluster: 'brisbane' },
  { id: 'garden-city', name: 'Garden City', address: 'Upper Mt Gravatt, QLD', cx: 490, cy: 215, rating: '4.9', cluster: 'brisbane' },
  { id: 'indooroopilly', name: 'Indooroopilly', address: 'Indooroopilly, QLD', cx: 475, cy: 212, rating: '4.7', cluster: 'brisbane' },
  { id: 'chermside', name: 'Westfield Chermside', address: 'Chermside, QLD', cx: 488, cy: 200, rating: '4.8', cluster: 'brisbane' },
  { id: 'robina', name: 'Robina Town Centre', address: 'Robina, QLD', cx: 495, cy: 238, rating: '4.7', cluster: 'gold-coast' },
  { id: 'pacific-fair', name: 'Pacific Fair', address: 'Broadbeach, QLD', cx: 497, cy: 242, rating: '4.8', cluster: 'gold-coast' },
  { id: 'maroochydore', name: 'Sunshine Plaza', address: 'Maroochydore, QLD', cx: 485, cy: 182, rating: '4.9', cluster: 'sunshine-coast' },
  { id: 'kawana', name: 'Kawana Waters', address: 'Bokarina, QLD', cx: 488, cy: 185, rating: '4.8', cluster: 'sunshine-coast' },
  { id: 'sydney-cbd', name: 'Westfield Sydney', address: 'Sydney CBD, NSW', cx: 530, cy: 310, rating: '4.8', cluster: 'sydney' },
  { id: 'chatswood', name: 'Chatswood Chase', address: 'Chatswood, NSW', cx: 535, cy: 302, rating: '4.7', cluster: 'sydney' },
  { id: 'parramatta', name: 'Westfield Parramatta', address: 'Parramatta, NSW', cx: 528, cy: 305, rating: '4.8', cluster: 'sydney' },
  { id: 'ipswich', name: 'Riverlink', address: 'Ipswich, QLD', cx: 472, cy: 215, rating: '4.7', cluster: 'brisbane' },
  { id: 'toowoomba', name: 'Grand Central', address: 'Toowoomba, QLD', cx: 465, cy: 220, rating: '4.8', cluster: 'brisbane' },
  { id: 'broadbeach', name: 'The Oasis', address: 'Broadbeach, QLD', cx: 495, cy: 240, rating: '4.7', cluster: 'gold-coast' },
];

const ausOutline = "M120,280 Q130,260 150,240 Q170,210 200,190 Q230,170 260,160 Q290,150 320,145 Q350,142 380,140 Q410,138 440,140 Q470,142 500,148 Q530,155 550,170 Q570,185 585,205 Q600,225 610,248 Q620,270 625,295 Q630,320 628,345 Q626,370 618,390 Q610,410 598,425 Q586,440 570,450 Q554,460 535,465 Q516,470 498,468 Q480,466 465,458 Q450,450 438,438 Q426,426 418,410 Q410,394 405,376 Q400,358 398,340 Q396,322 395,305 Q394,288 392,272 Q390,256 386,242 Q382,228 375,216 Q368,204 358,195 Q348,186 336,180 Q324,174 310,172 Q296,170 282,172 Q268,174 254,180 Q240,186 228,196 Q216,206 206,218 Q196,230 188,244 Q180,258 174,272 Q168,286 162,300 Q156,314 148,326 Q140,338 130,348 Q120,358 110,365 Q100,372 92,378 Q84,384 78,390 Q72,396 68,402 Q64,408 62,414 Q60,420 62,426 Q64,432 68,436 Q72,440 78,442 Q84,444 90,442 Q96,440 100,436 Q104,432 106,426 Q108,420 110,414 Q112,408 115,402 Q118,396 120,390 Q122,384 122,378 Q122,372 120,366 Q118,360 116,354 Q114,348 114,342 Q114,336 116,330 Q118,324 120,318 Q122,312 122,306 Q122,300 120,294 Q118,288 116,282 Q114,276 114,270 Q114,264 116,258 Q118,252 120,280 Z";

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

        {/* Desktop: Full Australia SVG Map */}
        <div className="hidden lg:block relative w-[70%] mx-auto" style={{ paddingBottom: '55%' }}>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 700 500" fill="none" xmlns="http://www.w3.org/2000/svg">
            {/* Australia continent outline */}
            <path d={ausOutline} stroke="rgba(201, 144, 58, 0.25)" strokeWidth="0.8" fill="none" />
            {/* State borders */}
            <path d="M320,145 Q 330,180, 340,220 Q 350,260, 345,300 Q 340,340, 330,380" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" fill="none" />
            <path d="M440,140 Q 445,200, 450,260 Q 455,320, 445,380" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" fill="none" />
            <path d="M200,190 Q 260,185, 320,180 Q 380,175, 440,170" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" fill="none" />
            <path d="M395,305 Q 420,310, 445,315 Q 470,320, 500,325" stroke="rgba(255,255,255,0.06)" strokeWidth="0.5" fill="none" />
            {/* TAS */}
            <ellipse cx="540" cy="440" rx="18" ry="12" stroke="rgba(201, 144, 58, 0.2)" strokeWidth="0.6" fill="none" />
            {/* State labels */}
            <text x="430" y="260" fill="rgba(255,255,255,0.15)" fontSize="9" fontFamily="Syne">SA</text>
            <text x="340" y="210" fill="rgba(255,255,255,0.15)" fontSize="9" fontFamily="Syne">NT</text>
            <text x="250" y="350" fill="rgba(255,255,255,0.15)" fontSize="9" fontFamily="Syne">WA</text>
            <text x="485" y="250" fill="rgba(255,255,255,0.15)" fontSize="9" fontFamily="Syne">QLD</text>
            <text x="510" y="340" fill="rgba(255,255,255,0.15)" fontSize="9" fontFamily="Syne">NSW</text>
            <text x="470" y="390" fill="rgba(255,255,255,0.15)" fontSize="9" fontFamily="Syne">VIC</text>
            <text x="535" y="450" fill="rgba(255,255,255,0.15)" fontSize="8" fontFamily="Syne">TAS</text>

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
                <circle cx={loc.cx} cy={loc.cy} r="4" fill="#B8311F" />
              </g>
            ))}

            {/* International dot (lighter) */}
            <g style={{ cursor: 'pointer' }} onMouseEnter={() => setActiveLocation({ id: 'komodo', name: 'Komodo', address: 'Komodo, Indonesia', cx: 120, cy: 280, rating: '4.9', cluster: 'international' })} onMouseLeave={() => setActiveLocation(null)}>
              <circle cx="120" cy="280" r="4" fill="#C9903A" opacity="0.7" />
              <text x="128" y="284" fill="rgba(201, 144, 58, 0.5)" fontSize="8" fontFamily="Syne">(International)</text>
            </g>
          </svg>

          {/* Tooltip */}
          {activeLocation && (
            <div
              className="absolute z-10 p-4 rounded-chi"
              style={{
                backgroundColor: '#F5F0E3',
                border: '1px solid rgba(201, 144, 58, 0.2)',
                left: `${(activeLocation.cx / 700) * 100}%`,
                top: `${(activeLocation.cy / 500) * 100}%`,
                transform: 'translate(-50%, -120%)',
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
