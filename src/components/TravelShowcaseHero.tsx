"use client";

import { useState } from "react";

const destinations = [
  {
    key: "phu-quoc",
    title: "Phú Quốc",
    label: "Sunset resort",
    heroClass: "travel-hero-phu-quoc",
    cardClass: "travel-card-phu-quoc",
    eyebrow: "Island luxury combo",
    headline: "PHU QUOC ESCAPE",
    copy: "Resort biển, hoàng hôn và lịch trình nghỉ dưỡng được ghép cùng vé bay hợp lý cho gia đình cần kỳ nghỉ riêng tư."
  },
  {
    key: "da-nang",
    title: "Đà Nẵng",
    label: "My Khe beach",
    heroClass: "travel-hero-da-nang",
    cardClass: "travel-card-da-nang",
    eyebrow: "Central coast combo",
    headline: "DA NANG ESCAPE",
    copy: "Biển Mỹ Khê, giờ bay đẹp và khách sạn thuận tiện để cân bằng nghỉ dưỡng, ẩm thực và lịch trình gia đình."
  },
  {
    key: "nha-trang",
    title: "Nha Trang",
    label: "Bay view",
    heroClass: "travel-hero-nha-trang",
    cardClass: "travel-card-nha-trang",
    eyebrow: "Bay view combo",
    headline: "NHA TRANG ESCAPE",
    copy: "Vịnh biển xanh, khách sạn view cao tầng và combo linh hoạt cho nhóm bạn hoặc gia đình muốn tối ưu ngân sách."
  }
];

export function TravelShowcaseHero({ zaloUrl }: { zaloUrl: string }) {
  const [activeKey, setActiveKey] = useState(destinations[0].key);
  const active = destinations.find((item) => item.key === activeKey) ?? destinations[0];

  return (
    <section className="bg-brand-videoGray px-4 py-8 md:px-10 md:py-14">
      <div
        className={`${active.heroClass} relative mx-auto min-h-[720px] max-w-[1480px] overflow-hidden bg-cover bg-center text-white shadow-2xl transition-[background-image] duration-500`}
      >
        <div className="absolute left-0 top-0 h-1 w-1/2 bg-brand-gold" />
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-7 py-7 md:px-10">
          <a className="focus-ring flex items-center gap-3 rounded-sm text-xs font-semibold uppercase tracking-[0.28em]" href="/">
            <span className="grid h-7 w-7 place-items-center rounded-full border border-white/80 text-base">◎</span>
            Travel Thanh Nam
          </a>
          <nav className="hidden items-center gap-9 text-xs font-semibold uppercase tracking-[0.14em] text-white/85 lg:flex">
            <a className="border-b border-brand-gold pb-1 text-white" href="/">Home</a>
            <a href="/combo-hom-nay/">Combo</a>
            <a href="/combo-du-lich/">Destinations</a>
            <a href="/ve-may-bay-khach-san/">Flights</a>
            <a href="/lien-he/">Contact</a>
          </nav>
          <a className="focus-ring rounded-full border border-white/50 px-5 py-2 text-xs font-semibold uppercase tracking-[0.14em]" href={zaloUrl}>
            Zalo
          </a>
        </div>

        <div className="relative z-10 grid min-h-[720px] content-end gap-10 px-7 pb-14 pt-32 md:px-14 lg:grid-cols-[0.82fr_1.18fr] lg:items-end">
          <div className="pb-8">
            <div className="mb-5 h-1 w-6 bg-white" />
            <p className="text-lg text-white/90">{active.eyebrow}</p>
            <h1 className="mt-3 max-w-xl text-6xl font-semibold uppercase leading-[0.92] tracking-tight md:text-8xl">
              {active.headline}
            </h1>
            <p className="mt-7 max-w-md text-sm leading-6 text-white/75">{active.copy}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a className="focus-ring rounded-full bg-brand-gold px-4 py-3 text-sm font-semibold text-brand-primary" href="/combo-hom-nay/">
                Khám phá combo
              </a>
              <a className="focus-ring rounded-full border border-white/60 px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em]" href={zaloUrl}>
                Tư vấn Zalo
              </a>
            </div>
          </div>

          <div className="overflow-hidden">
            <div className="flex gap-6 overflow-x-auto pb-6">
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
                  className="grid h-14 w-14 place-items-center rounded-full border border-white/55 text-2xl"
                  onClick={() => {
                    const index = destinations.findIndex((item) => item.key === activeKey);
                    setActiveKey(destinations[(index + destinations.length - 1) % destinations.length].key);
                  }}
                  type="button"
                >
                  ‹
                </button>
                <button
                  aria-label="Điểm đến tiếp theo"
                  className="grid h-14 w-14 place-items-center rounded-full border border-white/55 text-2xl"
                  onClick={() => {
                    const index = destinations.findIndex((item) => item.key === activeKey);
                    setActiveKey(destinations[(index + 1) % destinations.length].key);
                  }}
                  type="button"
                >
                  ›
                </button>
              </div>
              <div className="h-px flex-1 bg-white/35">
                <div className="h-px bg-brand-gold transition-all" style={{ width: `${((destinations.findIndex((item) => item.key === activeKey) + 1) / destinations.length) * 100}%` }} />
              </div>
              <p className="text-5xl font-semibold leading-none">0{destinations.findIndex((item) => item.key === activeKey) + 1}</p>
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
      className={`group relative h-72 min-w-[210px] overflow-hidden rounded-lg bg-black/30 text-left shadow-2xl transition ${
        active ? "ring-2 ring-brand-gold ring-offset-2 ring-offset-transparent" : "opacity-85 hover:opacity-100"
      }`}
      onClick={onClick}
      type="button"
    >
      <div className={`${imageClass} absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105`} />
      <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
      <div className="absolute bottom-0 left-0 p-5">
        <p className="text-xs text-white/70">{label}</p>
        <p className="mt-2 text-2xl font-semibold uppercase leading-none text-white">{title}</p>
      </div>
    </button>
  );
}
