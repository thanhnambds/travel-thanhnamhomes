import type { ReactNode } from "react";
import { ClipboardCheck, MessageCircle, Plane } from "lucide-react";
import { ComboCard } from "@/components/ComboCard";
import { DestinationCard } from "@/components/DestinationCard";
import { PriceNote } from "@/components/PriceNote";
import { getConfig, getDailyCombo } from "@/lib/data";

export default function HomePage() {
  const config = getConfig();
  const combo = getDailyCombo();

  return (
    <>
      <TravelHero zaloUrl={config.zaloUrl} />

      <section className="container-page py-20">
        <p className="mx-auto max-w-2xl text-center text-sm font-medium uppercase tracking-wider text-brand-coral">
          Hệ sinh thái dịch vụ & Phong cách sống cao cấp
        </p>
        <div className="mt-10 grid gap-0 border-y border-brand-hairline md:grid-cols-3">
          <Info
            icon={<Plane size={22} />}
            title="Tối ưu chặng bay"
            text="Hệ thống tự động đồng bộ giờ bay đẹp nhất từ các hãng hàng không hàng đầu, khớp mượt mà với thời gian nhận phòng của bạn."
          />
          <Info
            icon={<ClipboardCheck size={22} />}
            title="Thẩm định chuẩn gu"
            text="Mọi combo được đề xuất đều qua bộ lọc thẩm định khắt khe của anh Thanh Nam, đảm bảo không gian lưu trú tinh tế và đẳng cấp."
          />
          <Info
            icon={<MessageCircle size={22} />}
            title="Trợ lý AI thấu cảm"
            text="Trò chuyện tự nhiên, tinh chỉnh mọi chi tiết xung quanh chuyến đi (hành lý, nâng hạng phòng, chính sách trẻ em) một cách tức thì."
          />
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <p className="mono-label text-sm uppercase text-brand-coral">Today's curated offer</p>
            <h2 className="display-type mt-4 text-5xl leading-none text-brand-primary md:text-6xl">Combo được chọn cho hôm nay</h2>
            <p className="mt-6 text-brand-slate">
              Dữ liệu được tạo từ bảng giá phòng và nguồn vé bay tham khảo. Thanh Nam kiểm tra lại trước khi giữ dịch vụ.
            </p>
          </div>
          <div className="rounded-[22px] bg-brand-greenWash p-6">
            {combo ? <ComboCard combo={combo} compact /> : <EmptyCombo />}
          </div>
        </div>
      </section>

      <section className="bg-brand-green py-20 text-white">
        <div className="container-page">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="mono-label text-sm uppercase text-brand-softCoral">Curated Destinations</p>
              <h2 className="display-type mt-4 text-5xl leading-none md:text-6xl">Điểm đến tinh hoa</h2>
              <p className="mt-5 max-w-xl text-brand-muted">
                Khám phá những vùng biển thiên đường với rổ quỹ phòng đối tác giá tốt nhất mùa hè này.
              </p>
            </div>
            <Link className="hidden text-sm font-medium text-white underline underline-offset-4 md:inline" href="/combo-du-lich/">
              Xem tất cả điểm đến
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <DestinationCard
              href="/combo-phu-quoc/"
              title="Combo Phú Quốc"
              description="Đảo ngọc thiên đường, resort nghỉ dưỡng biệt lập cao cấp, điểm hẹn hoàn hảo cho gia đình thượng lưu."
            />
            <DestinationCard
              href="/combo-da-nang/"
              title="Combo Đà Nẵng"
              description="Khung giờ bay hoàng đạo, hệ thống khách sạn mặt biển Mỹ Khê hoặc resort bán đảo Sơn Trà đẳng cấp."
            />
            <DestinationCard
              href="/combo-nha-trang/"
              title="Combo Nha Trang"
              description="Vịnh biển thiên đường, khách sạn tầng cao view trọn vịnh, tích hợp dịch vụ đưa đón sân bay đặc quyền."
            />
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <PriceNote />
      </section>
    </>
  );
}

function TravelHero({ zaloUrl }: { zaloUrl: string }) {
  const cards = [
    {
      title: "Phú Quốc",
      label: "Sunset resort",
      href: "/combo-phu-quoc/",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Đà Nẵng",
      label: "My Khe beach",
      href: "/combo-da-nang/",
      image: "https://images.unsplash.com/photo-1559592413-7cec4d0cae2b?auto=format&fit=crop&w=600&q=80"
    },
    {
      title: "Nha Trang",
      label: "Bay view",
      href: "/combo-nha-trang/",
      image: "https://images.unsplash.com/photo-1540541338287-41700207dee6?auto=format&fit=crop&w=600&q=80"
    }
  ];

  return (
    <section className="bg-[#b7b7b7] px-4 py-8 md:px-10 md:py-14">
      <div
        className="relative mx-auto min-h-[720px] max-w-[1480px] overflow-hidden rounded-none bg-cover bg-center text-white shadow-[0_35px_80px_rgba(0,0,0,0.28)]"
        style={{
          backgroundImage:
            "linear-gradient(90deg, rgba(0,0,0,0.56), rgba(0,0,0,0.18) 48%, rgba(0,0,0,0.10)), url('https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1800&q=85')"
        }}
      >
        <div className="absolute left-0 top-0 h-1 w-1/2 bg-[#f8bf2c]" />
        <div className="absolute inset-x-0 top-0 z-10 flex items-center justify-between px-7 py-7 md:px-10">
          <a className="focus-ring flex items-center gap-3 rounded-sm text-xs font-semibold uppercase tracking-[0.28em]" href="/">
            <span className="grid h-7 w-7 place-items-center rounded-full border border-white/80 text-base">◎</span>
            Travel Thanh Nam
          </a>
          <nav className="hidden items-center gap-9 text-xs font-semibold uppercase tracking-[0.14em] text-white/85 lg:flex">
            <a className="border-b border-[#f8bf2c] pb-1 text-white" href="/">Home</a>
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
            <p className="text-lg text-white/90">Vietnam Luxury Combo</p>
            <h1 className="mt-3 max-w-xl text-6xl font-semibold uppercase leading-[0.92] tracking-tight md:text-8xl">
              AI Travel Escape
            </h1>
            <p className="mt-7 max-w-md text-sm leading-6 text-white/75">
              Thiết kế combo vé bay và khách sạn theo gu nghỉ dưỡng của bạn. Gợi ý nhanh, kiểm tra lại giá thật qua Zalo
              trước khi giữ dịch vụ.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a className="focus-ring rounded-full bg-[#f8bf2c] px-4 py-3 text-sm font-semibold text-brand-primary" href="/combo-hom-nay/">
                Khám phá combo
              </a>
              <a className="focus-ring rounded-full border border-white/60 px-6 py-3 text-xs font-semibold uppercase tracking-[0.12em]" href={zaloUrl}>
                Tư vấn Zalo
              </a>
            </div>
          </div>

          <div className="overflow-hidden">
            <div className="flex gap-6 overflow-x-auto pb-6">
              {cards.map((card) => (
                <a
                  className="group relative h-72 min-w-[210px] overflow-hidden rounded-lg bg-black/30 shadow-[0_20px_40px_rgba(0,0,0,0.30)]"
                  href={card.href}
                  key={card.title}
                >
                  <div
                    aria-label={card.title}
                    className="absolute inset-0 bg-cover bg-center transition duration-500 group-hover:scale-105"
                    role="img"
                    style={{ backgroundImage: `url(${card.image})` }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 p-5">
                    <p className="text-xs text-white/70">{card.label}</p>
                    <p className="mt-2 text-2xl font-semibold uppercase leading-none">{card.title}</p>
                  </div>
                </a>
              ))}
            </div>
            <div className="flex items-center gap-5">
              <div className="flex gap-3">
                <span className="grid h-14 w-14 place-items-center rounded-full border border-white/55 text-2xl">‹</span>
                <span className="grid h-14 w-14 place-items-center rounded-full border border-white/55 text-2xl">›</span>
              </div>
              <div className="h-px flex-1 bg-white/35">
                <div className="h-px w-1/3 bg-[#f8bf2c]" />
              </div>
              <p className="text-5xl font-semibold leading-none">03</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Info({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="border-brand-hairline bg-white p-6 md:border-r last:md:border-r-0">
      <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-full border border-brand-hairline text-brand-primary">{icon}</div>
      <h3 className="text-2xl font-normal text-brand-ink">{title}</h3>
      <p className="mt-4 text-sm leading-6 text-brand-slate">{text}</p>
    </div>
  );
}

function EmptyCombo() {
  return (
    <div className="rounded-[22px] border border-dashed border-brand-hairline bg-white p-6 text-center text-brand-slate">
      Hệ thống đang cập nhật quỹ phòng và chặng bay HOT nhất trong ngày. Vui lòng bấm Chat Zalo để nhận thiết kế combo
      ngay lập tức!
    </div>
  );
}
