import Link from "next/link";
import Image from "next/image";

export function DestinationCard({ href, title, description, image }: { href: string; title: string; description: string; image: string }) {
  return (
    <Link className="focus-ring group relative flex h-[400px] w-full flex-col justify-end overflow-hidden rounded-2xl transition hover:-translate-y-1" href={href}>
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition duration-700 group-hover:scale-105"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent" />
      <div className="relative z-10 p-6 text-white">
        <h3 className="text-2xl font-semibold tracking-wide">{title}</h3>
        <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/80">{description}</p>
        <div className="mt-5 inline-block rounded-full border border-white/30 px-4 py-2 text-xs font-medium tracking-wide text-white transition group-hover:bg-white/10 group-hover:border-white/50">
          Xem tất cả tour
        </div>
      </div>
    </Link>
  );
}
