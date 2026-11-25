import { useRef, useState } from 'react';

export default function InteractiveCard({
  as: Tag = 'div',
  className = '',
  glowColor = 'rgba(217, 93, 36, 0.11)',
  tilt = true,
  children,
  ...rest
}) {
  const cardRef = useRef(null);
  const [spot, setSpot] = useState({ x: 50, y: 50, active: false, rx: 0, ry: 0 });

  const handleMouseMove = (e) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    const rx = tilt ? ((y - 50) / 50) * -2.2 : 0;
    const ry = tilt ? ((x - 50) / 50) * 2.2 : 0;
    setSpot({ x, y, active: true, rx, ry });
  };

  const handleMouseLeave = () => {
    setSpot((prev) => ({ ...prev, active: false, rx: 0, ry: 0 }));
  };

  return (
    <Tag
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`relative overflow-hidden transition-all duration-300 ease-out will-change-transform ${className}`}
      style={{
        transform: spot.active
          ? `perspective(900px) rotateX(${spot.rx.toFixed(2)}deg) rotateY(${spot.ry.toFixed(2)}deg) translateY(-2px)`
          : 'perspective(900px) rotateX(0deg) rotateY(0deg) translateY(0px)',
      }}
      {...rest}
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 z-0 transition-opacity duration-300"
        style={{
          opacity: spot.active ? 1 : 0,
          background: `radial-gradient(300px circle at ${spot.x}% ${spot.y}%, ${glowColor}, transparent 72%)`,
        }}
      />
      <div className="relative z-10 h-full">{children}</div>
    </Tag>
  );
}
