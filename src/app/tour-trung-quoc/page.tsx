import { getPublicTours, formatShortDate, formatVnd } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";
import { PageHero } from "@/components/PageHero";
import { TourCard } from "@/components/TourCard";
import { PriceNote } from "@/components/PriceNote";
import { Faq } from "@/components/Faq";
import { Check, ClipboardCheck, ShieldCheck, MapPin } from "lucide-react";
import Link from "next/link";
import { getConfig } from "@/lib/data";

export const metadata = pageMetadata(
  "Tour du lịch Trung Quốc cao cấp trọn gói từ Hà Nội",
  "Khám phá Thượng Hải, Ô Trấn, Hàng Châu, Côn Minh, Đại Lý... Tour du lịch Trung Quốc trọn gói, bay VNA/Vietjet, dịch vụ 5 sao đẳng cấp, tư vấn hỗ trợ qua Zalo Thanh Nam Homes.",
  "/tour-trung-quoc/"
);

export default function ChinaTourPage() {
  const config = getConfig();
  const tours = getPublicTours();
  
  // Filter for China / Hong Kong tours
  const chinaTours = tours.filter((tour) => {
    const country = tour.country.toLowerCase();
    return country.includes("trung") || country.includes("hong") || country.includes("đài") || country.includes("taiwan");
  });

  return (
    <>
      <PageHero
        eyebrow="Khám phá thế giới"
        title="Hành Trình Trung Hoa Kỳ Vĩ"
        description="Trải nghiệm những hải trình độc bản, khám phá danh lam thắng cảnh lộng lẫy và văn hóa ngàn năm. Tour du lịch trọn gói cao cấp được kiểm duyệt khắt khe, lịch khởi hành liên tục và hướng dẫn viên đồng hành chu đáo."
      />

      <section className="bg-brand-soft py-16">
        <div className="container-page">
          <div className="mb-10">
            <p className="section-label">Danh sách tour đang mở bán</p>
            <h2 className="text-4xl font-medium tracking-tight text-brand-primary">Tour Trung Quốc & Hong Kong Nổi Bật</h2>
            <p className="mt-4 max-w-2xl text-brand-slate">
              Lọc và duyệt thủ công từ danh sách các đối tác lữ hành uy tín nhất. Vui lòng nhấn vào tour để xem chi tiết lịch trình và liên hệ Zalo để kiểm tra tình trạng chỗ thực tế.
            </p>
          </div>

          {chinaTours.length > 0 ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {chinaTours.map((tour) => (
                <TourCard
                  key={tour.id}
                  href={tour.program_url || tour.source_sheet_url}
                  image={tourImage(tour.country)}
                  location={tour.country}
                  title={tour.title}
                  rating={5}
                  reviews={0}
                  tag={`Khởi hành: ${tour.departure_dates.map(formatShortDate).join(", ")}`}
                  price={`${formatVnd(tour.price)}/người`}
                  duration={tour.duration}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-brand-hairline bg-white p-12 text-center text-brand-slate">
              Hệ thống đang cập nhật lịch trình các tour Trung Quốc mới nhất cho tháng này. Vui lòng nhắn tin trực tiếp qua Zalo để nhận chương trình độc quyền riêng biệt!
            </div>
          )}
        </div>
      </section>

      <section className="container-page py-20">
        <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="space-y-6">
            <p className="section-label">Đặc quyền dịch vụ</p>
            <h2 className="text-4xl font-medium text-brand-primary leading-tight">Tại sao nên đặt Tour Trung Quốc tại Thanh Nam Travel?</h2>
            <p className="text-brand-slate leading-relaxed">
              Chúng tôi cam kết mang lại một hành trình không chỉ là đi tham quan, mà là một kỳ nghỉ đẳng cấp, trọn vẹn và an tâm tuyệt đối từ lúc bắt đầu cho đến khi trở về.
            </p>

            <div className="space-y-4 pt-4">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-goldDark">
                  <ShieldCheck size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-brand-primary">Thủ Tục Visa Nhanh Gọn</h4>
                  <p className="mt-1 text-sm text-brand-slate">Chuyên viên hỗ trợ làm visa đoàn/visa cá nhân tỉ lệ đậu cao, hồ sơ đơn giản tối đa cho quý khách.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-goldDark">
                  <Check size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-brand-primary">Hàng Không Quốc Tế Uy Tín</h4>
                  <p className="mt-1 text-sm text-brand-slate">Lịch bay thẳng đẹp từ Vietnam Airlines hoặc các hãng hàng không chất lượng cao, hạn chế tối đa transit.</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-soft text-brand-goldDark">
                  <ClipboardCheck size={20} />
                </div>
                <div>
                  <h4 className="font-semibold text-brand-primary">Hỗ Trợ 1:1 Trọn Hành Trình</h4>
                  <p className="mt-1 text-sm text-brand-slate">Đội ngũ Thanh Nam Travel theo sát và hỗ trợ xử lý mọi nhu cầu phát sinh của quý khách 24/7.</p>
                </div>
              </div>
            </div>
          </div>

          <div className="rounded-[22px] border border-brand-hairline bg-white p-8 shadow-soft">
            <h3 className="text-3xl font-medium text-brand-primary mb-6">Cẩm nang & Kinh nghiệm du lịch Trung Quốc cần biết</h3>
            <div className="space-y-6 text-sm leading-relaxed text-brand-slate">
              <div className="border-b border-brand-hairline pb-4">
                <span className="font-bold text-brand-primary block mb-1">1. Đổi tiền tệ (Tệ - CNY)</span>
                Bạn nên đổi sẵn một lượng Nhân Dân Tệ (CNY) mặt nhất định trước khi khởi hành tại Hà Nội (phố Hà Trung). Ngoài ra, tại Trung Quốc việc thanh toán qua ví điện tử Alipay hoặc WeChat Pay là cực kỳ phổ biến và tiện lợi, chuyên viên của chúng tôi sẽ hướng dẫn bạn cài đặt liên kết thẻ Visa trước khi đi.
              </div>

              <div className="border-b border-brand-hairline pb-4">
                <span className="font-bold text-brand-primary block mb-1">2. Kết nối Internet & Mạng xã hội</span>
                Mạng internet Trung Quốc chặn Facebook, Google, YouTube, Zalo. Bạn nên mua sẵn Sim du lịch Trung Quốc tích hợp VPN (hoặc eSIM) ngay tại Việt Nam để truy cập mạng bình thường không bị chặn khi sang nước bạn.
              </div>

              <div>
                <span className="font-bold text-brand-primary block mb-1">3. Khí hậu và Trang phục</span>
                Mỗi mùa Trung Quốc mang một vẻ đẹp riêng. Mùa hè mát mẻ ở vùng cao như Lệ Giang, Shangrila nhưng sẽ khá nóng ở Bắc Kinh, Thượng Hải. Hãy chuẩn bị trang phục năng động, giày thể thao đế mềm vì các điểm tham quan tại Trung Quốc thường yêu cầu đi bộ khám phá khá nhiều.
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container-page pb-16">
        <div className="rounded-[22px] bg-brand-navy p-8 text-white md:p-12 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <p className="mono-label text-sm uppercase text-brand-gold">Thiết kế hành trình riêng</p>
            <h3 className="text-4xl font-normal leading-tight mt-4">Chưa tìm thấy lịch trình phù hợp với gia đình bạn?</h3>
            <p className="mt-4 text-white/70 leading-relaxed text-sm">
              Đừng ngần ngại, hãy chia sẻ ngay ý tưởng, điểm đến bạn muốn khám phá, số lượng thành viên và tiêu chuẩn mong muốn. Chuyên viên thiết kế tour cá nhân hóa của chúng tôi sẽ may đo và gửi báo giá hành trình độc bản dành riêng cho bạn.
            </p>
            <a
              className="mt-8 inline-flex items-center justify-center rounded-full bg-brand-gold px-6 py-3.5 text-sm font-semibold text-brand-primary transition hover:bg-brand-goldLight"
              href={config.zaloUrl}
              target="_blank"
              rel="noreferrer"
            >
              Liên hệ tư vấn Zalo miễn phí
            </a>
          </div>
          <div className="absolute right-0 bottom-0 opacity-10 pointer-events-none hidden md:block select-none">
            <MapPin size={350} />
          </div>
        </div>
      </section>

      <section className="container-page pb-16">
        <PriceNote />
      </section>

      <Faq />
    </>
  );
}

function tourImage(country: string): string {
  const normalized = country.toLowerCase();
  if (normalized.includes("trung") || normalized.includes("hong") || normalized.includes("dai") || normalized.includes("đài")) return "/images/tours/china.png";
  if (normalized.includes("thai") || normalized.includes("thái")) return "/images/tours/thailand.png";
  if (normalized.includes("nhat") || normalized.includes("nhật")) return "/images/tours/japan.png";
  if (normalized.includes("han") || normalized.includes("hàn")) return "/images/tours/japan.png";
  if (normalized.includes("bali") || normalized.includes("indo") || normalized.includes("malaysia") || normalized.includes("singapore")) return "/images/tours/bali.png";
  return "/images/ha-long.png";
}
