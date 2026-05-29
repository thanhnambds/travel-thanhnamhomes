import type { Metadata } from "next";
import { AdminLog } from "@/components/AdminLog";
import { ComboCard } from "@/components/ComboCard";
import { ExpiryNotice } from "@/components/ExpiryNotice";
import { PageHero } from "@/components/PageHero";
import { getDailyCombo, getConfig } from "@/lib/data";
import { TravelAIChatWidget } from "@/components/TravelAIChatWidget";

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
  const config = getConfig();

  return (
    <>
      <PageHero
        eyebrow="Combo hôm nay"
        title="Ưu Đãi Đặc Quyền Trong Ngày"
        description="Tuyển tập những gói nghỉ dưỡng tinh hoa kết hợp vé máy bay và không gian lưu trú sang trọng, được các chuyên viên tuyển chọn và cập nhật mỗi ngày."
      />
      <section className="container-page py-16">
        {combo ? (
          <div className="space-y-6 max-w-3xl mx-auto">
            <ExpiryNotice expiresAt={combo.expires_at} />
            <ComboCard combo={combo} />
            <div className="pt-4 border-t border-brand-hairline">
              <p className="text-xs text-brand-slate mb-3 text-center">
                🤖 Anh/chị có câu hỏi về lịch trình hay muốn tính giá cho đoàn đông? Trò chuyện ngay với trợ lý AI:
              </p>
              <TravelAIChatWidget
                productId={combo.combo_id}
                productType="combo"
                productTitle={combo.title}
                initialPrice={combo.total_price}
                zaloUrl={config.zaloUrl}
              />
            </div>
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
