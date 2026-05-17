import Link from "next/link";
import { MessageCircle } from "lucide-react";

const nav = [
  ["Combo hôm nay", "/combo-hom-nay/"],
  ["Combo du lịch", "/combo-du-lich/"],
  ["Vé bay + khách sạn", "/ve-may-bay-khach-san/"],
  ["Liên hệ", "/lien-he/"]
];

export function Header({ zaloUrl }: { zaloUrl: string }) {
  return (
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between gap-4">
        <Link href="/" className="focus-ring rounded-sm font-semibold text-brand-ink">
          Travel Thanh Nam Homes
        </Link>
        <nav className="hidden items-center gap-5 text-sm font-medium text-slate-700 lg:flex">
          {nav.map(([label, href]) => (
            <Link className="focus-ring rounded-sm hover:text-brand-teal" href={href} key={href}>
              {label}
            </Link>
          ))}
        </nav>
        <a
          href={zaloUrl}
          className="focus-ring inline-flex items-center gap-2 rounded-md bg-brand-teal px-4 py-2 text-sm font-semibold text-white"
        >
          <MessageCircle size={17} />
          Zalo
        </a>
      </div>
    </header>
  );
}
