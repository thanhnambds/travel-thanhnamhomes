import Link from "next/link";
import type { ReactNode } from "react";
import { ClipboardCheck, MessageCircle, Plane } from "lucide-react";
import { ComboCard } from "@/components/ComboCard";
import { DestinationCard } from "@/components/DestinationCard";
import { PriceNote } from "@/components/PriceNote";
import { getConfig, getDailyCombo } from "@/lib/data";

export default function HomePage() {
  const config = getConfig();
  const combo = getDailyCombo();

  return (
    <>
      <section className="bg-white">
        <div className="container-page grid min-h-[calc(100vh-116px)] gap-14 py-16 lg:grid-cols-[1.04fr_0.96fr] lg:py-24">
          <div className="flex flex-col justify-center">
            <p className="mono-label mb-6 text-sm uppercase text-brand-coral">Travel Thanh Nam Homes</p>
            <h1 className="display-type max-w-4xl text-6xl font-normal leading-none text-brand-primary md:text-7xl lg:text-8xl">
              Tuyệt tác kỳ nghỉ, thiết kế riêng bằng Trợ lý AI tinh tế
            </h1>
            <p className="mt-8 max-w-2xl text-xl leading-8 text-brand-slate">
              Hệ thống kết nối trực tiếp cổng dữ liệu vé máy bay thời gian thực và bảng giá phòng đối tác. Nhận ngay
              phương án Combo (Vé bay + Khách sạn) tối ưu chuẩn gu chỉ sau 30 giây trò chuyện cùng Trợ lý AI.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Link className="focus-ring rounded-full bg-brand-primary px-7 py-3.5 text-sm font-medium text-white" href="/combo-hom-nay/">
                Khám phá Combo HOT hôm nay
              </Link>
              <a className="focus-ring text-sm font-medium text-brand-primary underline underline-offset-4" href={config.zaloUrl}>
                Trực tiếp trao đổi qua Zalo
              </a>
            </div>
          </div>
          <div className="flex items-center rounded-[22px] bg-brand-greenWash p-6">
            {combo ? <ComboCard combo={combo} compact /> : <EmptyCombo />}
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <p className="mx-auto max-w-2xl text-center text-sm font-medium uppercase tracking-wider text-brand-coral">
          Hệ sinh thái dịch vụ & Phong cách sống cao cấp
        </p>
        <div className="mt-10 grid gap-0 border-y border-brand-hairline md:grid-cols-3">
          <Info
            icon={<Plane size={22} />}
            title="Tối ưu chặng bay"
            text="Hệ thống tự động đồng bộ giờ bay đẹp nhất từ các hãng hàng không hàng đầu, khớp mượt mà với thời gian nhận phòng của bạn."
          />
          <Info
            icon={<ClipboardCheck size={22} />}
            title="Thẩm định chuẩn gu"
            text="Mọi combo được đề xuất đều qua bộ lọc thẩm định khắt khe của anh Thanh Nam, đảm bảo không gian lưu trú tinh tế và đẳng cấp."
          />
          <Info
            icon={<MessageCircle size={22} />}
            title="Trợ lý AI thấu cảm"
            text="Trò chuyện tự nhiên, tinh chỉnh mọi chi tiết xung quanh chuyến đi (hành lý, nâng hạng phòng, chính sách trẻ em) một cách tức thì."
          />
        </div>
      </section>

      <section className="bg-brand-green py-20 text-white">
        <div className="container-page">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="mono-label text-sm uppercase text-brand-softCoral">Curated Destinations</p>
              <h2 className="display-type mt-4 text-5xl leading-none md:text-6xl">Điểm đến tinh hoa</h2>
              <p className="mt-5 max-w-xl text-brand-muted">
                Khám phá những vùng biển thiên đường với rổ quỹ phòng đối tác giá tốt nhất mùa hè này.
              </p>
            </div>
            <Link className="hidden text-sm font-medium text-white underline underline-offset-4 md:inline" href="/combo-du-lich/">
              Xem tất cả điểm đến
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <DestinationCard
              href="/combo-phu-quoc/"
              title="Combo Phú Quốc"
              description="Đảo ngọc thiên đường, resort nghỉ dưỡng biệt lập cao cấp, điểm hẹn hoàn hảo cho gia đình thượng lưu."
            />
            <DestinationCard
              href="/combo-da-nang/"
              title="Combo Đà Nẵng"
              description="Khung giờ bay hoàng đạo, hệ thống khách sạn mặt biển Mỹ Khê hoặc resort bán đảo Sơn Trà đẳng cấp."
            />
            <DestinationCard
              href="/combo-nha-trang/"
              title="Combo Nha Trang"
              description="Vịnh biển thiên đường, khách sạn tầng cao view trọn vịnh, tích hợp dịch vụ đưa đón sân bay đặc quyền."
            />
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <PriceNote />
      </section>
    </>
  );
}

function Info({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="border-brand-hairline bg-white p-6 md:border-r last:md:border-r-0">
      <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-full border border-brand-hairline text-brand-primary">{icon}</div>
      <h3 className="text-2xl font-normal text-brand-ink">{title}</h3>
      <p className="mt-4 text-sm leading-6 text-brand-slate">{text}</p>
    </div>
  );
}

function EmptyCombo() {
  return (
    <div className="rounded-[22px] border border-dashed border-brand-hairline bg-white p-6 text-center text-brand-slate">
      Hệ thống đang cập nhật quỹ phòng và chặng bay HOT nhất trong ngày. Vui lòng bấm Chat Zalo để nhận thiết kế combo
      ngay lập tức!
    </div>
  );
}
