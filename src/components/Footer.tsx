import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-brand-primary text-white">
      <div className="container-page grid gap-10 py-16 md:grid-cols-[1.2fr_0.8fr]">
        <div>
          <p className="mono-label text-sm uppercase text-brand-coral">AI moves fast</p>
          <p className="display-type mt-4 max-w-xl text-4xl leading-none md:text-5xl">Travel lead engine cho combo du lịch</p>
          <p className="mt-5 max-w-xl text-sm leading-6 text-brand-muted">
            Website static riêng cho subdomain travel.thanhnamhomes.vn, không dùng backend trong MVP và không ảnh hưởng
            cấu trúc SEO của thanhnamhomes.vn.
          </p>
        </div>
        <div className="flex flex-wrap content-start gap-5 text-sm text-brand-muted md:justify-end">
          <Link href="/combo-phu-quoc/">Phú Quốc</Link>
          <Link href="/combo-da-nang/">Đà Nẵng</Link>
          <Link href="/combo-nha-trang/">Nha Trang</Link>
          <Link href="/lien-he/">Liên hệ</Link>
        </div>
      </div>
    </footer>
  );
}
