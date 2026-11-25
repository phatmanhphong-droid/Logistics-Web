import { useEffect, useRef, useState } from 'react';

/**
 * 4 signature heading reveal animations:
 * - "radar-sweep": Horizontal clip-path scan wipe (Tracking / GPS)
 * - "split-mask": Word-by-word masked tilt slide-up (Services)
 * - "focus-expand": Tracking tighten + depth focus snap (Quote Calculator)
 * - "stagger-slide": Left-to-right kinetic word glide with accent rule (Footer Hubs)
 */
export default function RevealHeading({
  eyebrow,
  title,
  subtitle,
  variant = 'split-mask',
  as: Tag = 'h2',
  eyebrowClassName = 'text-[#D95D24]',
  titleClassName = 'text-[#1E3A5F]',
  subtitleClassName = 'text-[#526071]',
  className = '',
}) {
  const containerRef = useRef(null);
  const [shown, setShown] = useState(false);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          observer.disconnect();
        }
      },
      { threshold: 0.18 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const words = title.split(' ');

  return (
    <div ref={containerRef} className={className}>
      {/* Eyebrow with animated leading accent line */}
      {eyebrow && (
        <div className="flex items-center gap-2.5">
          <span
            aria-hidden="true"
            className="block h-[2px] origin-left rounded-full bg-[#D95D24] transition-all duration-700 ease-out"
            style={{
              width: shown ? '26px' : '0px',
              opacity: shown ? 1 : 0,
            }}
          />
          <p
            className={`font-mono text-xs font-semibold tracking-[0.22em] uppercase transition-all duration-700 ease-out ${eyebrowClassName} ${
              shown ? 'translate-x-0 opacity-100' : '-translate-x-3 opacity-0'
            }`}
          >
            {eyebrow}
          </p>
        </div>
      )}

      {/* VARIANT 1: RADAR SWEEP (Horizontal Scan Wipe for Tracking) */}
      {variant === 'radar-sweep' && (
        <div className="relative mt-2.5 inline-block">
          <Tag
            className={`font-display text-3xl font-bold leading-[1.18] tracking-tight transition-all duration-900 ease-[cubic-bezier(0.22,1,0.36,1)] sm:text-4xl ${titleClassName}`}
            style={{
              clipPath: shown ? 'inset(-8% 0% -8% 0%)' : 'inset(-8% 100% -8% 0%)',
              opacity: shown ? 1 : 0.2,
              transform: shown ? 'translate3d(0,0,0)' : 'translate3d(-12px,0,0)',
            }}
          >
            {title}
          </Tag>
        </div>
      )}

      {/* VARIANT 2: SPLIT MASK + SUBTLE TILT (Kinetic Editorial for Services) */}
      {variant === 'split-mask' && (
        <Tag
          className={`mt-2.5 font-display text-3xl font-bold leading-[1.18] tracking-tight sm:text-4xl ${titleClassName}`}
        >
          {words.map((word, idx) => (
            <span
              key={`${word}-${idx}`}
              className="mr-[0.24em] -my-1.5 inline-block overflow-hidden py-1.5 align-bottom"
            >
              <span
                className="inline-block origin-bottom-left transition-all duration-750 ease-[cubic-bezier(0.22,1,0.36,1)]"
                style={{
                  transitionDelay: shown ? `${idx * 42}ms` : '0ms',
                  transform: shown
                    ? 'translate3d(0, 0, 0) rotate(0deg)'
                    : 'translate3d(0, 120%, 0) rotate(4deg)',
                  opacity: shown ? 1 : 0,
                  filter: shown ? 'blur(0px)' : 'blur(4px)',
                }}
              >
                {word}
              </span>
            </span>
          ))}
        </Tag>
      )}

      {/* VARIANT 3: FOCUS EXPAND -> TIGHTEN (Precision Mechanical Snap for Quote) */}
      {variant === 'focus-expand' && (
        <Tag
          className={`mt-2.5 font-display text-3xl font-bold leading-[1.18] transition-all duration-900 ease-[cubic-bezier(0.16,1,0.3,1)] sm:text-4xl ${titleClassName}`}
          style={{
            letterSpacing: shown ? '-0.015em' : '0.09em',
            transform: shown ? 'scale(1) translate3d(0,0,0)' : 'scale(0.95) translate3d(0,12px,0)',
            opacity: shown ? 1 : 0,
            filter: shown ? 'blur(0px)' : 'blur(8px)',
          }}
        >
          {title}
        </Tag>
      )}

      {/* VARIANT 4: STAGGER HORIZONTAL GLIDE (Footer Network) */}
      {variant === 'stagger-slide' && (
        <Tag
          className={`mt-2 font-display text-xl font-bold leading-[1.2] tracking-tight sm:text-2xl ${titleClassName}`}
        >
          {words.map((word, idx) => (
            <span
              key={`${word}-${idx}`}
              className="mr-[0.25em] inline-block transition-all duration-650 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{
                transitionDelay: shown ? `${idx * 45}ms` : '0ms',
                transform: shown ? 'translate3d(0, 0, 0)' : 'translate3d(-18px, 0, 0)',
                opacity: shown ? 1 : 0,
              }}
            >
              {word}
            </span>
          ))}
        </Tag>
      )}

      {/* Subtitle */}
      {subtitle && (
        <p
          className={`mt-3 text-base leading-relaxed transition-all duration-700 ease-out ${subtitleClassName} ${
            shown ? 'translate-y-0 opacity-100 blur-0' : 'translate-y-4 opacity-0 blur-[4px]'
          }`}
          style={{ transitionDelay: shown ? '220ms' : '0ms' }}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}
