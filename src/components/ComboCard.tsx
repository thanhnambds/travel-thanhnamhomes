import Link from "next/link";
import type { ReactNode } from "react";
import { CalendarDays, Hotel, Plane, Users } from "lucide-react";
import type { Combo } from "@/lib/types";
import { formatDate, formatVnd, getConfig } from "@/lib/data";
import { PriceNote } from "./PriceNote";

export function ComboCard({ combo, compact = false }: { combo: Combo; compact?: boolean }) {
  const config = getConfig();

  return (
    <article className="w-full overflow-hidden rounded-2xl border border-brand-hairline bg-white shadow-soft transition-all duration-500 hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-3 p-7 pb-2">
        <div>
          <p className="section-label">{combo.destination}</p>
          <h2 className="display-type mt-4 max-w-2xl text-3xl font-normal leading-tight text-brand-primary md:text-4xl">
            {combo.title}
          </h2>
        </div>
        <span className="rounded-full bg-brand-soft border border-brand-coral/20 px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-brand-goldDark">
          {combo.status}
        </span>
      </div>

      <div className="grid gap-4 p-7 text-sm text-brand-slate md:grid-cols-2">
        <Fact icon={<CalendarDays size={18} />} label="Thời gian" value={`${formatDate(combo.start_date)} - ${formatDate(combo.end_date)} (${combo.duration})`} />
        <Fact icon={<Users size={18} />} label="Khách" value={`${combo.guests.adults} người lớn, ${combo.guests.children} trẻ em`} />
        <Fact icon={<Plane size={18} />} label="Chuyến bay" value={combo.flight_summary} />
        <Fact icon={<Hotel size={18} />} label="Khách sạn" value={`${combo.hotel_name}, ${combo.room_type}, ${combo.meal_plan}`} />
      </div>

      <div className="mx-7 rounded-xl bg-brand-soft border border-brand-coral/10 p-6 shadow-inner">
        <p className="text-xs uppercase tracking-wider font-bold text-brand-goldDark">Giá tham khảo cho combo</p>
        <p className="display-type mt-2 text-4xl md:text-5xl font-normal leading-none text-brand-primary">
          {formatVnd(combo.total_price)}
        </p>
      </div>

      {!compact && (
        <>
          <div className="grid gap-6 p-7 md:grid-cols-2">
            <List title="Bao gồm" items={combo.included} />
            <List title="Không bao gồm" items={combo.excluded} />
          </div>
          <div className="grid gap-4 px-7 text-sm leading-7 text-brand-slate md:grid-cols-2">
            <p className="p-4 rounded-xl bg-brand-stone/40 border border-brand-hairline/40">
              <strong className="text-brand-primary block mb-1">Điều kiện hoàn/hủy:</strong> {combo.cancellation_policy}
            </p>
            <p className="p-4 rounded-xl bg-brand-stone/40 border border-brand-hairline/40">
              <strong className="text-brand-primary block mb-1">Chính sách trẻ em:</strong> {combo.child_policy}
            </p>
          </div>
          <div className="p-7">
            <PriceNote text={combo.price_note} />
          </div>
        </>
      )}

      <div className="flex flex-wrap gap-4 p-7 pt-4">
        <a 
          className="focus-ring inline-flex items-center gap-2 rounded-full bg-brand-gold px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-brand-primary shadow-md transition-all duration-300 hover:bg-brand-goldLight hover:-translate-y-0.5 hover:shadow-lg pulse-gold-glow" 
          href={config.zaloUrl}
          target="_blank"
          rel="noreferrer"
        >
          Kiểm tra giá qua Zalo
        </a>
        <Link className="focus-ring inline-flex items-center gap-2 rounded-full border border-brand-hairline px-7 py-3.5 text-xs font-bold uppercase tracking-wider text-brand-primary shadow-sm transition-all duration-300 hover:bg-brand-soft hover:-translate-y-0.5" href="/combo-hom-nay/">
          Chi tiết combo
        </Link>
      </div>
    </article>
  );
}

function Fact({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex min-h-24 gap-4 rounded-xl border border-brand-border/60 bg-brand-stone/30 p-4 transition-all duration-300 hover:bg-brand-soft hover:border-brand-gold/30 hover:shadow-sm">
      <div className="mt-0.5 text-brand-goldDark">{icon}</div>
      <p className="text-sm leading-relaxed">
        <span className="block font-bold text-brand-primary text-xs uppercase tracking-wider mb-0.5">{label}</span>
        {value}
      </p>
    </div>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="display-type text-2xl font-normal text-brand-primary mb-3">{title}</h3>
      <ul className="space-y-2 text-sm leading-6 text-brand-slate">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2">
            <span className="text-brand-gold font-bold">•</span>
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
}
