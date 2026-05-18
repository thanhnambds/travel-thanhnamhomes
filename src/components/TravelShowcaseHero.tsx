"use client";

import { useState } from "react";
import { Bookmark, Globe2, Search, UserRound } from "lucide-react";

const destinations = [
  {
    key: "phu-quoc",
    title: "Phú Quốc",
    label: "Sunset resort - Island",
    heroClass: "travel-hero-phu-quoc",
    cardClass: "travel-card-phu-quoc",
    eyebrow: "Vietnam island combo",
    headline: "PHU QUOC",
    subline: "ESCAPE",
    copy: "Resort biển, hoàng hôn và lịch trình nghỉ dưỡng được ghép cùng vé bay hợp lý. Thanh Nam kiểm tra lại giá thật qua Zalo trước khi giữ dịch vụ."
  },
  {
    key: "da-nang",
    title: "Đà Nẵng",
    label: "My Khe beach - Central",
    heroClass: "travel-hero-da-nang",
    cardClass: "travel-card-da-nang",
    eyebrow: "Central coast combo",
    headline: "DA NANG",
    subline: "ESCAPE",
    copy: "Biển Mỹ Khê, giờ bay đẹp và khách sạn thuận tiện để cân bằng nghỉ dưỡng, ẩm thực và lịch trình gia đình."
  },
  {
    key: "nha-trang",
    title: "Nha Trang",
    label: "Bay view - Coast",
    heroClass: "travel-hero-nha-trang",
    cardClass: "travel-card-nha-trang",
    eyebrow: "Bay view combo",
    headline: "NHA TRANG",
    subline: "ESCAPE",
    copy: "Vịnh biển xanh, khách sạn view cao tầng và combo linh hoạt cho nhóm bạn hoặc gia đình muốn tối ưu ngân sách."
  }
];

export function TravelShowcaseHero({ zaloUrl }: { zaloUrl: string }) {
  const [activeKey, setActiveKey] = useState(destinations[0].key);
  const active = destinations.find((item) => item.key === activeKey) ?? destinations[0];
  const activeIndex = destinations.findIndex((item) => item.key === activeKey);

  const move = (direction: -1 | 1) => {
    setActiveKey(destinations[(activeIndex + direction + destinations.length) % destinations.length].key);
  };

  return (
    <section className="home-showcase-page relative min-h-screen overflow-hidden bg-brand-black text-white">
      <div className="absolute inset-0">
        {destinations.map((item) => (
          <div
            className={`${item.heroClass} absolute inset-0 bg-cover bg-center transition-[opacity,transform,filter] duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              activeKey === item.key ? "scale-100 opacity-100 blur-0" : "scale-105 opacity-0 blur-[2px]"
            }`}
            key={item.key}
          />
        ))}
      </div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_42%_24%,rgba(255,255,255,0.18),transparent_32%),linear-gradient(90deg,rgba(0,0,0,0.56),rgba(0,0,0,0.28)_48%,rgba(0,0,0,0.18))]" />
      <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-black/24" />
      <div className="absolute inset-x-0 top-0 z-20 h-1.5 bg-brand-gold" />

      <div className="relative z-30 flex min-h-screen flex-col">
        <header className="flex items-center justify-between px-6 py-7 sm:px-10 lg:px-14">
          <a className="focus-ring flex items-center gap-4 rounded-sm text-xs font-semibold uppercase text-white" href="/">
            <Globe2 className="h-8 w-8" strokeWidth={1.8} />
            <span className="hidden sm:inline">Travel Thanh Nam</span>
          </a>
          <nav className="hidden items-center gap-10 text-xs font-semibold uppercase text-white/80 lg:flex">
            <a className="border-b-2 border-brand-gold pb-2 text-white" href="/">Home</a>
            <a className="transition hover:text-white" href="/combo-hom-nay/">Holidays</a>
            <a className="transition hover:text-white" href="/combo-du-lich/">Destinations</a>
            <a className="transition hover:text-white" href="/ve-may-bay-khach-san/">Flights</a>
            <a className="transition hover:text-white" href="/lien-he/">Contacts</a>
          </nav>
          <div className="flex items-center gap-5">
            <a className="focus-ring hidden rounded-full p-2 text-white/90 transition hover:text-white sm:inline-flex" href="/combo-du-lich/" aria-label="Tìm combo">
              <Search className="h-6 w-6" />
            </a>
            <a className="focus-ring hidden rounded-full p-2 text-white/90 transition hover:text-white sm:inline-flex" href={zaloUrl} aria-label="Tư vấn qua Zalo">
              <UserRound className="h-6 w-6" />
            </a>
            <a className="focus-ring rounded-full border border-white/45 px-4 py-2 text-xs font-semibold uppercase text-white lg:hidden" href={zaloUrl}>
              Zalo
            </a>
          </div>
        </header>

        <div className="grid flex-1 content-end gap-10 px-6 pb-8 pt-12 sm:px-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-end lg:px-14 lg:pb-12">
          <div className="max-w-2xl pb-2 lg:pb-24">
            <div className="mb-7 h-1 w-8 bg-white" />
            <p className="text-xl text-white/88 md:text-2xl">{active.eyebrow}</p>
            <h1 className="mt-4 text-[4.25rem] font-black uppercase leading-[0.84] text-white sm:text-[6rem] md:text-[8rem] lg:text-[7.8rem] xl:text-[9rem]">
              <span className="block transition-all duration-700 ease-out" key={`${active.key}-headline`}>
                {active.headline}
              </span>
              <span className="block transition-all duration-700 ease-out" key={`${active.key}-subline`}>
                {active.subline}
              </span>
            </h1>
            <p className="mt-7 max-w-xl text-sm leading-7 text-white/72 md:text-base">{active.copy}</p>
            <div className="mt-8 flex flex-wrap items-center gap-5">
              <a className="focus-ring grid h-12 w-12 place-items-center rounded-full bg-brand-gold text-brand-primary" href="/combo-hom-nay/" aria-label="Xem combo hôm nay">
                <Bookmark className="h-5 w-5 fill-current" />
              </a>
              <a className="focus-ring rounded-full border border-white/55 px-8 py-3 text-xs font-bold uppercase text-white/92 transition hover:bg-white hover:text-brand-primary" href="/combo-hom-nay/">
                Khám phá combo
              </a>
              <a className="focus-ring rounded-full border border-white/35 px-8 py-3 text-xs font-bold uppercase text-white/92 transition hover:bg-white hover:text-brand-primary" href={zaloUrl}>
                Tư vấn Zalo
              </a>
            </div>
          </div>

          <div className="min-w-0 overflow-hidden pb-2">
            <div className="flex gap-6 overflow-x-auto pb-7 pr-[12vw] lg:pr-0">
              {destinations.map((item) => (
                <HeroDestinationButton
                  active={activeKey === item.key}
                  imageClass={item.cardClass}
                  key={item.key}
                  label={item.label}
                  onClick={() => setActiveKey(item.key)}
                  title={item.title}
                />
              ))}
            </div>
            <div className="flex items-center gap-5">
              <div className="flex gap-3">
                <button
                  aria-label="Điểm đến trước"
                  className="focus-ring grid h-16 w-16 place-items-center rounded-full border border-white/55 text-3xl text-white/90 transition hover:bg-white hover:text-brand-primary"
                  onClick={() => move(-1)}
                  type="button"
                >
                  ‹
                </button>
                <button
                  aria-label="Điểm đến tiếp theo"
                  className="focus-ring grid h-16 w-16 place-items-center rounded-full border border-white/55 text-3xl text-white/90 transition hover:bg-white hover:text-brand-primary"
                  onClick={() => move(1)}
                  type="button"
                >
                  ›
                </button>
              </div>
              <div className="h-px min-w-28 flex-1 bg-white/35">
                <div
                  className="h-px bg-brand-gold transition-all duration-700 ease-out"
                  style={{ width: `${((activeIndex + 1) / destinations.length) * 100}%` }}
                />
              </div>
              <p className="min-w-14 text-right text-5xl font-black leading-none text-white">0{activeIndex + 1}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroDestinationButton({
  active,
  imageClass,
  label,
  onClick,
  title
}: {
  active: boolean;
  imageClass: string;
  label: string;
  onClick: () => void;
  title: string;
}) {
  return (
    <button
      className={`group relative h-[19rem] min-w-[230px] overflow-hidden rounded-xl bg-black/30 text-left shadow-[0_24px_55px_rgba(0,0,0,0.32)] transition duration-500 sm:min-w-[250px] lg:h-[22rem] lg:min-w-[270px] ${
        active ? "translate-y-[-10px] ring-2 ring-brand-gold ring-offset-2 ring-offset-transparent" : "opacity-[0.82] hover:-translate-y-2 hover:opacity-100"
      }`}
      onClick={onClick}
      type="button"
    >
      <div className={`${imageClass} absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/78 via-black/10 to-white/10" />
      <div className="absolute bottom-0 left-0 p-6">
        <div className="mb-5 h-0.5 w-5 bg-white/80" />
        <p className="text-sm font-medium text-white/74">{label}</p>
        <p className="mt-3 text-3xl font-black uppercase leading-[0.9] text-white">{title}</p>
      </div>
    </button>
  );
}
