import { useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const voucherOptions = [
  { amount: 40, label: 'Express treatment' },
  { amount: 80, label: 'Most popular' },
  { amount: 120, label: 'Full experience' },
];

const faqs = [
  { q: 'How are gift cards delivered?', a: 'Gift cards are delivered by email immediately after purchase. You can choose to send it directly to the recipient or to yourself to print and hand-deliver.' },
  { q: 'Do gift cards expire?', a: 'Chi Link gift cards are valid for 3 years from the date of purchase, in accordance with Australian consumer law.' },
  { q: 'Can I use a gift card at any location?', a: 'Yes, Chi Link gift cards can be redeemed at any of our 23 locations across Australia.' },
  { q: 'Can I add a personal message?', a: 'Absolutely. During checkout you can add a personalised message that will be included in the email to your recipient.' },
  { q: 'What if I lose my gift card email?', a: "Contact our team with the purchaser's email address and we can resend the gift card." },
];

export default function GiftCardsPage() {
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState('');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
      <section className="relative pt-32 lg:pt-40 pb-20 lg:pb-28 min-h-[70vh] flex items-center" style={{ backgroundColor: '#9A6B2A' }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
            <div className="flex-1 text-center lg:text-left">
              <h1 className="reveal-anim font-display text-white mb-6" style={{ fontSize: 'clamp(48px, 6vw, 72px)', lineHeight: 0.92, letterSpacing: '-0.03em' }}>
                Give someone<br />the gift of flow.
              </h1>
              <p className="reveal-anim font-body mb-8" style={{ fontSize: '17px', lineHeight: 1.8, color: 'rgba(255,255,255,0.75)' }}>
                E-Vouchers starting from $40. Delivered instantly by email.<br />Redeemable at any of our 23 locations.
              </p>
            </div>
            <div className="flex-shrink-0 w-[240px] lg:w-[300px]">
              <img src="/images/gift-card.png" alt="" className="w-full h-auto animate-envelope-sway" style={{ filter: 'brightness(0) invert(1)', opacity: 0.85 }} />
            </div>
          </div>
        </div>
      </section>

      {/* Voucher Options */}
      <section className="py-20 lg:py-28" style={{ backgroundColor: '#F5F0E3' }}>
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10">
          <h2 className="reveal-anim font-display text-chi-ink mb-10" style={{ fontSize: 'clamp(32px, 4vw, 48px)', lineHeight: 0.95, letterSpacing: '-0.02em' }}>Choose a value</h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {voucherOptions.map((opt) => (
              <button
                key={opt.amount}
                onClick={() => { setSelectedAmount(opt.amount); setCustomAmount(''); }}
                className="reveal-anim p-8 rounded-chi text-center transition-all duration-200 chi-ease"
                style={{
                  backgroundColor: selectedAmount === opt.amount ? 'rgba(184, 49, 31, 0.08)' : '#EBE5D6',
                  border: selectedAmount === opt.amount ? '2px solid #B8311F' : '2px solid transparent',
                }}
              >
                <span className="font-display text-chi-ink" style={{ fontSize: '40px', lineHeight: 1 }}>${opt.amount}</span>
                <p className="font-body text-chi-smoke text-sm mt-2">{opt.label}</p>
                {selectedAmount === opt.amount && <span className="inline-block mt-3 label-style text-chi-cinnabar text-[10px]">SELECTED</span>}
              </button>
            ))}
          </div>

          {/* Custom amount */}
          <div className="reveal-anim max-w-sm mx-auto mb-10">
            <p className="font-body text-chi-smoke text-sm text-center mb-3">Or enter a custom amount</p>
            <div className="flex">
              <span className="px-4 py-3 font-display text-chi-ink text-lg" style={{ backgroundColor: '#EBE5D6', borderRadius: '4px 0 0 4px' }}>$</span>
              <input
                type="number"
                value={customAmount}
                onChange={(e) => { setCustomAmount(e.target.value); setSelectedAmount(null); }}
                placeholder="Custom"
                className="flex-1 px-4 py-3 font-body text-chi-ink bg-chi-stone focus:outline-none focus:ring-1 focus:ring-chi-cinnabar"
              />
            </div>
          </div>

          <div className="reveal-anim text-center">
            <button
              className="px-10 py-3.5 bg-chi-cinnabar text-chi-parchment label-style rounded-chi hover:bg-chi-ink transition-all duration-200 disabled:opacity-40"
              disabled={!selectedAmount && !customAmount}
              onClick={() => alert('Proceeding to checkout with gift card value: $' + (selectedAmount || customAmount))}
            >
              Purchase Gift Card →
            </button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 lg:py-20" style={{ backgroundColor: '#EBE5D6' }}>
        <div className="max-w-[800px] mx-auto px-6 lg:px-10">
          <h2 className="reveal-anim font-display text-chi-ink mb-10 text-center" style={{ fontSize: '32px', lineHeight: 0.95, letterSpacing: '-0.02em' }}>How it works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { num: '一', title: 'Choose a value', desc: 'Select from our popular denominations or enter your own amount.' },
              { num: '二', title: 'Add a message', desc: 'Personalise your gift with a heartfelt message for the recipient.' },
              { num: '三', title: 'Send instantly', desc: 'Delivered by email immediately. Or print and hand-deliver.' },
            ].map((step) => (
              <div key={step.num} className="reveal-anim text-center">
                <span className="font-display text-chi-cinnabar text-3xl block mb-3">{step.num}</span>
                <h3 className="font-display text-chi-ink text-lg mb-2">{step.title}</h3>
                <p className="font-body text-chi-smoke text-sm" style={{ lineHeight: 1.6 }}>{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-16 lg:py-20" style={{ backgroundColor: '#F5F0E3' }}>
        <div className="max-w-[700px] mx-auto px-6 lg:px-10">
          <h2 className="reveal-anim font-display text-chi-ink mb-8" style={{ fontSize: '32px', lineHeight: 0.95, letterSpacing: '-0.02em' }}>Questions</h2>
          <div className="space-y-0">
            {faqs.map((faq, i) => (
              <div key={i} className="reveal-anim" style={{ borderBottom: '1px solid #CEC5B0' }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between py-5 text-left group"
                >
                  <span className="font-body text-chi-ink text-base font-medium pr-4">{faq.q}</span>
                  <span className="text-chi-cinnabar font-body text-lg flex-shrink-0 transition-transform duration-200" style={{ transform: openFaq === i ? 'rotate(45deg)' : 'rotate(0deg)' }}>+</span>
                </button>
                <div
                  className="overflow-hidden transition-all duration-300 chi-ease"
                  style={{ maxHeight: openFaq === i ? '200px' : '0', opacity: openFaq === i ? 1 : 0 }}
                >
                  <p className="font-body text-chi-smoke pb-5" style={{ fontSize: '15px', lineHeight: 1.7 }}>{faq.a}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
