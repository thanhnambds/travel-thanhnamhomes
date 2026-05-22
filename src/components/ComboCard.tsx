import Link from "next/link";
import type { ReactNode } from "react";
import { CalendarDays, Hotel, Plane, Users } from "lucide-react";
import type { Combo } from "@/lib/types";
import { formatDate, formatVnd, getConfig } from "@/lib/data";
import { PriceNote } from "./PriceNote";

export function ComboCard({ combo, compact = false }: { combo: Combo; compact?: boolean }) {
  const config = getConfig();

  return (
    <article className="w-full overflow-hidden rounded-2xl border border-brand-hairline bg-white shadow-soft">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div className="p-7 pb-2">
          <p className="section-label">{combo.destination}</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-medium leading-tight tracking-[-0.02em] text-brand-primary md:text-4xl">{combo.title}</h2>
        </div>
      </div>

      <div className="grid gap-3 p-7 text-sm text-brand-slate md:grid-cols-2">
        <Fact icon={<CalendarDays size={18} />} label="Thời gian" value={`${formatDate(combo.start_date)} - ${formatDate(combo.end_date)} (${combo.duration})`} />
        <Fact icon={<Users size={18} />} label="Khách" value={`${combo.guests.adults} người lớn, ${combo.guests.children} trẻ em`} />
        <Fact icon={<Plane size={18} />} label="Chuyến bay" value={combo.flight_summary} />
        <Fact icon={<Hotel size={18} />} label="Khách sạn" value={`${combo.hotel_name}, ${combo.room_type}, ${combo.meal_plan}`} />
      </div>

      <div className="mx-7 rounded-xl bg-brand-soft p-5">
        <p className="text-sm text-brand-slate">Giá tham khảo cho combo</p>
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
              <strong>Điều kiện hoàn/hủy:</strong> {combo.cancellation_policy}
            </p>
            <p>
              <strong>Chính sách trẻ em:</strong> {combo.child_policy}
            </p>
          </div>
          <div className="p-7">
            <PriceNote text={combo.price_note} />
          </div>
        </>
      )}

      <div className="flex flex-wrap gap-3 p-7 pt-5">
        <a className="focus-ring rounded-full bg-brand-gold px-6 py-3 text-sm font-semibold text-brand-primary transition hover:bg-brand-goldLight" href={config.zaloUrl}>
          Kiểm tra giá qua Zalo
        </a>
        <Link className="focus-ring rounded-full border border-brand-hairline px-6 py-3 text-sm font-semibold text-brand-primary transition hover:bg-brand-soft" href="/combo-hom-nay/">
          Chi tiết combo
        </Link>
      </div>
    </article>
  );
}

function Fact({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex min-h-28 gap-3 rounded-xl border border-brand-border p-4">
      <div className="mt-0.5 text-brand-goldDark">{icon}</div>
      <p>
        <span className="block font-medium text-brand-primary">{label}</span>
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
