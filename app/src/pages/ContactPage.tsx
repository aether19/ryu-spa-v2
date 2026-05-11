import { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const locationList = [
  { state: 'QUEENSLAND', clinics: [
    { name: 'Anzac Square', address: '200 Edward St, Brisbane CBD, QLD 4000', phone: '(07) 3018 0001' },
    { name: 'Queens Plaza', address: '226 Queen St, Brisbane CBD, QLD 4000', phone: '(07) 3018 0002' },
    { name: 'Garden City', address: 'Logan Rd, Upper Mt Gravatt, QLD 4122', phone: '(07) 3018 0003' },
    { name: 'Robina Town Centre', address: 'Robina Town Centre Dr, Robina, QLD 4226', phone: '(07) 3018 0004' },
    { name: 'Pacific Fair', address: 'Hooker Blvd, Broadbeach, QLD 4218', phone: '(07) 3018 0005' },
    { name: 'Sunshine Plaza', address: 'Maroochydore Rd, Maroochydore, QLD 4558', phone: '(07) 3018 0006' },
    { name: 'Ipswich', address: 'Riverlink Shopping Centre, Ipswich, QLD 4305', phone: '(07) 3018 0007' },
    { name: 'Toowoomba', address: 'Grand Central, Toowoomba, QLD 4350', phone: '(07) 3018 0008' },
  ]},
  { state: 'NEW SOUTH WALES', clinics: [
    { name: 'Sydney CBD', address: 'Westfield Sydney, Pitt St, Sydney NSW 2000', phone: '(02) 9018 0001' },
    { name: 'Chatswood', address: 'Chatswood Chase, Anderson St, Chatswood NSW 2067', phone: '(02) 9018 0002' },
    { name: 'Parramatta', address: 'Westfield Parramatta, Church St, Parramatta NSW 2150', phone: '(02) 9018 0003' },
    { name: 'Bondi Junction', address: 'Westfield Bondi Junction, Oxford St, Bondi NSW 2022', phone: '(02) 9018 0004' },
  ]},
];

const subjects = ['General Enquiry', 'Booking Issue', 'Franchising', 'Media', 'Careers', 'Other'];

export default function ContactPage() {
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

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

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newErrors: Record<string, boolean> = {};
    ['name', 'email', 'subject', 'message'].forEach((field) => {
      if (!formData.get(field)) newErrors[field] = true;
    });
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setFormSubmitted(true);
  };

  return (
    <main>
      {/* Hero */}
      <section className="relative pt-32 lg:pt-40 pb-16 lg:pb-20" style={{ backgroundColor: '#F5F0E3' }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <h1 className="reveal-anim font-display text-chi-ink mb-4" style={{ fontSize: 'clamp(40px, 5vw, 64px)', lineHeight: 0.92, letterSpacing: '-0.03em' }}>
            Get in touch.
          </h1>
        </div>
      </section>

      {/* Two column layout */}
      <section className="py-12 lg:py-20" style={{ backgroundColor: '#F5F0E3' }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Left: Info */}
            <div>
              <div className="reveal-anim mb-10">
                <h3 className="label-style text-chi-cinnabar mb-3">GENERAL ENQUIRIES</h3>
                <p className="font-body text-chi-ink text-base mb-1">hello@chi-link.com.au</p>
                <p className="font-body text-chi-smoke text-sm">1300 CHI LINK (1300 244 546)</p>
              </div>

              <div className="reveal-anim mb-10 p-5 rounded-chi" style={{ backgroundColor: '#EBE5D6' }}>
                <p className="font-body text-chi-ink text-sm" style={{ lineHeight: 1.7 }}>
                  <span className="text-chi-cinnabar font-medium">For appointment bookings,</span> please use our online booking system via your nearest location. This is the fastest way to secure your preferred time.
                </p>
                <a href="/locations" className="inline-block mt-3 font-body text-chi-cinnabar text-sm hover:underline">Find your location →</a>
              </div>

              {/* Location list */}
              <div className="reveal-anim">
                {locationList.map((group) => (
                  <div key={group.state} className="mb-8">
                    <h4 className="label-style text-chi-cinnabar mb-3">{group.state}</h4>
                    <div className="space-y-3">
                      {group.clinics.map((clinic) => (
                        <div key={clinic.name}>
                          <p className="font-body text-chi-ink text-sm font-medium">{clinic.name}</p>
                          <p className="font-body text-chi-smoke text-xs">{clinic.address}</p>
                          <p className="font-body text-chi-mist text-xs">{clinic.phone}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right: Form */}
            <div>
              {formSubmitted ? (
                <div className="reveal-anim text-center py-16">
                  <span className="font-display text-chi-cinnabar text-3xl block mb-4">气</span>
                  <h3 className="font-display text-chi-ink text-2xl mb-2">Thank you.</h3>
                  <p className="font-body text-chi-smoke">We'll be in touch shortly.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="reveal-anim space-y-5">
                  <div>
                    <label className="label-style text-chi-smoke block mb-2">NAME</label>
                    <input name="name" className={`w-full px-4 py-3 font-body text-chi-ink rounded-chi focus:outline-none focus:ring-1 focus:ring-chi-cinnabar ${errors.name ? 'border border-chi-cinnabar' : ''}`} style={{ backgroundColor: '#EBE5D6' }} />
                    {errors.name && <p className="font-body text-chi-cinnabar text-xs mt-1">Name is required</p>}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="label-style text-chi-smoke block mb-2">EMAIL</label>
                      <input name="email" type="email" className={`w-full px-4 py-3 font-body text-chi-ink rounded-chi focus:outline-none focus:ring-1 focus:ring-chi-cinnabar ${errors.email ? 'border border-chi-cinnabar' : ''}`} style={{ backgroundColor: '#EBE5D6' }} />
                      {errors.email && <p className="font-body text-chi-cinnabar text-xs mt-1">Email is required</p>}
                    </div>
                    <div>
                      <label className="label-style text-chi-smoke block mb-2">PHONE</label>
                      <input name="phone" type="tel" className="w-full px-4 py-3 font-body text-chi-ink rounded-chi focus:outline-none focus:ring-1 focus:ring-chi-cinnabar" style={{ backgroundColor: '#EBE5D6' }} />
                    </div>
                  </div>
                  <div>
                    <label className="label-style text-chi-smoke block mb-2">SUBJECT</label>
                    <select name="subject" required className="w-full px-4 py-3 font-body text-chi-ink rounded-chi focus:outline-none focus:ring-1 focus:ring-chi-cinnabar" style={{ backgroundColor: '#EBE5D6' }}>
                      <option value="">Select...</option>
                      {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label-style text-chi-smoke block mb-2">MESSAGE</label>
                    <textarea name="message" rows={4} className={`w-full px-4 py-3 font-body text-chi-ink rounded-chi focus:outline-none focus:ring-1 focus:ring-chi-cinnabar resize-none ${errors.message ? 'border border-chi-cinnabar' : ''}`} style={{ backgroundColor: '#EBE5D6' }} />
                    {errors.message && <p className="font-body text-chi-cinnabar text-xs mt-1">Message is required</p>}
                  </div>
                  <button type="submit" className="w-full sm:w-auto px-8 py-3.5 bg-chi-cinnabar text-chi-parchment label-style rounded-chi hover:bg-chi-ink transition-all duration-200">
                    Send Message →
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
