"use client";

import { useMemo, useState, useEffect } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { CalendarDays, Filter, MapPin, Search, Star, Plane, Hotel } from "lucide-react";
import { TourCard } from "@/components/TourCard";
import type { PublicTour, PublicHotel } from "@/lib/types";
import { normalizeSearch, tourHref, tourImage } from "@/lib/tour-helpers";

export function TourSearchResults({ tours, hotels = [] }: { tours: PublicTour[]; hotels?: PublicHotel[] }) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const type = searchParams.get("type") ?? "tour";
  const [query, setQuery] = useState(searchParams.get("q") ?? "");
  const [month, setMonth] = useState(searchParams.get("month") ?? "");
  const [departureCity, setDepartureCity] = useState(searchParams.get("from") ?? "Tất cả");
  const [maxPrice, setMaxPrice] = useState("");

  // Sync URL search params to local filter state when search params change
  useEffect(() => {
    setQuery(searchParams.get("q") ?? "");
    setMonth(searchParams.get("month") ?? "");
    setDepartureCity(searchParams.get("from") ?? "Tất cả");
  }, [searchParams]);

  // Reactive URL update helper
  function updateFilter(key: string, value: string) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }
    router.replace(`${pathname}?${params.toString()}`);
  }

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

  // Filter matched hotels based on search query
  const matchedHotels = useMemo(() => {
    const normalizedQuery = normalizeSearch(query);
    if (!normalizedQuery) return []; // Only show hotels when a search query is active to avoid cluttering on blank filter

    return hotels.filter((hotel) => {
      const haystack = normalizeSearch([
        hotel.hotel_name,
        hotel.original_name,
        hotel.destination,
        hotel.country,
        hotel.supplier_name
      ].join(" "));
      return haystack.includes(normalizedQuery);
    });
  }, [hotels, query]);

  return (
    <div className="grid gap-8 lg:grid-cols-[320px_1fr]">
      <aside className="h-fit rounded-2xl border border-brand-hairline bg-white p-5 shadow-soft lg:sticky lg:top-24">
        {/* Sidebar Tab Switcher */}
        <div className="mb-5 flex gap-1 rounded-xl bg-brand-stone p-1">
          <button
            type="button"
            onClick={() => updateFilter("type", "tour")}
            className={`flex-1 rounded-lg py-2 text-center text-xs font-bold uppercase tracking-wider transition ${
              type === "tour"
                ? "bg-brand-primary text-white shadow-sm"
                : "text-brand-slate hover:text-brand-primary"
            }`}
          >
            Tour
          </button>
          <button
            type="button"
            onClick={() => updateFilter("type", "hotel")}
            className={`flex-1 rounded-lg py-2 text-center text-xs font-bold uppercase tracking-wider transition ${
              type === "hotel"
                ? "bg-brand-primary text-white shadow-sm"
                : "text-brand-slate hover:text-brand-primary"
            }`}
          >
            Khách sạn
          </button>
        </div>

        <div className="flex items-center gap-2 text-brand-primary border-t border-brand-hairline/60 pt-4">
          <Filter size={18} />
          <h2 className="text-lg font-semibold">Bộ lọc tìm kiếm</h2>
        </div>

        <div className="mt-5 space-y-4">
          <label className="block">
            <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-brand-slate">
              <Search size={15} />
              Điểm đến / Khách sạn
            </span>
            <input
              className="h-12 w-full rounded-xl border border-brand-hairline bg-brand-stone px-4 text-sm outline-none transition focus:border-brand-gold"
              placeholder="Nhập điểm đến, tên khách sạn..."
              value={query}
              onChange={(event) => {
                setQuery(event.target.value);
                updateFilter("q", event.target.value);
              }}
            />
          </label>

          {type === "tour" && (
            <>
              <label className="block">
                <span className="mb-2 flex items-center gap-2 text-xs font-bold uppercase tracking-wide text-brand-slate">
                  <CalendarDays size={15} />
                  Tháng khởi hành
                </span>
                <select
                  className="h-12 w-full rounded-xl border border-brand-hairline bg-brand-stone px-4 text-sm font-semibold outline-none transition focus:border-brand-gold"
                  value={month}
                  onChange={(event) => {
                    setMonth(event.target.value);
                    updateFilter("month", event.target.value);
                  }}
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
                  onChange={(event) => {
                    setDepartureCity(event.target.value);
                    updateFilter("from", event.target.value);
                  }}
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
            </>
          )}
        </div>
      </aside>

      <section className="space-y-12">
        {type === "hotel" ? (
          /* Priority Layout: Hotel First */
          <>
            <div>
              <div className="mb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
                <div>
                  <p className="section-label">Hệ thống phòng đối tác</p>
                  <h3 className="mt-2 text-3xl font-semibold tracking-[-0.02em] text-brand-primary">
                    {matchedHotels.length} khách sạn đối tác
                  </h3>
                </div>
                <p className="max-w-xl text-sm leading-6 text-brand-slate">
                  Danh sách phòng khách sạn từ hệ thống liên kết trực tiếp của Thanh Nam Homes Travel. Cam kết mức giá ưu đãi tốt nhất thị trường cùng dịch vụ hỗ trợ chu đáo.
                </p>
              </div>

              {matchedHotels.length ? (
                <div className="flex flex-col gap-3">
                  {matchedHotels.map((hotel) => {
                    const cleanedName = cleanDisplayHotelName(hotel.hotel_name);
                    const encodedMsg = encodeURIComponent(
                      `Xin chào Thanh Nam Homes Travel, em muốn kiểm tra tình trạng phòng trống và đặt phòng tại khách sạn: ${cleanedName} (Khu vực: ${hotel.destination}).`
                    );
                    const hotelZaloUrl = `https://zalo.me/0965325555?text=${encodedMsg}`;

                    // Deterministic facility tags for premium consumer experience
                    const AMENITY_TAGS = [
                      "Buffet sáng thượng hạng",
                      "Tiện ích 5 sao cao cấp",
                      "Sát biển / Trung tâm",
                      "Hỗ trợ check-in sớm",
                      "Bao gồm thuế & dịch vụ"
                    ];
                    const charCodeSum = hotel.id.split("").reduce((sum, char) => sum + char.charCodeAt(0), 0);
                    const tag1 = AMENITY_TAGS[charCodeSum % AMENITY_TAGS.length];
                    const tag2 = AMENITY_TAGS[(charCodeSum + 2) % AMENITY_TAGS.length];

                    return (
                      <div
                        key={hotel.id}
                        className="group flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-brand-hairline bg-white p-4 shadow-soft transition-all duration-300 hover:border-brand-gold hover:shadow-md"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-brand-goldDark">
                              <MapPin size={9} />
                              {hotel.destination}
                            </span>
                            {hotel.stars && hotel.stars > 0 ? (
                              <div className="flex gap-0.5 text-amber-400">
                                {Array.from({ length: hotel.stars }).map((_, idx) => (
                                  <Star key={idx} size={10} fill="currentColor" className="stroke-amber-400" />
                                ))}
                              </div>
                            ) : (
                              <span className="rounded bg-brand-primary/5 px-2 py-0.5 text-[9px] font-semibold text-brand-slate">
                                Đối tác VIP
                              </span>
                            )}
                          </div>

                          <h4 className="mt-2 text-sm sm:text-base font-bold leading-snug text-brand-primary group-hover:text-brand-goldDark transition-colors">
                            {cleanedName}
                          </h4>
                        </div>

                        <div className="flex flex-wrap gap-1.5 md:w-56 shrink-0 md:justify-center">
                          <span className="inline-flex rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                            ✓ {tag1}
                          </span>
                          <span className="inline-flex rounded bg-emerald-50 px-2 py-0.5 text-[10px] font-medium text-emerald-700">
                            ✓ {tag2}
                          </span>
                        </div>

                        <div className="flex items-center justify-between md:flex-col md:items-end gap-3 md:w-52 shrink-0 border-t border-brand-hairline md:border-t-0 pt-3 md:pt-0">
                          <div className="text-left md:text-right">
                            <span className="block text-[10px] uppercase font-bold tracking-wide text-brand-slate">Mức giá</span>
                            <span className="text-xs font-bold text-emerald-600">Giá ưu đãi tốt nhất</span>
                          </div>
                          
                          <a
                            href={hotelZaloUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center justify-center rounded-xl bg-brand-gold px-4 py-2.5 text-xs font-bold text-brand-primary transition-all duration-200 hover:bg-brand-goldLight shadow-sm shrink-0"
                          >
                            Kiểm tra phòng & Đặt ngay
                          </a>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-brand-hairline bg-white p-8 text-brand-slate">
                  Chưa tìm thấy phòng khách sạn đối tác phù hợp tại khu vực này trên quỹ phòng. Anh/chị vui lòng nhắn tin Zalo để Thanh Nam Homes Travel hỗ trợ check phòng trực tiếp nhé!
                </div>
              )}
            </div>
          </>
        ) : (
          /* Priority Layout: Tour First */
          <>
            <div>
              <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="section-label">Hành trình du lịch</p>
                  <h2 className="mt-2 text-3xl font-semibold tracking-[-0.02em] text-brand-primary">
                    {results.length} tour phù hợp
                  </h2>
                </div>
                <p className="max-w-xl text-sm leading-6 text-brand-slate">
                  Tìm kiếm trực tiếp từ toàn bộ hệ thống tour của Thanh Nam Homes Travel. Vui lòng liên hệ qua Zalo để kiểm tra tình trạng chỗ và giá chính xác nhất.
                </p>
              </div>

              {results.length ? (
                <div className="flex flex-col gap-3">
                  {results.map((tour) => (
                    <div
                      key={tour.id}
                      className="group flex flex-col md:flex-row md:items-center justify-between gap-4 rounded-xl border border-brand-hairline bg-white p-4 shadow-soft transition-all duration-300 hover:border-brand-gold hover:shadow-md"
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-brand-goldDark">
                            {tour.country}
                          </span>
                          <span className="text-[11px] text-brand-slate font-medium flex items-center gap-1">
                            ✈️ {tour.airline}
                          </span>
                          <span className="text-[11px] text-brand-slate font-medium flex items-center gap-1">
                            📍 Từ {tour.departure_city}
                          </span>
                        </div>
                        <Link
                          href={tourHref(tour)}
                          className="mt-2 block text-sm sm:text-base font-bold leading-snug text-brand-primary group-hover:text-brand-goldDark transition-colors"
                        >
                          {tour.title}
                        </Link>
                      </div>

                      <div className="flex items-center gap-1 text-xs font-bold text-brand-primary md:w-28 shrink-0 md:justify-center">
                        <span className="rounded bg-brand-stone px-2.5 py-1 text-brand-primary">
                          {tour.duration}
                        </span>
                      </div>

                      <div className="md:w-56 shrink-0">
                        <span className="block text-[9px] uppercase font-bold tracking-wider text-brand-slate mb-1">
                          Lịch khởi hành gần nhất
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {tour.departure_dates.slice(0, 4).map((date) => (
                            <span
                              key={date}
                              className="inline-flex rounded bg-sky-50 text-sky-700 px-1.5 py-0.5 text-[10px] font-bold"
                            >
                              {formatShortDate(date)}
                            </span>
                          ))}
                          {tour.departure_dates.length > 4 && (
                            <span className="inline-flex rounded bg-brand-stone/40 text-brand-slate px-1.5 py-0.5 text-[10px] font-medium">
                              +{tour.departure_dates.length - 4} ngày khác
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center justify-between md:flex-col md:items-end gap-3 md:w-44 shrink-0 border-t border-brand-hairline md:border-t-0 pt-3 md:pt-0">
                        <div className="text-left md:text-right">
                          <span className="block text-[9px] uppercase font-bold tracking-wider text-brand-slate">Giá tour</span>
                          <span className="text-sm sm:text-base font-bold text-brand-primary">{formatVnd(tour.price)}/khách</span>
                        </div>
                        <Link
                          href={tourHref(tour)}
                          className="inline-flex items-center justify-center rounded-xl bg-brand-gold px-4 py-2 text-xs font-bold text-brand-primary transition-all duration-200 hover:bg-brand-goldLight shadow-sm shrink-0"
                        >
                          Xem chi tiết
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="rounded-2xl border border-dashed border-brand-hairline bg-white p-8 text-brand-slate">
                  Chưa tìm thấy hành trình phù hợp với bộ lọc hiện tại trên hệ thống. Anh/chị vui lòng nhắn tin Zalo để Thanh Nam Homes Travel kiểm tra thêm các tour mới nhất từ đối tác nhé!
                </div>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}

function cleanDisplayHotelName(name: string): string {
  let clean = name.trim();
  // Remove leading and trailing punctuation/quotes/commas/spaces/brackets
  clean = clean.replace(/^[,\s"'\(\)\[\]\-]+/g, "");
  clean = clean.replace(/[,\s"'\(\)\[\]\-]+$/g, "");
  
  // Replace internal commas or raw slash patterns
  clean = clean.replace(/,/g, " / ");
  
  // Strip common codes inside hotel names (e.g. SP_, QN_, HB_, etc.)
  clean = clean.replace(/\b(SP|QN|HB|DT|HN|VP|PT|BG|BN|CBA|LS|SL|YB|NB|CB|HP|VT|ĐN|MC|HG|TQ|YB|C\.THƠ|B\.TH|BTH|VT|ĐN|SP|QN|HB|DT|HN|VP|PT|BG|BN|CBA|LS|SL|YB|NB|CB|HP|VT|ĐN|MC|HG|TQ|YB)_\b/gi, "");
  // Strip starting codes with space like "SP " or "QN "
  clean = clean.replace(/^(SP|QN|HB|DT|HN|VP|PT|BG|BN|CBA|LS|SL|YB|NB|CB|HP|VT|ĐN|MC|HG|TQ|YB)\s+/gi, "");

  // Clean double spaces and replace any escaped characters
  clean = clean.replace(/\s+/g, " ");

  // Final trim
  clean = clean.trim();

  return clean || name;
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
