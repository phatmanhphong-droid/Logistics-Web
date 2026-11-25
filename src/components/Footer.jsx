import { useState } from 'react';
import { PackageCheck, MapPin, Mail, Phone } from 'lucide-react';
import InteractiveCard from './InteractiveCard';
import RevealHeading from './RevealHeading';

const HUBS = [
  { city: 'TP. Hồ Chí Minh', detail: 'Hub Tân Bình & Cảng Cát Lái — 42.000 m²' },
  { city: 'Hà Nội', detail: 'KCN Bắc Thăng Long & Sân bay Nội Bài — 28.000 m²' },
  { city: 'Đà Nẵng', detail: 'KCN Hòa Khánh & Cảng Tiên Sa — 15.000 m²' },
  { city: 'Singapore', detail: 'PSA Keppel Distripark — Hub trung chuyển ASEAN' },
];

export default function Footer() {
  const [hoveredHub, setHoveredHub] = useState(null);

  return (
    <footer id="network" className="bg-[#1E3A5F] text-slate-200">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="flex items-center gap-2.5">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/20 bg-white/10 text-white">
                <PackageCheck className="h-5 w-5" aria-hidden="true" />
              </span>
              <div>
                <span className="block font-display text-lg font-extrabold text-white">
                  VeloCargo
                </span>
                <span className="block text-[10px] font-semibold uppercase tracking-[0.18em] text-amber-200/90">
                  Global Logistics
                </span>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-slate-300">
              Đối tác logistics &amp; quản trị chuỗi cung ứng chuẩn quốc tế (ISO 9001:2015, thành
              viên FIATA &amp; IATA).
            </p>
            <div className="mt-5 space-y-2 text-sm">
              <p className="flex items-center gap-2 text-slate-100">
                <Phone className="h-4 w-4 text-amber-300" aria-hidden="true" />
                <span>Hotline 24/7: 1900 888 999</span>
              </p>
              <p className="flex items-center gap-2 text-slate-100">
                <Mail className="h-4 w-4 text-amber-300" aria-hidden="true" />
                <span>dispatch@velocargo.vn</span>
              </p>
            </div>
          </div>

          <div className="lg:col-span-8">
            <RevealHeading
              variant="stagger-slide"
              as="h3"
              eyebrow="Mạng lưới chiến lược"
              title="Hệ thống Hub & Kho trung chuyển"
              eyebrowClassName="text-amber-300"
              titleClassName="text-white"
            />
            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {HUBS.map((hub) => {
                const isDimmed = hoveredHub !== null && hoveredHub !== hub.city;
                return (
                  <div
                    key={hub.city}
                    onMouseEnter={() => setHoveredHub(hub.city)}
                    onMouseLeave={() => setHoveredHub(null)}
                    className={`transition-opacity duration-300 ${isDimmed ? 'opacity-65' : 'opacity-100'}`}
                  >
                    <InteractiveCard
                      glowColor="rgba(252, 211, 77, 0.16)"
                      className="rounded-xl border border-white/15 bg-[#162D4A] p-4 hover:border-amber-300/45"
                    >
                      <p className="flex items-center gap-1.5 text-sm font-semibold text-white">
                        <MapPin className="h-4 w-4 text-[#D95D24]" aria-hidden="true" />
                        {hub.city}
                      </p>
                      <p className="mt-1 text-xs text-slate-300">{hub.detail}</p>
                    </InteractiveCard>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 border-t border-white/15 pt-6 text-xs text-slate-300">
          <p>© 2026 VeloCargo Global Logistics. Bảo lưu mọi quyền.</p>
          <div className="flex gap-6">
            <a href="#tracking" className="nav-underline transition-colors hover:text-white">
              Tra cứu vận đơn
            </a>
            <a href="#services" className="nav-underline transition-colors hover:text-white">
              Dịch vụ
            </a>
            <a href="#quote" className="nav-underline transition-colors hover:text-white">
              Báo giá
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
