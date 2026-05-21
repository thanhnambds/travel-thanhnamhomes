import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-brand-primary text-white">
      <div className="container-page grid gap-10 py-16 md:grid-cols-[1.4fr_0.6fr]">
        <div>
          <p className="section-label-dark">Thanh Nam Homes Travel</p>
          <p className="mt-4 max-w-xl text-4xl font-medium leading-tight tracking-[-0.02em] text-white md:text-5xl">
            Combo du lịch, chốt lead thủ công qua Zalo
          </p>
          <p className="mt-5 max-w-xl text-sm leading-7 text-white/62">
            Một nhánh nội dung thuộc hệ sinh thái Thanh Nam Homes. Website dùng dữ liệu tĩnh để gợi ý combo, sau đó tư vấn
            viên kiểm tra lại giá và điều kiện dịch vụ trước khi chốt.
          </p>
        </div>
        <div className="flex flex-col gap-4 text-sm text-white/62 md:items-end md:justify-start">
          <p className="text-xs font-medium uppercase tracking-wider text-white">Điểm đến nổi bật</p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 md:justify-end">
            <Link className="transition-colors hover:text-white" href="/combo-phu-quoc/">Phú Quốc</Link>
            <Link className="transition-colors hover:text-white" href="/combo-da-nang/">Đà Nẵng</Link>
            <Link className="transition-colors hover:text-white" href="/combo-nha-trang/">Nha Trang</Link>
            <Link className="transition-colors hover:text-white" href="/tour-trung-quoc/">Tour Trung Quốc</Link>
            <Link className="transition-colors hover:text-white" href="/lien-he/">Liên hệ</Link>
          </div>
          <p className="mt-4 text-xs text-white/45">© 2026 Thanh Nam Homes. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
