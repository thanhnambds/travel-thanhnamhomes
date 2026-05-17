import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function DestinationCard({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link className="focus-ring group rounded-lg border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft" href={href}>
      <h3 className="text-xl font-semibold text-brand-ink">{title}</h3>
      <p className="mt-3 min-h-16 text-sm leading-6 text-slate-600">{description}</p>
      <span className="mt-5 inline-flex items-center gap-2 font-semibold text-brand-teal">
        Xem combo <ArrowRight size={17} className="transition group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
