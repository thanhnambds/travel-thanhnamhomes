import Link from "next/link";
import type { ReactNode } from "react";
import { Plane, MessageCircle, ClipboardCheck } from "lucide-react";
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
        <div className="container-page grid gap-10 py-12 lg:grid-cols-[1.05fr_0.95fr] lg:py-16">
          <div className="flex flex-col justify-center">
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.16em] text-brand-coral">
              Travel Thanh Nam Homes
            </p>
            <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-brand-ink md:text-5xl">
              Combo du lịch vé máy bay và khách sạn, chốt tư vấn qua Zalo
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
              Chọn combo tham khảo được tạo từ dữ liệu vé bay và bảng giá khách sạn tĩnh. Thanh Nam kiểm tra lại giá
              mới nhất trước khi giữ dịch vụ.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link className="focus-ring rounded-md bg-brand-teal px-5 py-3 font-semibold text-white" href="/combo-hom-nay/">
                Xem combo hôm nay
              </Link>
              <a className="focus-ring rounded-md border border-brand-teal px-5 py-3 font-semibold text-brand-teal" href={config.zaloUrl}>
                Chat Zalo
              </a>
            </div>
          </div>
          <div className="rounded-lg bg-brand-mist p-5 shadow-soft">
            {combo ? <ComboCard combo={combo} compact /> : <EmptyCombo />}
          </div>
        </div>
      </section>

      <section className="container-page py-12">
        <div className="grid gap-4 md:grid-cols-3">
          <Info icon={<Plane size={22} />} title="Vé bay dạng adapter" text="MVP dùng mock data, sau này thay bằng dữ liệu API đã xử lý qua GitHub Actions." />
          <Info icon={<ClipboardCheck size={22} />} title="Duyệt thủ công" text="Script chỉ tạo draft. Người quản trị xem lại rồi mới publish combo." />
          <Info icon={<MessageCircle size={22} />} title="Lọc lead qua chat" text="Chatbot hỏi nhu cầu, tóm tắt và chuyển khách sang Zalo để chốt thủ công." />
        </div>
      </section>

      <section className="bg-white py-12">
        <div className="container-page">
          <div className="mb-6 flex items-end justify-between gap-4">
            <div>
              <h2 className="text-3xl font-semibold text-brand-ink">Điểm đến đang bán lead</h2>
              <p className="mt-2 text-slate-600">Tập trung ba điểm đến có nhu cầu tốt trong MVP.</p>
            </div>
            <Link className="hidden font-semibold text-brand-teal md:inline" href="/combo-du-lich/">
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

      <section className="container-page py-10">
        <PriceNote />
      </section>
    </>
  );
}

function Info({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-lg border border-slate-200 bg-white p-5">
      <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-md bg-brand-mist text-brand-teal">{icon}</div>
      <h3 className="font-semibold text-brand-ink">{title}</h3>
      <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
    </div>
  );
}

function EmptyCombo() {
  return (
    <div className="rounded-lg border border-dashed border-slate-300 bg-white p-6 text-slate-600">
      Chưa có combo published. Chạy script tạo draft và publish sau khi duyệt.
    </div>
  );
}
