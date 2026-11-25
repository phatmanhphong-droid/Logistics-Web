import { useState } from 'react';
import { Calculator, CheckCircle2, Send } from 'lucide-react';
import { RATE_TABLE } from '../data/logisticsData';
import InteractiveCard from './InteractiveCard';
import RevealHeading from './RevealHeading';

const formatVND = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export default function QuoteCalculator({ selectedMode, setSelectedMode }) {
  const [weight, setWeight] = useState('50');
  const [origin, setOrigin] = useState('TP. Hồ Chí Minh');
  const [destination, setDestination] = useState('Hà Nội');
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const parsedWeight = Math.max(1, Number(weight) || 1);
  const rate = RATE_TABLE[selectedMode] || RATE_TABLE.road;
  const estimatedCost = rate.baseFee + parsedWeight * rate.perKg;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <section
      id="quote"
      className="relative scroll-mt-16 border-t border-[#E5E2DA] bg-[#EFECE5] py-20 text-[#1E3A5F] sm:py-24"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid items-start gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <RevealHeading
              variant="focus-expand"
              eyebrow="Báo giá minh bạch • Phản hồi 15 phút"
              title="Ước tính cước phí & đặt lịch lấy hàng"
              subtitle="Chọn phương thức vận chuyển và khối lượng dự kiến để xem cước tạm tính ngay lập tức. Đội ngũ điều phối sẽ xác nhận lịch lấy hàng trong 15 phút."
            />

            {/* Maritime Navy (#1E3A5F) Price Showcase Card with Spotlight + Tilt */}
            <InteractiveCard
              glowColor="rgba(217, 93, 36, 0.22)"
              className="mt-8 rounded-2xl border border-[#1E3A5F] bg-[#1E3A5F] p-6 text-white shadow-xl shadow-[#1E3A5F]/18"
            >
              <div className="flex items-center gap-2 font-mono text-xs font-semibold tracking-wider text-amber-300 uppercase">
                <Calculator className="h-4 w-4" aria-hidden="true" />
                <span>Chi phí ước tính ({rate.label})</span>
              </div>
              <p className="mt-3 font-metric text-4xl font-bold tracking-tight text-white">
                {formatVND(estimatedCost)}
              </p>
              <p className="mt-2 text-sm text-slate-200">
                Thời gian dự kiến:{' '}
                <span className="font-semibold text-amber-200">{rate.days}</span> • Tuyến{' '}
                <span className="text-white">
                  {origin} → {destination}
                </span>
              </p>
            </InteractiveCard>
          </div>

          <div className="lg:col-span-7">
            <form
              onSubmit={handleSubmit}
              className="rounded-3xl border border-[#DFDCD3] bg-white p-6 shadow-xl shadow-[#1E3A5F]/8 sm:p-8"
            >
              <div className="grid gap-5 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <span className="block text-sm font-semibold text-[#1E3A5F]">
                    Phương thức vận chuyển
                  </span>
                  <div className="mt-2.5 grid grid-cols-1 gap-2.5 sm:grid-cols-3">
                    {Object.entries(RATE_TABLE).map(([key, item]) => {
                      const active = selectedMode === key;
                      return (
                        <button
                          key={key}
                          type="button"
                          onClick={() => {
                            setSelectedMode(key);
                            setSubmitted(false);
                          }}
                          className={`min-h-11 cursor-pointer rounded-xl border px-3.5 py-2.5 text-left text-sm font-semibold transition-all duration-200 hover:-translate-y-0.5 ${
                            active
                              ? 'border-[#1E3A5F] bg-[#1E3A5F] text-white shadow-md shadow-[#1E3A5F]/20'
                              : 'border-[#E2DFD7] bg-[#FAF9F6] text-[#1E3A5F] hover:border-[#1E3A5F]/50 hover:bg-white'
                          }`}
                        >
                          {item.label}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label htmlFor="quote-origin" className="block text-sm font-semibold text-[#1E3A5F]">
                    Điểm lấy hàng
                  </label>
                  <input
                    id="quote-origin"
                    type="text"
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-xl border border-[#DFDCD3] bg-[#FAF9F6] px-3.5 text-sm text-[#1E3A5F] transition-colors focus:border-[#1E3A5F] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="quote-dest" className="block text-sm font-semibold text-[#1E3A5F]">
                    Điểm giao hàng
                  </label>
                  <input
                    id="quote-dest"
                    type="text"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-xl border border-[#DFDCD3] bg-[#FAF9F6] px-3.5 text-sm text-[#1E3A5F] transition-colors focus:border-[#1E3A5F] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="quote-weight" className="block text-sm font-semibold text-[#1E3A5F]">
                    Khối lượng (kg)
                  </label>
                  <input
                    id="quote-weight"
                    type="number"
                    min="1"
                    max="50000"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="mt-1.5 h-11 w-full rounded-xl border border-[#DFDCD3] bg-[#FAF9F6] px-3.5 font-mono text-sm text-[#1E3A5F] transition-colors focus:border-[#1E3A5F] focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label htmlFor="quote-email" className="block text-sm font-semibold text-[#1E3A5F]">
                    Email hoặc Số điện thoại
                  </label>
                  <input
                    id="quote-email"
                    type="text"
                    required
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setSubmitted(false);
                    }}
                    placeholder="contact@company.vn / 0901..."
                    className="mt-1.5 h-11 w-full rounded-xl border border-[#DFDCD3] bg-[#FAF9F6] px-3.5 text-sm text-[#1E3A5F] placeholder:text-[#64748B] transition-colors focus:border-[#1E3A5F] focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div className="mt-6 flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs text-[#64748B]">
                  Giá tạm tính chưa bao gồm phụ phí nhiên liệu và VAT.
                </p>
                <button
                  type="submit"
                  className="btn-sheen inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-full bg-[#D95D24] px-6 text-sm font-semibold text-white shadow-lg shadow-[#D95D24]/25 hover:bg-[#C24F1B] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#D95D24]"
                >
                  <Send className="h-4 w-4" aria-hidden="true" />
                  <span>Gửi yêu cầu báo giá chính thức</span>
                </button>
              </div>

              {submitted && (
                <div
                  role="status"
                  className="mt-4 flex items-center gap-2 rounded-xl border border-teal-200 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-900"
                >
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-teal-700" aria-hidden="true" />
                  <span>
                    Đã tiếp nhận yêu cầu cho tuyến {origin} → {destination} ({parsedWeight} kg).
                    Chuyên viên sẽ liên hệ qua {email}.
                  </span>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
