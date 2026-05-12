import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface LocationItem {
  slug: string;
  name: string;
  address: string;
  image: string;
  services: string[];
  rating: string;
  reviews: number;
  state: string;
}

const allLocations: LocationItem[] = [
  { slug: 'anzac-square', name: 'Anzac Square', address: '200 Edward St, Brisbane CBD, QLD', image: '/images/clinic-interior.jpg', services: ['Acupuncture', 'Massage', 'Head Spa'], rating: '4.9', reviews: 312, state: 'brisbane' },
  { slug: 'queens-plaza', name: 'Queens Plaza', address: '226 Queen St, Brisbane CBD, QLD', image: '/images/clinic-interior.jpg', services: ['Acupuncture', 'Massage', 'Cupping'], rating: '4.8', reviews: 278, state: 'brisbane' },
  { slug: 'garden-city', name: 'Garden City', address: 'Logan Rd, Upper Mt Gravatt, QLD', image: '/images/clinic-interior.jpg', services: ['Massage', 'Head Spa', 'Reflexology'], rating: '4.9', reviews: 195, state: 'brisbane' },
  { slug: 'chermside', name: 'Westfield Chermside', address: 'Hamilton Rd, Chermside, QLD', image: '/images/clinic-interior.jpg', services: ['Acupuncture', 'Massage', 'Cupping', 'Herbal'], rating: '4.8', reviews: 234, state: 'brisbane' },
  { slug: 'indooroopilly', name: 'Indooroopilly', address: 'Station Rd, Indooroopilly, QLD', image: '/images/clinic-interior.jpg', services: ['Massage', 'Head Spa'], rating: '4.7', reviews: 156, state: 'brisbane' },
  { slug: 'robina', name: 'Robina Town Centre', address: 'Robina Town Centre Dr, Robina, QLD', image: '/images/clinic-interior.jpg', services: ['Massage', 'Acupuncture', 'Head Spa'], rating: '4.7', reviews: 189, state: 'gold-coast' },
  { slug: 'pacific-fair', name: 'Pacific Fair', address: 'Hooker Blvd, Broadbeach, QLD', image: '/images/clinic-interior.jpg', services: ['Massage', 'Cupping', 'Reflexology'], rating: '4.8', reviews: 267, state: 'gold-coast' },
  { slug: 'maroochydore', name: 'Sunshine Plaza', address: 'Maroochydore Rd, Maroochydore, QLD', image: '/images/clinic-interior.jpg', services: ['Acupuncture', 'Massage', 'Head Spa', 'Herbal'], rating: '4.9', reviews: 145, state: 'sunshine-coast' },
  { slug: 'kawana', name: 'Kawana Waters', address: 'Nicklin Way, Bokarina, QLD', image: '/images/clinic-interior.jpg', services: ['Massage', 'Head Spa'], rating: '4.8', reviews: 98, state: 'sunshine-coast' },
  { slug: 'sydney-cbd', name: 'Westfield Sydney', address: 'Pitt St, Sydney CBD, NSW', image: '/images/clinic-interior.jpg', services: ['Acupuncture', 'Massage', 'Cupping', 'Head Spa'], rating: '4.8', reviews: 423, state: 'sydney' },
  { slug: 'chatswood', name: 'Chatswood Chase', address: 'Anderson St, Chatswood, NSW', image: '/images/clinic-interior.jpg', services: ['Massage', 'Acupuncture', 'Reflexology'], rating: '4.7', reviews: 312, state: 'sydney' },
  { slug: 'parramatta', name: 'Westfield Parramatta', address: '159-175 Church St, Parramatta, NSW', image: '/images/clinic-interior.jpg', services: ['Massage', 'Head Spa'], rating: '4.8', reviews: 278, state: 'sydney' },
];

const tabs = [
  { key: 'all', label: 'All' },
  { key: 'brisbane', label: 'Brisbane' },
  { key: 'gold-coast', label: 'Gold Coast' },
  { key: 'sunshine-coast', label: 'Sunshine Coast' },
  { key: 'sydney', label: 'Sydney' },
];

export default function LocationsHubPage() {
  const [activeTab, setActiveTab] = useState('all');
  const [search, setSearch] = useState('');
  const gridRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    if (heroRef.current) {
      gsap.fromTo(heroRef.current.querySelectorAll('.hero-anim'), { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out', delay: 0.2,
      });
    }
  }, []);

  const filtered = allLocations.filter((loc) => {
    const matchesTab = activeTab === 'all' || loc.state === activeTab;
    const matchesSearch = !search || loc.name.toLowerCase().includes(search.toLowerCase()) || loc.address.toLowerCase().includes(search.toLowerCase());
    return matchesTab && matchesSearch;
  });

  return (
    <main>
      {/* Hero */}
      <section className="relative pt-32 lg:pt-40 pb-16 lg:pb-20 min-h-[60vh] flex flex-col justify-center" style={{ backgroundColor: '#0D0A06' }}>
        <div ref={heroRef} className="max-w-[1280px] mx-auto px-6 lg:px-10 w-full">
          <h1 className="hero-anim font-display text-chi-parchment mb-8 opacity-0" style={{ fontSize: 'clamp(48px, 6vw, 72px)', lineHeight: 0.92, letterSpacing: '-0.03em' }}>
            Find your<br />Chi Link.
          </h1>

          {/* Search */}
          <div className="hero-anim relative max-w-lg mb-8 opacity-0">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Enter your suburb..."
              className="w-full px-5 py-3.5 font-body text-sm text-chi-parchment placeholder:text-chi-smoke rounded-chi focus:outline-none transition-all duration-200"
              style={{ backgroundColor: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)' }}
              onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'; }}
              onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'; }}
            />
            <svg className="absolute right-4 top-1/2 -translate-y-1/2" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#B8311F" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
          </div>

          {/* Tabs */}
          <div className="hero-anim flex gap-1 flex-wrap opacity-0">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className="px-4 py-2 font-body text-[13px] uppercase tracking-wider transition-all duration-200 rounded-chi"
                style={{
                  color: activeTab === tab.key ? '#B8311F' : '#8C8478',
                  borderBottom: activeTab === tab.key ? '2px solid #B8311F' : '2px solid transparent',
                  fontWeight: activeTab === tab.key ? 500 : 400,
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Location Grid */}
      <section className="py-16 lg:py-20" style={{ backgroundColor: '#F5F0E3' }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div ref={gridRef} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((loc) => (
              <div key={loc.slug} className="group rounded-chi overflow-hidden transition-all duration-300 hover:-translate-y-2" style={{ backgroundColor: '#EBE5D6' }}>
                <div className="h-40 overflow-hidden">
                  <img src={loc.image} alt={loc.name} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                </div>
                <div className="p-5">
                  <h3 className="font-display text-chi-ink text-xl mb-1">{loc.name}</h3>
                  <p className="font-body text-chi-smoke text-[13px] mb-3">{loc.address}</p>
                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {loc.services.map((s) => (
                      <span key={s} className="px-2.5 py-0.5 rounded-full font-body text-[11px]" style={{ backgroundColor: '#CEC5B0', color: '#1A1208' }}>{s}</span>
                    ))}
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1">
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="#C9903A"><path d="M8 0l2.47 5.01L16 5.81l-4 3.9.94 5.5L8 12.88l-4.94 2.6.94-5.5-4-3.9 5.53-.8z" /></svg>
                      <span className="font-body text-chi-ink text-xs font-medium">{loc.rating}</span>
                      <span className="font-body text-chi-smoke text-xs">({loc.reviews})</span>
                    </div>
                    <Link to={`/booking?clinic=${loc.slug}`} className="font-body text-chi-cinnabar text-[13px] hover:underline">Book at {loc.name} →</Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-16">
              <p className="font-body text-chi-smoke text-lg">No locations match your search.</p>
              <button onClick={() => { setSearch(''); setActiveTab('all'); }} className="mt-4 font-body text-chi-cinnabar text-sm hover:underline">Clear filters</button>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}
