import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const timeline = [
  { year: '2004', event: 'First Chi Link opens in Brisbane CBD' },
  { year: '2007', event: 'Expanded to 5 locations across Queensland' },
  { year: '2011', event: 'Chi Day Spa brand launched' },
  { year: '2016', event: 'Reached 15 locations' },
  { year: '2020', event: 'Continued through COVID with telehealth TCM consultations' },
  { year: '2024', event: '23 locations across Australia and international presence' },
];

const values = [
  { title: 'Qualified', desc: 'Every practitioner holds recognised Australian credentials in their modality. No exceptions. No shortcuts.' },
  { title: 'Evidence-informed', desc: 'TCM philosophy grounded in modern understanding of pain, inflammation, and nervous system regulation.' },
  { title: 'Accessible', desc: '23 locations across Australia so wellness is not a special-occasion luxury.' },
];

const team = [
  { name: 'Dr. Mei Lin', role: 'Senior TCM Practitioner', cred: 'B.HSc(Chinese Med), DipAc', location: 'Brisbane CBD', image: '/images/team-member-3.jpg' },
  { name: 'James Carter', role: 'Lead Massage Therapist', cred: 'DipRemMassage, 10+ yrs', location: 'Sydney CBD', image: '/images/team-member-2.jpg' },
  { name: 'Dr. Sarah Whitfield', role: 'Acupuncture Specialist', cred: 'M.Ac, B.HSc', location: 'Gold Coast', image: '/images/team-member-1.jpg' },
  { name: 'Prof. David Chen', role: 'Herbal Medicine Practitioner', cred: 'PhD(Chinese Med), 25 yrs', location: 'Brisbane CBD', image: '/images/team-member-4.jpg' },
];

export default function AboutPage() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.scrollTo(0, 0);
    const triggers: ScrollTrigger[] = [];

    const revealEls = document.querySelectorAll('.reveal-anim');
    revealEls.forEach((el) => {
      const tween = gsap.fromTo(el, { opacity: 0, y: 24 }, {
        opacity: 1, y: 0, duration: 0.6, ease: 'power2.out',
        scrollTrigger: { trigger: el, start: 'top 88%', toggleActions: 'play none none none' },
      });
      if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
    });

    return () => { triggers.forEach((t) => t.kill()); };
  }, []);

  return (
    <main>
      {/* Hero */}
      <section className="relative pt-32 lg:pt-40 pb-20 lg:pb-28 min-h-[70vh] flex items-end" style={{ backgroundColor: '#0D0A06' }}>
        <div ref={heroRef} className="max-w-[1280px] mx-auto px-6 lg:px-10 w-full">
          <h1 className="hero-anim font-display text-chi-parchment mb-6" style={{ fontSize: 'clamp(48px, 6vw, 72px)', lineHeight: 0.92, letterSpacing: '-0.03em' }}>
            A philosophy<br />built on flow.
          </h1>
          <p className="hero-anim font-subhead italic text-chi-mist max-w-2xl" style={{ fontSize: '20px', lineHeight: 1.6 }}>
            Chi Link began in 2004 with a single belief: that the body already knows how to heal itself.
            Our role is to remove what blocks it.
          </p>
        </div>
      </section>

      {/* Story Section */}
      <section className="py-20 lg:py-28" style={{ backgroundColor: '#F5F0E3' }}>
        <div className="max-w-[900px] mx-auto px-6 lg:px-10">
          <div className="reveal-anim space-y-8">
            <p className="font-body text-chi-ink" style={{ fontSize: '17px', lineHeight: 1.8 }}>
              For over twenty years, Chi Link has been at the forefront of Traditional Chinese Medicine in Australia.
              What started as a single clinic in Brisbane's CBD has grown into Australia's largest network of TCM
              and wellness clinics — with 23 locations across Queensland, New South Wales, and beyond.
            </p>
            <p className="font-body text-chi-ink" style={{ fontSize: '17px', lineHeight: 1.8 }}>
              Our practitioners are qualified, experienced, and passionate about what they do. Every treatment
              is grounded in centuries of TCM wisdom, informed by modern evidence, and tailored to the
              individual sitting in front of us.
            </p>
          </div>

          <blockquote className="reveal-anim mt-12 pl-6" style={{ borderLeft: '3px solid #C9903A' }}>
            <p className="font-subhead italic text-chi-ink" style={{ fontSize: 'clamp(24px, 3vw, 32px)', lineHeight: 1.3 }}>
              "We don't treat symptoms. We restore the conditions for the body to treat itself."
            </p>
          </blockquote>

          <div className="reveal-anim mt-12">
            <img src="/images/about-consultation.jpg" alt="TCM consultation" className="w-full h-64 lg:h-80 object-cover rounded-chi" />
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-20 lg:py-28" style={{ backgroundColor: '#0D0A06' }}>
        <div className="max-w-[800px] mx-auto px-6 lg:px-10">
          <h2 className="reveal-anim font-display text-chi-parchment mb-14" style={{ fontSize: 'clamp(36px, 4vw, 56px)', lineHeight: 0.95, letterSpacing: '-0.02em' }}>Our journey</h2>
          <div className="relative">
            <div className="absolute left-[23px] top-0 bottom-0 w-px" style={{ backgroundColor: 'rgba(255,255,255,0.1)' }} />
            {timeline.map((item, i) => (
              <div key={i} className="reveal-anim flex gap-6 mb-10 last:mb-0 relative">
                <div className="flex-shrink-0 w-3 h-3 rounded-full mt-2" style={{ backgroundColor: '#B8311F' }} />
                <div>
                  <span className="font-display text-chi-cinnabar text-2xl">{item.year}</span>
                  <p className="font-body text-chi-mist mt-1" style={{ fontSize: '15px', lineHeight: 1.7 }}>{item.event}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 lg:py-28" style={{ backgroundColor: '#F5F0E3' }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <h2 className="reveal-anim font-display text-chi-ink mb-12" style={{ fontSize: 'clamp(36px, 4vw, 56px)', lineHeight: 0.95, letterSpacing: '-0.02em' }}>What we stand for</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {values.map((v) => (
              <div key={v.title} className="reveal-anim p-8 rounded-chi" style={{ backgroundColor: '#EBE5D6' }}>
                <h3 className="font-display text-chi-ink text-2xl mb-3">{v.title}</h3>
                <p className="font-body text-chi-smoke" style={{ fontSize: '15px', lineHeight: 1.7 }}>{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-20 lg:py-28" style={{ backgroundColor: '#EBE5D6' }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <h2 className="reveal-anim font-display text-chi-ink mb-12" style={{ fontSize: 'clamp(36px, 4vw, 56px)', lineHeight: 0.95, letterSpacing: '-0.02em' }}>Meet our team</h2>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member) => (
              <div key={member.name} className="reveal-anim text-center">
                <div className="w-28 h-28 lg:w-32 lg:h-32 mx-auto mb-4 rounded-full overflow-hidden">
                  <img src={member.image} alt={member.name} className="w-full h-full object-cover" loading="lazy" />
                </div>
                <h4 className="font-display text-chi-ink text-lg">{member.name}</h4>
                <p className="font-body text-chi-cinnabar text-sm">{member.role}</p>
                <p className="font-body text-chi-smoke text-xs mt-1">{member.cred}</p>
                <p className="font-body text-chi-mist text-xs mt-0.5">{member.location}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
