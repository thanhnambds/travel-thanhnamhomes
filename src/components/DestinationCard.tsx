import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function DestinationCard({ href, title, description }: { href: string; title: string; description: string }) {
  return (
    <Link className="focus-ring group rounded-lg border border-brand-hairline bg-brand-stone p-6 text-brand-primary transition hover:bg-white" href={href}>
      <h3 className="text-2xl font-normal">{title}</h3>
      <p className="mt-5 min-h-20 text-sm leading-6 text-brand-slate">{description}</p>
      <span className="mt-8 inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4">
        Xem combo <ArrowRight size={17} className="transition group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
