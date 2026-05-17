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
              Combo du lịch vé máy bay và khách sạn, chốt tư vấn qua Zalo
            </h1>
            <p className="mt-8 max-w-2xl text-xl leading-8 text-brand-slate">
              Chọn combo tham khảo được tạo từ dữ liệu vé bay và bảng giá khách sạn tĩnh. Thanh Nam kiểm tra lại giá
              mới nhất trước khi giữ dịch vụ.
            </p>
            <div className="mt-10 flex flex-wrap items-center gap-5">
              <Link className="focus-ring rounded-full bg-brand-primary px-7 py-3.5 text-sm font-medium text-white" href="/combo-hom-nay/">
                Xem combo hôm nay
              </Link>
              <a className="focus-ring text-sm font-medium text-brand-primary underline underline-offset-4" href={config.zaloUrl}>
                Chat Zalo
              </a>
            </div>
          </div>
          <div className="flex items-center rounded-[22px] bg-brand-greenWash p-6">
            {combo ? <ComboCard combo={combo} compact /> : <EmptyCombo />}
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <p className="mx-auto max-w-2xl text-center text-sm text-brand-slate">
          Static-first system, GitHub Actions workflow, client-side lead qualification
        </p>
        <div className="mt-10 grid gap-0 border-y border-brand-hairline md:grid-cols-3">
          <Info icon={<Plane size={22} />} title="Vé bay dạng adapter" text="MVP dùng mock data, sau này thay bằng dữ liệu API đã xử lý qua GitHub Actions." />
          <Info icon={<ClipboardCheck size={22} />} title="Duyệt thủ công" text="Script chỉ tạo draft. Người quản trị xem lại rồi mới publish combo." />
          <Info icon={<MessageCircle size={22} />} title="Lọc lead qua chat" text="Chatbot hỏi nhu cầu, tóm tắt và chuyển sang Zalo để chốt thủ công." />
        </div>
      </section>

      <section className="bg-brand-green py-20 text-white">
        <div className="container-page">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="mono-label text-sm uppercase text-brand-softCoral">Destination taxonomy</p>
              <h2 className="display-type mt-4 text-5xl leading-none md:text-6xl">Điểm đến đang bán lead</h2>
              <p className="mt-5 max-w-xl text-brand-muted">Tập trung ba điểm đến có nhu cầu tốt trong MVP.</p>
            </div>
            <Link className="hidden text-sm font-medium text-white underline underline-offset-4 md:inline" href="/combo-du-lich/">
              Xem tất cả
            </Link>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <DestinationCard href="/combo-phu-quoc/" title="Combo Phú Quốc" description="Biển đảo, resort nghỉ dưỡng, phù hợp gia đình và cặp đôi." />
            <DestinationCard href="/combo-da-nang/" title="Combo Đà Nẵng" description="Lịch bay đẹp, khách sạn trung tâm hoặc gần biển Mỹ Khê." />
            <DestinationCard href="/combo-nha-trang/" title="Combo Nha Trang" description="Khách sạn biển, chi phí hợp lý, hợp nhóm bạn và gia đình." />
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
    <div className="rounded-[22px] border border-dashed border-brand-hairline bg-white p-6 text-brand-slate">
      Chưa có combo published. Chạy script tạo draft và publish sau khi duyệt.
    </div>
  );
}
