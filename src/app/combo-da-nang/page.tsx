import { DestinationLanding } from "@/components/DestinationLanding";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Combo Đà Nẵng bay từ Hà Nội",
  "Combo Đà Nẵng vé máy bay và khách sạn, giá tham khảo, tư vấn qua Zalo Thanh Nam Homes.",
  "/combo-da-nang/"
);

export default function DaNangPage() {
  return (
    <DestinationLanding
      slug="da-nang"
      title="Combo Đà Nẵng bay từ Hà Nội"
      description="Gợi ý combo Đà Nẵng 3N2Đ với giờ bay hợp lý, khách sạn trung tâm hoặc gần biển, phù hợp gia đình và cặp đôi."
    />
  );
}
