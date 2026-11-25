import { useEffect, useRef, useState } from 'react';
import { ArrowRight, ArrowDownRight } from 'lucide-react';

const SCENES = [
  {
    id: 0,
    src: '/scenes/scene-1.jpg',
    code: '01',
    navLabel: 'Chuỗi cung ứng',
    eyebrow: 'VELOCARGO GLOBAL LOGISTICS',
    titleLead: 'Kiến tạo chuỗi cung ứng',
    titleAccent: 'không điểm dừng',
    subtitle:
      'Hạ tầng vận tải đa phương thức kết nối nhà máy, cảng nước sâu và thị trường quốc tế trong một hệ sinh thái thống nhất.',
    metric: '24/7',
    metricLabel: 'Điều phối toàn cầu',
    transitionType: 'base',
    motion: (t) => ({ scale: 1.04 + t * 0.08, tx: -1.2 + t * 2.4, ty: 0 }),
  },
  {
    id: 1,
    src: '/scenes/scene-2.jpg',
    code: '02',
    navLabel: 'Cam kết SLA',
    eyebrow: 'ĐỘ CHÍNH XÁC VẬN HÀNH',
    titleLead: 'Chính xác đến từng',
    titleAccent: 'phút cam kết',
    subtitle:
      'Lịch trình cố định hàng tuần và điều phối làn bốc xếp thông minh giúp doanh nghiệp loại bỏ hoàn toàn thời gian chờ.',
    metric: '99.4%',
    metricLabel: 'Giao hàng đúng hẹn SLA',
    // 01 -> 02: Horizontal Wipe from Right to Left (matches truck gliding into bay)
    transitionType: 'horizontal-wipe',
    motion: (t) => ({ scale: 1.05 + t * 0.08, tx: 1.0 - t * 2.0, ty: -0.4 + t * 0.8 }),
  },
  {
    id: 2,
    src: '/scenes/scene-3.jpg',
    code: '03',
    navLabel: 'An toàn tuyệt đối',
    eyebrow: 'TIÊU CHUẨN QUỐC TẾ ISO & FIATA',
    titleLead: 'An toàn tuyệt đối cho',
    titleAccent: 'mọi lô hàng',
    subtitle:
      'Giám sát niêm phong điện tử, cảm biến hành trình liên tục và cam kết bảo hiểm 100% giá trị trên từng chặng.',
    metric: '100%',
    metricLabel: 'Bảo hiểm toàn trình',
    // 02 -> 03: Vertical Drop from Top to Bottom (matches crane lowering container)
    transitionType: 'vertical-drop',
    motion: (t) => ({ scale: 1.05 + t * 0.08, tx: 0, ty: -1.4 + t * 2.4 }),
  },
  {
    id: 3,
    src: '/scenes/scene-4.jpg',
    code: '04',
    navLabel: 'Xuyên biên giới',
    eyebrow: 'SỐ HÓA HẢI QUAN E-DO',
    titleLead: 'Thông quan tốc độ',
    titleAccent: 'xuyên biên giới',
    subtitle:
      'Tự động hóa chứng từ và thông quan điện tử giúp rút ngắn tối đa thời gian lưu cảng, tăng tốc dòng chảy hàng hóa.',
    metric: '-40%',
    metricLabel: 'Thời gian chờ thông quan',
    // 03 -> 04: Diagonal Speed Slice (kinetic highway momentum)
    transitionType: 'diagonal-slice',
    motion: (t) => ({ scale: 1.05 + t * 0.07, tx: -1.6 + t * 3.2, ty: 0.3 - t * 0.6 }),
  },
  {
    id: 4,
    src: '/scenes/scene-5.jpg',
    code: '05',
    navLabel: 'Tầm vóc toàn cầu',
    eyebrow: 'MẠNG LƯỚI VẬN TẢI TOÀN CẦU',
    titleLead: 'Một đối tác.',
    titleAccent: '180+ Quốc gia.',
    subtitle:
      'Từ các cảng biển chiến lược đến tận kho phân phối nội địa — VeloCargo đồng hành cùng tốc độ tăng trưởng của doanh nghiệp.',
    metric: '180+',
    metricLabel: 'Quốc gia & vùng lãnh thổ',
    isFinale: true,
    // 04 -> 05: Cinema Aperture Expand from Center (grand panoramic port reveal)
    transitionType: 'aperture-expand',
    motion: (t) => ({ scale: 1.16 - t * 0.14, tx: 0.5 - t * 0.5, ty: -0.7 + t * 0.7 }),
  },
];

const clamp = (v, min, max) => Math.min(max, Math.max(min, v));
const lerp = (a, b, t) => a + (b - a) * t;
const easeInOutCubic = (t) => {
  const c = clamp(t, 0, 1);
  return c < 0.5 ? 4 * c * c * c : 1 - Math.pow(-2 * c + 2, 3) / 2;
};

function getTransitionClipPath(type, t) {
  if (type === 'base' || t >= 0.999) return 'none';
  if (t <= 0.001) return 'inset(100% 0 0 0)';

  switch (type) {
    case 'horizontal-wipe': {
      // Sweeps cleanly from right edge to left edge
      const leftInset = (1 - t) * 100;
      return `inset(0 0 0 ${leftInset.toFixed(2)}%)`;
    }
    case 'vertical-drop': {
      // Drops smoothly from top to bottom like the crane lowering cargo
      const bottomInset = (1 - t) * 100;
      return `inset(0 0 ${bottomInset.toFixed(2)}% 0)`;
    }
    case 'diagonal-slice': {
      // Sharp kinetic diagonal speed cut sweeping left-to-right
      const slant = 24;
      const topX = clamp(t * (100 + slant), 0, 100);
      const bottomX = clamp(t * (100 + slant) - slant, 0, 100);
      return `polygon(0% 0%, ${topX.toFixed(2)}% 0%, ${bottomX.toFixed(2)}% 100%, 0% 100%)`;
    }
    case 'aperture-expand': {
      // Circular Iris Portal expanding smoothly from center (0% -> 105%)
      const radius = t * 105;
      return `circle(${radius.toFixed(2)}% at 50% 50%)`;
    }
    default:
      return 'none';
  }
}

export default function PortHeroCinematic() {
  const sectionRef = useRef(null);
  const scrollProgressRef = useRef(0);
  const hoverTargetRef = useRef(null);
  const currentProgressRef = useRef(0);
  const pointerTargetRef = useRef({ x: 0, y: 0, px: 50, py: 50 });
  const pointerCurrentRef = useRef({ x: 0, y: 0, px: 50, py: 50 });

  const [progress, setProgress] = useState(0);
  const [pointer, setPointer] = useState({ x: 0, y: 0, px: 50, py: 50 });
  const [displayIdx, setDisplayIdx] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  // Preload all 5 high-res scenes silently
  useEffect(() => {
    SCENES.forEach((s) => {
      const img = new Image();
      img.src = s.src;
    });
  }, []);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
    const onChange = (e) => setReducedMotion(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Scroll-linked timeline
  useEffect(() => {
    const onScroll = () => {
      const el = sectionRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const scrollable = el.offsetHeight - window.innerHeight;
      if (scrollable <= 0) return;
      hoverTargetRef.current = null;
      scrollProgressRef.current = clamp(-rect.top / scrollable, 0, 1);
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // 60fps smooth interpolation loop
  useEffect(() => {
    let rafId;
    const tick = () => {
      const desired =
        hoverTargetRef.current !== null ? hoverTargetRef.current : scrollProgressRef.current;
      const ease = reducedMotion ? 0.35 : 0.08;
      const nextP = lerp(currentProgressRef.current, desired, ease);

      const nextX = lerp(pointerCurrentRef.current.x, pointerTargetRef.current.x, 0.07);
      const nextY = lerp(pointerCurrentRef.current.y, pointerTargetRef.current.y, 0.07);
      const nextPx = lerp(pointerCurrentRef.current.px, pointerTargetRef.current.px, 0.08);
      const nextPy = lerp(pointerCurrentRef.current.py, pointerTargetRef.current.py, 0.08);

      if (
        Math.abs(nextP - currentProgressRef.current) > 0.0001 ||
        Math.abs(nextX - pointerCurrentRef.current.x) > 0.0005 ||
        Math.abs(nextY - pointerCurrentRef.current.y) > 0.0005
      ) {
        currentProgressRef.current = nextP;
        pointerCurrentRef.current = { x: nextX, y: nextY, px: nextPx, py: nextPy };
        setProgress(nextP);
        setPointer({ x: nextX, y: nextY, px: nextPx, py: nextPy });
      }
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [reducedMotion]);

  // Debounce scene index slightly (70ms) so fast scrolling doesn't stutter text animations
  const rawIdx = clamp(Math.round(progress * (SCENES.length - 1)), 0, SCENES.length - 1);
  useEffect(() => {
    const timer = setTimeout(() => setDisplayIdx(rawIdx), 70);
    return () => clearTimeout(timer);
  }, [rawIdx]);

  const jumpToScene = (idx, lockScroll = true) => {
    const targetP = idx / (SCENES.length - 1);
    if (!lockScroll) {
      hoverTargetRef.current = targetP;
      return;
    }
    hoverTargetRef.current = null;
    scrollProgressRef.current = targetP;
    if (sectionRef.current) {
      const scrollable = sectionRef.current.offsetHeight - window.innerHeight;
      if (scrollable > 0) {
        window.scrollTo({
          top: sectionRef.current.offsetTop + targetP * scrollable,
          behavior: reducedMotion ? 'auto' : 'smooth',
        });
      }
    }
  };

  const handlePointerMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const rx = (e.clientX - rect.left) / rect.width;
    const ry = (e.clientY - rect.top) / rect.height;
    pointerTargetRef.current = {
      x: clamp((rx - 0.5) * 2, -1, 1),
      y: clamp((ry - 0.5) * 2, -1, 1),
      px: clamp(rx * 100, 0, 100),
      py: clamp(ry * 100, 0, 100),
    };
  };

  const handlePointerLeave = () => {
    pointerTargetRef.current = { x: 0, y: 0, px: 50, py: 50 };
    hoverTargetRef.current = null;
  };

  const timelinePos = progress * (SCENES.length - 1);
  const finaleReveal = easeInOutCubic(clamp(timelinePos - 3, 0, 1));
  const activeScene = SCENES[displayIdx];
  const leadWords = activeScene.titleLead.split(' ');
  const accentWords = activeScene.titleAccent.split(' ');
  const isFinale = Boolean(activeScene.isFinale);

  return (
    <section
      id="hero"
      ref={sectionRef}
      aria-label="Câu chuyện thương hiệu VeloCargo Global Logistics"
      className="relative h-[400vh] bg-slate-950"
    >
      {/* Full-bleed 100vh stage from top: 0 so transparent Navbar floats directly inside the image */}
      <div
        onMouseMove={handlePointerMove}
        onMouseLeave={handlePointerLeave}
        className="sticky top-0 flex h-screen min-h-[640px] w-full flex-col justify-end overflow-hidden bg-slate-950"
      >
        {/* 1. MULTI-SIGNATURE GEOMETRIC TRANSITION CINEMA STACK */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden bg-slate-950">
          {SCENES.map((scene, idx) => {
            const wipeProgress =
              idx === 0 ? 1 : easeInOutCubic(clamp(timelinePos - (idx - 1), 0, 1));
            const outgoingProgress =
              idx < SCENES.length - 1 ? easeInOutCubic(clamp(timelinePos - idx, 0, 1)) : 0;

            if (idx > 0 && wipeProgress <= 0.001) return null;
            if (outgoingProgress >= 0.999) return null;

            const localT = clamp(timelinePos - idx + 0.5, 0, 1);
            const { scale, tx, ty } = scene.motion(localT);
            // Extra dramatic lens zoom-out + golden bloom as Scene 5 circular portal opens
            const finaleZoomBoost = scene.isFinale ? (1 - wipeProgress) * 0.14 : 0;
            const finaleBloom = scene.isFinale ? (1 - wipeProgress) * 0.22 : 0;
            const finalScale = scale + finaleZoomBoost - outgoingProgress * 0.045;
            const brightness = 1 + finaleBloom - outgoingProgress * 0.4;
            const px = pointer.x * -1.45;
            const py = pointer.y * -0.9;
            const clipPath = getTransitionClipPath(scene.transitionType, wipeProgress);

            return (
              <div
                key={scene.id}
                aria-hidden={idx !== displayIdx}
                className="absolute inset-0 will-change-transform"
                style={{
                  zIndex: idx + 1,
                  clipPath,
                }}
              >
                <img
                  src={scene.src}
                  alt={scene.navLabel}
                  decoding="async"
                  className="h-full w-full object-cover object-center will-change-transform"
                  style={{
                    transform: `scale(${finalScale.toFixed(4)}) translate3d(${(tx + px).toFixed(2)}%, ${(ty + py).toFixed(2)}%, 0)`,
                    filter: `brightness(${brightness.toFixed(3)}) contrast(1.04)`,
                  }}
                />
              </div>
            );
          })}

          {/* Special Effect for Scene 5: Expanding Luminous Iris Portal & Rotating Radar Ring */}
          {finaleReveal > 0.01 && finaleReveal < 0.96 && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center overflow-hidden"
              style={{ opacity: Math.sin(finaleReveal * Math.PI) }}
            >
              {/* Primary luminous portal ring synced to circle radius */}
              <div
                className="rounded-full border border-orange-300/80 shadow-[0_0_45px_rgba(249,115,22,0.45),inset_0_0_35px_rgba(56,189,248,0.3)]"
                style={{
                  width: `${(finaleReveal * 165).toFixed(2)}vmax`,
                  height: `${(finaleReveal * 165).toFixed(2)}vmax`,
                }}
              />
              {/* Secondary rotating dashed compass/radar ring */}
              <div
                className="absolute rounded-full border border-dashed border-sky-300/45"
                style={{
                  width: `${(finaleReveal * 176).toFixed(2)}vmax`,
                  height: `${(finaleReveal * 176).toFixed(2)}vmax`,
                  transform: `rotate(${(finaleReveal * 75).toFixed(1)}deg)`,
                }}
              />
            </div>
          )}
        </div>

        {/* 2. TOP SCRIM (for transparent Navbar readability) + BOTTOM VIGNETTE + CURSOR SPOTLIGHT */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 z-10 h-32 bg-gradient-to-b from-slate-950/75 via-slate-950/30 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-slate-950/90 via-slate-950/22 to-transparent"
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-10 transition-opacity duration-300"
          style={{
            background: `radial-gradient(640px circle at ${pointer.px}% ${pointer.py}%, rgba(56, 189, 248, 0.11), rgba(249, 115, 22, 0.05) 40%, transparent 72%)`,
          }}
        />

        {/* 3. GIANT COUNTER-PARALLAX WATERMARK NUMBER */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-20 left-6 z-10 select-none font-display text-[140px] font-black leading-none tracking-tighter text-white/[0.045] sm:left-10 sm:text-[220px]"
          style={{
            transform: `translate3d(${(pointer.x * 18).toFixed(1)}px, ${(pointer.y * 12).toFixed(1)}px, 0)`,
          }}
        >
          {activeScene.code}
        </div>

        {/* 4. DESKTOP MINIMALIST RIGHT-EDGE CHAPTER RAIL */}
        <nav
          aria-label="Điều hướng chương thương hiệu"
          onMouseLeave={() => {
            hoverTargetRef.current = null;
          }}
          className="absolute top-1/2 right-6 z-20 hidden -translate-y-1/2 flex-col items-end gap-4 sm:flex lg:right-10"
        >
          {SCENES.map((scene, idx) => {
            const isActive = idx === displayIdx;
            return (
              <button
                key={scene.id}
                type="button"
                onClick={() => jumpToScene(idx, true)}
                onMouseEnter={() => jumpToScene(idx, false)}
                className="group flex min-h-8 cursor-pointer items-center gap-3.5 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
              >
                <span
                  className={`text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                    isActive
                      ? 'translate-x-0 text-white opacity-100'
                      : 'translate-x-2 text-slate-300 opacity-0 group-hover:translate-x-0 group-hover:opacity-100'
                  }`}
                >
                  {scene.navLabel}
                </span>
                <span
                  className={`block rounded-full transition-all duration-300 ${
                    isActive
                      ? 'h-[3px] w-10 bg-orange-500 shadow-[0_0_12px_rgba(249,115,22,0.7)]'
                      : 'h-[2px] w-4 bg-white/35 group-hover:w-7 group-hover:bg-white/80'
                  }`}
                />
              </button>
            );
          })}
        </nav>

        {/* 5. BRAND STORYTELLING STAGE */}
        <div
          className={`relative z-20 mx-auto w-full max-w-7xl px-5 pb-9 sm:px-8 sm:pb-12 lg:px-10 ${
            isFinale ? 'my-auto pt-20 text-center' : ''
          }`}
        >
          <div
            key={activeScene.id}
            className={
              isFinale
                ? 'mx-auto flex max-w-4xl flex-col items-center'
                : 'flex flex-col justify-between gap-8 lg:flex-row lg:items-end'
            }
          >
            {/* Brand Copy Block */}
            <div className="max-w-3xl">
              <p className="animate-cinema-fade font-mono text-[11px] font-semibold tracking-[0.28em] text-orange-400 uppercase sm:text-xs">
                {activeScene.eyebrow}
              </p>

              <h1
                className={`mt-3.5 font-display font-bold tracking-tight text-white ${
                  isFinale
                    ? 'text-4xl leading-[1.15] sm:text-6xl lg:text-[68px]'
                    : 'text-3xl leading-[1.16] sm:text-5xl lg:text-[58px]'
                }`}
              >
                {leadWords.map((word, wIdx) => (
                  <span
                    key={`lead-${activeScene.id}-${wIdx}`}
                    className="mr-[0.24em] -my-1.5 inline-block overflow-hidden py-1.5 align-bottom"
                  >
                    <span
                      className="animate-cinema-word"
                      style={{ animationDelay: `${wIdx * 45}ms` }}
                    >
                      {word}
                    </span>
                  </span>
                ))}
                <br className="hidden sm:block" />
                {accentWords.map((word, wIdx) => (
                  <span
                    key={`accent-${activeScene.id}-${wIdx}`}
                    className="mr-[0.24em] -my-1.5 inline-block overflow-hidden py-1.5 align-bottom"
                  >
                    <span
                      className="animate-cinema-word bg-gradient-to-r from-orange-400 via-amber-200 to-white bg-clip-text text-transparent"
                      style={{ animationDelay: `${(leadWords.length + wIdx) * 45 + 40}ms` }}
                    >
                      {word}
                    </span>
                  </span>
                ))}
              </h1>

              <p
                className={`animate-cinema-fade mt-4 text-base leading-relaxed text-slate-200/90 sm:text-lg ${
                  isFinale ? 'mx-auto max-w-2xl' : 'max-w-xl'
                }`}
                style={{ animationDelay: '220ms' }}
              >
                {activeScene.subtitle}
              </p>

              {/* Action Buttons */}
              <div
                className={`animate-cinema-fade mt-7 flex flex-wrap items-center gap-4 ${
                  isFinale ? 'justify-center' : ''
                }`}
                style={{ animationDelay: '300ms' }}
              >
                <a
                  href="#quote"
                  className="btn-sheen group inline-flex min-h-12 cursor-pointer items-center gap-2.5 rounded-full bg-[#D95D24] px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-orange-950/40 transition-all hover:bg-[#C24F1B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
                >
                  <span>Nhận báo giá doanh nghiệp</span>
                  <ArrowRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
                    aria-hidden="true"
                  />
                </a>

                <a
                  href="#tracking"
                  className="group inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full border border-white/25 bg-white/10 px-5 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all hover:border-white/50 hover:bg-white/20 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                >
                  <span>Tra cứu vận đơn</span>
                  <ArrowDownRight
                    className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:translate-y-0.5"
                    aria-hidden="true"
                  />
                </a>
              </div>
            </div>

            {/* Right-Side Architectural Big Metric (Scenes 1-4) */}
            {!isFinale && (
              <div className="hidden border-l border-white/20 pl-7 text-left lg:block">
                <div className="overflow-hidden py-1">
                  <p className="animate-metric-roll font-metric text-6xl font-bold tracking-tight text-white">
                    {activeScene.metric}
                  </p>
                </div>
                <p
                  className="animate-cinema-fade mt-1.5 font-mono text-xs tracking-wider text-slate-300 uppercase"
                  style={{ animationDelay: '160ms' }}
                >
                  {activeScene.metricLabel}
                </p>
              </div>
            )}
          </div>

          {/* Mobile 5-Bar Touch Scrubber + Ultra-thin Progress Hairline */}
          <div className={`mt-8 ${isFinale ? 'mx-auto max-w-2xl' : ''}`}>
            <div className="mb-3 flex items-center justify-center gap-2 sm:hidden">
              {SCENES.map((scene, idx) => (
                <button
                  key={scene.id}
                  type="button"
                  aria-label={`Chuyển đến ${scene.navLabel}`}
                  onClick={() => jumpToScene(idx, true)}
                  className={`h-1.5 cursor-pointer rounded-full transition-all ${
                    idx === displayIdx ? 'w-8 bg-orange-500' : 'w-3 bg-white/30'
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-4">
              <div className="h-[2px] flex-1 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-blue-400 via-white to-orange-500"
                  style={{ width: `${Math.max(4, progress * 100)}%` }}
                />
              </div>
              <span className="font-mono text-[11px] tracking-widest text-slate-300/85">
                {activeScene.code} / 0{SCENES.length}
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
