import Link from "next/link";
import { MessageCircle, Plane } from "lucide-react";

const nav = [
  ["Trang chủ", "/"],
  ["Giới thiệu", "/gioi-thieu/"],
  ["Dịch vụ", "/dich-vu/"],
  ["Tin tức", "/tin-tuc/"],
  ["Liên hệ", "/lien-he/"]
];

export function Header({ zaloUrl }: { zaloUrl: string }) {
  return (
    <header className="site-header sticky top-0 z-30 border-b border-brand-hairline bg-white/80 backdrop-blur-md transition-all duration-300">
      <div className="container-page flex min-h-[72px] items-center justify-between gap-4">
        <Link href="/" className="focus-ring flex items-center gap-3 rounded-md text-sm font-bold uppercase tracking-[0.04em] text-brand-primary transition-all duration-300 hover:opacity-90">
          <span className="grid h-10 w-10 place-items-center rounded-full border border-brand-gold/60 bg-brand-soft text-brand-goldDark shadow-[0_0_0_3px_rgba(199,161,90,0.12)] transition duration-500 hover:rotate-[360deg]">
            <Plane size={18} />
          </span>
          <span className="display-type text-base font-bold text-brand-primary">
            Thanh Nam <span className="text-brand-goldDark font-extrabold">Travel</span>
          </span>
        </Link>
        <nav className="hidden items-center justify-center gap-8 text-sm font-semibold text-brand-primary lg:flex">
          {nav.map(([label, href]) => (
            <Link 
              className="focus-ring relative py-2 transition-all duration-300 hover:text-brand-goldDark after:absolute after:bottom-0 after:left-0 after:h-[2px] after:w-0 after:bg-brand-gold after:transition-all after:duration-300 hover:after:w-full" 
              href={href} 
              key={href}
            >
              {label}
            </Link>
          ))}
        </nav>
        <a
          href={zaloUrl}
          target="_blank"
          rel="noreferrer"
          className="focus-ring inline-flex items-center gap-2 rounded-full bg-brand-gold px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-brand-primary shadow-md transition-all duration-300 hover:bg-brand-goldLight hover:-translate-y-0.5 hover:shadow-lg hover:shadow-brand-gold/25"
        >
          <MessageCircle size={15} />
          Zalo
        </a>
      </div>
    </header>
  );
}
