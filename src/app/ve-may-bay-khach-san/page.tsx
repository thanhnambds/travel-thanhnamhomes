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
      <section className="container-page grid gap-0 border-y border-brand-hairline py-16 md:grid-cols-3">
        {[
          ["1. Đọc dữ liệu", "Vé bay từ adapter, khách sạn từ CSV tĩnh trong repo."],
          ["2. Lọc rule", "Loại dữ liệu hết hạn, thiếu chính sách, giờ bay không phù hợp."],
          ["3. Chuyển Zalo", "Chatbot tóm tắt nhu cầu, nhân sự kiểm tra và báo giá mới nhất."]
        ].map(([title, text]) => (
          <div className="border-brand-hairline bg-white p-6 md:border-r last:md:border-r-0" key={title}>
            <h2 className="text-3xl font-normal text-brand-primary">{title}</h2>
            <p className="mt-5 text-sm leading-6 text-brand-slate">{text}</p>
          </div>
        ))}
      </section>
      <section className="container-page py-16">
        <PriceNote />
      </section>
      <Faq />
    </>
  );
}
