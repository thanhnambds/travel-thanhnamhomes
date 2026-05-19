import Link from "next/link";
import { CalendarDays, ExternalLink, Plane } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { PriceNote } from "@/components/PriceNote";
import { formatShortDate, formatVnd, getPublicTours } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Tour Trung Quốc đã duyệt",
  "Danh sách tour Trung Quốc đang mở bán, chỉ hiển thị dữ liệu đã được Thanh Nam duyệt trước khi chatbot tư vấn.",
  "/tour-trung-quoc/"
);

export default function ChinaToursPage() {
  const tours = getPublicTours().filter((tour) => tour.country === "Trung Quốc");

  return (
    <>
      <PageHero
        eyebrow="Tour Đã Duyệt"
        title="Tour Trung Quốc đang mở bán"
        description="Danh sách tour đã được lọc từ bảng giá đối tác và duyệt thủ công trước khi hiển thị cho khách."
      />
      <section className="container-page grid gap-5 py-16 lg:grid-cols-2">
        {tours.map((tour) => (
          <article className="rounded-[22px] border border-brand-hairline bg-white p-6 shadow-soft" key={tour.id}>
            <p className="section-label text-brand-goldDark">{tour.destination}</p>
            <h2 className="mt-3 text-3xl font-semibold leading-tight text-brand-primary">{tour.title}</h2>
            <div className="mt-6 grid gap-3 text-sm text-brand-ink sm:grid-cols-3">
              <div className="rounded-lg border border-brand-hairline bg-brand-stone p-3">
                <CalendarDays className="mb-2 text-brand-goldDark" size={18} />
                <p className="font-medium">Khởi hành</p>
                <p className="mt-1 text-brand-slate">{tour.departure_dates.map(formatShortDate).join(", ")}</p>
              </div>
              <div className="rounded-lg border border-brand-hairline bg-brand-stone p-3">
                <Plane className="mb-2 text-brand-goldDark" size={18} />
                <p className="font-medium">Hãng bay</p>
                <p className="mt-1 text-brand-slate">{tour.airline}</p>
              </div>
              <div className="rounded-lg border border-brand-hairline bg-brand-stone p-3">
                <p className="text-2xl font-semibold text-brand-primary">{tour.duration}</p>
                <p className="mt-1 text-brand-slate">Thời gian</p>
              </div>
            </div>
            <div className="mt-6 rounded-xl bg-brand-primary p-5 text-white">
              <p className="text-sm text-brand-muted">Giá tham khảo từ</p>
              <p className="mt-1 text-4xl font-semibold">{formatVnd(tour.price)}/người</p>
              <p className="mt-3 text-xs leading-5 text-brand-muted">{tour.price_note}</p>
            </div>
            <div className="mt-5 flex flex-wrap gap-3">
              <a className="btn-brand-gold inline-flex items-center gap-2" href={tour.program_url} target="_blank" rel="noreferrer">
                Xem lịch trình
                <ExternalLink size={16} />
              </a>
              <Link className="btn-hero-outline text-brand-primary" href="/lien-he/">
                Tư vấn qua Zalo
              </Link>
            </div>
          </article>
        ))}
      </section>
      <section className="container-page pb-16">
        <PriceNote />
      </section>
    </>
  );
}
