# Travel Thanh Nam Homes MVP ✈️🏨

Website giới thiệu tour du lịch, combo vé máy bay & khách sạn và thu hút khách hàng tiềm năng cho `travel.thanhnamhomes.vn`.

Dự án được tối ưu hóa để vận hành theo mô hình **bán thủ công (Semi-manual) với sự trợ giúp của AI/Codex**, đảm bảo nội dung luôn mới, tối ưu SEO, tăng tương tác bán hàng và kiểm soát rủi ro an toàn thông tin 100%.

---

## 📌 Phạm Vi MVP (Scope)

* **Static Export:** Xuất bản dưới dạng trang tĩnh Next.js tĩnh (Static HTML) để deploy lên GitHub Pages hoặc Vercel.
* **Không cần Cơ sở dữ liệu:** Toàn bộ dữ liệu nằm tại các file JSON/CSV trong dự án dưới thư mục `data/`.
* **Không chứa API nhạy cảm:** Mọi luồng API thực hiện client-side hoặc được xử lý tĩnh trong lúc build.
* **Tích hợp Zalo:** Nút kêu gọi hành động (CTA) hướng người dùng chat trực tiếp với Zalo OA hoặc Zalo cá nhân của admin.

---

## 📂 Quản Lý File Dữ Liệu

* `data/hotels.csv`: Bảng giá khách sạn cơ sở.
* `data/flights.mock.json`: Dữ liệu chuyến bay giả lập phục vụ tạo combo.
* `data/config.json`: Cấu hình biên lợi nhuận (Margin), danh sách điểm đến, hotline và cấu hình SEO.
* `data/generated/tours-public.json`: Danh sách tour công khai sau khi cào từ đối tác.
* `data/generated/hotels-public.json`: Danh sách khách sạn công khai.
* `data/generated/daily-combo.json`: Combo nổi bật nhất trong ngày hiển thị tại `/combo-hom-nay/`.

---

## ⚙️ Các Lệnh Vận Hành Cơ Bản

Hãy cài đặt đầy đủ các thư viện trước khi chạy:
```bash
npm install
```

### 1. Đồng bộ dữ liệu đối tác (Scraper)
Cào thông tin tour và khách sạn từ link Google Sheets của đối tác:
```bash
node scripts/scrape-partner-tours.mjs
node scripts/scrape-partner-hotels.mjs
```

### 2. Tạo combo & Kiểm tra chất lượng (QA)
Tạo combo tự động dựa trên biên lợi nhuận và chạy bộ kiểm tra chất lượng:
```bash
# Tạo combo mới
npm run generate:combo

# Kiểm tra dữ liệu (Không lộ B2B, Đúng Giá, Đúng Ngày)
npm run validate:data
```

### 3. Tối ưu SEO & Build sitemap
Cập nhật sitemap để Google index bài viết/combo nhanh hơn:
```bash
npm run build:sitemap
```

### 4. Build & Xuất bản tĩnh
Tự động validate dữ liệu, cập nhật sitemap và build dự án:
```bash
npm run build
```

---

## 🧠 Quy Trình Phối Hợp Bán Thủ Công Với AI/Codex

Để cập nhật website hàng ngày mà không sợ lỗi, hãy phối hợp với AI Assistant theo quy trình 4 bước đơn giản:

### Bước 1: Yêu cầu AI cào và cập nhật dữ liệu
* **Câu lệnh gửi AI:** *"Hãy cào dữ liệu tour/khách sạn mới nhất, cập nhật combo và chạy validate"*
* **Hành động của AI:**
  1. Chạy lệnh scraper để lấy thông tin mới.
  2. Chạy lệnh tạo combo hàng ngày.
  3. Chạy `npm run validate:data` để xác thực dữ liệu.

### Bước 2: AI viết nội dung SEO & Caption Bán Hàng
* **Hành động của AI:**
  1. **SEO:** Viết bài viết giới thiệu combo mới tại thư mục `src/app/tin-tuc/`, tối ưu thẻ Title, Meta Description và thêm cấu trúc Schema.org.
  2. **Sales:** Soạn 3 mẫu caption sống động (đầy đủ icon, giá B2C cuối, link CTA) để đăng Zalo OA / Facebook.

### Bước 3: Anh Nam duyệt bản nháp (QA Check)
* **Hành động của Anh Nam:**
  1. Kiểm tra trực quan báo cáo của AI hiển thị trong khung chat.
  2. Đảm bảo đạt tiêu chí **"3 KHÔNG - 3 ĐÚNG"**:
     - **KHÔNG** lộ link sheet B2B, **KHÔNG** lộ tên nhà cung cấp gốc (Hoàng Việt, Viettrend...).
     - **KHÔNG** sai giá (phải lớn hơn giá gốc + margin).
     - **KHÔNG** sai ngày khởi hành (phải là ngày trong tương lai).
     - **ĐÚNG** chính tả, câu từ B2C tự nhiên, hấp dẫn.

### Bước 4: Kích hoạt Deploy an toàn
* Khi mọi thứ đã hoàn hảo, anh chỉ cần gõ: **`OK deploy`**.
* AI sẽ tự thực hiện lệnh commit, push lên GitHub để kích hoạt Vercel tự động cập nhật website:
  ```bash
  git add .
  git commit -m "content: update tours, daily-combo and SEO post [approved by nam]"
  git push origin main
  ```

---

## 🛡️ Hướng Dẫn Bảo Mật Dữ Liệu B2B

1. **Khử dữ liệu nhạy cảm tại runtime:**
   Mã nguồn dự án tại `src/lib/data.ts` đã được thiết kế để tự động làm trống (`""`) các trường nhạy cảm như `source_sheet_url`, `supplier_name`, `original_name`, `program_url` trước khi trả dữ liệu về phía trình duyệt client.
2. **Ngăn chặn đẩy file thô lên hosting:**
   Các file nháp chứa thông tin nội bộ của đối tác tuyệt đối không được sao chép vào thư mục `public/`.
3. **Cảnh báo bắt buộc về giá:**
   Để tránh tranh chấp khi đối tác đổi giá đột xuất, mọi tour/combo phải hiển thị câu cảnh báo mặc định từ `data/config.json`:
   > *"Giá tham khảo tại thời điểm cập nhật, có thể thay đổi theo tình trạng vé, phòng và chính sách của nhà cung cấp. Vui lòng liên hệ để kiểm tra giá chính xác trước khi giữ dịch vụ."*

---

## 📈 Tối Ưu Hóa SEO

Các trang quan trọng đã cấu hình tự động index:
* `/` (Trang chủ)
* `/combo-du-lich/` (Trang tổng hợp combo)
* `/combo-phu-quoc/`, `/combo-da-nang/`, `/combo-nha-trang/` (Trang điểm đến)
* `/ve-may-bay-khach-san/` (Trang tư vấn combo)
* `/lien-he/` (Trang liên hệ, thông tin Zalo)
* Các bài viết trong `/tin-tuc/` (Trang blog tin tức kéo traffic tự nhiên)

*Lưu ý: Trang `/combo-hom-nay/` được đánh dấu `noindex` vì dữ liệu thay đổi liên tục hàng ngày, tránh lỗi thuật toán Google do nội dung mỏng.*
