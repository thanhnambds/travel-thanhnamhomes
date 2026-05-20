import Link from "next/link";
import Image from "next/image";

export function DestinationCard({ href, title, description, image }: { href: string; title: string; description: string; image: string }) {
  return (
    <Link 
      className="focus-ring group relative flex h-[420px] w-full flex-col justify-end overflow-hidden rounded-2xl bg-brand-primary/10 shadow-soft transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-2xl hover:shadow-brand-primary/15" 
      href={href}
    >
      <Image
        src={image}
        alt={title}
        fill
        className="object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-primary/95 via-brand-primary/30 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
      <div className="relative z-10 p-7 text-white">
        <h3 className="display-type text-3xl font-normal tracking-wide text-white">{title}</h3>
        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/70 transition-colors duration-300 group-hover:text-white/85">{description}</p>
        <div className="mt-6 inline-flex rounded-full border border-white/20 bg-white/5 backdrop-blur-sm px-4 py-2.5 text-xs font-bold uppercase tracking-widest text-white transition-all duration-300 group-hover:bg-white group-hover:text-brand-primary group-hover:border-white">
          Xem tất cả tour
        </div>
      </div>
    </Link>
  );
}
