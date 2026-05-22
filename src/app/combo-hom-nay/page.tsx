import type { Metadata } from "next";
import { AdminLog } from "@/components/AdminLog";
import { ComboCard } from "@/components/ComboCard";
import { ExpiryNotice } from "@/components/ExpiryNotice";
import { PageHero } from "@/components/PageHero";
import { getDailyCombo } from "@/lib/data";

export const metadata: Metadata = {
  title: "Combo hôm nay",
  description: "Combo du lịch tham khảo được duyệt thủ công từ dữ liệu vé bay và khách sạn.",
  robots: {
    index: false,
    follow: true
  }
};

export default function TodayComboPage() {
  const combo = getDailyCombo();

  return (
    <>
      <PageHero
        eyebrow="Combo hôm nay"
        title="Ưu Đãi Đặc Quyền Trong Ngày"
        description="Tuyển tập những gói nghỉ dưỡng tinh hoa kết hợp vé máy bay và không gian lưu trú sang trọng, được các chuyên viên tuyển chọn và cập nhật mỗi ngày."
      />
      <section className="container-page py-16">
        {combo ? (
          <div className="space-y-4">
            <ExpiryNotice expiresAt={combo.expires_at} />
            <ComboCard combo={combo} />
          </div>
        ) : (
          <div className="rounded-[22px] border border-dashed border-brand-hairline bg-white p-7 text-brand-slate">
            Hiện tại các chuyên viên đang tuyển chọn những ưu đãi phòng và chặng bay tốt nhất. Quý khách vui lòng kết nối qua Zalo để nhận báo giá cá nhân hóa.
          </div>
        )}
      </section>
    </>
  );
}
