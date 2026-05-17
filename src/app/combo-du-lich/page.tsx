import { ComboCard } from "@/components/ComboCard";
import { DestinationCard } from "@/components/DestinationCard";
import { Faq } from "@/components/Faq";
import { PageHero } from "@/components/PageHero";
import { PriceNote } from "@/components/PriceNote";
import { getDailyCombo } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Combo du lịch vé máy bay và khách sạn",
  "Danh sách combo du lịch tham khảo bay từ Hà Nội, khách sạn tĩnh, tư vấn chốt lead qua Zalo.",
  "/combo-du-lich/"
);

export default function ComboTravelPage() {
  const combo = getDailyCombo();

  return (
    <>
      <PageHero
        eyebrow="Combo du lịch"
        title="Combo vé máy bay và khách sạn cho khách cần tư vấn nhanh"
        description="MVP ưu tiên Phú Quốc, Đà Nẵng và Nha Trang. Dữ liệu dùng để lọc nhu cầu, không thay thế báo giá chính thức."
      />
      <section className="container-page grid gap-4 py-10 md:grid-cols-3">
        <DestinationCard href="/combo-phu-quoc/" title="Combo Phú Quốc" description="Resort, biển đảo, lịch trình nghỉ dưỡng 3N2Đ." />
        <DestinationCard href="/combo-da-nang/" title="Combo Đà Nẵng" description="Bay từ Hà Nội, khách sạn gần biển hoặc trung tâm." />
        <DestinationCard href="/combo-nha-trang/" title="Combo Nha Trang" description="Khách sạn biển, phù hợp gia đình và nhóm bạn." />
      </section>
      {combo && (
        <section className="container-page pb-10">
          <ComboCard combo={combo} />
        </section>
      )}
      <section className="container-page pb-10">
        <PriceNote />
      </section>
      <Faq />
    </>
  );
}
