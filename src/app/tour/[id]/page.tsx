import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { CalendarDays, CheckCircle2, Clock, MapPin, MessageCircle, Plane, ShieldCheck, Star, Users } from "lucide-react";
import { formatDate, formatShortDate, formatVnd, getConfig, getPublicTourById, getPublicTours } from "@/lib/data";
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

  return {
    title: `${tour.title} - ${formatVnd(tour.price)}/khách`,
    description: `${tour.title}, khởi hành từ ${tour.departure_city}, giá tham khảo ${formatVnd(tour.price)}/khách. Thanh Nam Travel kiểm tra lại chỗ và giá trước khi giữ dịch vụ.`
  };
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

  return (
    <>
      <section className="bg-white">
        <div className="container-page py-6 text-sm text-brand-slate">
          <Link href="/" className="hover:text-brand-primary">Trang chủ</Link>
          <span className="px-2">/</span>
          <span>{tour.country}</span>
          <span className="px-2">/</span>
          <span className="text-brand-primary">{tour.title}</span>
        </div>
      </section>

      <section className="bg-white pb-10">
        <div className="container-page grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div>
            <p className="section-label">{tour.country}</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight tracking-[-0.02em] text-brand-primary md:text-5xl">
              Tour {tour.title} {tour.duration}
            </h1>
            <div className="mt-5 flex flex-wrap gap-3 text-sm text-brand-slate">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-2">
                <Star size={15} className="fill-brand-gold text-brand-gold" />
                9.0 Tuyệt vời
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-2">
                <Plane size={15} />
                Khởi hành từ: {tour.departure_city}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-soft px-3 py-2">
                <ShieldCheck size={15} />
                Mã tour: {tour.id}
              </span>
            </div>
          </div>

          <aside className="rounded-2xl border border-brand-hairline bg-brand-soft p-5">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-brand-goldDark">Giá tham khảo từ</p>
                <p className="mt-1 text-3xl font-bold tracking-[-0.02em] text-brand-primary md:text-4xl">{formatVnd(tour.price)}</p>
              </div>
              <p className="pb-1 text-sm font-semibold text-brand-slate">/khách</p>
            </div>
            <div className="mt-5 grid gap-2 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <InfoChip icon={<Clock size={16} />} label="Thời lượng" value={tour.duration} />
              <InfoChip icon={<Plane size={16} />} label="Hàng không" value={tour.airline} />
              <InfoChip icon={<MapPin size={16} />} label="Điểm đến" value={tour.destination} />
            </div>
            <a
              className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-primary px-5 py-3 text-sm font-bold text-white transition hover:bg-black"
              href={`${config.zaloUrl}?text=${zaloSummary}`}
            >
              <MessageCircle size={18} />
              Kiểm tra chỗ qua Zalo
            </a>
            <p className="mt-3 text-xs leading-5 text-brand-slate">{tour.price_note}</p>
          </aside>
        </div>
      </section>

      <section className="bg-white pb-12">
        <div className="container-page">
          <div className="relative min-h-[320px] overflow-hidden rounded-2xl md:min-h-[460px]">
            <Image src={image} alt={tour.title} fill priority className="object-cover" sizes="100vw" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/65 via-black/10 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-white/75">{tour.country}</p>
              <h2 className="mt-2 max-w-3xl text-3xl font-semibold md:text-5xl">{tour.title}</h2>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page grid gap-8 py-14 lg:grid-cols-[1fr_360px]">
        <div className="space-y-10">
          <section className="rounded-2xl border border-brand-hairline bg-white p-6 md:p-8">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="section-label">Lịch trình và giá tour</p>
                <h2 className="mt-3 text-3xl font-semibold text-brand-primary">Chọn ngày khởi hành</h2>
              </div>
              <span className="hidden rounded-full bg-brand-soft px-4 py-2 text-sm font-semibold text-brand-primary md:inline-flex">
                {departures.length} ngày mở bán
              </span>
            </div>
            <div className="mt-6 overflow-hidden rounded-2xl border border-brand-hairline">
              <div className="grid grid-cols-[1.1fr_1.1fr_0.9fr_1fr] bg-brand-soft px-4 py-3 text-xs font-bold uppercase tracking-wide text-brand-slate">
                <span>Khởi hành</span>
                <span>Ngày về</span>
                <span>Tình trạng</span>
                <span className="text-right">Giá tour</span>
              </div>
              {departures.map((item) => (
                <div className="grid grid-cols-[1.1fr_1.1fr_0.9fr_1fr] border-t border-brand-hairline px-4 py-4 text-sm text-brand-primary" key={item.start}>
                  <span>
                    <b className="block">{weekday(item.start)}</b>
                    {formatDate(item.start)}
                  </span>
                  <span>
                    <b className="block">{item.end ? weekday(item.end) : "Đang cập nhật"}</b>
                    {item.end ? formatDate(item.end) : "Liên hệ"}
                  </span>
                  <span className="font-semibold text-brand-goldDark">Liên hệ</span>
                  <span className="text-right font-bold">{formatVnd(tour.price)}/khách</span>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-brand-hairline bg-white p-6 md:p-8">
            <p className="section-label">Điểm nổi bật tour</p>
            <div className="mt-6 grid gap-4">
              {highlights.map((item) => (
                <div className="flex gap-3 text-brand-primary" key={item}>
                  <CheckCircle2 size={20} className="mt-0.5 shrink-0 text-brand-goldDark" />
                  <p className="leading-7">{item}</p>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-2xl border border-brand-hairline bg-white p-6 md:p-8">
            <p className="section-label">Chương trình tour</p>
            <h2 className="mt-3 text-3xl font-semibold text-brand-primary">Lịch trình dự kiến</h2>
            <div className="mt-6 divide-y divide-brand-hairline">
              {itinerary.map((day) => (
                <details className="group py-4" open={day.day === 1} key={day.day}>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                    <div>
                      <p className="text-sm font-bold text-brand-goldDark">Ngày {day.day}</p>
                      <h3 className="mt-1 text-xl font-semibold text-brand-primary">{day.title}</h3>
                    </div>
                    <span className="rounded-full border border-brand-hairline px-3 py-1 text-sm text-brand-slate group-open:bg-brand-soft">Xem</span>
                  </summary>
                  <p className="mt-4 leading-7 text-brand-slate">{day.description}</p>
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
              {tour.public_notes.map((note) => (
                <p key={note}>{note}</p>
              ))}
              <p>Trang này trình bày dữ liệu tour đã duyệt trên website. Thanh Nam Travel sẽ kiểm tra lại giá, lịch bay, tình trạng chỗ và điều kiện thanh toán với đối tác trước khi xác nhận dịch vụ.</p>
            </div>
          </section>
        </div>

        <aside className="h-fit rounded-2xl border border-brand-hairline bg-white p-6 shadow-soft lg:sticky lg:top-24">
          <p className="section-label">Đặt tour ngay</p>
          <h2 className="mt-3 text-2xl font-semibold text-brand-primary">Cần hỗ trợ giữ chỗ?</h2>
          <p className="mt-3 text-sm leading-6 text-brand-slate">
            Gửi nhu cầu qua Zalo để Thanh Nam kiểm tra giá thật, số chỗ còn nhận và chính sách mới nhất.
          </p>
          <div className="mt-5 rounded-2xl bg-brand-soft p-4">
            <p className="text-sm text-brand-slate">Tổng giá tham khảo cho 2 người lớn</p>
            <p className="mt-1 text-3xl font-bold text-brand-primary">{formatVnd(tour.price * 2)}</p>
          </div>
          <a
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-brand-gold px-5 py-3 text-sm font-bold text-brand-primary transition hover:bg-brand-gold/80"
            href={`${config.zaloUrl}?text=${zaloSummary}`}
          >
            <MessageCircle size={18} />
            Gửi yêu cầu qua Zalo
          </a>
          <div className="mt-5 grid gap-3 text-sm text-brand-slate">
            <InfoLine icon={<Users size={17} />} label="Khách" value="Người lớn, trẻ em" />
            <InfoLine icon={<CalendarDays size={17} />} label="Ngày đi gần nhất" value={formatShortDate(tour.departure_dates[0])} />
          </div>
        </aside>
      </section>

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
    `Hành trình ${tour.title} được chọn từ dữ liệu tour đối tác đã duyệt.`,
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
