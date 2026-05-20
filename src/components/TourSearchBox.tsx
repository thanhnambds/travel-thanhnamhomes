"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, MapPin, Search, Users } from "lucide-react";

interface TourSearchBoxProps {
  className?: string;
  compact?: boolean;
}

export function TourSearchBox({ className = "", compact = false }: TourSearchBoxProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [month, setMonth] = useState("2026-07");
  const [departureCity, setDepartureCity] = useState("Hà Nội");

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (month) params.set("month", month);
    if (departureCity) params.set("from", departureCity);
    router.push(`/tim-kiem-tour/?${params.toString()}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`rounded-2xl border border-white/18 bg-black/28 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur-md ${className}`}
    >
      <label className="relative block">
        <Search className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-brand-slate" size={24} />
        <input
          className={`w-full rounded-2xl border border-white/20 bg-white pl-14 pr-5 text-brand-primary outline-none transition focus:border-brand-gold ${compact ? "h-14 text-base" : "h-16 text-lg"}`}
          placeholder="Bạn muốn đi đâu? Ví dụ: Thượng Hải, Hàn Quốc, Đài Loan..."
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
      </label>

      <div className="mt-3 grid gap-3 md:grid-cols-[1fr_1fr_1.1fr_auto]">
        <label className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-brand-primary">
          <CalendarDays className="text-brand-slate" size={22} />
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-bold uppercase tracking-wide text-brand-slate">Tháng đi</span>
            <input
              type="month"
              className="mt-0.5 w-full bg-transparent text-base font-semibold outline-none"
              value={month}
              onChange={(event) => setMonth(event.target.value)}
            />
          </span>
        </label>

        <label className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-brand-primary">
          <MapPin className="text-brand-slate" size={22} />
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-bold uppercase tracking-wide text-brand-slate">Khởi hành</span>
            <select
              className="mt-0.5 w-full bg-transparent text-base font-semibold outline-none"
              value={departureCity}
              onChange={(event) => setDepartureCity(event.target.value)}
            >
              <option>Hà Nội</option>
              <option>Hồ Chí Minh</option>
              <option>Đà Nẵng</option>
              <option>Tất cả</option>
            </select>
          </span>
        </label>

        <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-brand-primary">
          <Users className="text-brand-slate" size={22} />
          <span>
            <span className="block text-xs font-bold uppercase tracking-wide text-brand-slate">Khách</span>
            <span className="mt-0.5 block text-base font-semibold">2 người lớn, 0 trẻ em</span>
          </span>
        </div>

        <button className="rounded-2xl bg-brand-gold px-8 py-4 text-base font-bold text-brand-primary transition hover:bg-brand-goldLight" type="submit">
          Tìm
        </button>
      </div>
    </form>
  );
}
