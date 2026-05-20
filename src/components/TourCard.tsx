import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, Star } from "lucide-react";

export interface TourCardProps {
  href: string;
  image: string;
  location: string;
  title: string;
  rating: number;
  reviews: number;
  tag: string;
  price: string;
  duration: string;
}

export function TourCard({ href, image, location, title, rating, reviews, tag, price, duration }: TourCardProps) {
  return (
    <Link 
      href={href} 
      className="focus-ring group flex flex-col overflow-hidden rounded-2xl border border-brand-hairline/70 bg-white shadow-soft transition-all duration-500 ease-out hover:-translate-y-2 hover:shadow-xl hover:border-brand-gold/40"
    >
      <div className="relative h-52 w-full overflow-hidden">
        {/* Absolute Glassmorphism Tag */}
        <div className="absolute left-4 top-4 z-10 flex items-center gap-1.5 rounded-full bg-white/80 backdrop-blur-md px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider text-brand-primary border border-white/30 shadow-sm">
          <MapPin size={11} className="text-brand-goldDark" />
          {location}
        </div>
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition-transform duration-700 ease-out group-hover:scale-108"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <h3 className="line-clamp-2 text-base font-bold leading-snug text-brand-primary transition-colors duration-300 group-hover:text-brand-goldDark">{title}</h3>
        
        <div className="mt-3 flex items-center gap-1 text-xs font-semibold text-brand-primary">
          <Star size={13} className="fill-brand-gold text-brand-gold" />
          <span className="text-brand-primary">{rating}.0</span> 
          <span className="font-normal text-brand-slate">({reviews} đánh giá)</span>
        </div>
        
        <div className="mt-4">
          <span className="inline-block rounded-full bg-brand-soft border border-brand-coral/20 px-3 py-1 text-xs font-bold text-brand-goldDark">
            {tag}
          </span>
        </div>
        
        <div className="mt-auto pt-5">
          <div className="flex items-center justify-between border-t border-brand-hairline/50 pt-4">
            <div className="text-xs text-brand-slate font-medium">
              Giá khởi điểm: <span className="block mt-0.5 text-base font-extrabold text-brand-primary tracking-tight">{price}</span>
            </div>
            <div className="flex items-center gap-1 rounded-md bg-brand-stone/60 px-2 py-1 text-xs font-bold text-brand-slate">
              <Clock size={12} className="text-brand-goldDark" />
              {duration}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
