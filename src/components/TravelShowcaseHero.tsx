"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Bookmark, Globe2, Search, UserRound } from "lucide-react";

type Destination = {
  key: string;
  title: string;
  label: string;
  heroClass: string;
  cardClass: string;
  eyebrow: string;
  headline: string;
  subline: string;
  copy: string;
};

const transition = { duration: 0.65, ease: [0.22, 1, 0.36, 1] } as const;
const cardTransition = { duration: 0.5, ease: [0.22, 1, 0.36, 1] } as const;

const destinations: Destination[] = [
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
  const [items, setItems] = useState(destinations);
  const active = items[0];
  const activeIndex = destinations.findIndex((item) => item.key === active.key);

  const move = (direction: -1 | 1) => {
    setItems((prev) => {
      const next = [...prev];
      if (direction === 1) {
        const first = next.shift();
        next.push(first!);
      } else {
        const last = next.pop();
        next.unshift(last!);
      }
      return next;
    });
  };

  const handleCardClick = (clickedKey: string) => {
    setItems((prev) => {
      const index = prev.findIndex((item) => item.key === clickedKey);
      const next = [...prev];
      if (index === 0) {
        const first = next.shift();
        next.push(first!);
      } else {
        const removed = next.splice(0, index);
        next.push(...removed);
      }
      return next;
    });
  };

  return (
    <section className="home-showcase-page relative min-h-screen overflow-hidden bg-brand-black text-white">
      <div className="absolute inset-0">
        {destinations.map((item) => (
          <motion.div
            className={`${item.heroClass} absolute inset-0 bg-cover bg-center will-change-[opacity,transform]`}
            animate={{
              opacity: active.key === item.key ? 1 : 0,
              scale: active.key === item.key ? 1 : 1.06,
              filter: active.key === item.key ? "blur(0px)" : "blur(2px)"
            }}
            key={item.key}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
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
          <ActiveDestinationText active={active} zaloUrl={zaloUrl} />

          <SliderContainer
            activeIndex={activeIndex}
            active={active}
            items={items}
            move={move}
            handleCardClick={handleCardClick}
          />
        </div>
      </div>
    </section>
  );
}

function ActiveDestinationText({ active, zaloUrl }: { active: Destination; zaloUrl: string }) {
  return (
    <div className="max-w-2xl pb-2 lg:pb-24">
      <AnimatePresence mode="wait">
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -26 }}
          initial={{ opacity: 0, y: 28 }}
          key={active.key}
          transition={{ ...transition, delay: 0.15 }}
        >
          <div className="mb-7 h-1 w-8 bg-white" />
          <p className="text-xl text-white/88 md:text-2xl">{active.eyebrow}</p>
          <h1 className="mt-4 text-[4.25rem] font-black uppercase leading-[0.84] text-white sm:text-[6rem] md:text-[8rem] lg:text-[7.8rem] xl:text-[9rem]">
            <span className="block">{active.headline}</span>
            <span className="block">{active.subline}</span>
          </h1>
          <p className="mt-7 max-w-xl text-sm leading-7 text-white/72 md:text-base">{active.copy}</p>
        </motion.div>
      </AnimatePresence>

      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="mt-8 flex flex-wrap items-center gap-5"
        initial={{ opacity: 0, y: 16 }}
        transition={{ ...transition, delay: 0.3 }}
      >
        <a className="focus-ring grid h-12 w-12 place-items-center rounded-full bg-brand-gold text-brand-primary" href="/combo-hom-nay/" aria-label="Xem combo hôm nay">
          <Bookmark className="h-5 w-5 fill-current" />
        </a>
        <a className="focus-ring rounded-full border border-white/55 px-8 py-3 text-xs font-bold uppercase text-white/92 transition hover:bg-white hover:text-brand-primary" href="/combo-hom-nay/">
          Khám phá combo
        </a>
        <a className="focus-ring rounded-full border border-white/35 px-8 py-3 text-xs font-bold uppercase text-white/92 transition hover:bg-white hover:text-brand-primary" href={zaloUrl}>
          Tư vấn Zalo
        </a>
      </motion.div>
    </div>
  );
}

function SliderContainer({
  activeIndex,
  active,
  items,
  move,
  handleCardClick
}: {
  activeIndex: number;
  active: Destination;
  items: Destination[];
  move: (direction: -1 | 1) => void;
  handleCardClick: (key: string) => void;
}) {
  return (
    <div className="min-w-0 overflow-hidden pb-2">
      <motion.div className="flex items-end gap-6 overflow-x-auto pb-7 pr-[12vw] lg:pr-0" layout>
        <AnimatePresence mode="popLayout">
          {items.map((item, index) => (
            <CardItem
              active={active.key === item.key}
              index={index}
              item={item}
              key={item.key}
              onClick={() => handleCardClick(item.key)}
            />
          ))}
        </AnimatePresence>
      </motion.div>
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
          <motion.div
            animate={{ width: `${((activeIndex + 1) / items.length) * 100}%` }}
            className="h-px bg-brand-gold"
            transition={transition}
          />
        </div>
        <p className="min-w-14 text-right text-5xl font-black leading-none text-white">0{activeIndex + 1}</p>
      </div>
    </div>
  );
}

function CardItem({
  active,
  index,
  item,
  onClick,
}: {
  active: boolean;
  index: number;
  item: Destination;
  onClick: () => void;
}) {
  // Create a slight opposite offset for images inside inactive cards
  // When they slide to index 0 (active), x animates to 0, creating a parallax slide.
  const parallaxX = index * 26;

  return (
    <motion.button
      animate={{ opacity: active ? 1 : 0.78, y: active ? -8 : 0 }}
      className={`group relative h-[19rem] w-[260px] shrink-0 overflow-hidden rounded-xl bg-black/30 text-left shadow-[0_24px_55px_rgba(0,0,0,0.32)] outline-none sm:h-[20rem] sm:w-[280px] lg:h-[22rem] lg:w-[300px] ${
        active ? "ring-2 ring-brand-gold ring-offset-2 ring-offset-transparent" : "hover:ring-1 hover:ring-white/40"
      }`}
      layout
      onClick={onClick}
      transition={cardTransition}
      type="button"
    >
      <motion.div
        animate={{
          scale: active ? 1.14 : 1.02,
          x: parallaxX
        }}
        className={`${item.cardClass} absolute inset-y-0 -left-10 -right-10 bg-cover bg-center will-change-transform`}
        transition={cardTransition}
      />
      <div className={`absolute inset-0 transition-colors duration-500 ${
        active ? "bg-gradient-to-t from-black/70 via-black/5 to-white/5" : "bg-gradient-to-t from-black/80 via-black/20 to-black/10"
      }`} />
      <motion.div
        animate={{ opacity: 1, y: active ? -4 : 0 }}
        className="absolute bottom-0 left-0 p-6"
        transition={{ ...cardTransition, delay: active ? 0.06 : 0 }}
      >
        <div className={`mb-5 h-0.5 w-5 transition-colors duration-500 ${active ? "bg-brand-gold" : "bg-white/60"}`} />
        <p className="text-sm font-medium text-white/74">{item.label}</p>
        <p className="mt-3 text-3xl font-black uppercase leading-[0.9] text-white">{item.title}</p>
      </motion.div>
    </motion.button>
  );
}
