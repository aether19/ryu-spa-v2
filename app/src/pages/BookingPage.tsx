import { useState, useEffect } from 'react';
import { format, startOfMonth, getDay, isSameMonth, isSameDay, isBefore, addMonths, subMonths } from 'date-fns';
import { Link } from 'react-router-dom';

// ─── Data ────────────────────────────────────────────────────────────────────

const services = [
  { id: 'acupuncture',  name: 'Acupuncture',            char: '针', duration: '30 – 60 min', price: 'From $65',  desc: 'Restore flow to blocked meridian pathways' },
  { id: 'deep-tissue',  name: 'Deep Tissue Massage',     char: '推', duration: '30 – 90 min', price: 'From $55',  desc: 'Release chronic muscle tension and tightness' },
  { id: 'head-spa',     name: 'Head Spa Therapy',        char: '頭', duration: '45 – 60 min', price: 'From $75',  desc: 'Calm the mind and restore mental clarity' },
  { id: 'cupping',      name: 'Cupping Therapy',         char: '罐', duration: '20 – 45 min', price: 'From $45',  desc: 'Improve circulation and accelerate recovery' },
  { id: 'herbal',       name: 'Herbal Medicine',         char: '藥', duration: 'Consultation', price: 'From $50', desc: 'Personalised herbal formulations for your constitution' },
  { id: 'reflexology',  name: 'Reflexology',             char: '足', duration: '30 – 60 min', price: 'From $50',  desc: 'Balance the body through pressure points on the feet' },
  { id: 'couples',      name: 'Couples Massage',         char: '双', duration: '60 – 90 min', price: 'From $110', desc: 'Shared relaxation experience for you and your partner' },
];

const allLocations = [
  { id: 'anzac-square',  name: 'Anzac Square',          suburb: 'Brisbane CBD',     state: 'QLD' },
  { id: 'queens-plaza',  name: 'Queens Plaza',           suburb: 'Brisbane CBD',     state: 'QLD' },
  { id: 'chermside',     name: 'Westfield Chermside',   suburb: 'Chermside',        state: 'QLD' },
  { id: 'garden-city',   name: 'Garden City',            suburb: 'Upper Mt Gravatt', state: 'QLD' },
  { id: 'indooroopilly', name: 'Indooroopilly',          suburb: 'Indooroopilly',    state: 'QLD' },
  { id: 'ipswich',       name: 'Riverlink',              suburb: 'Ipswich',          state: 'QLD' },
  { id: 'toowoomba',     name: 'Grand Central',          suburb: 'Toowoomba',        state: 'QLD' },
  { id: 'robina',        name: 'Robina Town Centre',    suburb: 'Robina',           state: 'QLD' },
  { id: 'pacific-fair',  name: 'Pacific Fair',           suburb: 'Broadbeach',       state: 'QLD' },
  { id: 'broadbeach',    name: 'The Oasis',              suburb: 'Broadbeach',       state: 'QLD' },
  { id: 'maroochydore',  name: 'Sunshine Plaza',         suburb: 'Maroochydore',     state: 'QLD' },
  { id: 'kawana',        name: 'Kawana Waters',          suburb: 'Bokarina',         state: 'QLD' },
  { id: 'sydney-cbd',    name: 'Westfield Sydney',       suburb: 'Sydney CBD',       state: 'NSW' },
  { id: 'chatswood',     name: 'Chatswood Chase',        suburb: 'Chatswood',        state: 'NSW' },
  { id: 'parramatta',    name: 'Westfield Parramatta',  suburb: 'Parramatta',       state: 'NSW' },
];

const timeSlots = [
  { label: '9:00 AM',  period: 'Morning'   },
  { label: '9:30 AM',  period: 'Morning'   },
  { label: '10:00 AM', period: 'Morning'   },
  { label: '10:30 AM', period: 'Morning'   },
  { label: '11:00 AM', period: 'Morning'   },
  { label: '11:30 AM', period: 'Morning'   },
  { label: '12:00 PM', period: 'Afternoon' },
  { label: '12:30 PM', period: 'Afternoon' },
  { label: '1:00 PM',  period: 'Afternoon' },
  { label: '1:30 PM',  period: 'Afternoon' },
  { label: '2:00 PM',  period: 'Afternoon' },
  { label: '2:30 PM',  period: 'Afternoon' },
  { label: '3:00 PM',  period: 'Afternoon' },
  { label: '3:30 PM',  period: 'Afternoon' },
  { label: '4:00 PM',  period: 'Afternoon' },
  { label: '4:30 PM',  period: 'Afternoon' },
  { label: '5:00 PM',  period: 'Evening'   },
  { label: '5:30 PM',  period: 'Evening'   },
  { label: '6:00 PM',  period: 'Evening'   },
  { label: '6:30 PM',  period: 'Evening'   },
  { label: '7:00 PM',  period: 'Evening'   },
];

// Simulate some unavailable slots
const unavailable = new Set(['10:00 AM', '2:30 PM', '5:00 PM']);

// ─── Calendar ────────────────────────────────────────────────────────────────

function CalendarPicker({ selected, onSelect }: { selected: Date | null; onSelect: (d: Date) => void }) {
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    d.setHours(0, 0, 0, 0);
    return d;
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const monthStart = startOfMonth(viewMonth);
  // Monday-based offset: getDay returns 0=Sun,1=Mon…6=Sat → adjust so Mon=0
  const rawDow = getDay(monthStart);
  const startOffset = rawDow === 0 ? 6 : rawDow - 1;

  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(monthStart);
    d.setDate(1 - startOffset + i);
    days.push(d);
  }

  const isDisabled  = (d: Date) => isBefore(d, today) || getDay(d) === 0; // No Sundays
  const isOtherMo   = (d: Date) => !isSameMonth(d, viewMonth);
  const isSelected  = (d: Date) => selected ? isSameDay(d, selected) : false;
  const isToday     = (d: Date) => isSameDay(d, today);

  const canGoPrev = !isSameMonth(viewMonth, today);

  return (
    <div style={{ backgroundColor: '#1A1208', border: '1px solid rgba(201,144,58,0.15)', borderRadius: '12px', padding: '24px' }}>
      {/* Month nav */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setViewMonth(subMonths(viewMonth, 1))}
          disabled={!canGoPrev}
          className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200"
          style={{ color: canGoPrev ? '#F5F0E3' : '#3D3530', backgroundColor: canGoPrev ? 'rgba(255,255,255,0.06)' : 'transparent', cursor: canGoPrev ? 'pointer' : 'not-allowed' }}
        >
          ‹
        </button>
        <span className="font-display text-chi-parchment text-lg">{format(viewMonth, 'MMMM yyyy')}</span>
        <button
          onClick={() => setViewMonth(addMonths(viewMonth, 1))}
          className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200 hover:bg-white/10"
          style={{ color: '#F5F0E3' }}
        >
          ›
        </button>
      </div>

      {/* Day-of-week headers */}
      <div className="grid grid-cols-7 mb-3">
        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map(d => (
          <div key={d} className="text-center font-body text-[11px] uppercase tracking-wider pb-2" style={{ color: '#6B6058' }}>{d}</div>
        ))}
      </div>

      {/* Day grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, i) => {
          const disabled  = isDisabled(day) || isOtherMo(day);
          const sel       = isSelected(day);
          const todayDay  = isToday(day);
          const otherMo   = isOtherMo(day);

          return (
            <button
              key={i}
              onClick={() => !disabled && onSelect(day)}
              disabled={disabled}
              className="aspect-square flex items-center justify-center font-body text-sm rounded-lg transition-all duration-150"
              style={{
                color: sel ? '#F5F0E3' : disabled ? (otherMo ? 'transparent' : '#3D3530') : '#F5F0E3',
                backgroundColor: sel ? '#B8311F' : 'transparent',
                border: todayDay && !sel ? '1px solid rgba(201,144,58,0.5)' : '1px solid transparent',
                cursor: disabled ? 'default' : 'pointer',
                opacity: disabled && !otherMo ? 0.3 : 1,
              }}
              onMouseEnter={e => { if (!disabled) (e.currentTarget as HTMLButtonElement).style.backgroundColor = sel ? '#B8311F' : 'rgba(255,255,255,0.08)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.backgroundColor = sel ? '#B8311F' : 'transparent'; }}
            >
              {otherMo ? '' : format(day, 'd')}
            </button>
          );
        })}
      </div>

      <p className="font-body text-center mt-4" style={{ fontSize: '11px', color: '#6B6058' }}>
        Sundays unavailable · Past dates disabled
      </p>
    </div>
  );
}

// ─── Step indicator ───────────────────────────────────────────────────────────

const STEPS = ['Service', 'Location', 'Date & Time', 'Your Details'];

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-12">
      {STEPS.map((label, i) => {
        const idx = i + 1;
        const done    = idx < current;
        const active  = idx === current;
        return (
          <div key={idx} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-body text-sm transition-all duration-300"
                style={{
                  backgroundColor: done ? '#B8311F' : active ? 'transparent' : 'transparent',
                  border: done ? 'none' : active ? '2px solid #B8311F' : '2px solid #3D3530',
                  color: done ? '#F5F0E3' : active ? '#B8311F' : '#3D3530',
                }}
              >
                {done ? '✓' : idx}
              </div>
              <span className="font-body text-[11px] uppercase tracking-wider hidden sm:block"
                style={{ color: active ? '#F5F0E3' : done ? '#B8311F' : '#3D3530' }}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="w-16 lg:w-24 h-px mx-2 mb-5" style={{ backgroundColor: i < current - 1 ? '#B8311F' : '#2A2520' }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function BookingPage() {
  const [step, setStep] = useState(1);
  const [selectedService,  setSelectedService]  = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDate,     setSelectedDate]     = useState<Date | null>(null);
  const [selectedTime,     setSelectedTime]     = useState('');
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', email: '', notes: '' });
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => { window.scrollTo(0, 0); }, [step]);

  const canContinue = () => {
    if (step === 1) return !!selectedService;
    if (step === 2) return !!selectedLocation;
    if (step === 3) return !!selectedDate && !!selectedTime;
    if (step === 4) return !!form.firstName && !!form.lastName && !!form.phone && !!form.email;
    return true;
  };

  const next = () => { if (canContinue()) setStep(s => Math.min(s + 1, 4)); };
  const back = () => setStep(s => Math.max(s - 1, 1));

  const handleSubmit = () => {
    if (canContinue()) setSubmitted(true);
  };

  const svc = services.find(s => s.id === selectedService);
  const loc = allLocations.find(l => l.id === selectedLocation);

  // ── Confirmation screen ────────────────────────────────────────
  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6" style={{ backgroundColor: '#0D0A06' }}>
        <div className="text-center max-w-lg">
          <div className="font-display mb-6" style={{ fontSize: '80px', color: '#B8311F', lineHeight: 1 }}>气</div>
          <h1 className="font-display text-chi-parchment mb-4" style={{ fontSize: 'clamp(32px,5vw,52px)', lineHeight: 1 }}>
            Booking Confirmed
          </h1>
          <p className="font-body text-chi-mist mb-8" style={{ lineHeight: 1.8 }}>
            Thank you, {form.firstName}. Your session has been requested. A confirmation will be sent to <span style={{ color: '#F5F0E3' }}>{form.email}</span>.
          </p>
          <div className="p-6 rounded-chi mb-8 text-left space-y-3" style={{ backgroundColor: '#1A1208', border: '1px solid rgba(201,144,58,0.15)' }}>
            <Row label="Service"  value={svc?.name ?? ''} />
            <Row label="Location" value={`${loc?.name}, ${loc?.suburb}`} />
            <Row label="Date"     value={selectedDate ? format(selectedDate, 'EEEE, d MMMM yyyy') : ''} />
            <Row label="Time"     value={selectedTime} />
            <Row label="Name"     value={`${form.firstName} ${form.lastName}`} />
          </div>
          <Link to="/" className="inline-block px-8 py-3 rounded-chi font-body text-sm uppercase tracking-wider transition-all duration-300"
            style={{ backgroundColor: '#B8311F', color: '#F5F0E3' }}>
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: '#0D0A06' }}>
      {/* Header */}
      <div className="relative pt-28 pb-10 text-center" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none font-display select-none"
          style={{ fontSize: '200px', color: 'rgba(245,240,227,0.025)', lineHeight: 1, top: '60%' }}>
          预
        </div>
        <span className="label-style text-chi-cinnabar block mb-2">CHI LINK · ONLINE BOOKING</span>
        <h1 className="font-display text-chi-parchment" style={{ fontSize: 'clamp(36px,5vw,56px)', lineHeight: 0.95, letterSpacing: '-0.03em' }}>
          Book Your Session
        </h1>
      </div>

      {/* Content */}
      <div className="max-w-[860px] mx-auto px-6 py-12">
        <StepBar current={step} />

        {/* ── Step 1: Service ── */}
        {step === 1 && (
          <div>
            <h2 className="font-display text-chi-parchment text-2xl mb-2">Choose a Service</h2>
            <p className="font-body text-chi-mist mb-8" style={{ fontSize: '14px' }}>Select the treatment you'd like to book.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map(svc => {
                const active = selectedService === svc.id;
                return (
                  <button
                    key={svc.id}
                    onClick={() => setSelectedService(svc.id)}
                    className="text-left p-5 rounded-chi transition-all duration-200 relative overflow-hidden"
                    style={{
                      backgroundColor: active ? 'rgba(184,49,31,0.12)' : '#1A1208',
                      border: active ? '1.5px solid #B8311F' : '1.5px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <div className="absolute top-4 right-4 font-display opacity-10 select-none" style={{ fontSize: '40px', color: '#F5F0E3', lineHeight: 1 }}>
                      {svc.char}
                    </div>
                    <span className="block font-display text-chi-parchment text-lg mb-1">{svc.name}</span>
                    <span className="block font-body text-chi-mist text-sm mb-3">{svc.desc}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-body text-xs px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.06)', color: '#8C8478' }}>{svc.duration}</span>
                      <span className="font-body text-xs" style={{ color: active ? '#B8311F' : '#C9903A' }}>{svc.price}</span>
                    </div>
                    {active && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: '#B8311F' }}>
                        <span style={{ color: '#F5F0E3', fontSize: '10px' }}>✓</span>
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Step 2: Location ── */}
        {step === 2 && (
          <div>
            <h2 className="font-display text-chi-parchment text-2xl mb-2">Choose a Location</h2>
            <p className="font-body text-chi-mist mb-8" style={{ fontSize: '14px' }}>All {allLocations.length} clinics available for your selected treatment.</p>

            {/* Group by state */}
            {['QLD', 'NSW'].map(state => (
              <div key={state} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="label-style text-chi-cinnabar">{state}</span>
                  <div className="flex-1 h-px" style={{ backgroundColor: 'rgba(255,255,255,0.06)' }} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {allLocations.filter(l => l.state === state).map(loc => {
                    const active = selectedLocation === loc.id;
                    return (
                      <button
                        key={loc.id}
                        onClick={() => setSelectedLocation(loc.id)}
                        className="text-left p-4 rounded-chi transition-all duration-200"
                        style={{
                          backgroundColor: active ? 'rgba(184,49,31,0.12)' : '#1A1208',
                          border: active ? '1.5px solid #B8311F' : '1.5px solid rgba(255,255,255,0.06)',
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="block font-display text-chi-parchment text-base mb-0.5">{loc.name}</span>
                            <span className="block font-body text-chi-mist text-sm">{loc.suburb}</span>
                          </div>
                          {active && (
                            <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5" style={{ backgroundColor: '#B8311F' }}>
                              <span style={{ color: '#F5F0E3', fontSize: '10px' }}>✓</span>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── Step 3: Date & Time ── */}
        {step === 3 && (
          <div>
            <h2 className="font-display text-chi-parchment text-2xl mb-2">Choose Date & Time</h2>
            <p className="font-body text-chi-mist mb-8" style={{ fontSize: '14px' }}>
              Select an available date and your preferred time slot.
            </p>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Calendar */}
              <div className="flex-shrink-0" style={{ width: '100%', maxWidth: '340px' }}>
                <p className="font-body text-chi-parchment text-sm mb-3 uppercase tracking-wider" style={{ opacity: 0.6 }}>Date</p>
                <CalendarPicker selected={selectedDate} onSelect={setSelectedDate} />
              </div>

              {/* Time slots */}
              <div className="flex-1">
                <p className="font-body text-chi-parchment text-sm mb-3 uppercase tracking-wider" style={{ opacity: 0.6 }}>
                  Time {selectedDate ? `· ${format(selectedDate, 'EEE d MMM')}` : ''}
                </p>
                {!selectedDate ? (
                  <div className="flex items-center justify-center h-48 rounded-chi" style={{ backgroundColor: '#1A1208', border: '1px dashed rgba(255,255,255,0.08)' }}>
                    <p className="font-body text-chi-mist text-sm">Select a date first</p>
                  </div>
                ) : (
                  <div>
                    {['Morning', 'Afternoon', 'Evening'].map(period => {
                      const slots = timeSlots.filter(t => t.period === period);
                      return (
                        <div key={period} className="mb-5">
                          <p className="font-body text-xs uppercase tracking-wider mb-2" style={{ color: '#6B6058' }}>{period}</p>
                          <div className="flex flex-wrap gap-2">
                            {slots.map(slot => {
                              const booked = unavailable.has(slot.label);
                              const active = selectedTime === slot.label;
                              return (
                                <button
                                  key={slot.label}
                                  disabled={booked}
                                  onClick={() => !booked && setSelectedTime(slot.label)}
                                  className="font-body text-sm rounded-lg transition-all duration-150"
                                  style={{
                                    padding: '8px 16px',
                                    backgroundColor: booked ? 'transparent' : active ? '#B8311F' : '#1A1208',
                                    color: booked ? '#2A2520' : active ? '#F5F0E3' : '#CEC5B0',
                                    border: booked ? '1px solid #1A1208' : active ? '1px solid #B8311F' : '1px solid rgba(255,255,255,0.08)',
                                    cursor: booked ? 'not-allowed' : 'pointer',
                                    textDecoration: booked ? 'line-through' : 'none',
                                  }}
                                >
                                  {slot.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                    <p className="font-body mt-2" style={{ fontSize: '11px', color: '#6B6058' }}>
                      Strikethrough slots are unavailable
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 4: Details ── */}
        {step === 4 && (
          <div>
            <h2 className="font-display text-chi-parchment text-2xl mb-2">Your Details</h2>
            <p className="font-body text-chi-mist mb-8" style={{ fontSize: '14px' }}>Almost done — just a few details to confirm your booking.</p>

            {/* Booking summary strip */}
            <div className="flex flex-wrap gap-4 mb-8 p-4 rounded-chi" style={{ backgroundColor: '#1A1208', border: '1px solid rgba(201,144,58,0.12)' }}>
              <SummaryPill label="Service"  value={svc?.name ?? ''} />
              <SummaryPill label="Location" value={`${loc?.name}, ${loc?.suburb}`} />
              {selectedDate && <SummaryPill label="Date" value={format(selectedDate, 'd MMM yyyy')} />}
              {selectedTime && <SummaryPill label="Time" value={selectedTime} />}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="First Name *"   value={form.firstName} onChange={v => setForm(f => ({ ...f, firstName: v }))} placeholder="e.g. Sarah" />
              <Field label="Last Name *"    value={form.lastName}  onChange={v => setForm(f => ({ ...f, lastName:  v }))} placeholder="e.g. Mitchell" />
              <Field label="Phone *"        value={form.phone}     onChange={v => setForm(f => ({ ...f, phone:     v }))} placeholder="e.g. 0412 345 678" type="tel" />
              <Field label="Email *"        value={form.email}     onChange={v => setForm(f => ({ ...f, email:     v }))} placeholder="e.g. sarah@email.com" type="email" />
            </div>
            <div className="mt-4">
              <label className="block font-body text-chi-mist text-sm mb-2" style={{ letterSpacing: '0.04em' }}>
                Additional Notes <span style={{ color: '#6B6058' }}>(optional)</span>
              </label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Any health conditions, preferences or questions for your practitioner…"
                className="w-full font-body text-sm rounded-chi outline-none resize-none"
                style={{
                  backgroundColor: '#1A1208',
                  border: '1.5px solid rgba(255,255,255,0.08)',
                  color: '#F5F0E3',
                  padding: '12px 16px',
                  lineHeight: 1.7,
                  caretColor: '#B8311F',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = 'rgba(184,49,31,0.5)'; }}
                onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              />
            </div>
          </div>
        )}

        {/* ── Nav buttons ── */}
        <div className="flex items-center justify-between mt-10 pt-8" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
          {step > 1 ? (
            <button onClick={back} className="font-body text-sm uppercase tracking-wider transition-colors duration-200"
              style={{ color: '#8C8478' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#F5F0E3')}
              onMouseLeave={e => (e.currentTarget.style.color = '#8C8478')}
            >
              ← Back
            </button>
          ) : (
            <div />
          )}

          {step < 4 ? (
            <button
              onClick={next}
              disabled={!canContinue()}
              className="px-8 py-3 rounded-chi font-body text-sm uppercase tracking-wider transition-all duration-200"
              style={{
                backgroundColor: canContinue() ? '#B8311F' : '#2A2520',
                color: canContinue() ? '#F5F0E3' : '#4A4540',
                cursor: canContinue() ? 'pointer' : 'not-allowed',
              }}
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canContinue()}
              className="px-10 py-3 rounded-chi font-body text-sm uppercase tracking-wider transition-all duration-200"
              style={{
                backgroundColor: canContinue() ? '#B8311F' : '#2A2520',
                color: canContinue() ? '#F5F0E3' : '#4A4540',
                cursor: canContinue() ? 'pointer' : 'not-allowed',
              }}
            >
              Confirm Booking
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

// ─── Small helpers ────────────────────────────────────────────────────────────

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="font-body text-chi-mist text-sm flex-shrink-0">{label}</span>
      <span className="font-body text-chi-parchment text-sm text-right">{value}</span>
    </div>
  );
}

function SummaryPill({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="block font-body text-[10px] uppercase tracking-wider mb-0.5" style={{ color: '#6B6058' }}>{label}</span>
      <span className="block font-body text-chi-parchment text-sm">{value}</span>
    </div>
  );
}

function Field({
  label, value, onChange, placeholder, type = 'text',
}: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block font-body text-chi-mist text-sm mb-2" style={{ letterSpacing: '0.04em' }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full font-body text-sm rounded-chi outline-none"
        style={{
          backgroundColor: '#1A1208',
          border: '1.5px solid rgba(255,255,255,0.08)',
          color: '#F5F0E3',
          padding: '12px 16px',
          caretColor: '#B8311F',
        }}
        onFocus={e => { e.currentTarget.style.borderColor = 'rgba(184,49,31,0.5)'; }}
        onBlur={e  => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
      />
    </div>
  );
}
