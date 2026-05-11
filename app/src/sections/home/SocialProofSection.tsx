import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const reviews = [
  { name: 'Sarah M.', text: 'After months of chronic back pain, three sessions at Chi Link changed everything. The practitioners truly understand the body.', rating: 5, location: 'Brisbane CBD', wide: true },
  { name: 'James L.', text: "I was skeptical about acupuncture. Now I recommend Chi Link to everyone I know. Professional, calming, effective.", rating: 5, location: 'Gold Coast', wide: false },
  { name: 'Emma T.', text: 'The head spa treatment is pure bliss. I float out of there every single time. Best self-care ritual I have ever found.', rating: 5, location: 'Sunshine Coast', wide: false },
  { name: 'Michael R.', text: "As an athlete, recovery is everything. Chi Link's deep tissue work keeps me performing at my peak.", rating: 5, location: 'Sydney', wide: true },
  { name: 'Lisa K.', text: 'The herbal medicine consultation was incredibly thorough. I feel more balanced than I have in years.', rating: 5, location: 'Brisbane', wide: false },
  { name: 'David W.', text: "My partner and I get couples massage here monthly. It is our favourite tradition. The staff makes everyone feel welcome.", rating: 5, location: 'Gold Coast', wide: false },
];

export default function SocialProofSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const scoreRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const triggers: ScrollTrigger[] = [];

    if (scoreRef.current) {
      const sTween = gsap.fromTo(scoreRef.current, { opacity: 0, y: 32 }, {
        opacity: 1, y: 0, duration: 0.7, ease: 'power2.out',
        scrollTrigger: { trigger: sectionRef.current, start: 'top 80%', toggleActions: 'play none none none' },
      });
      if (sTween.scrollTrigger) triggers.push(sTween.scrollTrigger);
    }

    const cards = cardsRef.current?.querySelectorAll('.review-card');
    if (cards) {
      const cTween = gsap.fromTo(cards, { opacity: 0, y: 32 }, {
        opacity: 1, y: 0, duration: 0.7, stagger: 0.08, ease: 'power2.out',
        scrollTrigger: { trigger: cardsRef.current, start: 'top 85%', toggleActions: 'play none none none' },
      });
      if (cTween.scrollTrigger) triggers.push(cTween.scrollTrigger);
    }

    return () => { triggers.forEach((t) => t.kill()); };
  }, []);

  return (
    <section ref={sectionRef} className="relative py-24 lg:py-36" style={{ backgroundColor: '#F5F0E3' }}>
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
        <div ref={scoreRef} className="text-center mb-14 opacity-0">
          <span className="label-style text-chi-cinnabar block mb-4">GOOGLE REVIEWS · VERIFIED</span>
          <div className="flex items-baseline justify-center gap-3 mb-2">
            <span className="font-display text-chi-ink" style={{ fontSize: 'clamp(64px, 8vw, 96px)', lineHeight: 0.88, letterSpacing: '-0.04em' }}>4.9</span>
            <div className="flex flex-col items-start">
              <div className="flex gap-1">
                {[1,2,3,4,5].map((s) => (<svg key={s} width="16" height="16" viewBox="0 0 16 16" fill="#C9903A"><path d="M8 0l2.47 5.01L16 5.81l-4 3.9.94 5.5L8 12.88l-4.94 2.6.94-5.5-4-3.9 5.53-.8z" /></svg>))}
              </div>
            </div>
          </div>
          <p className="font-body text-chi-smoke" style={{ fontSize: '14px' }}>based on 2,400+ verified reviews across all locations</p>
        </div>

        <div ref={cardsRef} className="columns-1 md:columns-2 lg:columns-3 gap-5 space-y-5">
          {reviews.map((review, i) => (
            <div
              key={i}
              className={`review-card break-inside-avoid p-5 rounded-chi transition-transform duration-300 hover:-translate-y-1 ${review.wide ? 'md:col-span-1' : ''}`}
              style={{ backgroundColor: '#EBE5D6' }}
            >
              <div className="flex gap-0.5 mb-3">
                {Array.from({ length: review.rating }).map((_, j) => (
                  <svg key={j} width="12" height="12" viewBox="0 0 16 16" fill="#C9903A"><path d="M8 0l2.47 5.01L16 5.81l-4 3.9.94 5.5L8 12.88l-4.94 2.6.94-5.5-4-3.9 5.53-.8z" /></svg>
                ))}
              </div>
              <p className="font-body text-chi-ink mb-4" style={{ fontSize: '15px', lineHeight: 1.7 }}>"{review.text}"</p>
              <div className="flex items-center justify-between">
                <span className="font-body text-chi-smoke text-sm font-medium">{review.name}</span>
                <span className="font-body text-chi-mist text-xs">{review.location}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
