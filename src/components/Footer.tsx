import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <div className="container-page grid gap-6 py-8 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="font-semibold text-brand-ink">Travel Thanh Nam Homes</p>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-600">
            Website static riêng cho subdomain travel.thanhnamhomes.vn, không dùng backend trong MVP và không ảnh hưởng
            cấu trúc SEO của thanhnamhomes.vn.
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-700 md:justify-end">
          <Link href="/combo-phu-quoc/">Phú Quốc</Link>
          <Link href="/combo-da-nang/">Đà Nẵng</Link>
          <Link href="/combo-nha-trang/">Nha Trang</Link>
          <Link href="/lien-he/">Liên hệ</Link>
        </div>
      </div>
    </footer>
  );
}
