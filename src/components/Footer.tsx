import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-brand-primary text-white">
      <div className="container-page grid gap-10 py-16 md:grid-cols-[1.4fr_0.6fr]">
        <div>
          <p className="mono-label text-sm uppercase text-brand-coral">Thanh Nam Homes Lifestyle</p>
          <p className="display-type mt-4 max-w-xl text-4xl leading-none md:text-5xl">Kiến tạo kỳ nghỉ thượng lưu</p>
          <p className="mt-5 max-w-xl text-sm leading-6 text-brand-muted">
            Một sản phẩm thuộc hệ sinh thái Thanh Nam Homes. Chúng tôi mang đến giải pháp thiết kế kỳ nghỉ đột phá bằng
            công nghệ AI, kết hợp dịch vụ tư vấn chuyên nghiệp mang lại trải nghiệm WOW trọn vẹn cho gia đình bạn.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-sm text-brand-muted md:items-end md:justify-start">
          <p className="text-xs font-medium uppercase tracking-wider text-white">Điểm đến nổi bật</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 md:justify-end">
            <Link className="transition-colors hover:text-white" href="/combo-phu-quoc/">Phú Quốc</Link>
            <Link className="transition-colors hover:text-white" href="/combo-da-nang/">Đà Nẵng</Link>
            <Link className="transition-colors hover:text-white" href="/combo-nha-trang/">Nha Trang</Link>
            <Link className="transition-colors hover:text-white" href="/lien-he/">Liên hệ</Link>
          </div>
          <p className="mt-4 text-xs text-brand-muted/60">© 2026 Thanh Nam Homes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
