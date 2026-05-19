import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function DestinationCard({
  href,
  title,
  description,
  imageUrl
}: {
  href: string;
  title: string;
  description: string;
  imageUrl: string;
}) {
  return (
    <Link
      className="focus-ring group flex flex-col overflow-hidden rounded-3xl bg-white shadow-airbnb transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_12px_28px_rgba(0,0,0,0.12)]"
      href={href}
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden">
        <img
          src={imageUrl}
          alt={title}
          className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="text-2xl font-medium text-brand-primary">{title}</h3>
        <p className="mt-3 flex-1 text-sm leading-6 text-brand-slate">{description}</p>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-goldDark underline underline-offset-4">
          Xem combo <ArrowRight size={17} className="transition-transform group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
