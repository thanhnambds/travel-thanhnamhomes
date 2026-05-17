import { DestinationLanding } from "@/components/DestinationLanding";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Combo Phú Quốc bay từ Hà Nội",
  "Combo Phú Quốc vé máy bay và khách sạn, giá tham khảo, tư vấn qua Zalo Thanh Nam Homes.",
  "/combo-phu-quoc/"
);

export default function PhuQuocPage() {
  return (
    <DestinationLanding
      slug="phu-quoc"
      title="Combo Phú Quốc bay từ Hà Nội"
      description="Gợi ý combo Phú Quốc 3N2Đ cho gia đình, cặp đôi hoặc nhóm bạn, ưu tiên khách sạn từ 3 sao và điều kiện giá rõ ràng."
    />
  );
}
