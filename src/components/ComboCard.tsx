import Link from "next/link";
import type { ReactNode } from "react";
import { CalendarDays, Hotel, Plane, Users } from "lucide-react";
import type { Combo } from "@/lib/types";
import { formatDate, formatVnd, getConfig } from "@/lib/data";
import { PriceNote } from "./PriceNote";

export function ComboCard({ combo, compact = false }: { combo: Combo; compact?: boolean }) {
  const config = getConfig();

  return (
    <article className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.14em] text-brand-coral">{combo.destination}</p>
          <h2 className="mt-2 text-2xl font-semibold leading-tight text-brand-ink">{combo.title}</h2>
        </div>
        <span className="rounded-md bg-brand-mist px-3 py-1 text-sm font-semibold text-brand-teal">
          {combo.status}
        </span>
      </div>

      <div className="mt-5 grid gap-3 text-sm text-slate-700 md:grid-cols-2">
        <Fact icon={<CalendarDays size={18} />} label="Thời gian" value={`${formatDate(combo.start_date)} - ${formatDate(combo.end_date)} (${combo.duration})`} />
        <Fact icon={<Users size={18} />} label="Khách" value={`${combo.guests.adults} người lớn, ${combo.guests.children} trẻ em`} />
        <Fact icon={<Plane size={18} />} label="Chuyến bay" value={combo.flight_summary} />
        <Fact icon={<Hotel size={18} />} label="Khách sạn" value={`${combo.hotel_name}, ${combo.room_type}, ${combo.meal_plan}`} />
      </div>

      <div className="mt-5 rounded-lg bg-slate-50 p-4">
        <p className="text-sm text-slate-600">Giá tham khảo cho combo</p>
        <p className="mt-1 text-3xl font-semibold text-brand-ink">{formatVnd(combo.total_price)}</p>
      </div>

      {!compact && (
        <>
          <div className="mt-5 grid gap-5 md:grid-cols-2">
            <List title="Bao gồm" items={combo.included} />
            <List title="Không bao gồm" items={combo.excluded} />
          </div>
          <div className="mt-5 grid gap-4 text-sm leading-6 text-slate-700 md:grid-cols-2">
            <p>
              <strong>Điều kiện hoàn/hủy:</strong> {combo.cancellation_policy}
            </p>
            <p>
              <strong>Chính sách trẻ em:</strong> {combo.child_policy}
            </p>
          </div>
          <div className="mt-5">
            <PriceNote text={combo.price_note} />
          </div>
        </>
      )}

      <div className="mt-5 flex flex-wrap gap-3">
        <a className="focus-ring rounded-md bg-brand-teal px-4 py-2 font-semibold text-white" href={config.zaloUrl}>
          Kiểm tra giá qua Zalo
        </a>
        <Link className="focus-ring rounded-md border border-slate-300 px-4 py-2 font-semibold text-brand-ink" href="/combo-hom-nay/">
          Chi tiết combo
        </Link>
      </div>
    </article>
  );
}

function Fact({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex gap-3 rounded-md border border-slate-200 p-3">
      <div className="mt-0.5 text-brand-teal">{icon}</div>
      <p>
        <span className="block font-semibold text-brand-ink">{label}</span>
        {value}
      </p>
    </div>
  );
}

function List({ title, items }: { title: string; items: string[] }) {
  return (
    <div>
      <h3 className="font-semibold text-brand-ink">{title}</h3>
      <ul className="mt-2 space-y-2 text-sm leading-6 text-slate-700">
        {items.map((item) => (
          <li key={item}>- {item}</li>
        ))}
      </ul>
    </div>
  );
}
