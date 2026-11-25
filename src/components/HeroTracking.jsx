import { Search, ShieldCheck, Clock, Globe2, ArrowRight } from 'lucide-react';
import { SAMPLE_SHIPMENTS } from '../data/logisticsData';

const SAMPLE_IDS = Object.keys(SAMPLE_SHIPMENTS);

export default function HeroTracking({
  trackingInput,
  setTrackingInput,
  onSearch,
  errorMessage,
}) {
  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(trackingInput);
  };

  return (
    <section
      id="tracking"
      className="relative overflow-hidden border-b border-slate-200 bg-gradient-to-b from-blue-50/80 via-white to-white"
    >
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
        <div className="grid items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="inline-flex items-center gap-2 rounded-full border border-blue-200 bg-blue-50 px-3.5 py-1.5 text-xs font-semibold text-blue-800">
              <span className="h-2 w-2 rounded-full bg-orange-600" aria-hidden="true" />
              Hệ thống giám sát vận tải thời gian thực 24/7
            </div>

            <h1 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-slate-900 sm:text-5xl sm:leading-[1.12]">
              Vận chuyển thông minh,{' '}
              <span className="text-blue-600">kiểm soát từng chặng</span> trên toàn cầu
            </h1>

            <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Giải pháp logistics đa phương thức từ kho xưởng đến tận tay khách hàng. Theo dõi hành
              trình GPS, trạng thái thông quan và tính cước minh bạch chỉ trong một nền tảng.
            </p>

            <form
              onSubmit={handleSubmit}
              className="mt-8 rounded-2xl border border-slate-200 bg-white p-2.5 shadow-sm"
              noValidate
            >
              <label htmlFor="tracking-code" className="sr-only">
                Nhập mã vận đơn để tra cứu
              </label>
              <div className="flex flex-col gap-2 sm:flex-row">
                <div className="relative flex-1">
                  <Search
                    className="pointer-events-none absolute top-1/2 left-3.5 h-5 w-5 -translate-y-1/2 text-slate-400"
                    aria-hidden="true"
                  />
                  <input
                    id="tracking-code"
                    type="text"
                    value={trackingInput}
                    onChange={(e) => setTrackingInput(e.target.value)}
                    placeholder="Nhập mã vận đơn (VD: VC-884210-VN)"
                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50/70 pr-4 pl-11 font-mono text-sm text-slate-900 placeholder:font-sans placeholder:text-slate-400 focus:border-blue-600 focus:bg-white focus:outline-none"
                  />
                </div>
                <button
                  type="submit"
                  className="inline-flex h-12 cursor-pointer items-center justify-center gap-2 rounded-xl bg-orange-600 px-6 text-sm font-semibold text-white transition-colors hover:bg-orange-700 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-600"
                >
                  <span>Tra cứu ngay</span>
                  <ArrowRight className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>

              {errorMessage && (
                <p role="alert" className="mt-2.5 px-2 text-sm font-medium text-red-600">
                  {errorMessage}
                </p>
              )}

              <div className="mt-3 flex flex-wrap items-center gap-2 px-1">
                <span className="text-xs font-medium text-slate-500">Mã mẫu thử nhanh:</span>
                {SAMPLE_IDS.map((id) => (
                  <button
                    key={id}
                    type="button"
                    onClick={() => {
                      setTrackingInput(id);
                      onSearch(id);
                    }}
                    className="cursor-pointer rounded-md border border-slate-200 bg-slate-50 px-2.5 py-1 font-mono text-xs font-medium text-blue-700 transition-colors hover:border-blue-300 hover:bg-blue-50"
                  >
                    {id}
                  </button>
                ))}
              </div>
            </form>
          </div>

          <div className="lg:col-span-5">
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                    <Clock className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-display text-2xl font-extrabold text-slate-900">99.4%</p>
                    <p className="text-sm text-slate-600">Tỷ lệ giao hàng đúng cam kết SLA</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                    <Globe2 className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-display text-2xl font-extrabold text-slate-900">180+ Quốc gia</p>
                    <p className="text-sm text-slate-600">Mạng lưới cảng biển &amp; sân bay liên kết</p>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-xs sm:col-span-2 lg:col-span-1">
                <div className="flex items-center gap-3">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-green-50 text-green-600">
                    <ShieldCheck className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <div>
                    <p className="font-display text-2xl font-extrabold text-slate-900">Bảo hiểm 100%</p>
                    <p className="text-sm text-slate-600">Cam kết đền bù minh bạch &amp; e-POD tức thì</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
