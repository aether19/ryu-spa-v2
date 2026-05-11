import { useEffect, useRef } from 'react';

export default function MeridianTransition() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const paths = container.querySelectorAll<SVGPathElement>('.meridian-path');

    // Set initial state
    paths.forEach((path) => {
      const length = path.getTotalLength();
      path.style.strokeDasharray = `${length}`;
      path.style.strokeDashoffset = `${length}`;
    });

    // Use IntersectionObserver - CSS only, no GSAP
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            paths.forEach((path, i) => {
              path.style.transition = `stroke-dashoffset 2s ease-out ${i * 0.2}s`;
              path.style.strokeDashoffset = '0';
            });
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.3 }
    );

    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative w-full" style={{ height: '200px', backgroundColor: '#0D0A06' }}>
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 1200 200" preserveAspectRatio="none">
        <path className="meridian-path" d="M0 100 C 100 80, 200 120, 300 100 S 500 60, 600 100 S 800 140, 900 100 S 1100 80, 1200 100" fill="none" stroke="#C9903A" strokeWidth="0.5" opacity="0.12" />
        <path className="meridian-path" d="M0 120 C 150 100, 250 140, 400 110 S 600 80, 750 120 S 950 100, 1200 110" fill="none" stroke="#C9903A" strokeWidth="0.5" opacity="0.12" />
        <path className="meridian-path" d="M0 80 C 200 100, 350 60, 500 90 S 700 130, 850 80 S 1000 110, 1200 90" fill="none" stroke="#C9903A" strokeWidth="0.5" opacity="0.12" />
        <path className="meridian-path" d="M200 0 C 180 50, 220 100, 200 200" fill="none" stroke="#C9903A" strokeWidth="0.5" opacity="0.08" />
        <path className="meridian-path" d="M600 0 C 580 60, 620 120, 600 200" fill="none" stroke="#C9903A" strokeWidth="0.5" opacity="0.08" />
        <path className="meridian-path" d="M1000 0 C 980 40, 1020 80, 1000 200" fill="none" stroke="#C9903A" strokeWidth="0.5" opacity="0.08" />
        <path className="meridian-path" d="M300 100 Q 350 70, 400 85 T 500 75" fill="none" stroke="#C9903A" strokeWidth="0.5" opacity="0.1" />
        <path className="meridian-path" d="M700 110 Q 750 130, 800 115 T 950 125" fill="none" stroke="#C9903A" strokeWidth="0.5" opacity="0.1" />
      </svg>
    </div>
  );
}
