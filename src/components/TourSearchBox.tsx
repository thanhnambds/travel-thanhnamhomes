"use client";

import { FormEvent, useState, useRef, useEffect, useMemo, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CalendarDays, MapPin, Search, Users, Plane, Hotel, X } from "lucide-react";
import type { PublicTour, PublicHotel } from "@/lib/types";
import { normalizeSearch } from "@/lib/tour-helpers";

interface TourSearchBoxProps {
  className?: string;
  compact?: boolean;
  tours?: PublicTour[];
  hotels?: PublicHotel[];
}

export function TourSearchBox(props: TourSearchBoxProps) {
  return (
    <Suspense fallback={<div className="h-16 w-full animate-pulse rounded-2xl bg-white/10" />}>
      <TourSearchBoxInner {...props} />
    </Suspense>
  );
}

function TourSearchBoxInner({ className = "", compact = false, tours = [], hotels = [] }: TourSearchBoxProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [activeTab, setActiveTab] = useState<"tour" | "hotel">("tour");
  const [query, setQuery] = useState("");
  const [month, setMonth] = useState("");
  const [departureCity, setDepartureCity] = useState("Hà Nội");
  const [showDropdown, setShowDropdown] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sync state with URL search parameters dynamically
  useEffect(() => {
    const q = searchParams.get("q") ?? "";
    const type = searchParams.get("type") === "hotel" ? "hotel" : "tour";
    const monthParam = searchParams.get("month") ?? "";
    const fromParam = searchParams.get("from") ?? "Hà Nội";

    setQuery(q);
    setActiveTab(type);
    setMonth(monthParam);
    setDepartureCity(fromParam);
  }, [searchParams]);

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

  // Group tours and hotels by destination
  const uniqueDestinations = useMemo(() => {
    const map = new Map<string, { country: string; prices: number[]; tourCount: number; hotelCount: number }>();
    
    // Add destinations from tours
    if (tours && tours.length > 0) {
      tours.forEach((tour) => {
        if (!tour || !tour.destination) return;
        const key = tour.destination;
        const existing = map.get(key);
        if (existing) {
          existing.prices.push(tour.price);
          existing.tourCount += 1;
        } else {
          map.set(key, {
            country: tour.country || "Việt Nam",
            prices: [tour.price],
            tourCount: 1,
            hotelCount: 0
          });
        }
      });
    }
    
    // Add destinations from hotels
    if (hotels && hotels.length > 0) {
      hotels.forEach((hotel) => {
        if (!hotel || !hotel.destination) return;
        const key = hotel.destination;
        const existing = map.get(key);
        if (existing) {
          existing.hotelCount += 1;
        } else {
          map.set(key, {
            country: hotel.country || "Việt Nam",
            prices: [],
            tourCount: 0,
            hotelCount: 1
          });
        }
      });
    }

    return Array.from(map.entries())
      .map(([destination, data]) => {
        const hasTours = data.prices.length > 0;
        const minPrice = hasTours ? Math.min(...data.prices) : 0;
        return {
          destination,
          country: data.country || "Việt Nam",
          minPrice,
          tourCount: data.tourCount,
          hotelCount: data.hotelCount
        };
      })
      .sort((a, b) => a.destination.localeCompare(b.destination, "vi"));
  }, [tours, hotels]);

  // Filter destinations based on active tab and search input query
  const filteredDestinations = useMemo(() => {
    const normalized = normalizeSearch(query);
    
    // Filter by active tab first
    const tabFiltered = uniqueDestinations.filter((item) => {
      if (activeTab === "tour") return item.tourCount > 0;
      if (activeTab === "hotel") return item.hotelCount > 0;
      return true;
    });

    if (!normalized) return tabFiltered;

    return tabFiltered.filter(
      (item) =>
        normalizeSearch(item.destination).includes(normalized) ||
        normalizeSearch(item.country).includes(normalized)
    );
  }, [uniqueDestinations, query, activeTab]);

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

  // iVIVU Style Destinations Lists & Helpers
  const hotDomestic = [
    { name: "Đà Nẵng", desc: "Thành phố đáng sống" },
    { name: "Phú Quốc", desc: "Đảo Ngọc thiên đường" },
    { name: "Nha Trang", desc: "Vịnh biển thơ mộng" },
    { name: "Sapa", desc: "Thị trấn sương mù" },
    { name: "Hạ Long", desc: "Kỳ quan thiên nhiên" },
    { name: "Hội An", desc: "Phố cổ hoài niệm" },
    { name: "Vũng Tàu", desc: "Thành phố biển khang trang" },
    { name: "Hà Nội", desc: "Thủ đô nghìn năm" }
  ];

  const hotInternational = [
    { name: "Singapore", desc: "Quốc đảo sư tử" },
    { name: "Thái Lan", desc: "Xứ sở chùa Vàng" },
    { name: "Nhật Bản", desc: "Đất nước mặt trời mọc" },
    { name: "Hàn Quốc", desc: "Xứ sở Kim Chi" },
    { name: "Trung Quốc", desc: "Vùng đất huyền sử" }
  ];

  function getDestinationImage(name: string): string {
    const norm = name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
    if (norm.includes("da nang")) return "/images/da-nang.png";
    if (norm.includes("phu quoc")) return "/images/phu-quoc.png";
    if (norm.includes("nha trang")) return "/images/nha-trang.png";
    if (norm.includes("ha long") || norm.includes("vinh ha long") || norm.includes("du thuyen")) return "/images/ha-long.png";
    if (norm.includes("china") || norm.includes("trung quoc") || norm.includes("thuong hai")) return "/images/tours/china.png";
    if (norm.includes("thai") || norm.includes("bangkok")) return "/images/tours/thailand.png";
    if (norm.includes("nhat") || norm.includes("tokyo")) return "/images/tours/japan.png";
    if (norm.includes("han") || norm.includes("seoul")) return "/images/tours/japan.png";
    if (norm.includes("singapore") || norm.includes("bali") || norm.includes("malaysia")) return "/images/tours/bali.png";
    return "/images/ha-long.png";
  }

  const getDestinationStats = (name: string) => {
    const norm = name.toLowerCase();
    let tourCount = 0;
    let hotelCount = 0;
    
    tours.forEach((tour) => {
      if (
        tour.destination.toLowerCase().includes(norm) ||
        tour.country.toLowerCase().includes(norm)
      ) {
        tourCount += 1;
      }
    });
    
    hotels.forEach((hotel) => {
      if (
        hotel.destination.toLowerCase().includes(norm) ||
        hotel.country.toLowerCase().includes(norm) ||
        (norm.includes("ha long") && hotel.destination.includes("Du thuyền Hạ Long"))
      ) {
        hotelCount += 1;
      }
    });
    
    return { tourCount, hotelCount };
  };

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    params.set("type", activeTab);
    if (activeTab === "tour") {
      if (month) params.set("month", month);
      if (departureCity) params.set("from", departureCity);
    }
    router.push(`/tim-kiem-tour/?${params.toString()}`);
  }

  return (
    <form
      onSubmit={onSubmit}
      className={`rounded-2xl border border-white/18 bg-black/28 p-4 shadow-[0_24px_80px_rgba(0,0,0,0.22)] backdrop-blur-md ${className}`}
    >
      {/* Tab Switcher Menu */}
      <div className="mb-4 flex gap-1.5 border-b border-white/10 pb-3">
        <button
          type="button"
          onClick={() => {
            setActiveTab("tour");
            setQuery("");
            setShowDropdown(false);
          }}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold uppercase tracking-wide transition duration-200 ${
            activeTab === "tour"
              ? "bg-brand-gold text-brand-primary shadow-sm"
              : "text-white/70 hover:bg-white/5 hover:text-white"
          }`}
        >
          <Plane size={16} />
          TOUR DU LỊCH
        </button>
        <button
          type="button"
          onClick={() => {
            setActiveTab("hotel");
            setQuery("");
            setShowDropdown(false);
          }}
          className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-bold uppercase tracking-wide transition duration-200 ${
            activeTab === "hotel"
              ? "bg-brand-gold text-brand-primary shadow-sm"
              : "text-white/70 hover:bg-white/5 hover:text-white"
          }`}
        >
          <Hotel size={16} />
          KHÁCH SẠN
        </button>
      </div>

      <div className="relative" ref={containerRef}>
        <Search className="pointer-events-none absolute left-5 top-1/2 -translate-y-1/2 text-brand-slate" size={24} />
        <input
          className={`w-full rounded-2xl border border-white/20 bg-white pl-14 pr-5 text-brand-primary outline-none transition focus:border-brand-gold ${compact ? "h-14 text-base" : "h-16 text-lg"}`}
          placeholder={
            activeTab === "tour"
              ? "Bạn muốn đi du lịch ở đâu? Ví dụ: Thượng Hải, Nhật Bản, Đài Loan..."
              : "Tìm điểm đến hoặc tên khách sạn đối tác... Ví dụ: Sapa, Cát Cát Hill..."
          }
          value={query}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={(event) => {
            if (event.key === "Escape") {
              setShowDropdown(false);
            }
          }}
          onChange={(event) => {
            setQuery(event.target.value);
            setShowDropdown(true);
          }}
        />

        {/* Dropdown Suggestions - iVIVU Luxury Destination Grid Layout */}
        {showDropdown && (
          <div className="absolute left-0 right-0 top-full z-50 mt-2 max-h-[460px] overflow-y-auto rounded-2xl border border-brand-hairline bg-white p-5 shadow-[0_24px_80px_rgba(0,0,0,0.18)] pr-12 relative">
            <button
              type="button"
              onClick={() => setShowDropdown(false)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-brand-slate hover:bg-brand-soft hover:text-brand-primary transition z-50 bg-white shadow-sm border border-brand-hairline/60"
              title="Đóng bảng gợi ý"
            >
              <X size={16} />
            </button>
            {query === "" ? (
              /* iVIVU Style Structured Hot Grid */
              <div className="space-y-5">
                <div>
                  <div className="px-1 py-1 text-xs font-extrabold uppercase tracking-wider text-brand-slate border-b border-brand-hairline/60 pb-2">
                    🔥 Địa điểm trong nước đang HOT nhất
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                    {hotDomestic.map((item) => {
                      const stats = getDestinationStats(item.name);
                      const image = getDestinationImage(item.name);
                      const displayCount = activeTab === "tour" 
                        ? `${stats.tourCount} tour đang mở` 
                        : `${stats.hotelCount} khách sạn`;

                      return (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => {
                            setQuery(item.name);
                            setShowDropdown(false);
                            const params = new URLSearchParams();
                            params.set("q", item.name);
                            params.set("type", activeTab);
                            if (activeTab === "tour" && departureCity) {
                              params.set("from", departureCity);
                            }
                            router.push(`/tim-kiem-tour/?${params.toString()}`);
                          }}
                          className="flex items-center gap-3 rounded-xl p-2 text-left hover:bg-brand-soft transition duration-200 border border-brand-hairline/30 hover:border-brand-gold/40"
                        >
                          <img
                            src={image}
                            alt={item.name}
                            className="w-11 h-11 rounded-lg object-cover shadow-sm bg-brand-stone"
                          />
                          <div className="min-w-0">
                            <div className="font-bold text-xs text-brand-primary truncate">{item.name}</div>
                            <div className="text-[10px] text-brand-slate font-medium truncate mt-0.5">{displayCount}</div>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {activeTab === "tour" && (
                  <div>
                    <div className="px-1 py-1 text-xs font-extrabold uppercase tracking-wider text-brand-slate border-b border-brand-hairline/60 pb-2">
                      🌏 Địa điểm nước ngoài đang HOT nhất
                    </div>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-3">
                      {hotInternational.map((item) => {
                        const stats = getDestinationStats(item.name);
                        const image = getDestinationImage(item.name);
                        const displayCount = `${stats.tourCount} tour đang mở`;

                        return (
                          <button
                            key={item.name}
                            type="button"
                            onClick={() => {
                              setQuery(item.name);
                              setShowDropdown(false);
                              const params = new URLSearchParams();
                              params.set("q", item.name);
                              params.set("type", activeTab);
                              if (activeTab === "tour" && departureCity) {
                                params.set("from", departureCity);
                              }
                              router.push(`/tim-kiem-tour/?${params.toString()}`);
                            }}
                            className="flex items-center gap-3 rounded-xl p-2 text-left hover:bg-brand-soft transition duration-200 border border-brand-hairline/30 hover:border-brand-gold/40"
                          >
                            <img
                              src={image}
                              alt={item.name}
                              className="w-11 h-11 rounded-lg object-cover shadow-sm bg-brand-stone"
                            />
                            <div className="min-w-0">
                              <div className="font-bold text-xs text-brand-primary truncate">{item.name}</div>
                              <div className="text-[10px] text-brand-slate font-medium truncate mt-0.5">{displayCount}</div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            ) : filteredDestinations.length > 0 ? (
              /* Matched Search Results */
              <div>
                <div className="px-3 py-2 text-xs font-extrabold uppercase tracking-wider text-brand-slate border-b border-brand-hairline/60 mb-2">
                  📍 Kết quả tìm thấy cho "{query}"
                </div>
                <div className="grid gap-1">
                  {filteredDestinations.map((item) => {
                    const stats = getDestinationStats(item.destination);
                    const image = getDestinationImage(item.destination);
                    const displayCount = activeTab === "tour" 
                      ? `${stats.tourCount} tour đang mở` 
                      : `${stats.hotelCount} khách sạn`;

                    return (
                      <button
                        key={item.destination}
                        type="button"
                        onClick={() => {
                          setQuery(item.destination);
                          setShowDropdown(false);
                          const params = new URLSearchParams();
                          params.set("q", item.destination);
                          params.set("type", activeTab);
                          if (activeTab === "tour" && departureCity) {
                            params.set("from", departureCity);
                          }
                          router.push(`/tim-kiem-tour/?${params.toString()}`);
                        }}
                        className="flex items-center justify-between rounded-xl p-2 text-left hover:bg-brand-soft transition duration-200"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={image}
                            alt={item.destination}
                            className="w-10 h-10 rounded-lg object-cover shadow-sm"
                          />
                          <div>
                            <span className="font-bold text-sm text-brand-primary">{item.destination}</span>
                            <span className="ml-1.5 text-xs text-brand-slate">({item.country})</span>
                          </div>
                        </div>
                        <div className="text-right">
                          {activeTab === "tour" ? (
                            <>
                              {item.minPrice > 0 ? (
                                <div className="text-xs font-extrabold text-brand-goldDark">
                                  Từ {new Intl.NumberFormat("vi-VN").format(item.minPrice)}đ
                                </div>
                              ) : (
                                <div className="text-[10px] font-bold text-brand-goldDark">Giá ưu đãi</div>
                              )}
                              <div className="text-[10px] text-brand-slate mt-0.5">{displayCount}</div>
                            </>
                          ) : (
                            <>
                              <div className="text-xs font-extrabold text-brand-goldDark">Giá tốt nhất</div>
                              <div className="text-[10px] text-brand-slate mt-0.5">{displayCount}</div>
                            </>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            ) : (
              <div className="px-3 py-6 text-center text-xs font-medium text-brand-slate">
                Không tìm thấy kết quả phù hợp cho "{query}"
              </div>
            )}
          </div>
        )}
      </div>

      {activeTab === "tour" ? (
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
            Tìm tour
          </button>
        </div>
      ) : (
        <div className="mt-3 grid gap-3 md:grid-cols-[1fr_1fr_1.1fr_auto]">
          <label className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-brand-primary">
            <CalendarDays className="text-brand-slate" size={22} />
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-bold uppercase tracking-wide text-brand-slate">Tháng đặt phòng</span>
              <select
                className="mt-0.5 w-full bg-transparent text-base font-semibold outline-none"
                defaultValue=""
              >
                <option value="">Tất cả các tháng</option>
                <option value="2026-06">Tháng 6/2026</option>
                <option value="2026-07">Tháng 7/2026</option>
                <option value="2026-08">Tháng 8/2026</option>
              </select>
            </span>
          </label>

          <label className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-brand-primary">
            <MapPin className="text-brand-slate" size={22} />
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-bold uppercase tracking-wide text-brand-slate">Thời gian nghỉ</span>
              <select
                className="mt-0.5 w-full bg-transparent text-base font-semibold outline-none"
                defaultValue="2"
              >
                <option value="1">1 đêm</option>
                <option value="2">2 đêm</option>
                <option value="3">3 đêm</option>
                <option value="4">4 đêm</option>
                <option value="5+">Nhiều hơn</option>
              </select>
            </span>
          </label>

          <div className="flex items-center gap-3 rounded-2xl bg-white px-4 py-3 text-brand-primary">
            <Users className="text-brand-slate" size={22} />
            <span>
              <span className="block text-xs font-bold uppercase tracking-wide text-brand-slate">Số phòng / khách</span>
              <span className="mt-0.5 block text-base font-semibold">1 phòng, 2 người lớn</span>
            </span>
          </div>

          <button
            className="rounded-2xl bg-brand-gold px-8 py-4 text-base font-bold text-brand-primary transition hover:bg-brand-goldLight"
            type="submit"
          >
            Tìm khách sạn
          </button>
        </div>
      )}
    </form>
  );
}
