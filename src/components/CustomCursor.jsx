import { useEffect, useRef, useState } from 'react';

export default function CustomCursor() {
  const dotRef = useRef(null);
  const ringRef = useRef(null);
  const [enabled, setEnabled] = useState(false);
  const [cursorState, setCursorState] = useState('default'); // 'default' | 'pointer' | 'input'
  const [pressed, setPressed] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const isFinePointer = window.matchMedia('(pointer: fine)').matches;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isFinePointer || reducedMotion) return;

    setEnabled(true);

    let mouseX = -100;
    let mouseY = -100;
    let ringX = -100;
    let ringY = -100;
    let rafId;

    const onMouseMove = (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      setVisible(true);

      const target = e.target;
      if (target instanceof Element) {
        if (target.closest('input, textarea, select')) {
          setCursorState('input');
        } else if (
          target.closest('a, button, [role="button"], .cursor-pointer, article')
        ) {
          setCursorState('pointer');
        } else {
          setCursorState('default');
        }
      }
    };

    const onMouseDown = () => setPressed(true);
    const onMouseUp = () => setPressed(false);
    const onMouseLeave = () => setVisible(false);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('mousedown', onMouseDown);
    window.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseleave', onMouseLeave);

    const tick = () => {
      ringX += (mouseX - ringX) * 0.16;
      ringY += (mouseY - ringY) * 0.16;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%)`;
      }
      if (ringRef.current) {
        ringRef.current.style.transform = `translate3d(${ringX}px, ${ringY}px, 0) translate(-50%, -50%)`;
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('mousedown', onMouseDown);
      window.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseleave', onMouseLeave);
    };
  }, []);

  if (!enabled) return null;

  const ringSize =
    cursorState === 'pointer' ? (pressed ? 44 : 54) : cursorState === 'input' ? 24 : pressed ? 26 : 34;

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[100] overflow-hidden"
      style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.25s ease' }}
    >
      {/* Smooth Trailing Outer Ring */}
      <div
        ref={ringRef}
        className="fixed top-0 left-0 rounded-full will-change-transform"
        style={{
          width: `${ringSize}px`,
          height: `${ringSize}px`,
          border:
            cursorState === 'pointer'
              ? '1.5px solid rgba(217, 93, 36, 0.85)'
              : '1.25px solid rgba(217, 93, 36, 0.5)',
          backgroundColor:
            cursorState === 'pointer' ? 'rgba(217, 93, 36, 0.12)' : 'transparent',
          boxShadow:
            cursorState === 'pointer' ? '0 0 22px rgba(217, 93, 36, 0.25)' : 'none',
          transition:
            'width 0.22s cubic-bezier(0.22, 1, 0.36, 1), height 0.22s cubic-bezier(0.22, 1, 0.36, 1), background-color 0.22s ease, border-color 0.22s ease, box-shadow 0.22s ease',
        }}
      />

      {/* Crisp Inner Accent Dot */}
      <div
        ref={dotRef}
        className="fixed top-0 left-0 rounded-full will-change-transform"
        style={{
          width: cursorState === 'pointer' ? '5px' : '6px',
          height: cursorState === 'pointer' ? '5px' : '6px',
          backgroundColor: '#D95D24',
          opacity: cursorState === 'input' ? 0 : 0.9,
          transition: 'width 0.2s ease, height 0.2s ease, opacity 0.2s ease',
        }}
      />
    </div>
  );
}
