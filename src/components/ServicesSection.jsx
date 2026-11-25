import { useState } from 'react';
import { Ship, Plane, Truck, Warehouse, Check, ArrowRight } from 'lucide-react';
import { SERVICES } from '../data/logisticsData';
import RevealHeading from './RevealHeading';

const ICON_MAP = {
  sea: Ship,
  air: Plane,
  road: Truck,
  warehouse: Warehouse,
};

export default function ServicesSection({ onSelectMode }) {
  const [activeIdx, setActiveIdx] = useState(0);

  return (
    <section
      id="services"
      className="relative scroll-mt-16 border-t border-[#E5E2DA] bg-[#F5F4F0] py-20 text-[#1E3A5F] sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Editorial Header with Word-by-Word Scroll Reveal */}
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-end">
          <RevealHeading
            variant="split-mask"
            className="max-w-2xl"
            eyebrow="Dịch vụ cốt lõi • Đa phương thức"
            title="Giải pháp vận tải toàn diện cho chuỗi cung ứng hiện đại"
          />
          <p className="max-w-md text-sm leading-relaxed text-[#526071] sm:text-base">
            Rê chuột hoặc chọn từng phương thức để khám phá năng lực vận hành thực tế của hệ sinh
            thái VeloCargo.
          </p>
        </div>

        {/* Expanding Photorealistic Panels (Desktop Horizontal Accordion / Mobile Stacked) */}
        <div className="mt-12 flex flex-col gap-3.5 lg:h-[540px] lg:flex-row">
          {SERVICES.map((service, idx) => {
            const Icon = ICON_MAP[service.id] || Truck;
            const isActive = idx === activeIdx;

            return (
              <article
                key={service.id}
                onMouseEnter={() => setActiveIdx(idx)}
                onClick={() => setActiveIdx(idx)}
                style={{
                  flexGrow: isActive ? 2.85 : 0.95,
                  flexBasis: '0%',
                  transition: 'flex-grow 0.6s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.4s ease',
                }}
                className={`group relative cursor-pointer overflow-hidden rounded-3xl border select-none ${
                  isActive
                    ? 'min-h-[380px] border-[#1E3A5F]/35 shadow-2xl shadow-[#1E3A5F]/20 lg:min-h-0'
                    : 'min-h-[112px] border-[#D8D4C9] shadow-sm lg:min-h-0'
                }`}
              >
                {/* Full-Bleed Real Photography Layer */}
                <img
                  src={service.image}
                  alt={service.title}
                  loading="lazy"
                  decoding="async"
                  className="absolute inset-0 h-full w-full object-cover object-center transition-all duration-700 ease-out"
                  style={{
                    transform: isActive ? 'scale(1.04)' : 'scale(1.12)',
                    filter: isActive
                      ? 'brightness(0.88) saturate(1.06)'
                      : 'brightness(0.55) saturate(0.75)',
                  }}
                />

                {/* Maritime Navy Atmospheric Gradient Vignette */}
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 transition-opacity duration-500"
                  style={{
                    background: isActive
                      ? 'linear-gradient(180deg, rgba(16,34,58,0.45) 0%, rgba(16,34,58,0.18) 38%, rgba(12,26,46,0.92) 100%)'
                      : 'linear-gradient(180deg, rgba(16,34,58,0.55) 0%, rgba(16,34,58,0.82) 100%)',
                  }}
                />

                {/* Top Bar: Chapter Code + Icon / Metric */}
                <div className="relative z-10 flex items-start justify-between p-5 sm:p-6">
                  <div className="flex items-center gap-2.5">
                    <span
                      className={`flex h-10 w-10 items-center justify-center rounded-xl border backdrop-blur-md transition-all duration-300 ${
                        isActive
                          ? 'border-[#D95D24]/60 bg-[#D95D24] text-white shadow-lg shadow-[#D95D24]/35'
                          : 'border-white/20 bg-white/10 text-white'
                      }`}
                    >
                      <Icon className="h-5 w-5" aria-hidden="true" />
                    </span>
                    <span className="font-mono text-xs font-semibold tracking-widest text-white/85">
                      {service.code}
                    </span>
                  </div>

                  {/* Big Metric Pill (visible on expanded panel) */}
                  <div
                    className={`rounded-2xl border border-white/20 bg-[#10223A]/70 px-3.5 py-2 text-right backdrop-blur-md transition-all duration-500 ${
                      isActive
                        ? 'translate-y-0 opacity-100'
                        : 'pointer-events-none -translate-y-2 opacity-0'
                    }`}
                  >
                    <p className="font-metric text-xl font-bold leading-none text-white">
                      {service.metric}
                    </p>
                    <p className="mt-1 font-mono text-[10px] tracking-wider text-amber-200 uppercase">
                      {service.metricUnit}
                    </p>
                  </div>
                </div>

                {/* Bottom Content Stage */}
                <div className="relative z-10 mt-auto flex h-[calc(100%-88px)] flex-col justify-end p-5 sm:p-7">
                  {/* Subtitle */}
                  <p
                    className={`font-mono text-[11px] font-semibold tracking-[0.2em] uppercase transition-colors duration-300 ${
                      isActive ? 'text-amber-300' : 'text-slate-300/80'
                    }`}
                  >
                    {service.subtitle}
                  </p>

                  {/* Title */}
                  <h3
                    className={`mt-1.5 font-display font-bold tracking-tight text-white transition-all duration-300 ${
                      isActive ? 'text-2xl sm:text-3xl' : 'text-lg lg:text-xl'
                    }`}
                  >
                    {service.title}
                  </h3>

                  {/* Expandable Details (Description + SLA + CTA) */}
                  <div
                    className={`grid transition-all duration-500 ease-out ${
                      isActive
                        ? 'mt-3 grid-rows-[1fr] opacity-100'
                        : 'mt-0 grid-rows-[0fr] opacity-0'
                    }`}
                  >
                    <div className="overflow-hidden">
                      <p className="max-w-lg text-sm leading-relaxed text-slate-200 sm:text-[15px]">
                        {service.description}
                      </p>

                      <div className="mt-5 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-4">
                        <p className="flex items-center gap-2 text-xs font-medium text-slate-100">
                          <Check
                            className="h-4 w-4 shrink-0 text-emerald-300"
                            aria-hidden="true"
                          />
                          <span>{service.sla}</span>
                        </p>

                        <a
                          href="#quote"
                          onClick={(e) => {
                            e.stopPropagation();
                            if (service.id !== 'warehouse') onSelectMode(service.id);
                          }}
                          className="btn-sheen inline-flex min-h-10 items-center gap-2 rounded-full bg-[#D95D24] px-5 py-2 text-xs font-semibold text-white shadow-lg shadow-black/30 hover:bg-[#C24F1B]"
                        >
                          <span>Tính cước dịch vụ này</span>
                          <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
