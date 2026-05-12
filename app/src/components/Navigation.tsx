import { useEffect, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

const navLinks = [
  { label: 'Treatments', to: '/treatments' },
  { label: 'Locations',  to: '/locations'  },
  { label: 'About',      to: '/about'      },
  { label: 'Gift Cards', to: '/gift-cards' },
];

export default function Navigation() {
  const [scrolled,    setScrolled]    = useState(false);
  const [mobileOpen,  setMobileOpen]  = useState(false);
  const navRef   = useRef<HTMLElement>(null);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? 'hidden' : '';
    return () => { document.body.style.overflow = ''; };
  }, [mobileOpen]);

  return (
    <>
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-[100] transition-all duration-500"
        style={{
          backgroundColor: scrolled ? 'rgba(13,10,6,0.92)' : 'transparent',
          backdropFilter:       scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
        }}
      >
        <div className="max-w-[1280px] mx-auto px-6 lg:px-10 flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 z-[101]">
            <span className={`font-display text-xl lg:text-2xl tracking-tight transition-colors duration-300 ${scrolled ? 'text-chi-ink' : 'text-chi-parchment'}`}>Chi Link</span>
            <span className="text-chi-cinnabar text-lg font-display">气</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map(item => (
              <Link
                key={item.label}
                to={item.to}
                className={`label-style transition-colors duration-300 ${scrolled ? 'text-chi-smoke hover:text-chi-ink' : 'text-chi-mist hover:text-chi-parchment'}`}
              >
                {item.label}
              </Link>
            ))}
            {/* Book Now → internal booking page */}
            <Link
              to="/booking"
              className="px-5 py-2.5 bg-chi-cinnabar text-chi-parchment label-style hover:bg-chi-parchment hover:text-chi-ink transition-all duration-300 rounded-chi"
            >
              Book Now
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden flex flex-col gap-1.5 p-2 z-[101]"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Menu"
          >
            <span className={`w-5 h-px block transition-all duration-300 ${scrolled ? 'bg-chi-ink' : 'bg-chi-parchment'} ${mobileOpen ? 'rotate-45 translate-y-[3px]' : ''}`} />
            <span className={`w-5 h-px block transition-all duration-300 ${scrolled ? 'bg-chi-ink' : 'bg-chi-parchment'} ${mobileOpen ? '-rotate-45 -translate-y-[3px]' : ''}`} />
          </button>
        </div>
      </nav>

      {/* Mobile overlay */}
      <div
        className={`fixed inset-0 z-[99] lg:hidden flex flex-col items-center justify-center gap-8 transition-all duration-500 ${
          mobileOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ backgroundColor: 'rgba(13,10,6,0.97)', backdropFilter: 'blur(20px)' }}
      >
        {navLinks.map(item => (
          <Link
            key={item.label}
            to={item.to}
            className="font-display text-chi-parchment hover:text-chi-cinnabar transition-colors duration-300"
            style={{ fontSize: '32px', lineHeight: 1.2 }}
            onClick={() => setMobileOpen(false)}
          >
            {item.label}
          </Link>
        ))}
        <Link
          to="/booking"
          className="mt-4 px-8 py-3.5 bg-chi-cinnabar text-chi-parchment label-style rounded-chi"
          onClick={() => setMobileOpen(false)}
        >
          Book Now
        </Link>
      </div>
    </>
  );
}
