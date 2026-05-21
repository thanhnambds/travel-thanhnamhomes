import { DestinationLanding } from "@/components/DestinationLanding";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Combo Hạ Long dịch vụ trọn gói",
  "Combo Hạ Long khách sạn và du thuyền sang trọng, giá tham khảo, tư vấn qua Zalo Thanh Nam Homes.",
  "/combo-ha-long/"
);

export default function HaLongPage() {
  return (
    <DestinationLanding
      slug="ha-long"
      title="Combo Hạ Long dịch vụ trọn gói"
      description="Gợi ý combo du thuyền 5 sao và khách sạn Hạ Long nghỉ dưỡng cao cấp dành cho gia đình, cặp đôi hoặc nhóm bạn."
    />
  );
}
