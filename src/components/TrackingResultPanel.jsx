import { useEffect, useRef, useState } from 'react';
import {
  MapPin,
  Truck,
  Ship,
  Plane,
  Package,
  CalendarClock,
  CheckCircle2,
  Navigation,
  Search,
  ArrowRight,
  Copy,
  Check,
  Thermometer,
  ShieldCheck,
  Radio,
} from 'lucide-react';
import { SAMPLE_SHIPMENTS } from '../data/logisticsData';
import InteractiveCard from './InteractiveCard';
import RevealHeading from './RevealHeading';

const SAMPLE_IDS = Object.keys(SAMPLE_SHIPMENTS);

const JOURNEY_STEPS = [
  { label: 'Đã lấy hàng' },
  { label: 'Trung chuyển' },
  { label: 'Thông quan / Phân loại' },
  { label: 'Giao thành công' },
];

const MODE_ICON = {
  road: Truck,
  sea: Ship,
  air: Plane,
};

const STATUS_STYLES = {
  in_transit: {
    pill: 'border-[#D95D24]/45 bg-[#D95D24]/20 text-orange-200',
    dot: 'bg-[#F59E0B]',
    pin: '#F97316',
    ring: 'rgba(249,115,22,0.42)',
  },
  customs: {
    pill: 'border-sky-300/40 bg-sky-400/20 text-sky-100',
    dot: 'bg-sky-300',
    pin: '#38BDF8',
    ring: 'rgba(56,189,248,0.42)',
  },
  delivered: {
    pill: 'border-emerald-300/40 bg-emerald-500/20 text-emerald-100',
    dot: 'bg-emerald-300',
    pin: '#10B981',
    ring: 'rgba(16,185,129,0.42)',
  },
};

function GeographicSilhouette({ region }) {
  if (region === 'vietnam') {
    return (
      <g fill="#23456E" stroke="#4D7AB3" strokeWidth="1.2" opacity="0.92">
        <path d="M 155 18 L 265 18 L 278 46 L 252 68 L 260 94 L 298 134 L 306 168 L 284 204 L 252 232 L 218 258 L 194 244 L 204 214 L 180 185 L 188 145 L 172 104 L 146 66 Z" />
        <circle cx="360" cy="148" r="2.2" fill="#93C5FD" opacity="0.65" />
        <circle cx="372" cy="154" r="1.8" fill="#93C5FD" opacity="0.65" />
        <circle cx="366" cy="212" r="2.2" fill="#93C5FD" opacity="0.65" />
      </g>
    );
  }

  if (region === 'asean') {
    return (
      <g fill="#23456E" stroke="#4D7AB3" strokeWidth="1.2" opacity="0.92">
        <path d="M 120 14 L 280 14 L 292 64 L 258 96 L 222 106 L 196 146 L 174 134 L 160 88 L 122 62 Z" />
        <path d="M 148 136 L 186 142 L 214 218 L 198 232 L 168 192 Z" />
        <path d="M 332 162 L 420 148 L 444 218 L 352 240 Z" opacity="0.7" />
        <path d="M 105 224 L 188 258 L 165 274 L 92 246 Z" opacity="0.7" />
      </g>
    );
  }

  return (
    <g fill="#23456E" stroke="#4D7AB3" strokeWidth="1.2" opacity="0.92">
      <path d="M 28 36 L 186 24 L 212 72 L 194 118 L 154 148 L 126 198 L 76 218 L 36 164 Z" />
      <path d="M 218 76 L 238 82 L 232 108 L 216 102 Z" />
      <path d="M 254 88 L 272 104 L 260 128 L 246 114 Z" opacity="0.72" />
      <path d="M 382 28 L 488 28 L 488 228 L 434 196 L 408 140 L 392 86 Z" />
    </g>
  );
}

export default function TrackingResultPanel({
  shipment,
  trackingInput,
  setTrackingInput,
  onSearch,
  errorMessage,
}) {
  const sectionRef = useRef(null);
  const progressRef = useRef(shipment?.progress ?? 0);

  const [isVisible, setIsVisible] = useState(false);
  const [copied, setCopied] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(shipment?.progress ?? 0);
  const [activeWaypointIdx, setActiveWaypointIdx] = useState(null);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shipment) return;
    const startVal = progressRef.current;
    const endVal = shipment.progress;
    const startTime = performance.now();
    const duration = 540;
    let rafId;

    const animate = (now) => {
      const t = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      const current = startVal + (endVal - startVal) * eased;
      progressRef.current = current;
      setAnimatedProgress(Math.round(current));
      if (t < 1) rafId = requestAnimationFrame(animate);
    };

    rafId = requestAnimationFrame(animate);
    setActiveWaypointIdx(null);
    return () => cancelAnimationFrame(rafId);
  }, [shipment]);

  if (!shipment) return null;

  const statusStyle = STATUS_STYLES[shipment.status] || STATUS_STYLES.in_transit;
  const ModeIcon = MODE_ICON[shipment.modeType] || Truck;
  const points = shipment.routePoints;
  const fullPathD = `M ${points[0].x} ${points[0].y} Q ${points[1].x} ${points[1].y - 18} ${points[2].x} ${points[2].y}`;

  const currentPointIdx = points.findIndex((p) => p.current);
  const activePathD =
    currentPointIdx === 1
      ? `M ${points[0].x} ${points[0].y} Q ${(points[0].x + points[1].x) / 2 + 12} ${(points[0].y + points[1].y) / 2 - 14} ${points[1].x} ${points[1].y}`
      : fullPathD;

  const timelineIndexToWaypoint = (tIdx) => {
    const total = shipment.timeline.length;
    if (currentPointIdx === 1) {
      return tIdx === total - 1 ? 0 : 1;
    }
    return Math.max(0, Math.min(points.length - 1, points.length - 1 - tIdx));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(trackingInput);
  };

  const handleCopyId = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shipment.id).catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <section
      id="tracking"
      ref={sectionRef}
      aria-label="Tra cứu và theo dõi vận đơn"
      className="relative scroll-mt-16 overflow-hidden bg-[#F5F4F0] py-20 text-[#1E3A5F] sm:py-24"
    >
      {/* Subtle Architectural Dot Grid on Warm Ivory */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-45"
        style={{
          backgroundImage: 'radial-gradient(rgba(30, 58, 95, 0.13) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Header + Elevated Warm-Stone Search Capsule */}
        <div
          className={`mb-10 flex flex-col justify-between gap-6 transition-all duration-700 ease-out lg:flex-row lg:items-end ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
          }`}
        >
          <RevealHeading
            variant="radar-sweep"
            eyebrow="Theo dõi thời gian thực • GPS 24/7"
            title="Tra cứu hành trình vận đơn"
          />

          <form onSubmit={handleSubmit} noValidate className="w-full max-w-xl">
            <label htmlFor="tracking-code" className="sr-only">
              Nhập mã vận đơn
            </label>
            <div className="flex flex-col gap-2 rounded-2xl border border-[#DFDCD3] bg-white p-2 shadow-sm transition-colors focus-within:border-[#1E3A5F] sm:flex-row">
              <div className="relative flex-1">
                <Search
                  className="pointer-events-none absolute top-1/2 left-3.5 h-4 w-4 -translate-y-1/2 text-[#64748B]"
                  aria-hidden="true"
                />
                <input
                  id="tracking-code"
                  type="text"
                  value={trackingInput}
                  onChange={(e) => setTrackingInput(e.target.value)}
                  placeholder="Nhập mã vận đơn (VD: VC-884210-VN)"
                  className="h-11 w-full rounded-xl bg-[#F5F4F0]/75 pr-4 pl-10 font-mono text-sm font-medium text-[#1E3A5F] placeholder:font-sans placeholder:text-[#64748B] focus:bg-white focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="btn-sheen inline-flex h-11 cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#D95D24] px-6 text-sm font-semibold text-white shadow-md shadow-[#D95D24]/25 hover:bg-[#C24F1B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D95D24]"
              >
                <span>Tra cứu</span>
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>

            {errorMessage && (
              <p role="alert" className="mt-2 px-1 text-xs font-medium text-red-600">
                {errorMessage}
              </p>
            )}

            <div className="mt-3 flex flex-wrap items-center gap-2 px-1">
              <span className="text-xs font-medium text-[#526071]">Tuyến mẫu:</span>
              {SAMPLE_IDS.map((id) => {
                const isSelected = shipment.id === id;
                return (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setTrackingInput(id);
                      onSearch(id);
                    }}
                    className={`cursor-pointer rounded-full border px-3 py-1 font-mono text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 ${
                      isSelected
                        ? 'border-[#1E3A5F] bg-[#1E3A5F] text-white shadow-sm'
                        : 'border-[#DFDCD3] bg-white text-[#1E3A5F] hover:border-[#1E3A5F]/50 hover:bg-[#1E3A5F]/5'
                    }`}
                  >
                    {id}
                  </button>
                );
              })}
            </div>
          </form>
        </div>

        {/* Main White-Surface + Maritime Navy (#1E3A5F) Command Card */}
        <div
          key={shipment.id}
          className={`animate-panel-switch overflow-hidden rounded-3xl border border-[#E2DFD7] bg-white shadow-xl shadow-[#1E3A5F]/8 transition-all duration-700 delay-100 ${
            isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
          }`}
        >
          {/* 1. Maritime Navy (#1E3A5F) Executive Header */}
          <div className="relative overflow-hidden bg-[#1E3A5F] px-6 py-6 text-white sm:px-8">
            <img
              src={shipment.previewImage}
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-18 mix-blend-luminosity"
            />
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#1E3A5F] via-[#1E3A5F]/92 to-[#1E3A5F]/75"
            />

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-5">
              <div className="flex items-center gap-4">
                <div className="hidden h-14 w-20 shrink-0 overflow-hidden rounded-xl border border-white/20 sm:block">
                  <img
                    src={shipment.previewImage}
                    alt={shipment.mode}
                    className="h-full w-full object-cover"
                  />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-2.5">
                    <span className="font-mono text-xl font-semibold tracking-tight text-white">
                      {shipment.id}
                    </span>
                    <button
                      type="button"
                      onClick={handleCopyId}
                      aria-label="Sao chép mã vận đơn"
                      className="inline-flex h-7 cursor-pointer items-center gap-1 rounded-lg border border-white/20 bg-white/10 px-2.5 text-[11px] font-medium text-white transition-colors hover:bg-white/20"
                    >
                      {copied ? (
                        <>
                          <Check className="h-3 w-3 text-emerald-300" aria-hidden="true" />
                          <span className="text-emerald-200">Đã chép</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-3 w-3" aria-hidden="true" />
                          <span>Sao chép</span>
                        </>
                      )}
                    </button>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${statusStyle.pill}`}
                    >
                      <span
                        className={`h-2 w-2 rounded-full ${statusStyle.dot} ${
                          shipment.status !== 'delivered' ? 'animate-pulse' : ''
                        }`}
                        aria-hidden="true"
                      />
                      {shipment.statusLabel}
                    </span>
                  </div>

                  <p className="mt-1.5 flex items-center gap-2 text-sm text-slate-200">
                    <ModeIcon className="h-4 w-4 text-amber-300" aria-hidden="true" />
                    <span>{shipment.mode}</span>
                    <span className="text-white/35">•</span>
                    <span>{shipment.carrier}</span>
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 rounded-2xl border border-white/15 bg-white/10 px-4 py-3 backdrop-blur-md">
                <CalendarClock className="h-5 w-5 text-amber-300" aria-hidden="true" />
                <div>
                  <p className="text-[11px] font-medium tracking-wider text-slate-300 uppercase">
                    Dự kiến giao hàng
                  </p>
                  <p className="text-sm font-semibold text-white">{shipment.eta}</p>
                </div>
              </div>
            </div>

            {/* 4-Stage Horizontal Stepper */}
            <div className="relative z-10 mt-6 grid grid-cols-2 gap-3 border-t border-white/15 pt-5 sm:grid-cols-4">
              {JOURNEY_STEPS.map((step, idx) => {
                const isDone = idx <= shipment.stepIndex;
                const isCurrent = idx === shipment.stepIndex;
                return (
                  <div key={step.label} className="flex items-center gap-2.5">
                    <span
                      className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full font-mono text-[11px] font-semibold transition-all ${
                        isCurrent
                          ? 'bg-[#D95D24] text-white shadow-[0_0_14px_rgba(217,93,36,0.75)]'
                          : isDone
                            ? 'bg-white text-[#1E3A5F]'
                            : 'border border-white/25 bg-white/8 text-slate-300'
                      }`}
                    >
                      {idx + 1}
                    </span>
                    <span
                      className={`text-xs font-medium ${
                        isCurrent
                          ? 'text-white'
                          : isDone
                            ? 'text-slate-100'
                            : 'text-slate-300/70'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. Body Grid: Maritime Navy Map + Tactile Telemetry + Interactive Timeline */}
          <div className="grid gap-8 p-6 sm:p-8 lg:grid-cols-12">
            {/* Left: Geographic Radar Map & Interactive Telemetry Cards */}
            <div className="space-y-5 lg:col-span-7">
              <div className="relative overflow-hidden rounded-2xl border border-[#1E3A5F]/20 bg-[#152B47] p-5 text-white shadow-inner">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-slate-100">
                    <Radio className="h-3.5 w-3.5 animate-pulse text-amber-300" aria-hidden="true" />
                    <span>Bản đồ vệ tinh hành trình</span>
                    <span className="hidden rounded-md border border-white/15 bg-white/8 px-2 py-0.5 font-mono text-[11px] text-sky-200 sm:inline">
                      {shipment.gps}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-[11px] text-slate-300 uppercase">Tiến độ</span>
                    <span className="font-metric text-2xl font-bold text-white">
                      {animatedProgress}%
                    </span>
                  </div>
                </div>

                <div className="mb-3.5 h-[2.5px] w-full overflow-hidden rounded-full bg-white/15">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-sky-300 via-amber-300 to-[#D95D24] transition-[width] duration-500 ease-out"
                    style={{ width: `${animatedProgress}%` }}
                  />
                </div>

                <svg
                  viewBox="0 0 500 280"
                  role="img"
                  aria-label={`Bản đồ tuyến đường từ ${shipment.origin} đến ${shipment.destination}`}
                  className="h-64 w-full rounded-xl bg-[#10223A]"
                >
                  <defs>
                    <pattern id="geoGridNavy" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path
                        d="M 40 0 L 0 0 0 40"
                        fill="none"
                        stroke="rgba(255,255,255,0.06)"
                        strokeWidth="1"
                      />
                    </pattern>
                    <linearGradient id="routeGradNavy" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#93C5FD" />
                      <stop offset="100%" stopColor={statusStyle.pin} />
                    </linearGradient>
                  </defs>

                  <rect width="500" height="280" fill="url(#geoGridNavy)" />
                  <GeographicSilhouette region={shipment.mapRegion} />

                  <path
                    d={fullPathD}
                    fill="none"
                    stroke="rgba(255,255,255,0.22)"
                    strokeWidth="2.5"
                    strokeDasharray="5 6"
                  />
                  <path
                    d={activePathD}
                    fill="none"
                    stroke="url(#routeGradNavy)"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  <path
                    d={activePathD}
                    fill="none"
                    stroke="#FFFFFF"
                    strokeOpacity="0.75"
                    strokeWidth="1.5"
                    strokeDasharray="6 22"
                    className="animate-route-flow"
                  />

                  {points.map((pt, pIdx) => {
                    const isHighlighted = activeWaypointIdx === pIdx;
                    const showBeacon = pt.current || isHighlighted;
                    return (
                      <g
                        key={pt.code}
                        onMouseEnter={() => setActiveWaypointIdx(pIdx)}
                        onMouseLeave={() => setActiveWaypointIdx(null)}
                        className="cursor-pointer"
                      >
                        {showBeacon && (
                          <>
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r="14"
                              fill="none"
                              stroke={isHighlighted ? '#FCD34D' : statusStyle.pin}
                              strokeWidth="1.6"
                              className="animate-radar-ping"
                            />
                            <circle
                              cx={pt.x}
                              cy={pt.y}
                              r="13"
                              fill={isHighlighted ? 'rgba(252,211,77,0.3)' : statusStyle.ring}
                            />
                          </>
                        )}
                        <circle
                          cx={pt.x}
                          cy={pt.y}
                          r={showBeacon ? 6.5 : 5}
                          fill={
                            isHighlighted
                              ? '#FCD34D'
                              : pt.current
                                ? statusStyle.pin
                                : pt.done
                                  ? '#93C5FD'
                                  : '#64748B'
                          }
                          stroke="#FFFFFF"
                          strokeWidth="2"
                        />
                        <g transform={`translate(${pt.x}, ${pt.y + 16})`}>
                          <rect
                            x="-38"
                            y="0"
                            width="76"
                            height="21"
                            rx="6"
                            fill="rgba(16,34,58,0.92)"
                            stroke={
                              isHighlighted
                                ? '#FCD34D'
                                : pt.current
                                  ? statusStyle.pin
                                  : 'rgba(255,255,255,0.28)'
                            }
                            strokeWidth={isHighlighted ? '1.4' : '1'}
                          />
                          <text
                            x="0"
                            y="14"
                            textAnchor="middle"
                            fill="#F8FAFC"
                            fontSize="10.5"
                            fontWeight="600"
                          >
                            {pt.label}
                          </text>
                        </g>
                      </g>
                    );
                  })}
                </svg>

                <p className="mt-2.5 text-[11px] text-slate-300">
                  Mẹo: Rê chuột vào điểm trên bản đồ hoặc mốc nhật ký để đối chiếu trực tiếp.
                </p>
              </div>

              {/* 4 Tactile Telemetry Cards with Spotlight + Micro-Tilt */}
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                <InteractiveCard
                  glowColor="rgba(30, 58, 95, 0.10)"
                  className="rounded-xl border border-[#E5E2DA] bg-[#FAF9F6] p-3.5 hover:border-[#1E3A5F]/40 hover:bg-white hover:shadow-md"
                >
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#526071] uppercase">
                    <MapPin className="h-3.5 w-3.5 text-[#1E3A5F]" aria-hidden="true" />
                    Điểm đi
                  </div>
                  <p className="mt-1.5 text-xs font-bold leading-snug text-[#1E3A5F]">
                    {shipment.origin}
                  </p>
                </InteractiveCard>

                <InteractiveCard
                  glowColor="rgba(217, 93, 36, 0.12)"
                  className="rounded-xl border border-[#E5E2DA] bg-[#FAF9F6] p-3.5 hover:border-[#D95D24]/45 hover:bg-white hover:shadow-md"
                >
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#526071] uppercase">
                    <Navigation className="h-3.5 w-3.5 text-[#D95D24]" aria-hidden="true" />
                    Điểm đến
                  </div>
                  <p className="mt-1.5 text-xs font-bold leading-snug text-[#1E3A5F]">
                    {shipment.destination}
                  </p>
                </InteractiveCard>

                <InteractiveCard
                  glowColor="rgba(30, 58, 95, 0.10)"
                  className="rounded-xl border border-[#E5E2DA] bg-[#FAF9F6] p-3.5 hover:border-[#1E3A5F]/40 hover:bg-white hover:shadow-md"
                >
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#526071] uppercase">
                    <Thermometer className="h-3.5 w-3.5 text-[#1E3A5F]" aria-hidden="true" />
                    Cảm biến
                  </div>
                  <p className="mt-1.5 text-xs font-bold leading-snug text-[#1E3A5F]">
                    {shipment.temperature}
                  </p>
                </InteractiveCard>

                <InteractiveCard
                  glowColor="rgba(15, 118, 110, 0.12)"
                  className="rounded-xl border border-[#E5E2DA] bg-[#FAF9F6] p-3.5 hover:border-teal-600/40 hover:bg-white hover:shadow-md"
                >
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-[#526071] uppercase">
                    <ShieldCheck className="h-3.5 w-3.5 text-teal-700" aria-hidden="true" />
                    Niêm phong
                  </div>
                  <p className="mt-1.5 font-mono text-xs font-bold text-[#1E3A5F]">
                    {shipment.sealCode}
                  </p>
                </InteractiveCard>
              </div>
            </div>

            {/* Right: Interactive Timeline */}
            <div className="flex flex-col justify-between lg:col-span-5">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <h3 className="font-display text-base font-bold text-[#1E3A5F]">
                    Nhật ký hành trình
                  </h3>
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-[#E5E2DA] bg-[#F5F4F0] px-3 py-1 text-xs font-semibold text-[#1E3A5F]">
                    <Package className="h-3.5 w-3.5 text-[#D95D24]" aria-hidden="true" />
                    {shipment.weight} • {shipment.packages}
                  </span>
                </div>

                <ol className="mt-5 space-y-3.5">
                  {shipment.timeline.map((step, idx) => {
                    const mappedWaypoint = timelineIndexToWaypoint(idx);
                    const isSynced = activeWaypointIdx === mappedWaypoint;
                    return (
                      <li
                        key={`${step.time}-${idx}`}
                        onMouseEnter={() => setActiveWaypointIdx(mappedWaypoint)}
                        onMouseLeave={() => setActiveWaypointIdx(null)}
                        className={`relative cursor-pointer rounded-2xl border p-4 transition-all duration-200 ${
                          isSynced
                            ? '-translate-y-0.5 border-[#1E3A5F] bg-[#1E3A5F]/[0.05] shadow-md shadow-[#1E3A5F]/10'
                            : step.current
                              ? 'border-[#D95D24]/40 bg-[#FFF7F3]'
                              : 'border-[#E5E2DA] bg-white hover:border-[#1E3A5F]/40 hover:bg-[#FAF9F6]'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <span
                            className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full transition-colors ${
                              isSynced
                                ? 'bg-[#1E3A5F] text-white'
                                : step.current
                                  ? shipment.status === 'delivered'
                                    ? 'bg-teal-700 text-white'
                                    : 'bg-[#D95D24] text-white'
                                  : 'bg-[#1E3A5F]/12 text-[#1E3A5F]'
                            }`}
                            aria-hidden="true"
                          >
                            <CheckCircle2 className="h-3.5 w-3.5" />
                          </span>
                          <div className="min-w-0 flex-1">
                            <p className="font-mono text-[11px] font-medium text-[#64748B]">
                              {step.time}
                            </p>
                            <p className="mt-0.5 text-sm font-bold text-[#1E3A5F]">
                              {step.location}
                            </p>
                            <p className="mt-1 text-xs leading-relaxed text-[#526071]">
                              {step.detail}
                            </p>
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
