import Link from "next/link";
import type { ReactNode } from "react";
import { CalendarDays, Hotel, Plane, Users } from "lucide-react";
import type { Combo } from "@/lib/types";
import { formatDate, formatVnd, getConfig } from "@/lib/data";
import { PriceNote } from "./PriceNote";

export function ComboCard({ combo, compact = false }: { combo: Combo; compact?: boolean }) {
  const config = getConfig();

  return (
    <article className="w-full overflow-hidden rounded-3xl bg-white shadow-airbnb">
      <div className="flex flex-wrap items-start justify-between gap-3 p-7 pb-2">
        <div>
          <p className="section-label">{combo.destination}</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-medium leading-tight tracking-[-0.02em] text-brand-primary md:text-4xl">{combo.title}</h2>
        </div>
        <span className="rounded-full bg-brand-soft px-4 py-1.5 text-sm font-semibold text-brand-goldDark">
          {combo.status}
        </span>
      </div>

      <div className="grid gap-3 p-7 text-sm text-brand-slate md:grid-cols-2">
        <Fact icon={<CalendarDays size={18} />} label="Thời gian" value={`${formatDate(combo.start_date)} - ${formatDate(combo.end_date)} (${combo.duration})`} />
        <Fact icon={<Users size={18} />} label="Khách" value={`${combo.guests.adults} người lớn, ${combo.guests.children} trẻ em`} />
        <Fact icon={<Plane size={18} />} label="Chuyến bay" value={combo.flight_summary} />
        <Fact icon={<Hotel size={18} />} label="Khách sạn" value={`${combo.hotel_name}, ${combo.room_type}, ${combo.meal_plan}`} />
      </div>

      <div className="mx-7 rounded-2xl bg-brand-soft p-6">
        <p className="text-sm font-medium text-brand-slate">Giá tham khảo cho combo</p>
        <p className="mt-2 text-5xl font-medium leading-none tracking-[-0.02em] text-brand-primary">{formatVnd(combo.total_price)}</p>
      </div>

      {!compact && (
        <>
          <div className="grid gap-5 p-7 md:grid-cols-2">
            <List title="Bao gồm" items={combo.included} />
            <List title="Không bao gồm" items={combo.excluded} />
          </div>
          <div className="grid gap-4 px-7 text-sm leading-6 text-brand-slate md:grid-cols-2">
            <p>
              <strong className="text-brand-primary">Điều kiện hoàn/hủy:</strong> {combo.cancellation_policy}
            </p>
            <p>
              <strong className="text-brand-primary">Chính sách trẻ em:</strong> {combo.child_policy}
            </p>
          </div>
          <div className="p-7">
            <PriceNote text={combo.price_note} />
          </div>
        </>
      )}

      <div className="flex flex-wrap gap-3 p-7 pt-5">
        <a className="focus-ring flex-1 justify-center rounded-full bg-brand-gold px-6 py-3.5 text-center text-[15px] font-semibold text-brand-primary transition hover:bg-brand-goldLight" href={config.zaloUrl}>
          Kiểm tra giá qua Zalo
        </a>
        <Link className="focus-ring rounded-full bg-brand-soft px-6 py-3.5 text-[15px] font-semibold text-brand-primary transition hover:bg-[#eae1cd]" href="/combo-hom-nay/">
          Chi tiết
        </Link>
      </div>
    </article>
  );
}

function Fact({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex min-h-24 gap-4 rounded-2xl bg-brand-soft/50 p-5">
      <div className="mt-0.5 text-brand-goldDark">{icon}</div>
      <p className="leading-relaxed">
        <span className="block font-semibold text-brand-primary mb-0.5">{label}</span>
        {value}
      </p>
    </div>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="text-2xl font-medium text-brand-primary">{title}</h3>
      <ul className="mt-3 space-y-2 text-sm leading-6 text-brand-slate">
        {items.map((item) => (
          <li key={item}>- {item}</li>
        ))}
      </ul>
    </div>
  );
}
