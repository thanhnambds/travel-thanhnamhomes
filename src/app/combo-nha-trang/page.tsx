import { DestinationLanding } from "@/components/DestinationLanding";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Combo Nha Trang bay từ Hà Nội",
  "Combo Nha Trang vé máy bay và khách sạn, giá tham khảo, tư vấn qua Zalo Thanh Nam Homes.",
  "/combo-nha-trang/"
);

export default function NhaTrangPage() {
  return (
    <DestinationLanding
      slug="nha-trang"
      title="Combo Nha Trang bay từ Hà Nội"
      description="Gợi ý combo Nha Trang cho khách cần biển, khách sạn tiện di chuyển và ngân sách hợp lý."
    />
  );
}
