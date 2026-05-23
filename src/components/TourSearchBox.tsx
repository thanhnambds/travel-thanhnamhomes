"use client";

import { FormEvent, useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CalendarDays, MapPin, Search, Users } from "lucide-react";
import type { PublicTour } from "@/lib/types";
import { normalizeSearch } from "@/lib/tour-helpers";

interface TourSearchBoxProps {
  className?: string;
  compact?: boolean;
  tours?: PublicTour[];
}

export function TourSearchBox({ className = "", compact = false, tours = [] }: TourSearchBoxProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [month, setMonth] = useState("");
  const [departureCity, setDepartureCity] = useState("Hà Nội");
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Group tours by destination to get min price and tour count
  const uniqueDestinations = useMemo(() => {
    if (!tours || tours.length === 0) return [];
    const map = new Map<string, { country: string; prices: number[]; count: number }>();
    tours.forEach((tour) => {
      const key = tour.destination;
      const existing = map.get(key);
      if (existing) {
        existing.prices.push(tour.price);
        existing.count += 1;
      } else {
        map.set(key, {
          country: tour.country,
          prices: [tour.price],
          count: 1
        });
      }
    });

    return Array.from(map.entries())
      .map(([destination, data]) => ({
        destination,
        country: data.country,
        minPrice: Math.min(...data.prices),
        count: data.count
      }))
      .sort((a, b) => a.destination.localeCompare(b.destination, "vi"));
  }, [tours]);

  // Filter destinations based on user input
  const filteredDestinations = useMemo(() => {
    const normalized = normalizeSearch(query);
    if (!normalized) return uniqueDestinations;
    return uniqueDestinations.filter(
      (item) =>
        normalizeSearch(item.destination).includes(normalized) ||
        normalizeSearch(item.country).includes(normalized)
    );
  }, [uniqueDestinations, query]);

  // Dynamic departure cities
  const departureCities = useMemo(() => {
    if (!tours || tours.length === 0) return ["Hà Nội", "Hồ Chí Minh", "Đà Nẵng", "Tất cả"];
    const cities = Array.from(new Set(tours.map((tour) => tour.departure_city).filter(Boolean)));
    if (!cities.includes("Hà Nội")) cities.push("Hà Nội");
    if (!cities.includes("Hồ Chí Minh")) cities.push("Hồ Chí Minh");
    if (!cities.includes("Đà Nẵng")) cities.push("Đà Nẵng");
    return [...cities.sort((a, b) => a.localeCompare(b, "vi")), "Tất cả"];
  }, [tours]);

  // Dynamic available months
  const months = useMemo(() => {
    if (!tours || tours.length === 0) return ["2026-06", "2026-07"];
    return Array.from(new Set(tours.flatMap((tour) => tour.departure_dates.map((date) => date.slice(0, 7))))).sort();
  }, [tours]);

  function formatMonth(value: string): string {
    const [year, month] = value.split("-");
    return `Tháng ${Number(month)}/${year}`;
  }

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
      <div className="relative" ref={containerRef}>
        <Search className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-brand-slate" size={24} />
        <input
          className={`w-full rounded-2xl border border-white/20 bg-white pl-14 pr-5 text-brand-primary outline-none transition focus:border-brand-gold ${compact ? "h-14 text-base" : "h-16 text-lg"}`}
          placeholder="Bạn muốn đi đâu? Ví dụ: Thượng Hải, Hàn Quốc, Đài Loan..."
          value={query}
          onFocus={() => setShowDropdown(true)}
          onChange={(event) => {
            setQuery(event.target.value);
            setShowDropdown(true);
          }}
        />

        {/* Dropdown Suggestions */}
        {showDropdown && uniqueDestinations.length > 0 && (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[320px] overflow-y-auto rounded-2xl border border-brand-hairline bg-white p-3 shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
            <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-brand-slate border-b border-brand-hairline/60 mb-2">
              📍 Điểm đến & Giá sàn tốt nhất từ JSON
            </div>
            <div className="grid gap-0.5">
              {filteredDestinations.length > 0 ? (
                filteredDestinations.map((item) => (
                  <button
                    key={item.destination}
                    type="button"
                    onClick={() => {
                      setQuery(item.destination);
                      setShowDropdown(false);
                      const params = new URLSearchParams();
                      params.set("q", item.destination);
                      // Khi gõ chọn nhanh điểm đến, không gài cứng bộ lọc tháng để luôn tìm thấy kết quả
                      if (departureCity) params.set("from", departureCity);
                      router.push(`/tim-kiem-tour/?${params.toString()}`);
                    }}
                    className="flex items-center justify-between rounded-xl px-3 py-3 text-left text-brand-primary transition hover:bg-brand-soft"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-soft text-brand-goldDark">
                        <MapPin size={18} />
                      </div>
                      <div>
                        <span className="font-semibold text-sm text-brand-primary">{item.destination}</span>
                        <span className="ml-1.5 text-xs text-brand-slate">({item.country})</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-sm font-bold text-brand-goldDark">
                        Từ {new Intl.NumberFormat("vi-VN").format(item.minPrice)}đ
                      </div>
                      <div className="text-[10px] text-brand-slate">{item.count} tour đã duyệt</div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-3 py-6 text-center text-sm text-brand-slate">
                  Không tìm thấy điểm đến phù hợp.
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="mt-3 grid gap-3 md:grid-cols-[1fr_1fr_1.1fr_auto]">
        <label className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-brand-primary">
          <CalendarDays className="text-brand-slate" size={22} />
          <span className="min-w-0 flex-1">
            <span className="block text-xs font-bold uppercase tracking-wide text-brand-slate">Tháng đi</span>
            <select
              className="mt-0.5 w-full bg-transparent text-base font-semibold outline-none"
              value={month}
              onChange={(event) => setMonth(event.target.value)}
            >
              <option value="">Tất cả tháng</option>
              {months.map((item) => (
                <option key={item} value={item}>
                  {formatMonth(item)}
                </option>
              ))}
            </select>
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
              {departureCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
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

        <button
          className="rounded-2xl bg-brand-gold px-8 py-4 text-base font-bold text-brand-primary transition hover:bg-brand-goldLight"
          type="submit"
        >
          Tìm
        </button>
      </div>
    </form>
  );
}
