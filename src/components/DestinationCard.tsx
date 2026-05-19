import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function DestinationCard({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link className="focus-ring group rounded-2xl border border-brand-hairline bg-white p-7 text-brand-primary shadow-soft transition hover:-translate-y-1 hover:border-brand-gold/40" href={href}>
      <h3 className="text-2xl font-medium">{title}</h3>
      <p className="mt-5 min-h-20 text-sm leading-7 text-brand-slate">{description}</p>
      <span className="mt-8 inline-flex items-center gap-2 text-sm font-semibold text-brand-goldDark underline underline-offset-4">
        Xem combo <ArrowRight size={17} className="transition group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
