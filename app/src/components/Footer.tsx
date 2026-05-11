import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{ backgroundColor: '#0D0A06' }}>
      {/* Row 1: Logo + Socials */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 pt-16 pb-6">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-xl text-chi-parchment" style={{ letterSpacing: '-0.02em' }}>Chi Link</span>
            <span className="text-chi-cinnabar text-lg font-display">气</span>
          </Link>
          <div className="flex items-center gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-chi-mist hover:text-chi-parchment transition-colors duration-300" aria-label="Facebook">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z" /></svg>
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-chi-mist hover:text-chi-parchment transition-colors duration-300" aria-label="Instagram">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" /></svg>
            </a>
          </div>
        </div>
      </div>

      {/* Hairline rule */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10"><div className="w-full h-px" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }} /></div>

      {/* Row 2: Four columns */}
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          <div>
            <h4 className="label-style text-chi-cinnabar mb-4">QUEENSLAND</h4>
            <ul className="space-y-2">
              {['Brisbane CBD', 'Gold Coast', 'Sunshine Coast', 'Ipswich', 'Toowoomba'].map((c) => (
                <li key={c}><span className="font-body text-chi-smoke text-sm hover:text-chi-parchment transition-colors duration-300">{c}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="label-style text-chi-cinnabar mb-4">NEW SOUTH WALES</h4>
            <ul className="space-y-2">
              {['Sydney CBD', 'Chatswood', 'Parramatta', 'Bondi Junction'].map((c) => (
                <li key={c}><span className="font-body text-chi-smoke text-sm hover:text-chi-parchment transition-colors duration-300">{c}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="label-style text-chi-cinnabar mb-4">QUICK LINKS</h4>
            <ul className="space-y-2">
              {[
                { label: 'Treatments', to: '/treatments' },
                { label: 'Locations', to: '/locations' },
                { label: 'Gift Cards', to: '/gift-cards' },
                { label: 'About Chi Link', to: '/about' },
                { label: 'Careers', to: '/careers' },
                { label: 'Franchising', to: '/contact' },
              ].map((link) => (
                <li key={link.label}><Link to={link.to} className="font-body text-chi-smoke text-sm hover:text-chi-parchment transition-colors duration-300">{link.label}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="label-style text-chi-cinnabar mb-4">STAY CONNECTED</h4>
            <p className="font-body text-chi-smoke text-sm mb-4">Receive wellness tips and exclusive offers.</p>
            <form className="flex" onSubmit={(e) => e.preventDefault()}>
              <input type="email" placeholder="Your email" className="flex-1 px-4 py-2.5 bg-transparent border border-chi-mist text-chi-parchment font-body text-sm placeholder:text-chi-smoke focus:outline-none focus:border-chi-gold rounded-l-chi" />
              <button type="submit" className="px-4 py-2.5 bg-chi-cinnabar text-chi-parchment rounded-r-chi hover:bg-chi-parchment hover:text-chi-ink transition-all duration-300" aria-label="Subscribe">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" /></svg>
              </button>
            </form>
          </div>
        </div>

        <p className="font-body text-chi-smoke text-xs mt-12">© Chi Franchising Pty Ltd · ABN 12 345 678 901</p>
      </div>
    </footer>
  );
}
