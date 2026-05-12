import { useState, useEffect } from 'react';
import { format, startOfMonth, getDay, isSameMonth, isSameDay, isBefore, addMonths, subMonths } from 'date-fns';
import { Link, useSearchParams } from 'react-router-dom';

// ─── Palette (light theme) ───────────────────────────────────────────────────
const C = {
  bg:         '#FAF7F2',   // warm off-white page bg
  surface:    '#FFFFFF',   // card / input bg
  surfaceAlt: '#F0EBE0',   // slightly tinted surface
  border:     'rgba(0,0,0,0.09)',
  borderFocus:'rgba(184,49,31,0.45)',
  ink:        '#1A1208',   // primary text
  smoke:      '#5A4E45',   // secondary text
  mist:       '#8C7E74',   // tertiary / labels
  accent:     '#B8311F',   // cinnabar
  accentHov:  '#9B2518',
  accentBg:   'rgba(184,49,31,0.07)',
  gold:       '#B07C28',
  divider:    'rgba(0,0,0,0.07)',
};

// ─── Data ────────────────────────────────────────────────────────────────────

const services = [
  { id: 'acupuncture', name: 'Acupuncture',          char: '针', duration: '30 – 60 min', price: 'From $65',  desc: 'Restore flow to blocked meridian pathways' },
  { id: 'deep-tissue', name: 'Deep Tissue Massage',   char: '推', duration: '30 – 90 min', price: 'From $55',  desc: 'Release chronic muscle tension and tightness' },
  { id: 'head-spa',    name: 'Head Spa Therapy',      char: '頭', duration: '45 – 60 min', price: 'From $75',  desc: 'Calm the mind and restore mental clarity' },
  { id: 'cupping',     name: 'Cupping Therapy',       char: '罐', duration: '20 – 45 min', price: 'From $45',  desc: 'Improve circulation and accelerate recovery' },
  { id: 'herbal',      name: 'Herbal Medicine',       char: '藥', duration: 'Consultation', price: 'From $50', desc: 'Personalised herbal formulations for your constitution' },
  { id: 'reflexology', name: 'Reflexology',           char: '足', duration: '30 – 60 min', price: 'From $50',  desc: 'Balance the body through pressure points on the feet' },
  { id: 'couples',     name: 'Couples Massage',       char: '双', duration: '60 – 90 min', price: 'From $110', desc: 'Shared relaxation experience for you and your partner' },
];

const allLocations = [
  { id: 'anzac-square',  name: 'Anzac Square',         suburb: 'Brisbane CBD',     state: 'QLD' },
  { id: 'queens-plaza',  name: 'Queens Plaza',          suburb: 'Brisbane CBD',     state: 'QLD' },
  { id: 'chermside',     name: 'Westfield Chermside',  suburb: 'Chermside',        state: 'QLD' },
  { id: 'garden-city',   name: 'Garden City',           suburb: 'Upper Mt Gravatt', state: 'QLD' },
  { id: 'indooroopilly', name: 'Indooroopilly',         suburb: 'Indooroopilly',    state: 'QLD' },
  { id: 'ipswich',       name: 'Riverlink',             suburb: 'Ipswich',          state: 'QLD' },
  { id: 'toowoomba',     name: 'Grand Central',         suburb: 'Toowoomba',        state: 'QLD' },
  { id: 'robina',        name: 'Robina Town Centre',   suburb: 'Robina',           state: 'QLD' },
  { id: 'pacific-fair',  name: 'Pacific Fair',          suburb: 'Broadbeach',       state: 'QLD' },
  { id: 'broadbeach',    name: 'The Oasis',             suburb: 'Broadbeach',       state: 'QLD' },
  { id: 'maroochydore',  name: 'Sunshine Plaza',        suburb: 'Maroochydore',     state: 'QLD' },
  { id: 'kawana',        name: 'Kawana Waters',         suburb: 'Bokarina',         state: 'QLD' },
  { id: 'sydney-cbd',    name: 'Westfield Sydney',      suburb: 'Sydney CBD',       state: 'NSW' },
  { id: 'chatswood',     name: 'Chatswood Chase',       suburb: 'Chatswood',        state: 'NSW' },
  { id: 'parramatta',    name: 'Westfield Parramatta', suburb: 'Parramatta',       state: 'NSW' },
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

const unavailable = new Set(['10:00 AM', '2:30 PM', '5:00 PM']);

// ─── Calendar ────────────────────────────────────────────────────────────────

function CalendarPicker({ selected, onSelect }: { selected: Date | null; onSelect: (d: Date) => void }) {
  const [viewMonth, setViewMonth] = useState(() => {
    const d = new Date(); d.setDate(1); d.setHours(0,0,0,0); return d;
  });

  const today = new Date(); today.setHours(0,0,0,0);

  const monthStart   = startOfMonth(viewMonth);
  const rawDow       = getDay(monthStart);
  const startOffset  = rawDow === 0 ? 6 : rawDow - 1; // Monday-first

  const days: Date[] = [];
  for (let i = 0; i < 42; i++) {
    const d = new Date(monthStart);
    d.setDate(1 - startOffset + i);
    days.push(d);
  }

  const isDisabled = (d: Date) => isBefore(d, today) || getDay(d) === 0;
  const isOtherMo  = (d: Date) => !isSameMonth(d, viewMonth);
  const isSelected = (d: Date) => selected ? isSameDay(d, selected) : false;
  const isToday    = (d: Date) => isSameDay(d, today);
  const canGoPrev  = !isSameMonth(viewMonth, today);

  return (
    <div style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, borderRadius: '12px', padding: '24px', boxShadow: '0 2px 12px rgba(0,0,0,0.06)' }}>
      {/* Month nav */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => setViewMonth(subMonths(viewMonth, 1))}
          disabled={!canGoPrev}
          className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200"
          style={{ color: canGoPrev ? C.ink : C.border, backgroundColor: canGoPrev ? C.surfaceAlt : 'transparent', cursor: canGoPrev ? 'pointer' : 'default', fontSize: '18px' }}
        >‹</button>
        <span className="font-display" style={{ color: C.ink, fontSize: '17px' }}>{format(viewMonth, 'MMMM yyyy')}</span>
        <button
          onClick={() => setViewMonth(addMonths(viewMonth, 1))}
          className="w-9 h-9 flex items-center justify-center rounded-full transition-all duration-200"
          style={{ color: C.ink, backgroundColor: C.surfaceAlt, fontSize: '18px' }}
          onMouseEnter={e => (e.currentTarget.style.backgroundColor = C.border)}
          onMouseLeave={e => (e.currentTarget.style.backgroundColor = C.surfaceAlt)}
        >›</button>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {['Mo','Tu','We','Th','Fr','Sa','Su'].map(d => (
          <div key={d} className="text-center font-body text-[11px] uppercase tracking-wider pb-2" style={{ color: C.mist }}>{d}</div>
        ))}
      </div>

      {/* Days */}
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
                color:           otherMo ? 'transparent' : sel ? '#fff' : disabled ? C.border : C.ink,
                backgroundColor: sel ? C.accent : 'transparent',
                border:          todayDay && !sel ? `1.5px solid ${C.accent}` : '1.5px solid transparent',
                cursor:          disabled ? 'default' : 'pointer',
                opacity:         disabled && !otherMo ? 0.35 : 1,
              }}
              onMouseEnter={e => { if (!disabled) (e.currentTarget as HTMLElement).style.backgroundColor = sel ? C.accent : C.surfaceAlt; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.backgroundColor = sel ? C.accent : 'transparent'; }}
            >
              {otherMo ? '' : format(day, 'd')}
            </button>
          );
        })}
      </div>
      <p className="font-body text-center mt-4" style={{ fontSize: '11px', color: C.mist }}>
        Sundays unavailable · Past dates disabled
      </p>
    </div>
  );
}

// ─── Step bar ────────────────────────────────────────────────────────────────

const STEPS = ['Service', 'Location', 'Date & Time', 'Your Details'];

function StepBar({ current }: { current: number }) {
  return (
    <div className="flex items-center justify-center gap-0 mb-12">
      {STEPS.map((label, i) => {
        const idx   = i + 1;
        const done  = idx < current;
        const active = idx === current;
        return (
          <div key={idx} className="flex items-center">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-8 h-8 rounded-full flex items-center justify-center font-body text-sm transition-all duration-300"
                style={{
                  backgroundColor: done ? C.accent : 'transparent',
                  border: done ? 'none' : active ? `2px solid ${C.accent}` : `2px solid ${C.border}`,
                  color: done ? '#fff' : active ? C.accent : C.mist,
                }}
              >
                {done ? '✓' : idx}
              </div>
              <span className="font-body text-[11px] uppercase tracking-wider hidden sm:block"
                style={{ color: active ? C.ink : done ? C.accent : C.mist }}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className="w-12 lg:w-20 h-px mx-2 mb-5" style={{ backgroundColor: i < current - 1 ? C.accent : C.border }} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Main ────────────────────────────────────────────────────────────────────

export default function BookingPage() {
  const [step,             setStep]            = useState(1);
  const [selectedService,  setSelectedService]  = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [selectedDate,     setSelectedDate]     = useState<Date | null>(null);
  const [selectedTime,     setSelectedTime]     = useState('');
  const [form, setForm] = useState({ firstName: '', lastName: '', phone: '', email: '', notes: '' });
  const [submitted, setSubmitted] = useState(false);

  const [searchParams] = useSearchParams();

  // On first load: if a ?service= param is present, pre-select it and skip to step 2.
  // If a ?clinic= param is also present (coming from the map), pre-select the location too.
  useEffect(() => {
    const svc = searchParams.get('service');
    const loc = searchParams.get('clinic');
    if (svc) {
      setSelectedService(svc);
      setStep(2);
    }
    if (loc) {
      setSelectedLocation(loc);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { window.scrollTo(0, 0); }, [step]);

  const canContinue = () => {
    if (step === 1) return !!selectedService;
    if (step === 2) return !!selectedLocation;
    if (step === 3) return !!selectedDate && !!selectedTime;
    if (step === 4) return !!form.firstName && !!form.lastName && !!form.phone && !!form.email;
    return true;
  };

  const next  = () => { if (canContinue()) setStep(s => Math.min(s + 1, 4)); };
  const back  = () => setStep(s => Math.max(s - 1, 1));
  const submit = () => { if (canContinue()) setSubmitted(true); };

  const svc = services.find(s => s.id === selectedService);
  const loc = allLocations.find(l => l.id === selectedLocation);

  // ── Confirmation ────────────────────────────────────────────────
  if (submitted) {
    return (
      <main className="min-h-screen flex items-center justify-center px-6 py-24" style={{ backgroundColor: C.bg }}>
        <div className="text-center max-w-lg w-full">
          <div className="font-display mb-6" style={{ fontSize: '72px', color: C.accent, lineHeight: 1 }}>气</div>
          <h1 className="font-display mb-4" style={{ color: C.ink, fontSize: 'clamp(32px,5vw,52px)', lineHeight: 1 }}>Booking Confirmed</h1>
          <p className="font-body mb-8" style={{ color: C.smoke, lineHeight: 1.8 }}>
            Thank you, {form.firstName}. Your session has been requested.<br />
            A confirmation will be sent to <strong style={{ color: C.ink }}>{form.email}</strong>.
          </p>
          <div className="p-6 rounded-xl mb-8 text-left space-y-3" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, boxShadow: '0 2px 16px rgba(0,0,0,0.05)' }}>
            <ConfirmRow label="Service"  value={svc?.name ?? ''} />
            <ConfirmRow label="Location" value={`${loc?.name}, ${loc?.suburb}`} />
            <ConfirmRow label="Date"     value={selectedDate ? format(selectedDate, 'EEEE, d MMMM yyyy') : ''} />
            <ConfirmRow label="Time"     value={selectedTime} />
            <ConfirmRow label="Name"     value={`${form.firstName} ${form.lastName}`} />
          </div>
          <Link to="/" className="inline-block px-8 py-3 rounded-xl font-body text-sm uppercase tracking-wider"
            style={{ backgroundColor: C.accent, color: '#fff' }}>
            Back to Home
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen" style={{ backgroundColor: C.bg }}>
      {/* Page header */}
      <div className="pt-28 pb-10 text-center" style={{ borderBottom: `1px solid ${C.divider}`, backgroundColor: C.surface }}>
        <span className="label-style block mb-2" style={{ color: C.accent }}>CHI LINK · ONLINE BOOKING</span>
        <h1 className="font-display" style={{ color: C.ink, fontSize: 'clamp(36px,5vw,56px)', lineHeight: 0.95, letterSpacing: '-0.03em' }}>
          Book Your Session
        </h1>
        <p className="font-body mt-3" style={{ color: C.smoke, fontSize: '15px' }}>
          Simple, quick, and done in under two minutes.
        </p>
      </div>

      <div className="max-w-[860px] mx-auto px-6 py-12">
        <StepBar current={step} />

        {/* ── Step 1: Service ── */}
        {step === 1 && (
          <div>
            <h2 className="font-display text-2xl mb-1" style={{ color: C.ink }}>Choose a Service</h2>
            <p className="font-body mb-8" style={{ color: C.smoke, fontSize: '14px' }}>Select the treatment you'd like to book.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {services.map(svc => {
                const active = selectedService === svc.id;
                return (
                  <button
                    key={svc.id}
                    onClick={() => setSelectedService(svc.id)}
                    className="text-left p-5 rounded-xl transition-all duration-200 relative overflow-hidden"
                    style={{
                      backgroundColor: active ? C.accentBg : C.surface,
                      border: active ? `2px solid ${C.accent}` : `1.5px solid ${C.border}`,
                      boxShadow: active ? `0 0 0 3px rgba(184,49,31,0.06)` : '0 1px 4px rgba(0,0,0,0.04)',
                    }}
                    onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(184,49,31,0.3)'; }}
                    onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.borderColor = C.border; }}
                  >
                    {/* Character watermark */}
                    <div className="absolute top-3 right-4 select-none font-display" style={{ fontSize: '44px', color: C.accent, opacity: 0.07, lineHeight: 1 }}>
                      {svc.char}
                    </div>
                    <span className="block font-display text-lg mb-1" style={{ color: C.ink }}>{svc.name}</span>
                    <span className="block font-body text-sm mb-3" style={{ color: C.smoke }}>{svc.desc}</span>
                    <div className="flex items-center gap-3">
                      <span className="font-body text-xs px-2.5 py-1 rounded-full" style={{ backgroundColor: C.surfaceAlt, color: C.mist }}>{svc.duration}</span>
                      <span className="font-body text-sm font-medium" style={{ color: active ? C.accent : C.gold }}>{svc.price}</span>
                    </div>
                    {active && (
                      <div className="absolute top-3 right-3 w-5 h-5 rounded-full flex items-center justify-center" style={{ backgroundColor: C.accent }}>
                        <span style={{ color: '#fff', fontSize: '10px' }}>✓</span>
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
            <h2 className="font-display text-2xl mb-1" style={{ color: C.ink }}>Choose a Location</h2>
            <p className="font-body mb-8" style={{ color: C.smoke, fontSize: '14px' }}>All {allLocations.length} clinics are available for your selected treatment.</p>
            {['QLD', 'NSW'].map(state => (
              <div key={state} className="mb-8">
                <div className="flex items-center gap-3 mb-4">
                  <span className="label-style" style={{ color: C.accent }}>{state === 'QLD' ? 'Queensland' : 'New South Wales'}</span>
                  <div className="flex-1 h-px" style={{ backgroundColor: C.divider }} />
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {allLocations.filter(l => l.state === state).map(loc => {
                    const active = selectedLocation === loc.id;
                    return (
                      <button
                        key={loc.id}
                        onClick={() => setSelectedLocation(loc.id)}
                        className="text-left p-4 rounded-xl transition-all duration-200"
                        style={{
                          backgroundColor: active ? C.accentBg : C.surface,
                          border: active ? `2px solid ${C.accent}` : `1.5px solid ${C.border}`,
                          boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
                        }}
                        onMouseEnter={e => { if (!active) (e.currentTarget as HTMLElement).style.borderColor = 'rgba(184,49,31,0.3)'; }}
                        onMouseLeave={e => { if (!active) (e.currentTarget as HTMLElement).style.borderColor = C.border; }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <span className="block font-display text-base mb-0.5" style={{ color: C.ink }}>{loc.name}</span>
                            <span className="block font-body text-sm" style={{ color: C.smoke }}>{loc.suburb}</span>
                          </div>
                          {active && (
                            <div className="w-5 h-5 rounded-full flex-shrink-0 flex items-center justify-center mt-0.5" style={{ backgroundColor: C.accent }}>
                              <span style={{ color: '#fff', fontSize: '10px' }}>✓</span>
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
            <h2 className="font-display text-2xl mb-1" style={{ color: C.ink }}>Choose Date & Time</h2>
            <p className="font-body mb-8" style={{ color: C.smoke, fontSize: '14px' }}>Select an available date and your preferred time slot.</p>

            <div className="flex flex-col lg:flex-row gap-8">
              {/* Calendar */}
              <div className="flex-shrink-0" style={{ width: '100%', maxWidth: '320px' }}>
                <p className="font-body text-sm mb-3 uppercase tracking-wider" style={{ color: C.mist }}>Date</p>
                <CalendarPicker selected={selectedDate} onSelect={setSelectedDate} />
              </div>

              {/* Time slots */}
              <div className="flex-1 min-w-0">
                <p className="font-body text-sm mb-3 uppercase tracking-wider" style={{ color: C.mist }}>
                  Time {selectedDate ? `· ${format(selectedDate, 'EEE d MMM')}` : ''}
                </p>
                {!selectedDate ? (
                  <div className="flex items-center justify-center h-48 rounded-xl" style={{ backgroundColor: C.surface, border: `1.5px dashed ${C.border}` }}>
                    <p className="font-body text-sm" style={{ color: C.mist }}>Select a date first</p>
                  </div>
                ) : (
                  <div>
                    {(['Morning', 'Afternoon', 'Evening'] as const).map(period => {
                      const slots = timeSlots.filter(t => t.period === period);
                      return (
                        <div key={period} className="mb-5">
                          <p className="font-body text-xs uppercase tracking-wider mb-2" style={{ color: C.mist }}>{period}</p>
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
                                    backgroundColor: booked ? C.surfaceAlt : active ? C.accent : C.surface,
                                    color: booked ? C.border : active ? '#fff' : C.ink,
                                    border: booked ? `1px solid ${C.border}` : active ? `1px solid ${C.accent}` : `1px solid ${C.border}`,
                                    cursor: booked ? 'not-allowed' : 'pointer',
                                    textDecoration: booked ? 'line-through' : 'none',
                                    boxShadow: active ? `0 2px 8px rgba(184,49,31,0.2)` : '0 1px 3px rgba(0,0,0,0.04)',
                                  }}
                                  onMouseEnter={e => { if (!booked && !active) { (e.currentTarget as HTMLElement).style.borderColor = C.accent; (e.currentTarget as HTMLElement).style.backgroundColor = C.accentBg; } }}
                                  onMouseLeave={e => { if (!booked && !active) { (e.currentTarget as HTMLElement).style.borderColor = C.border; (e.currentTarget as HTMLElement).style.backgroundColor = C.surface; } }}
                                >
                                  {slot.label}
                                </button>
                              );
                            })}
                          </div>
                        </div>
                      );
                    })}
                    <p className="font-body mt-1" style={{ fontSize: '11px', color: C.mist }}>Strikethrough = unavailable</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ── Step 4: Details ── */}
        {step === 4 && (
          <div>
            <h2 className="font-display text-2xl mb-1" style={{ color: C.ink }}>Your Details</h2>
            <p className="font-body mb-6" style={{ color: C.smoke, fontSize: '14px' }}>Almost done — just a few details to confirm your booking.</p>

            {/* Summary strip */}
            <div className="flex flex-wrap gap-6 mb-8 p-4 rounded-xl" style={{ backgroundColor: C.surface, border: `1px solid ${C.border}`, boxShadow: '0 1px 6px rgba(0,0,0,0.04)' }}>
              <SummaryPill label="Service"  value={svc?.name ?? ''} />
              <SummaryPill label="Location" value={`${loc?.name}, ${loc?.suburb}`} />
              {selectedDate && <SummaryPill label="Date" value={format(selectedDate, 'd MMM yyyy')} />}
              {selectedTime && <SummaryPill label="Time" value={selectedTime} />}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="First Name *"  value={form.firstName} onChange={v => setForm(f => ({ ...f, firstName: v }))} placeholder="Sarah"           />
              <Field label="Last Name *"   value={form.lastName}  onChange={v => setForm(f => ({ ...f, lastName:  v }))} placeholder="Mitchell"        />
              <Field label="Phone *"       value={form.phone}     onChange={v => setForm(f => ({ ...f, phone:     v }))} placeholder="0412 345 678"    type="tel"   />
              <Field label="Email *"       value={form.email}     onChange={v => setForm(f => ({ ...f, email:     v }))} placeholder="sarah@email.com" type="email" />
            </div>
            <div className="mt-4">
              <label className="block font-body text-sm mb-2" style={{ color: C.smoke, letterSpacing: '0.02em' }}>
                Additional Notes <span style={{ color: C.mist }}>(optional)</span>
              </label>
              <textarea
                rows={3}
                value={form.notes}
                onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                placeholder="Any health conditions, preferences or questions for your practitioner…"
                className="w-full font-body text-sm rounded-xl outline-none resize-none"
                style={{ backgroundColor: C.surface, border: `1.5px solid ${C.border}`, color: C.ink, padding: '12px 16px', lineHeight: 1.7 }}
                onFocus={e  => { e.currentTarget.style.borderColor = C.borderFocus; }}
                onBlur={e   => { e.currentTarget.style.borderColor = C.border; }}
              />
            </div>
          </div>
        )}

        {/* ── Nav buttons ── */}
        <div className="flex items-center justify-between mt-10 pt-8" style={{ borderTop: `1px solid ${C.divider}` }}>
          {step > 1 ? (
            <button
              onClick={back}
              className="font-body text-sm uppercase tracking-wider transition-colors duration-200"
              style={{ color: C.mist }}
              onMouseEnter={e => (e.currentTarget.style.color = C.ink)}
              onMouseLeave={e => (e.currentTarget.style.color = C.mist)}
            >
              ← Back
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              onClick={next}
              disabled={!canContinue()}
              className="px-8 py-3 rounded-xl font-body text-sm uppercase tracking-wider transition-all duration-200"
              style={{
                backgroundColor: canContinue() ? C.accent : C.border,
                color:           canContinue() ? '#fff'   : C.mist,
                cursor:          canContinue() ? 'pointer' : 'not-allowed',
                boxShadow:       canContinue() ? '0 2px 12px rgba(184,49,31,0.25)' : 'none',
              }}
            >
              Continue →
            </button>
          ) : (
            <button
              onClick={submit}
              disabled={!canContinue()}
              className="px-10 py-3 rounded-xl font-body text-sm uppercase tracking-wider transition-all duration-200"
              style={{
                backgroundColor: canContinue() ? C.accent : C.border,
                color:           canContinue() ? '#fff'   : C.mist,
                cursor:          canContinue() ? 'pointer' : 'not-allowed',
                boxShadow:       canContinue() ? '0 2px 16px rgba(184,49,31,0.3)' : 'none',
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

// ─── Helpers ─────────────────────────────────────────────────────────────────

function ConfirmRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <span className="font-body text-sm flex-shrink-0" style={{ color: C.mist }}>{label}</span>
      <span className="font-body text-sm text-right" style={{ color: C.ink }}>{value}</span>
    </div>
  );
}

function SummaryPill({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="block font-body text-[10px] uppercase tracking-wider mb-0.5" style={{ color: C.mist }}>{label}</span>
      <span className="block font-body text-sm" style={{ color: C.ink }}>{value}</span>
    </div>
  );
}

function Field({ label, value, onChange, placeholder, type = 'text' }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; type?: string;
}) {
  return (
    <div>
      <label className="block font-body text-sm mb-2" style={{ color: C.smoke, letterSpacing: '0.02em' }}>{label}</label>
      <input
        type={type}
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full font-body text-sm rounded-xl outline-none"
        style={{ backgroundColor: C.surface, border: `1.5px solid ${C.border}`, color: C.ink, padding: '12px 16px' }}
        onFocus={e => { e.currentTarget.style.borderColor = C.borderFocus; }}
        onBlur={e  => { e.currentTarget.style.borderColor = C.border; }}
      />
    </div>
  );
}
