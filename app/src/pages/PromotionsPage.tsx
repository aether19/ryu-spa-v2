import { useState, useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const filterTabs = ['All', 'Massage', 'Acupuncture', 'Day Spa', 'Gift Cards'];

const offers = [
  { title: 'Mother\'s Day Deluxe Package', desc: '90-minute Deep Tissue Massage + Head Spa + complimentary herbal tea gift set.', saving: '$45 off', image: '/images/promo-mothers-day.jpg', category: 'Day Spa', price: '$149' },
  { title: 'Acupuncture Introductory', desc: 'First-time client special. Initial consultation + first treatment session.', saving: '$30 off', image: '/images/treatment-acupuncture.jpg', category: 'Acupuncture', price: '$75' },
  { title: 'Couples Massage Experience', desc: '60-minute couples massage with aromatherapy oils and warm stone treatment.', saving: '$40 off', image: '/images/treatment-massage.jpg', category: 'Massage', price: '$180' },
  { title: 'Winter Warmth Package', desc: 'Cupping therapy + deep tissue massage + herbal warming treatment.', saving: '$35 off', image: '/images/treatment-cupping.jpg', category: 'Massage', price: '$125' },
  { title: 'Gift Card Bonus', desc: 'Purchase a $100 gift card and receive a complimentary 30-minute reflexology session.', saving: 'Bonus $55', image: '/images/gift-card.png', category: 'Gift Cards', price: '$100' },
  { title: 'Head Spa Revival', desc: '60-minute head spa with scalp treatment, neck massage, and herbal hair rinse.', saving: '$20 off', image: '/images/treatment-headspa.jpg', category: 'Day Spa', price: '$85' },
];

export default function PromotionsPage() {
  const [activeFilter, setActiveFilter] = useState('All');
  const heroRef = useRef<HTMLDivElement>(null);

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

  const filtered = activeFilter === 'All' ? offers : offers.filter((o) => o.category === activeFilter);

  return (
    <main>
      {/* Hero */}
      <section className="relative pt-32 lg:pt-40 pb-16 lg:pb-20" style={{ backgroundColor: '#F5F0E3' }}>
        <div ref={heroRef} className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <h1 className="reveal-anim font-display text-chi-ink" style={{ fontSize: 'clamp(48px, 6vw, 64px)', lineHeight: 0.95, letterSpacing: '-0.03em' }}>
            Current offers.
          </h1>
        </div>
      </section>

      {/* Seasonal Banner */}
      <section className="py-12 lg:py-16" style={{ backgroundColor: '#0D0A06' }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="reveal-anim flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <span className="label-style text-chi-cinnabar block mb-2">SEASONAL SPECIAL</span>
              <h2 className="font-display text-chi-parchment text-2xl lg:text-3xl mb-2">Mother's Day Package</h2>
              <p className="font-body text-chi-mist" style={{ fontSize: '15px' }}>Give Mum the gift of restoration. Available until May 14th.</p>
            </div>
            <a href="https://bookrelax.com.au/booking" target="_blank" rel="noopener noreferrer" className="px-6 py-3 bg-chi-cinnabar text-chi-parchment label-style rounded-chi hover:bg-chi-parchment hover:text-chi-ink transition-all duration-200 flex-shrink-0">
              Book This Offer
            </a>
          </div>
        </div>
      </section>

      {/* Filter + Grid */}
      <section className="py-16 lg:py-20" style={{ backgroundColor: '#F5F0E3' }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          {/* Filter tabs */}
          <div className="reveal-anim flex gap-2 mb-10 flex-wrap">
            {filterTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveFilter(tab)}
                className="px-4 py-2 rounded-full font-body text-xs transition-all duration-200"
                style={{
                  backgroundColor: activeFilter === tab ? '#B8311F' : '#EBE5D6',
                  color: activeFilter === tab ? '#F5F0E3' : '#1A1208',
                }}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((offer, i) => (
              <div key={i} className="reveal-anim group rounded-chi overflow-hidden transition-all duration-300 hover:-translate-y-2" style={{ backgroundColor: '#EBE5D6' }}>
                <div className="h-48 overflow-hidden">
                  <img src={offer.image} alt={offer.title} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" style={offer.category === 'Gift Cards' ? { filter: 'invert(1)', opacity: 0.3, objectFit: 'contain', padding: '24px' } : {}} />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="label-style text-chi-cinnabar text-[10px]">{offer.category.toUpperCase()}</span>
                    <span className="font-body text-chi-cinnabar text-xs font-medium">{offer.saving}</span>
                  </div>
                  <h3 className="font-display text-chi-ink text-xl mb-2">{offer.title}</h3>
                  <p className="font-body text-chi-smoke text-sm mb-4" style={{ lineHeight: 1.6 }}>{offer.desc}</p>
                  <div className="flex items-center justify-between">
                    <span className="font-display text-chi-ink text-lg">{offer.price}</span>
                    <a href="https://bookrelax.com.au/booking" target="_blank" rel="noopener noreferrer" className="font-body text-chi-cinnabar text-[13px] hover:underline">Book This Offer →</a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
