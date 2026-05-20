import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-brand-primary text-white border-t border-brand-hairline/10">
      <div className="container-page grid gap-12 py-20 md:grid-cols-[1.3fr_0.7fr]">
        <div className="space-y-6">
          <p className="section-label-dark">Thanh Nam Homes Travel</p>
          <p className="display-type max-w-xl text-3xl md:text-4xl lg:text-5xl font-light leading-tight text-white/95">
            Kiến Tạo Kỳ Nghỉ Độc Bản, Chốt Trực Tiếp Qua <span className="text-brand-gold font-normal">Zalo</span>
          </p>
          <p className="max-w-xl text-sm leading-8 text-white/60">
            Một dự án trực thuộc hệ sinh thái Thanh Nam Homes. Website sử dụng nền tảng dữ liệu thông minh tĩnh (Static Data Integration) để chọn lọc và gợi ý các hành trình tối ưu nhất, trước khi chuyển giao cho chuyên viên tư vấn hỗ trợ chi tiết 1:1.
          </p>
        </div>
        <div className="flex flex-col gap-6 text-sm text-white/60 md:items-end md:justify-between">
          <div className="w-full space-y-4 md:text-right">
            <p className="text-xs font-bold uppercase tracking-widest text-brand-gold">Điểm đến hàng đầu</p>
            <div className="flex flex-wrap gap-x-6 gap-y-3 justify-start md:justify-end">
              <Link className="transition-all duration-300 hover:text-brand-gold" href="/combo-phu-quoc/">Phú Quốc</Link>
              <Link className="transition-all duration-300 hover:text-brand-gold" href="/combo-da-nang/">Đà Nẵng</Link>
              <Link className="transition-all duration-300 hover:text-brand-gold" href="/combo-nha-trang/">Nha Trang</Link>
              <Link className="transition-all duration-300 hover:text-brand-gold" href="/lien-he/">Liên hệ</Link>
            </div>
          </div>
          <div className="w-full pt-8 border-t border-white/5 md:text-right">
            <p className="text-xs text-white/40">© 2026 Thanh Nam Homes. Tất cả quyền được bảo lưu.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
