import { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const benefits = [
  { title: 'Flexible hours', desc: 'Clinic schedules that work around your life, not the other way around.' },
  { title: 'Established brand', desc: '23 locations with built-in foot traffic and brand recognition.' },
  { title: 'Ongoing training', desc: 'Regular CPD workshops and TCM education to keep your skills sharp.' },
  { title: 'Community', desc: 'A network of practitioners who share your philosophy and passion.' },
];

const openRoles = [
  { title: 'Massage Therapist', location: 'Brisbane CBD', type: 'Part-time' },
  { title: 'Acupuncturist', location: 'Gold Coast', type: 'Full-time' },
  { title: 'TCM Practitioner', location: 'Sydney CBD', type: 'Full-time' },
  { title: 'Head Spa Therapist', location: 'Sunshine Coast', type: 'Casual' },
  { title: 'Clinic Manager', location: 'Brisbane CBD', type: 'Full-time' },
];

const modalities = ['Massage', 'Acupuncture', 'TCM', 'Head Spa', 'Admin / Operations'];
const clinicOptions = [
  'Brisbane CBD', 'Gold Coast', 'Sunshine Coast', 'Sydney CBD', 'Chatswood',
  'Parramatta', 'Bondi Junction', 'Ipswich', 'Toowoomba', 'Any location',
];

export default function CareersPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);

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

  return (
    <main>
      {/* Hero */}
      <section className="relative pt-32 lg:pt-40 pb-16 lg:pb-20" style={{ backgroundColor: '#0D0A06' }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <h1 className="reveal-anim font-display text-chi-parchment mb-6" style={{ fontSize: 'clamp(48px, 6vw, 64px)', lineHeight: 0.92, letterSpacing: '-0.03em' }}>
            Practise<br />what you love.
          </h1>
          <p className="reveal-anim font-body text-chi-mist max-w-xl" style={{ fontSize: '16px', lineHeight: 1.8 }}>
            Chi Link is Australia's largest TCM and massage network. We're always looking for qualified, passionate practitioners.
          </p>
        </div>
      </section>

      {/* Why Chi Link */}
      <section className="py-20 lg:py-28" style={{ backgroundColor: '#F5F0E3' }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <h2 className="reveal-anim font-display text-chi-ink mb-12" style={{ fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: 0.95, letterSpacing: '-0.02em' }}>Why Chi Link</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((b) => (
              <div key={b.title} className="reveal-anim p-6 rounded-chi" style={{ backgroundColor: '#EBE5D6' }}>
                <h3 className="font-display text-chi-ink text-xl mb-2">{b.title}</h3>
                <p className="font-body text-chi-smoke text-sm" style={{ lineHeight: 1.7 }}>{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Hero image */}
      <section>
        <div className="reveal-anim w-full h-64 lg:h-80">
          <img src="/images/careers-hero.jpg" alt="Chi Link team" className="w-full h-full object-cover" />
        </div>
      </section>

      {/* Open Roles */}
      <section className="py-20 lg:py-28" style={{ backgroundColor: '#F5F0E3' }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <h2 className="reveal-anim font-display text-chi-ink mb-10" style={{ fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: 0.95, letterSpacing: '-0.02em' }}>Open positions</h2>

          {openRoles.length > 0 ? (
            <div className="space-y-3">
              {openRoles.map((role, i) => (
                <div key={i} className="reveal-anim flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-5 rounded-chi" style={{ backgroundColor: '#EBE5D6' }}>
                  <div>
                    <h4 className="font-display text-chi-ink text-lg">{role.title}</h4>
                    <p className="font-body text-chi-smoke text-sm">{role.location} · {role.type}</p>
                  </div>
                  <a href="mailto:careers@chi-link.com.au" className="px-5 py-2 bg-chi-cinnabar text-chi-parchment font-body text-sm rounded-chi hover:bg-chi-ink transition-all duration-200 text-center">Apply →</a>
                </div>
              ))}
            </div>
          ) : (
            <div className="reveal-anim p-8 rounded-chi text-center" style={{ backgroundColor: '#EBE5D6' }}>
              <p className="font-body text-chi-smoke text-lg">We are not currently advertising, but we always accept expressions of interest.</p>
              <a href="mailto:careers@chi-link.com.au" className="font-body text-chi-cinnabar text-sm mt-3 inline-block hover:underline">careers@chi-link.com.au</a>
            </div>
          )}
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 lg:py-28" style={{ backgroundColor: '#EBE5D6' }}>
        <div className="max-w-[700px] mx-auto px-6 lg:px-10">
          {formSubmitted ? (
            <div className="text-center py-16">
              <span className="font-display text-chi-cinnabar text-3xl block mb-4">气</span>
              <h3 className="font-display text-chi-ink text-2xl mb-2">Thank you.</h3>
              <p className="font-body text-chi-smoke">We'll be in touch shortly.</p>
            </div>
          ) : (
            <>
              <h2 className="reveal-anim font-display text-chi-ink mb-10" style={{ fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: 0.95, letterSpacing: '-0.02em' }}>Send your expression of interest</h2>
              <form
                className="reveal-anim space-y-5"
                onSubmit={(e) => { e.preventDefault(); setFormSubmitted(true); }}
              >
                <div>
                  <label className="label-style text-chi-smoke block mb-2">FULL NAME</label>
                  <input type="text" required className="w-full px-4 py-3 bg-chi-parchment font-body text-chi-ink rounded-chi focus:outline-none focus:ring-1 focus:ring-chi-cinnabar" />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label-style text-chi-smoke block mb-2">EMAIL</label>
                    <input type="email" required className="w-full px-4 py-3 bg-chi-parchment font-body text-chi-ink rounded-chi focus:outline-none focus:ring-1 focus:ring-chi-cinnabar" />
                  </div>
                  <div>
                    <label className="label-style text-chi-smoke block mb-2">PHONE</label>
                    <input type="tel" className="w-full px-4 py-3 bg-chi-parchment font-body text-chi-ink rounded-chi focus:outline-none focus:ring-1 focus:ring-chi-cinnabar" />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="label-style text-chi-smoke block mb-2">PREFERRED LOCATION</label>
                    <select required className="w-full px-4 py-3 bg-chi-parchment font-body text-chi-ink rounded-chi focus:outline-none focus:ring-1 focus:ring-chi-cinnabar">
                      <option value="">Select...</option>
                      {clinicOptions.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label-style text-chi-smoke block mb-2">MODALITY</label>
                    <select required className="w-full px-4 py-3 bg-chi-parchment font-body text-chi-ink rounded-chi focus:outline-none focus:ring-1 focus:ring-chi-cinnabar">
                      <option value="">Select...</option>
                      {modalities.map((m) => <option key={m} value={m}>{m}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className="label-style text-chi-smoke block mb-2">MESSAGE / COVER NOTE</label>
                  <textarea rows={4} className="w-full px-4 py-3 bg-chi-parchment font-body text-chi-ink rounded-chi focus:outline-none focus:ring-1 focus:ring-chi-cinnabar resize-none" />
                </div>
                <div>
                  <label className="label-style text-chi-smoke block mb-2">UPLOAD CV (PDF)</label>
                  <input type="file" accept=".pdf" className="w-full px-4 py-3 bg-chi-parchment font-body text-chi-ink rounded-chi file:mr-4 file:px-4 file:py-2 file:rounded-chi file:border-0 file:bg-chi-cinnabar file:text-chi-parchment file:text-xs file:uppercase file:tracking-wider" />
                </div>
                <button type="submit" className="w-full sm:w-auto px-8 py-3.5 bg-chi-cinnabar text-chi-parchment label-style rounded-chi hover:bg-chi-ink transition-all duration-200">
                  Submit Application →
                </button>
              </form>
            </>
          )}
        </div>
      </section>
    </main>
  );
}
