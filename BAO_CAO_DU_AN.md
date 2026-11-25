# Báo Cáo Thiết Kế & Xây Dựng Website Logistics — VeloCargo

> **Tech Stack:** React 18 • Vite 6 • Tailwind CSS v4 • Lucide Icons  
> **Thư mục dự án:** `C:\Users\ASUS\.gemini\antigravity\scratch\logistics-web`  
> **Trạng thái:** Đã hoàn thiện giao diện, hiệu ứng tương tác và kiểm tra build (`vite build`) thành công không lỗi.

---

## 1. Hệ Thống Thiết Kế (Design System)

### Bảng màu chủ đạo (Maritime Executive)
- **Màu thương hiệu chính:** `#1E3A5F` *(Xanh Hải Quân Cổ Điển — dùng cho tiêu đề, header vận đơn, bản đồ vệ tinh, thẻ giá ước tính và Footer)*.
- **Nền tổng thể:** `#F5F4F0` *(Trắng Ngà Ấm — thoáng mắt, có lưới chấm kiến trúc nhẹ)* kết hợp thẻ trắng `#FFFFFF` và viền đá ấm `#E2DFD7`.
- **Điểm nhấn hành động (CTA & Trạng thái):** `#D95D24` *(Cam Đồng — ăn khớp màu container trong ảnh cảng biển)* cùng xanh ngọc `#0F766E` cho trạng thái hoàn thành / SLA.

### Hệ thống Font chữ
- **Tiêu đề & Nội dung Tiếng Việt:** `Be Vietnam Pro` *(400 – 800, tối ưu dấu Tiếng Việt sắc nét)*.
- **Số liệu nổi bật (Metrics / Giá cước / Tiến độ %):** `Space Grotesk` *(600 – 700)*.
- **Mã vận đơn, tọa độ GPS, mốc thời gian:** `IBM Plex Mono` *(500 – 600)*.

---

## 2. Các Chức Năng Đã Hoàn Thiện

### 2.1. Thanh Điều Hướng Thông Minh (`Navbar.jsx`)
- **Adaptive Transparent Header:** Nằm trong suốt trực tiếp trong bầu trời ảnh Hero khi ở đầu trang, tự động chuyển mượt sang nền kính ngà ấm (`#F5F4F0/92`, `backdrop-blur-md`) khi cuộn xuống các phần nội dung bên dưới.
- Hỗ trợ menu responsive cho cả Desktop và Mobile, gắn hotline `1900 888 999` và nút CTA `Nhận báo giá`.

### 2.2. Phần Hero Kể Chuyện Thương Hiệu 5 Cảnh (`PortHeroCinematic.jsx`)
- Ghép **5 khung hình chụp siêu thực 16:9** đồng nhất ánh sáng giờ vàng (`scene-1.jpg` → `scene-5.jpg`) thành chuỗi hành trình thương hiệu VeloCargo (*Chuỗi cung ứng không điểm dừng → Cam kết SLA 99.4% → An toàn 100% → Thông quan e-DO -40% thời gian chờ → Tầm vóc 180+ Quốc gia*).
- Tự động preload ngầm cả 5 ảnh độ phân giải cao.
- Điều hướng bằng **cuộn chuột (scroll)**, **rê chuột xem thử / bấm khóa cảnh** trên thanh 5 vạch bên phải (Desktop) hoặc 5 chấm chạm ở đáy (Mobile).
- Cảnh 5 chuyển bố cục sang **căn giữa cao trào (Grand Finale)** với 2 nút hành động (`Nhận báo giá doanh nghiệp` và `Tra cứu vận đơn`).

### 2.3. Tra Cứu & Theo Dõi Hành Trình Vận Đơn (`TrackingResultPanel.jsx`)
- Ô tìm kiếm mã vận đơn có kiểm tra lỗi và 3 mã tuyến mẫu bấm thử nhanh:
  - `VC-884210-VN` — Đường bộ Express *(TP.HCM → Đà Nẵng → Hà Nội)*
  - `VC-551904-SG` — Đường biển FCL 40ft *(Cảng Cát Lái → Cảng PSA Singapore)*
  - `VC-309412-US` — Đường hàng không Air Cargo *(Nội Bài → Incheon → Los Angeles)*
- Nút **Sao chép mã vận đơn** 1 chạm có phản hồi trạng thái.
- Thanh **4 chặng tiến độ ngang** *(Đã lấy hàng → Trung chuyển → Thông quan/Phân loại → Giao thành công)*.
- **Bản đồ địa lý vệ tinh tự đổi theo từng tuyến** *(dải chữ S Việt Nam, Biển Đông–ASEAN, xuyên Thái Bình Dương)* hiển thị tọa độ GPS, phần trăm tiến độ và 4 thẻ Telemetry *(Điểm đi, Điểm đến, Cảm biến nhiệt độ, Mã niêm phong Seal)*.

### 2.4. Dịch Vụ Cốt Lõi — 4 Tấm Ảnh Mở Rộng (`ServicesSection.jsx`)
- Hiển thị 4 dịch vụ chính *(Vận tải Đường biển, Hàng không, Đường bộ, Kho bãi & Fulfillment)* bằng **4 tấm ảnh chụp thực tế cao đứng** đặt cạnh nhau.
- Khi rê chuột hoặc bấm vào bất kỳ dịch vụ nào, tấm ảnh đó trượt mở rộng gấp ~3 lần, hiện đầy đủ số liệu năng lực (`120+ Cảng`, `24–72h`, `350+ Đầu kéo GPS`, `85K m² Kho ISO`), mô tả, cam kết SLA và nút **Tính cước dịch vụ này** (tự động chọn đúng phương thức tương ứng ở mục Tính cước bên dưới).

### 2.5. Ước Tính Cước Phí & Đặt Lịch Lấy Hàng (`QuoteCalculator.jsx`)
- Cho phép chọn 3 phương thức *(Đường bộ, Hàng không, Đường biển)*, nhập điểm đi/điểm đến, khối lượng (kg) và tự động tính tổng cước tạm tính theo định dạng tiền tệ VNĐ + thời gian dự kiến.
- Form gửi yêu cầu báo giá kèm thông báo xác nhận ngay trên trang.

### 2.6. Mạng Lưới Hub & Chân Trang (`Footer.jsx`)
- Hiển thị thông tin chứng nhận (ISO 9001, FIATA, IATA), hotline, email điều phối và 4 thẻ Hub trung chuyển lớn *(TP.HCM, Hà Nội, Đà Nẵng, Singapore)*.

---

## 3. Hệ Thống Hiệu Ứng Đã Xây Dựng

| Nhóm hiệu ứng | Chi tiết kỹ thuật & Trải nghiệm |
| :--- | :--- |
| **4 Chuyển cảnh khác biệt trên Hero** | `01→02` **Horizontal Wipe** (vén ngang); `02→03` **Vertical Drop** (thả dọc theo hướng cần cẩu); `03→04` **Diagonal Speed Slice** (cắt chéo động lực học); `04→05` **Circular Iris Portal** (phóng mở hình tròn từ tâm kèm **vòng hào quang & radar nét đứt xoay đồng bộ** + bloom ánh sáng giờ vàng). |
| **Parallax & Ambient Spotlight Hero** | Di chuột trên Hero tạo chiều sâu parallax giữa ảnh nền & số chương watermark khổng lồ, kèm ánh sáng phản chiếu nhẹ theo con trỏ. |
| **Con trỏ chuột tương tác (`CustomCursor.jsx`)** | Vòng hào quang trễ mượt 60fps (`lerp`) bám theo con trỏ: tự phóng mở + tỏa ánh cam đồng khi chỉ vào nút/link/thẻ, co đàn hồi khi click, thu gọn khi vào ô input. |
| **Thẻ cảm ứng 3D (`InteractiveCard.jsx`)** | Vầng sáng bám theo đầu chuột trên bề mặt thẻ + nghiêng 3D siêu nhẹ (`±2.2°`), áp dụng cho toàn bộ thẻ Telemetry, thẻ Giá ước tính và thẻ Hub Footer. |
| **Đồng bộ 2 chiều Bản đồ ↔ Nhật ký** | Rê chuột vào điểm trên bản đồ làm sáng mốc nhật ký tương ứng bên phải; rê vào dòng nhật ký kích hoạt vòng radar sáng trên đúng điểm bản đồ, kèm luồng tín hiệu chạy dọc tuyến và số `%` chạy mượt. |
| **4 Kiểu hiện tiêu đề mục (`RevealHeading.jsx`)** | Mỗi phần có 1 hiệu ứng riêng khi cuộn tới: `radar-sweep` *(Tra cứu)*, `split-mask` *(Dịch vụ)*, `focus-expand` *(Tính cước)*, `stagger-slide` *(Footer Hubs)*. |
| **Nút bấm & Liên kết** | Ánh sáng lướt chéo qua nút CTA (`.btn-sheen`), gạch chân trượt mượt trái→phải (`.nav-underline`), hiệu ứng tập trung tiêu điểm (`Group Focus`) trên cụm thẻ Hub. |

---

## 4. Cấu Trúc Thư Mục Bài Làm

```text
logistics-web/
├── index.html                        # Khai báo Google Fonts (Be Vietnam Pro, Space Grotesk, IBM Plex Mono)
├── package.json                      # Cấu hình React 18, Vite 6, Tailwind CSS v4, Lucide Icons
├── vite.config.js                    # Cấu hình Vite + @tailwindcss/vite
├── jsconfig.json                     # Cấu hình JSX cho IDE
├── .vscode/
│   └── settings.json                 # Tắt cảnh báo @theme của Tailwind v4
├── public/
│   └── scenes/                       # Bộ 7 ảnh chụp siêu thực 16:9 đồng nhất ánh sáng giờ vàng
│       ├── scene-1.jpg               # Hero 01: Xe đầu kéo tiếp cận cảng
│       ├── scene-2.jpg               # Hero 02 & Dịch vụ Đường biển: Làn bốc xếp STS cạnh tàu
│       ├── scene-3.jpg               # Hero 03: Cần cẩu hạ container cam 40ft
│       ├── scene-4.jpg               # Hero 04 & Dịch vụ Đường bộ: Xe rời cảng ra cao tốc
│       ├── scene-5.jpg               # Hero 05: Flycam toàn cảnh cảng biển
│       ├── service-air.jpg           # Dịch vụ Hàng không: Máy bay Cargo trên sân đỗ
│       └── service-warehouse.jpg     # Dịch vụ Kho bãi: Kho thông minh tự động
└── src/
    ├── main.jsx                      # Điểm khởi chạy React
    ├── index.css                     # Design tokens, keyframes, .btn-sheen, .nav-underline
    ├── App.jsx                       # Luồng trang chính & state tra cứu / chọn dịch vụ
    ├── data/
    │   └── logisticsData.js          # Dữ liệu 3 vận đơn mẫu, 4 dịch vụ, bảng giá cước
    └── components/
        ├── CustomCursor.jsx          # Hiệu ứng con trỏ chuột vòng hào quang 60fps
        ├── InteractiveCard.jsx       # Component thẻ cảm ứng spotlight + micro-tilt 3D
        ├── RevealHeading.jsx         # Component 4 kiểu hiệu ứng hiện tiêu đề theo cuộn trang
        ├── Navbar.jsx                # Thanh điều hướng trong suốt chuyển kính ngà ấm
        ├── PortHeroCinematic.jsx     # Hero 5 cảnh điện ảnh + 4 chuyển cảnh + vòng tròn Iris
        ├── TrackingResultPanel.jsx   # Tra cứu vận đơn, bản đồ vệ tinh 2 chiều & nhật ký
        ├── ServicesSection.jsx       # 4 tấm ảnh dịch vụ trượt mở rộng (Expanding Panels)
        ├── QuoteCalculator.jsx       # Tính cước nhanh & form đặt lịch lấy hàng
        └── Footer.jsx                # Thông tin doanh nghiệp & mạng lưới Hub trung chuyển
```

---

## 5. Cách Mở Lại Dự Án Sau Khi Nghỉ Ngơi

Mở terminal tại thư mục `C:\Users\ASUS\.gemini\antigravity\scratch\logistics-web` và chạy:

```bash
npm.cmd run dev -- --port 5173
```

Sau đó truy cập **http://localhost:5173/** trên trình duyệt.
