"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CalendarDays, Filter, MapPin, Search } from "lucide-react";
import { TourCard } from "@/components/TourCard";
import type { PublicTour } from "@/lib/types";
import { normalizeSearch, tourHref, tourImage } from "@/lib/tour-helpers";

export function TourSearchResults({ tours }: { tours: PublicTour[] }) {
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [month, setMonth] = useState(searchParams.get("month") ?? "");
  const [departureCity, setDepartureCity] = useState(searchParams.get("from") ?? "Tất cả");
  const [maxPrice, setMaxPrice] = useState("");

  const departureCities = useMemo(() => {
    return ["Tất cả", ...Array.from(new Set(tours.map((tour) => tour.departure_city))).sort((a, b) => a.localeCompare(b, "vi"))];
  }, [tours]);

  const months = useMemo(() => {
    return Array.from(new Set(tours.flatMap((tour) => tour.departure_dates.map((date) => date.slice(0, 7))))).sort();
  }, [tours]);

  const results = useMemo(() => {
    const normalizedQuery = normalizeSearch(query);
    const priceLimit = Number(maxPrice || 0) * 1000000;

    return tours
      .filter((tour) => {
        const haystack = normalizeSearch([tour.title, tour.destination, tour.country, tour.airline, tour.departure_city, tour.duration].join(" "));
        const matchesQuery = !normalizedQuery || haystack.includes(normalizedQuery);
        const matchesMonth = !month || tour.departure_dates.some((date) => date.startsWith(month));
        const matchesDeparture = departureCity === "Tất cả" || tour.departure_city === departureCity;
        const matchesPrice = !priceLimit || tour.price <= priceLimit;
        return matchesQuery && matchesMonth && matchesDeparture && matchesPrice;
      })
      .sort((a, b) => a.price - b.price);
  }, [departureCity, maxPrice, month, query, tours]);

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <aside className="h-fit rounded-2xl border border-brand-hairline bg-white p-5 shadow-soft lg:sticky lg:top-24">
        <div className="flex items-center gap-2 text-brand-primary">
          <Filter size={18} />
          <h2 className="text-lg font-semibold">Bộ lọc tour</h2>
        </div>

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-brand-slate">
              <Search size={15} />
              Điểm đến
            </span>
            <input
              className="h-12 w-full rounded-xl border border-brand-hairline bg-brand-stone px-4 text-sm outline-none transition focus:border-brand-gold"
              placeholder="Nhập quốc gia, thành phố..."
              value={query}
              onChange={(event) => setQuery(event.target.value)}
            />
          </label>

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-brand-slate">
              <CalendarDays size={15} />
              Tháng khởi hành
            </span>
            <select
              className="h-12 w-full rounded-xl border border-brand-hairline bg-brand-stone px-4 text-sm font-semibold outline-none transition focus:border-brand-gold"
              value={month}
              onChange={(event) => setMonth(event.target.value)}
            >
              <option value="">Tất cả tháng</option>
              {months.map((item) => (
                <option value={item} key={item}>
                  {formatMonth(item)}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-brand-slate">
              <MapPin size={15} />
              Khởi hành từ
            </span>
            <select
              className="h-12 w-full rounded-xl border border-brand-hairline bg-brand-stone px-4 text-sm font-semibold outline-none transition focus:border-brand-gold"
              value={departureCity}
              onChange={(event) => setDepartureCity(event.target.value)}
            >
              {departureCities.map((item) => (
                <option value={item} key={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-2 block text-xs font-bold uppercase tracking-wide text-brand-slate">Giá tối đa</span>
            <select
              className="h-12 w-full rounded-xl border border-brand-hairline bg-brand-stone px-4 text-sm font-semibold outline-none transition focus:border-brand-gold"
              value={maxPrice}
              onChange={(event) => setMaxPrice(event.target.value)}
            >
              <option value="">Không giới hạn</option>
              <option value="10">Dưới 10 triệu</option>
              <option value="15">Dưới 15 triệu</option>
              <option value="20">Dưới 20 triệu</option>
              <option value="30">Dưới 30 triệu</option>
            </select>
          </label>
        </div>
      </aside>

      <section>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="section-label">Kết quả tìm kiếm</p>
            <h2 className="mt-2 text-3xl font-semibold tracking-[-0.02em] text-brand-primary">
              {results.length} tour phù hợp
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-6 text-brand-slate">
            Kết quả chỉ lấy từ tour đã duyệt trên website. Giá và chỗ còn nhận cần kiểm tra lại qua Zalo trước khi giữ dịch vụ.
          </p>
        </div>

        {results.length ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {results.map((tour) => (
              <TourCard
                href={tourHref(tour)}
                image={tourImage(tour.country)}
                location={tour.country}
                title={tour.title}
                rating={5}
                reviews={0}
                tag={`Khởi hành ${tour.departure_dates.map(formatShortDate).join(", ")}`}
                price={`${formatVnd(tour.price)}/người`}
                duration={tour.duration}
                key={tour.id}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-brand-hairline bg-white p-8 text-brand-slate">
            Chưa có tour public phù hợp với bộ lọc này. Vui lòng nhắn Zalo để Thanh Nam kiểm tra thêm dữ liệu tour mới từ đối tác.
          </div>
        )}
      </section>
    </div>
  );
}

function formatVnd(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value) + "đ";
}

function formatShortDate(value: string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit"
  }).format(new Date(`${value}T12:00:00+07:00`));
}

function formatMonth(value: string): string {
  const [year, month] = value.split("-");
  return `Tháng ${Number(month)}/${year}`;
}
