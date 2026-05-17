import { Faq } from "@/components/Faq";
import { PageHero } from "@/components/PageHero";
import { PriceNote } from "@/components/PriceNote";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Vé máy bay và khách sạn",
  "Tư vấn combo vé máy bay và khách sạn, giá tham khảo, kiểm tra lại qua Zalo.",
  "/ve-may-bay-khach-san/"
);

export default function FlightHotelPage() {
  return (
    <>
      <PageHero
        eyebrow="Vé máy bay + khách sạn"
        title="Ghép vé bay và phòng khách sạn thành combo tư vấn nhanh"
        description="Hệ thống MVP dùng dữ liệu vé mock/API đã xử lý và bảng giá khách sạn CSV để tạo gợi ý. Không expose API key ra trình duyệt."
      />
      <section className="container-page grid gap-4 py-10 md:grid-cols-3">
        {[
          ["1. Đọc dữ liệu", "Vé bay từ adapter, khách sạn từ CSV tĩnh trong repo."],
          ["2. Lọc rule", "Loại dữ liệu hết hạn, thiếu chính sách, giờ bay không phù hợp."],
          ["3. Chuyển Zalo", "Chatbot tóm tắt nhu cầu, nhân sự kiểm tra và báo giá mới nhất."]
        ].map(([title, text]) => (
          <div className="rounded-lg border border-slate-200 bg-white p-5" key={title}>
            <h2 className="text-xl font-semibold text-brand-ink">{title}</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">{text}</p>
          </div>
        ))}
      </section>
      <section className="container-page pb-10">
        <PriceNote />
      </section>
      <Faq />
    </>
  );
}
