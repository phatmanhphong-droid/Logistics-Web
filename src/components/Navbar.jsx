import { useEffect, useState } from 'react';
import { Menu, X, PackageCheck, PhoneCall } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Tra cứu vận đơn', href: '#tracking' },
  { label: 'Dịch vụ', href: '#services' },
  { label: 'Tính cước', href: '#quote' },
  { label: 'Mạng lưới', href: '#network' },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isOverHero, setIsOverHero] = useState(true);

  useEffect(() => {
    const updateHeader = () => {
      const heroEl = document.getElementById('hero');
      if (!heroEl) {
        setIsOverHero(false);
        return;
      }
      setIsOverHero(heroEl.getBoundingClientRect().bottom > 84);
    };

    updateHeader();
    window.addEventListener('scroll', updateHeader, { passive: true });
    window.addEventListener('resize', updateHeader, { passive: true });
    return () => {
      window.removeEventListener('scroll', updateHeader);
      window.removeEventListener('resize', updateHeader);
    };
  }, []);

  const ivoryBar = !isOverHero || mobileOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        ivoryBar
          ? 'border-b border-[#E2DFD7] bg-[#F5F4F0]/92 shadow-xs backdrop-blur-md'
          : 'border-b border-transparent bg-transparent'
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <a
          href="#hero"
          className="group flex items-center gap-2.5 rounded-lg focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D95D24]"
        >
          <span
            className={`flex h-10 w-10 items-center justify-center rounded-lg transition-all duration-300 group-hover:scale-105 ${
              ivoryBar
                ? 'bg-[#1E3A5F] text-white shadow-sm'
                : 'border border-white/25 bg-white/12 text-white backdrop-blur-md'
            }`}
          >
            <PackageCheck className="h-5 w-5" aria-hidden="true" />
          </span>
          <div className="leading-tight">
            <span
              className={`block font-display text-lg font-extrabold tracking-tight transition-colors ${
                ivoryBar ? 'text-[#1E3A5F]' : 'text-white'
              }`}
            >
              VeloCargo
            </span>
            <span
              className={`block text-[10px] font-semibold uppercase tracking-[0.18em] transition-colors ${
                ivoryBar ? 'text-[#D95D24]' : 'text-amber-200/90'
              }`}
            >
              Global Logistics
            </span>
          </div>
        </a>

        <nav aria-label="Điều hướng chính" className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className={`nav-underline text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 ${
                ivoryBar
                  ? 'text-[#1E3A5F]/85 hover:text-[#1E3A5F] focus-visible:outline-[#1E3A5F]'
                  : 'text-white/90 hover:text-white focus-visible:outline-white'
              }`}
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <a
            href="tel:1900888999"
            className={`inline-flex min-h-11 items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold transition-colors ${
              ivoryBar
                ? 'text-[#1E3A5F] hover:bg-[#1E3A5F]/8'
                : 'text-white/90 hover:bg-white/12 hover:text-white'
            }`}
          >
            <PhoneCall className="h-4 w-4 text-[#D95D24]" aria-hidden="true" />
            <span>1900 888 999</span>
          </a>
          <a
            href="#quote"
            className={`btn-sheen inline-flex min-h-11 cursor-pointer items-center justify-center rounded-full px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D95D24] ${
              ivoryBar
                ? 'bg-[#D95D24] shadow-[#D95D24]/25 hover:bg-[#C24F1B]'
                : 'border border-white/25 bg-white/15 backdrop-blur-md hover:border-[#D95D24] hover:bg-[#D95D24]'
            }`}
          >
            Nhận báo giá
          </a>
        </div>

        <button
          type="button"
          onClick={() => setMobileOpen((prev) => !prev)}
          aria-expanded={mobileOpen}
          aria-label={mobileOpen ? 'Đóng menu' : 'Mở menu'}
          className={`inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-lg border transition-colors md:hidden ${
            ivoryBar
              ? 'border-[#D8D4C9] text-[#1E3A5F] hover:bg-[#EAE7DF]'
              : 'border-white/25 bg-white/10 text-white backdrop-blur-md hover:bg-white/20'
          }`}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-[#E2DFD7] bg-[#F5F4F0] px-4 py-4 md:hidden">
          <nav aria-label="Điều hướng di động" className="flex flex-col gap-2">
            {NAV_LINKS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className="flex min-h-11 items-center rounded-lg px-3 text-sm font-semibold text-[#1E3A5F] hover:bg-[#EAE7DF]"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#quote"
              onClick={() => setMobileOpen(false)}
              className="btn-sheen mt-2 flex min-h-11 items-center justify-center rounded-full bg-[#D95D24] px-4 text-sm font-semibold text-white hover:bg-[#C24F1B]"
            >
              Nhận báo giá nhanh
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
