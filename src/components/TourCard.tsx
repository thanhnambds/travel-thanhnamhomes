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
    <Link href={href} className="focus-ring group flex flex-col overflow-hidden rounded-2xl border border-brand-hairline bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-lg">
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={image}
          alt={title}
          fill
          className="object-cover transition duration-500 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
        />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-center gap-1 text-xs text-brand-slate">
          <MapPin size={14} className="text-brand-slate/80" />
          {location}
        </div>
        <h3 className="mt-2 line-clamp-2 text-base font-bold leading-snug text-brand-primary">{title}</h3>
        
        <div className="mt-2 flex items-center gap-1 text-sm font-semibold text-brand-primary">
          <Star size={14} className="fill-brand-gold text-brand-gold" />
          {rating} <span className="font-normal text-brand-slate">({reviews} đánh giá)</span>
        </div>
        
        <div className="mt-3">
          <span className="inline-block rounded bg-[#0d9488] px-2 py-1 text-xs font-semibold text-white">
            {tag}
          </span>
        </div>
        
        <div className="mt-auto pt-4">
          <div className="flex items-center justify-between border-t border-brand-hairline pt-4">
            <div className="text-sm text-brand-slate">
              Giá: <span className="text-base font-bold text-brand-primary">{price}</span>
            </div>
            <div className="flex items-center gap-1 text-xs font-medium text-brand-slate">
              <Clock size={14} />
              {duration}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
