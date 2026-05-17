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
        title="Combo được duyệt để tư vấn trong ngày"
        description="Nội dung được tạo từ dữ liệu tĩnh và chỉ dùng làm gợi ý bán lead. Giá cần được kiểm tra lại trước khi giữ dịch vụ."
      />
      <section className="container-page py-16">
        {combo ? (
          <div className="space-y-4">
            <ExpiryNotice expiresAt={combo.expires_at} />
            <ComboCard combo={combo} />
            <AdminLog combo={combo} />
          </div>
        ) : (
          <div className="rounded-[22px] border border-dashed border-brand-hairline bg-white p-7 text-brand-slate">
            Chưa có combo published.
          </div>
        )}
      </section>
    </>
  );
}
