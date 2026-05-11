import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';

interface PreloaderProps {
  onComplete: () => void;
}

export default function Preloader({ onComplete }: PreloaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const path = pathRef.current;
    const container = containerRef.current;
    if (!path || !container) return;

    const pathLength = path.getTotalLength();

    // Set initial state
    gsap.set(path, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
      fill: 'transparent',
    });

    const tl = gsap.timeline({
      onComplete: () => {
        // Fade out the preloader
        gsap.to(container, {
          opacity: 0,
          duration: 0.4,
          ease: 'power2.inOut',
          onComplete: () => {
            setVisible(false);
            onComplete();
          },
        });
      },
    });

    // Stroke draw animation - like being brushed onto the screen
    tl.to(path, {
      strokeDashoffset: 0,
      duration: 1.2,
      ease: 'power2.inOut',
    });

    // Brief pause then fill
    tl.to(path, {
      fill: '#B8311F',
      duration: 0.4,
      ease: 'power2.out',
    }, '+=0.2');

    return () => {
      tl.kill();
    };
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-[10000] flex items-center justify-center"
      style={{ backgroundColor: '#0D0A06' }}
    >
      <svg
        width="120"
        height="120"
        viewBox="0 0 100 100"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* 气 character - Qi */}
        <path
          ref={pathRef}
          d="M20 25 
             Q35 22, 50 25 
             Q65 28, 80 25
             M50 25 
             L50 45
             M30 45 
             Q50 42, 70 45
             M30 45
             Q28 60, 25 75
             M50 45
             Q52 60, 50 75
             Q48 88, 35 90
             M70 45
             Q72 60, 70 75"
          stroke="#B8311F"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="transparent"
        />
      </svg>
    </div>
  );
}
