import { ComboCard } from "@/components/ComboCard";
import { DestinationCard } from "@/components/DestinationCard";
import { Faq } from "@/components/Faq";
import { PageHero } from "@/components/PageHero";
import { PriceNote } from "@/components/PriceNote";
import { getDailyCombo } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Dịch vụ du lịch và nghỉ dưỡng",
  "Thanh Nam Travel cung cấp dịch vụ thiết kế tour, combo vé máy bay và khách sạn đẳng cấp.",
  "/dich-vu/"
);

export default function ServicesPage() {
  const combo = getDailyCombo();

  return (
    <>
      <PageHero
        eyebrow="Dịch Vụ Nghỉ Dưỡng"
        title="Thiết kế lộ trình du lịch và nghỉ dưỡng độc bản"
        description="Khám phá các điểm đến thiên đường như Phú Quốc, Đà Nẵng và Nha Trang với dịch vụ tư vấn chuyên nghiệp, tận tâm từ Thanh Nam Travel."
      />
      <section className="container-page grid gap-4 py-16 sm:grid-cols-2 lg:grid-cols-4">
        <DestinationCard href="/combo-phu-quoc/" title="Phú Quốc" description="Tuyệt tác đảo Ngọc xanh mát. Trải nghiệm không gian nghỉ dưỡng biệt lập, riêng tư." image="/images/phu-quoc.png" />
        <DestinationCard href="/combo-da-nang/" title="Đà Nẵng" description="Thành phố hiện đại với tầm nhìn panorama ôm trọn biển Mỹ Khê tuyệt đẹp." image="/images/da-nang.png" />
        <DestinationCard href="/combo-nha-trang/" title="Nha Trang" description="Viên ngọc bích của biển Đông với các khách sạn sang trọng bậc nhất." image="/images/nha-trang.png" />
        <DestinationCard href="/combo-ha-long/" title="Hạ Long" description="Kỳ quan thiên nhiên thế giới. Trải nghiệm hải trình đẳng cấp trên du thuyền." image="/images/ha-long.png" />
      </section>
      {combo && (
        <section className="container-page pb-16">
          <ComboCard combo={combo} />
        </section>
      )}
      <section className="container-page pb-16">
        <PriceNote />
      </section>
      <Faq />
    </>
  );
}
