import { useEffect, useRef } from 'react';
import gsap from 'gsap';

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const ghostRef = useRef<HTMLDivElement>(null);
  const posRef = useRef({ x: 0, y: 0 });
  const ghostPosRef = useRef({ x: 0, y: 0 });
  const isHoveringCTA = useRef(false);
  const isHoveringImage = useRef(false);
  const isClicking = useRef(false);

  useEffect(() => {
    // Check for touch device - disable custom cursor
    const isTouchDevice = window.matchMedia('(pointer: coarse)').matches;
    if (isTouchDevice) return;

    const cursor = cursorRef.current;
    const ghost = ghostRef.current;
    if (!cursor || !ghost) return;

    // Make cursor visible
    cursor.style.opacity = '1';
    ghost.style.opacity = '0.4';

    const onMouseMove = (e: MouseEvent) => {
      posRef.current.x = e.clientX;
      posRef.current.y = e.clientY;
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target) return;

      const isCTA = target.closest('a, button, [role="button"], .cta-hover');
      const isImage = target.closest('img, .image-hover, [data-cursor="image"]');

      isHoveringCTA.current = !!isCTA;
      isHoveringImage.current = !!isImage && !isCTA;

      updateCursorState();
    };

    const onMouseDown = () => {
      isClicking.current = true;
      updateCursorState();
      gsap.to(cursor, {
        scale: 1.5,
        duration: 0.1,
        ease: 'power2.out',
        onComplete: () => {
          gsap.to(cursor, {
            scale: 1,
            duration: 0.1,
            ease: 'power2.in',
          });
        },
      });
    };

    const onMouseUp = () => {
      isClicking.current = false;
      updateCursorState();
    };

    const updateCursorState = () => {
      if (!cursor) return;

      if (isHoveringCTA.current) {
        cursor.classList.add('cursor-cta');
        cursor.classList.remove('cursor-image');
      } else if (isHoveringImage.current) {
        cursor.classList.add('cursor-image');
        cursor.classList.remove('cursor-cta');
      } else {
        cursor.classList.remove('cursor-cta', 'cursor-image');
      }
    };

    // Animation loop
    let rafId: number;
    const animate = () => {
      // Lerp ghost position
      ghostPosRef.current.x += (posRef.current.x - ghostPosRef.current.x) * 0.12;
      ghostPosRef.current.y += (posRef.current.y - ghostPosRef.current.y) * 0.12;

      cursor.style.transform = `translate(${posRef.current.x}px, ${posRef.current.y}px) translate(-50%, -50%)`;
      ghost.style.transform = `translate(${ghostPosRef.current.x}px, ${ghostPosRef.current.y}px) translate(-50%, -50%)`;

      rafId = requestAnimationFrame(animate);
    };

    animate();

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseover', onMouseOver);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);

    return () => {
      cancelAnimationFrame(rafId);
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseover', onMouseOver);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
    };
  }, []);

  // Don't render on touch devices
  if (typeof window !== 'undefined' && window.matchMedia('(pointer: coarse)').matches) {
    return null;
  }

  return (
    <>
      <div
        ref={cursorRef}
        className="fixed top-0 left-0 pointer-events-none z-[9999] opacity-0 transition-[width,height,background] duration-200 mix-blend-difference"
        style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          border: '1px solid #B8311F',
          background: 'transparent',
        }}
      />
      <div
        ref={ghostRef}
        className="fixed top-0 left-0 pointer-events-none z-[9998] opacity-0"
        style={{
          width: '12px',
          height: '12px',
          borderRadius: '50%',
          border: '1px solid rgba(184, 49, 31, 0.3)',
          background: 'transparent',
        }}
      />
      <style>{`
        .cursor-cta {
          width: 40px !important;
          height: 40px !important;
          background: rgba(184, 49, 31, 0.2) !important;
          border: 1px solid #B8311F !important;
        }
        .cursor-cta::after {
          content: 'BOOK';
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 8px;
          font-weight: 500;
          letter-spacing: 0.12em;
          color: #B8311F;
          font-family: 'Inter', sans-serif;
        }
        .cursor-image {
          width: 24px !important;
          height: 24px !important;
          background: transparent !important;
          border: none !important;
          box-shadow: none !important;
        }
        .cursor-image::before,
        .cursor-image::after {
          content: '';
          position: absolute;
          background: #B8311F;
        }
        .cursor-image::before {
          width: 1px;
          height: 24px;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
        }
        .cursor-image::after {
          width: 24px;
          height: 1px;
          top: 50%;
          left: 0;
          transform: translateY(-50%);
        }
      `}</style>
    </>
  );
}
