import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CalendarDays, CheckCircle2, Clock, MapPin, MessageCircle, Plane, ShieldCheck, Star, Users } from "lucide-react";
import { formatDate, formatShortDate, formatVnd, getConfig, getPublicTourById, getPublicTours } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { tourImage } from "@/lib/tour-helpers";
import type { PublicTour } from "@/lib/types";

interface TourPageProps {
  params: Promise<{
    id: string;
  }>;
}

export function generateStaticParams() {
  return getPublicTours().map((tour) => ({ id: tour.id }));
}

export async function generateMetadata({ params }: TourPageProps): Promise<Metadata> {
  const { id } = await params;
  const tour = getPublicTourById(id);

  if (!tour) {
    return {
      title: "Tour không tồn tại"
    };
  }

  const title = `${tour.title} - ${formatVnd(tour.price)}/khách`;
  const description = `${tour.title}, khởi hành từ ${tour.departure_city}, giá tham khảo ${formatVnd(tour.price)}/khách. Thanh Nam Travel kiểm tra lại chỗ và giá trước khi giữ dịch vụ.`;
  const path = `/tour/${tour.id}/`;

  return pageMetadata(title, description, path);
}

export default async function TourDetailPage({ params }: TourPageProps) {
  const config = getConfig();
  const { id } = await params;
  const tour = getPublicTourById(id);

  if (!tour) notFound();

  const image = tourImage(tour.country);
  const departures = tour.departure_dates.map((date) => ({
    start: date,
    end: getReturnDate(date, tour.duration)
  }));
  const highlights = getHighlights(tour);
  const itinerary = getItinerary(tour);
  const relatedTours = getPublicTours()
    .filter((item) => item.id !== tour.id && item.country === tour.country)
    .slice(0, 3);
  const zaloSummary = encodeURIComponent(
    `Tôi quan tâm tour ${tour.title}, ${tour.duration}, khởi hành từ ${tour.departure_city}, giá tham khảo ${formatVnd(tour.price)}/khách. Vui lòng kiểm tra giúp tình trạng chỗ và giá mới nhất.`
  );

  // Schema.org Structured Data
  const tourSchema = {
    "@context": "https://schema.org",
    "@type": "TouristTrip",
    "name": tour.title,
    "description": tour.title + ", khởi hành từ " + tour.departure_city,
    "touristType": ["Gia đình", "Cặp đôi", "Nhóm bạn"],
    "offers": {
      "@type": "Offer",
      "price": tour.price,
      "priceCurrency": "VND",
      "availability": "https://schema.org/InStock",
      "seller": {
        "@type": "Organization",
        "name": "Thanh Nam Homes Travel",
        "url": config.siteUrl
      }
    },
    "departureTime": tour.departure_dates[0],
    "duration": tour.duration,
    "provider": {
      "@type": "Organization",
      "name": "Thanh Nam Homes Travel",
      "url": config.siteUrl
    }
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(tourSchema) }}
      />
      <section className="bg-[#f7f3ea]">
        <div className="container-page py-5 text-xs font-semibold uppercase tracking-wider text-brand-slate flex items-center gap-2 flex-wrap">
          <Link href="/" className="hover:text-brand-primary transition">Trang chủ</Link>
          <span className="text-brand-goldDark">•</span>
          <span>{tour.country}</span>
          <span className="text-brand-goldDark">•</span>
          <span className="text-brand-primary font-bold line-clamp-1">{tour.title}</span>
        </div>
      </section>

      <section className="bg-[#f7f3ea] pb-10">
        <div className="container-page grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="flex flex-col justify-center">
            <span className="inline-flex w-fit items-center gap-1 rounded bg-brand-gold px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-brand-primary">
              {tour.country}
            </span>
            <h1 className="mt-4 text-3xl font-extrabold leading-snug tracking-tight text-brand-primary md:text-4xl lg:text-5xl">
              Tour {tour.title} {tour.duration}
            </h1>
            <div className="mt-5 flex flex-wrap gap-2.5 text-xs text-brand-slate">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-brand-hairline px-3 py-2 font-semibold">
                <Star size={13} className="fill-brand-gold text-brand-gold" />
                9.0 Tuyệt vời
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-brand-hairline px-3 py-2 font-semibold">
                <Plane size={13} className="text-brand-goldDark" />
                Khởi hành: {tour.departure_city}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white border border-brand-hairline px-3 py-2 font-semibold">
                <ShieldCheck size={13} className="text-brand-goldDark" />
                Mã tour: {tour.id}
              </span>
            </div>
          </div>

          <aside className="relative overflow-hidden rounded-2xl border border-white/60 p-6 shadow-soft glass-panel backdrop-blur-md flex flex-col justify-between">
            {/* Visual Gold Line accent */}
            <div className="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-brand-gold to-brand-goldDark" />
            
            <div className="mt-2">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-brand-goldDark">Giá tham khảo từ</p>
                  <p className="mt-1 text-3xl font-extrabold tracking-tight text-brand-primary md:text-4xl">{formatVnd(tour.price)}</p>
                </div>
                <p className="pb-1 text-xs font-semibold text-brand-slate">/khách</p>
              </div>
              <div className="mt-5 grid gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
                <InfoChip icon={<Clock size={15} />} label="Thời lượng" value={tour.duration} />
                <InfoChip icon={<Plane size={15} />} label="Hãng bay" value={tour.airline} />
                <InfoChip icon={<MapPin size={15} />} label="Điểm đến" value={tour.destination} />
              </div>
            </div>
            
            <div className="mt-5">
              <a
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-primary py-3.5 text-sm font-bold text-white transition duration-300 hover:bg-brand-gold hover:text-brand-primary shadow-md hover:scale-[1.02] active:scale-95"
                href={`${config.zaloUrl}?text=${zaloSummary}`}
              >
                <MessageCircle size={18} className="text-brand-gold" />
                Kiểm tra chỗ qua Zalo
              </a>
              <p className="mt-3 text-[11px] leading-5 text-brand-slate text-center">{tour.price_note}</p>
            </div>
          </aside>
        </div>
      </section>

      <section className="bg-[#f7f3ea] pb-12">
        <div className="container-page">
          <div className="relative min-h-[360px] overflow-hidden rounded-3xl md:min-h-[480px] shadow-lg group">
            <Image
              src={image}
              alt={tour.title}
              fill
              priority
              className="object-cover transition-transform duration-1000 ease-out group-hover:scale-105"
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8 text-white">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-brand-goldLight">{tour.country}</p>
              <h2 className="mt-2.5 max-w-3xl text-3xl font-extrabold tracking-tight leading-tight md:text-5xl drop-shadow">
                {tour.title}
              </h2>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page grid gap-8 py-14 lg:grid-cols-[1fr_360px]">
        <div className="space-y-10">
          <section className="rounded-2xl border border-brand-hairline bg-white p-6 md:p-8">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div>
                <p className="section-label">Lịch trình và giá tour</p>
                <h2 className="mt-3 text-3xl font-bold text-brand-primary">Chọn ngày khởi hành</h2>
              </div>
              <span className="rounded-full bg-brand-soft px-3.5 py-1.5 text-xs font-bold text-brand-goldDark border border-brand-gold/10">
                {departures.length} ngày mở bán
              </span>
            </div>
            
            <div className="mt-6 overflow-hidden rounded-2xl border border-brand-hairline/80">
              <div className="grid grid-cols-[1.1fr_1.1fr_0.9fr_1fr] bg-brand-soft/70 px-4 py-3.5 text-[10px] font-bold uppercase tracking-wider text-brand-slate border-b border-brand-hairline">
                <span>Khởi hành</span>
                <span>Ngày về</span>
                <span>Tình trạng</span>
                <span className="text-right">Giá tour</span>
              </div>
              {departures.map((item) => (
                <div
                  className="grid grid-cols-[1.1fr_1.1fr_0.9fr_1fr] border-t first:border-t-0 border-brand-hairline px-4 py-4 text-sm text-brand-primary hover:bg-brand-soft/20 transition-colors"
                  key={item.start}
                >
                  <span className="leading-snug">
                    <b className="block text-brand-goldDark font-bold">{weekday(item.start)}</b>
                    <span className="text-xs text-brand-slate font-medium">{formatDate(item.start)}</span>
                  </span>
                  <span className="leading-snug">
                    <b className="block text-brand-primary font-bold">{item.end ? weekday(item.end) : "Đang cập nhật"}</b>
                    <span className="text-xs text-brand-slate font-medium">{item.end ? formatDate(item.end) : "Liên hệ"}</span>
                  </span>
                  <span className="flex items-center">
                    <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-700 border border-amber-100/50">
                      Liên hệ giữ chỗ
                    </span>
                  </span>
                  <span className="text-right font-bold flex flex-col justify-center">
                    <span className="text-brand-primary">{formatVnd(tour.price)}</span>
                    <span className="text-[10px] text-brand-slate font-normal">/khách</span>
                  </span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-brand-hairline bg-white p-6 md:p-8">
            <p className="section-label">Điểm nổi bật tour</p>
            <div className="mt-6 grid gap-4">
              {highlights.map((item) => (
                <div className="flex gap-3 text-brand-primary" key={item}>
                  <CheckCircle2 size={18} className="mt-1 shrink-0 text-brand-goldDark" />
                  <p className="leading-7 text-sm sm:text-base">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-brand-hairline bg-white p-6 md:p-8">
            <p className="section-label">Chương trình tour</p>
            <h2 className="mt-3 text-3xl font-bold text-brand-primary">Lịch trình dự kiến</h2>
            
            <div className="relative mt-8 space-y-6 pl-10">
              {/* Vertical line indicator */}
              <div className="timeline-line" />

              {itinerary.map((day) => (
                <details className="group relative pb-2" open={day.day === 1} key={day.day}>
                  {/* Timeline dot */}
                  <div className="timeline-dot animate-pulse-subtle" />

                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 focus:outline-none select-none">
                    <div className="flex-1">
                      <span className="inline-flex items-center gap-1 rounded bg-brand-soft px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-brand-goldDark">
                        Ngày {day.day}
                      </span>
                      <h3 className="mt-2 text-lg sm:text-xl font-extrabold text-brand-primary group-hover:text-brand-goldDark transition-colors">
                        {day.title}
                      </h3>
                    </div>
                    <span className="shrink-0 rounded-full border border-brand-hairline px-3 py-1 text-xs font-bold text-brand-slate transition-all duration-300 group-open:bg-brand-primary group-open:text-white group-open:border-brand-primary">
                      {day.day === 1 ? "Đóng" : "Xem chi tiết"}
                    </span>
                  </summary>
                  <p className="mt-4 leading-8 text-brand-slate text-sm sm:text-base pl-2 border-l-2 border-brand-gold/30 animate-fade-in-up">
                    {day.description}
                  </p>
                </details>
              ))}
            </div>
          </section>

          <section className="grid gap-4 md:grid-cols-2">
            <TourPolicy title="Giá tour bao gồm" items={includedItems(tour)} />
            <TourPolicy title="Giá tour không bao gồm" items={excludedItems()} />
          </section>

          <section className="rounded-2xl border border-brand-hairline bg-white p-6 md:p-8">
            <p className="section-label">Điều khoản và lưu ý</p>
            <div className="mt-5 space-y-3 text-sm leading-7 text-brand-slate">
              <p>{tour.price_note}</p>
              {(tour.public_notes || []).map((note) => (
                <p key={note}>{note}</p>
              ))}
              <p className="border-t border-brand-hairline/60 pt-4 text-xs italic">
                Trang này trình bày thông tin hành trình từ hệ thống tour du lịch của Thanh Nam Homes Travel. Chúng tôi sẽ kiểm tra lại giá, lịch bay, tình trạng chỗ và điều kiện thanh toán với đối tác trước khi xác nhận dịch vụ cho quý khách.
              </p>
            </div>
          </section>
        </div>

        <aside className="relative overflow-hidden h-fit rounded-2xl border border-white/60 p-6 shadow-soft lg:sticky lg:top-24 glass-panel backdrop-blur-md">
          {/* Accent top border */}
          <div className="absolute left-0 right-0 top-0 h-1.5 bg-gradient-to-r from-brand-gold to-brand-goldDark" />
          
          <p className="section-label mt-2">Đặt tour ngay</p>
          <h2 className="mt-3 text-2xl font-bold text-brand-primary">Cần hỗ trợ giữ chỗ?</h2>
          <p className="mt-3 text-sm leading-6 text-brand-slate">
            Gửi nhu cầu qua Zalo để Thanh Nam kiểm tra giá thật, số chỗ còn nhận và chính sách mới nhất.
          </p>
          <div className="mt-5 rounded-2xl bg-brand-soft/80 p-4 border border-brand-hairline/40">
            <p className="text-[10px] font-bold text-brand-slate uppercase tracking-wider">Tổng giá tham khảo cho 2 người lớn</p>
            <p className="mt-1 text-3xl font-extrabold text-brand-primary tracking-tight">{formatVnd(tour.price * 2)}</p>
          </div>
          <a
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-gold px-5 py-3.5 text-sm font-bold text-brand-primary transition duration-300 hover:bg-brand-goldLight shadow-sm hover:scale-[1.02] active:scale-95"
            href={`${config.zaloUrl}?text=${zaloSummary}`}
          >
            <MessageCircle size={18} />
            Gửi yêu cầu qua Zalo
          </a>
          <div className="mt-6 border-t border-brand-hairline/60 pt-5 grid gap-3 text-sm text-brand-slate">
            <InfoLine icon={<Users size={17} />} label="Khách" value="Người lớn, trẻ em" />
            <InfoLine icon={<CalendarDays size={17} />} label="Ngày đi gần nhất" value={formatShortDate(tour.departure_dates[0])} />
          </div>
        </aside>
      </section>

      {/* Floating CTA Mobile Widget */}
      <div className="fixed bottom-0 left-0 right-0 z-50 border-t border-brand-hairline/60 bg-white/95 p-4 shadow-[0_-5px_20px_rgba(24,21,18,0.06)] backdrop-blur-md md:hidden animate-fade-in-up">
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-[9px] font-bold uppercase tracking-wider text-brand-slate">Giá tham khảo từ</p>
            <p className="text-lg font-extrabold text-brand-primary">{formatVnd(tour.price)}<span className="text-[10px] font-normal text-brand-slate">/khách</span></p>
          </div>
          <a
            className="inline-flex items-center gap-2 rounded-xl bg-brand-gold px-4 py-2.5 text-xs font-bold text-brand-primary transition-all duration-300 active:scale-95 shadow-sm"
            href={`${config.zaloUrl}?text=${zaloSummary}`}
          >
            <MessageCircle size={15} />
            Tư vấn Zalo ngay
          </a>
        </div>
      </div>

      {relatedTours.length ? (
        <section className="container-page pb-16">
          <p className="section-label">Tour liên quan</p>
          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {relatedTours.map((item) => (
              <Link className="rounded-2xl border border-brand-hairline bg-white p-5 transition hover:-translate-y-1 hover:shadow-soft" href={`/tour/${item.id}/`} key={item.id}>
                <p className="text-sm text-brand-slate">{item.airline}</p>
                <h3 className="mt-2 text-lg font-semibold text-brand-primary">{item.title}</h3>
                <p className="mt-3 text-sm text-brand-slate">{item.duration} · từ {item.departure_city}</p>
                <p className="mt-4 text-xl font-bold text-brand-goldDark">{formatVnd(item.price)}</p>
              </Link>
            ))}
          </div>
        </section>
      ) : null}
    </>
  );
}

function InfoLine({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 text-brand-goldDark">{icon}</span>
      <span>
        <span className="block text-xs uppercase tracking-wide text-brand-slate">{label}</span>
        <b className="font-semibold text-brand-primary">{value}</b>
      </span>
    </div>
  );
}

function InfoChip({ icon, label, value }: { icon: ReactNode; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-brand-hairline bg-white/65 p-3">
      <div className="flex items-center gap-2 text-brand-goldDark">
        {icon}
        <span className="text-[11px] font-bold uppercase tracking-wide text-brand-slate">{label}</span>
      </div>
      <p className="mt-1 line-clamp-2 text-sm font-semibold leading-5 text-brand-primary">{value}</p>
    </div>
  );
}

function TourPolicy({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="rounded-2xl border border-brand-hairline bg-white p-6">
      <h2 className="text-2xl font-semibold text-brand-primary">{title}</h2>
      <ul className="mt-5 space-y-3 text-sm leading-6 text-brand-slate">
        {items.map((item) => (
          <li className="flex gap-2" key={item}>
            <CheckCircle2 size={17} className="mt-0.5 shrink-0 text-brand-goldDark" />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function getHighlights(tour: PublicTour): string[] {
  return [
    `Hành trình ${tour.title} thuộc hệ thống tour du lịch đa dạng của Thanh Nam Homes Travel.`,
    `Khởi hành từ ${tour.departure_city}, phù hợp khách muốn đi theo đoàn và tối ưu chi phí.`,
    `Giá tham khảo từ ${formatVnd(tour.price)}/khách, cần kiểm tra lại trước khi giữ dịch vụ.`,
    `Thanh Nam Travel hỗ trợ lọc ngày đi, số lượng khách, trẻ em và yêu cầu riêng qua Zalo.`
  ];
}

function getItinerary(tour: PublicTour) {
  const days = parseTourDays(tour.duration) ?? 5;
  const places = tour.title.split("-").map((item) => item.trim()).filter(Boolean);

  return Array.from({ length: days }, (_, index) => {
    const day = index + 1;
    const place = places[Math.min(index, places.length - 1)] ?? tour.destination;

    if (day === 1) {
      return {
        day,
        title: `${tour.departure_city} - ${place}`,
        description: `Quý khách tập trung theo giờ hẹn, làm thủ tục khởi hành đi ${tour.destination}. Lịch bay, giờ tập trung và bữa ăn sẽ được Thanh Nam Travel kiểm tra lại theo ngày khởi hành thực tế.`
      };
    }

    if (day === days) {
      return {
        day,
        title: `${tour.destination} - ${tour.departure_city}`,
        description: "Đoàn dùng bữa theo chương trình, hoàn tất các điểm tham quan cuối cùng nếu lịch trình cho phép, sau đó di chuyển ra sân bay/cửa khẩu để trở về Việt Nam."
      };
    }

    return {
      day,
      title: `Khám phá ${place}`,
      description: `Tham quan các điểm nổi bật trong chương trình ${tour.title}. Thứ tự điểm đến có thể điều chỉnh theo thời tiết, lịch bay, điều phối đoàn và quy định từ nhà cung cấp tại thời điểm khởi hành.`
    };
  });
}

function includedItems(tour: PublicTour): string[] {
  return [
    `Vận chuyển theo chương trình, hãng/loại phương tiện: ${tour.airline}.`,
    "Khách sạn theo tiêu chuẩn chương trình tour đối tác.",
    "Các bữa ăn, vé tham quan và hướng dẫn viên theo lịch trình đã xác nhận.",
    "Bảo hiểm du lịch theo quy định của chương trình.",
    "Tư vấn và kiểm tra lại thông tin trước khi khách giữ dịch vụ."
  ];
}

function excludedItems(): string[] {
  return [
    "Chi phí cá nhân, hành lý quá cước, điện thoại, giặt ủi và chi tiêu ngoài chương trình.",
    "Phụ thu phòng đơn, phụ thu lễ/tết hoặc phụ thu phát sinh nếu nhà cung cấp áp dụng.",
    "Visa hoặc giấy tờ nhập cảnh nếu chương trình không bao gồm.",
    "Tip hướng dẫn viên/tài xế và các khoản không ghi rõ trong mục bao gồm."
  ];
}

function parseTourDays(duration: string): number | null {
  const match = duration.match(/(\d+)\s*N/i);
  return match ? Number(match[1]) : null;
}

function getReturnDate(startDate: string, duration: string): string | null {
  const days = parseTourDays(duration);
  if (!days) return null;

  const date = new Date(`${startDate}T12:00:00+07:00`);
  date.setDate(date.getDate() + days - 1);
  return date.toISOString().slice(0, 10);
}

function weekday(value: string): string {
  return new Intl.DateTimeFormat("vi-VN", { weekday: "long" }).format(new Date(`${value}T12:00:00+07:00`));
}
