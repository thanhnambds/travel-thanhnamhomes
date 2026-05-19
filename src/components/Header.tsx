import Link from "next/link";
import { MessageCircle, Plane } from "lucide-react";

const nav = [
  ["Combo Today", "/combo-hom-nay/"],
  ["Tour du lịch", "/tour-du-lich/"],
  ["Combo du lịch", "/combo-du-lich/"],
  ["Liên hệ", "/lien-he/"]
];

export function Header({ zaloUrl }: { zaloUrl: string }) {
  return (
    <header className="site-header sticky top-0 z-30 border-b border-brand-hairline bg-white">
      <div className="container-page flex min-h-[68px] items-center justify-between gap-4">
        <Link href="/" className="focus-ring flex items-center gap-3 rounded-sm text-sm font-bold uppercase tracking-[0.02em] text-brand-primary">
          <span className="grid h-9 w-9 place-items-center rounded-full border border-brand-gold/60 bg-brand-soft text-brand-goldDark shadow-[0_0_0_3px_rgba(199,161,90,0.12)]">
            <Plane size={17} />
          </span>
          <span>
            Thanh Nam <span className="text-brand-goldDark">Travel</span>
          </span>
        </Link>
        <nav className="hidden items-center justify-center gap-8 text-sm font-medium text-brand-primary lg:flex">
          {nav.map(([label, href]) => (
            <Link className="focus-ring rounded-sm transition hover:text-brand-slate" href={href} key={href}>
              {label}
            </Link>
          ))}
        </nav>
        <a
          href={zaloUrl}
          className="focus-ring inline-flex items-center gap-2 rounded-full bg-brand-gold px-5 py-2.5 text-sm font-semibold text-brand-primary transition hover:bg-brand-goldLight"
        >
          <MessageCircle size={17} />
          Zalo
        </a>
      </div>
      <div className="border-t border-brand-hairline bg-brand-primary text-white">
        <div className="container-page flex min-h-8 items-center justify-center px-4 text-center text-xs leading-5 text-white/76">
          Combo là giá tham khảo. Thanh Nam kiểm tra lại vé và phòng trước khi giữ dịch vụ.
        </div>
      </div>
    </header>
  );
}
