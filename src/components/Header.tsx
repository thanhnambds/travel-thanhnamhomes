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
    <header className="sticky top-0 z-30 bg-white">
      <div className="bg-brand-black text-white">
        <div className="container-page flex min-h-9 items-center justify-center px-8 text-center text-xs leading-5">
          Combo là giá tham khảo. Thanh Nam kiểm tra lại vé và phòng trước khi giữ dịch vụ.
        </div>
      </div>
      <div className="border-b border-brand-border bg-white/95 backdrop-blur">
        <div className="container-page grid min-h-20 grid-cols-[1fr_auto_1fr] items-center gap-4">
          <Link href="/" className="focus-ring rounded-sm text-base font-medium text-brand-primary">
            Travel Thanh Nam Homes
          </Link>
          <nav className="hidden items-center justify-center gap-8 text-sm text-brand-ink lg:flex">
            {nav.map(([label, href]) => (
              <Link className="focus-ring rounded-sm underline-offset-4 hover:underline" href={href} key={href}>
                {label}
              </Link>
            ))}
          </nav>
          <a
            href={zaloUrl}
            className="focus-ring ml-auto inline-flex items-center gap-2 rounded-full bg-brand-primary px-5 py-2.5 text-sm font-medium text-white"
          >
            <MessageCircle size={17} />
            Zalo
          </a>
        </div>
      </div>
    </header>
  );
}
