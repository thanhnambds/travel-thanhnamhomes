import Link from "next/link";
import type { ReactNode } from "react";
import { Check, ClipboardCheck, Hotel, MessageCircle, Plane } from "lucide-react";
import { ComboCard } from "@/components/ComboCard";
import { DestinationCard } from "@/components/DestinationCard";
import { PriceNote } from "@/components/PriceNote";
import { getConfig, getDailyCombo } from "@/lib/data";

export default function HomePage() {
  const config = getConfig();
  const combo = getDailyCombo();

  return (
    <>
      <section className="travel-home-hero relative min-h-[calc(100vh-68px)] overflow-hidden bg-brand-primary text-white">
        <div className="absolute inset-0 travel-home-hero-bg" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_16%_54%,rgba(199,161,90,0.18),transparent_42%),linear-gradient(90deg,rgba(17,17,17,0.82),rgba(17,17,17,0.56)_52%,rgba(17,17,17,0.2))]" />
        <div className="container-page relative grid min-h-[calc(100vh-68px)] content-center gap-12 py-24 lg:grid-cols-[minmax(0,760px)_minmax(360px,1fr)] lg:items-center">
          <div>
            <p className="section-label-dark">Thanh Nam Homes Travel</p>
            <h1 className="max-w-4xl text-5xl font-medium leading-tight tracking-[-0.02em] text-white md:text-6xl lg:text-7xl">
              Combo du lịch vé bay và khách sạn, tư vấn rõ giá trước khi giữ dịch vụ
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/72 md:text-lg">
              Gợi ý combo từ dữ liệu vé bay tham khảo và bảng giá khách sạn tĩnh. Thanh Nam kiểm tra lại tình trạng vé,
              phòng và điều kiện giá qua Zalo trước khi chốt lead.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link className="btn-brand-gold" href="/combo-hom-nay/">
                <Plane size={18} />
                Xem combo hôm nay
              </Link>
              <a className="btn-hero-outline" href={config.zaloUrl}>
                <MessageCircle size={18} />
                Chat Zalo
              </a>
            </div>
            <div className="mt-7 flex flex-wrap gap-2">
              <Proof text="Giá tham khảo, kiểm tra lại trước khi giữ" />
              <Proof text="Không cam kết còn vé/phòng tự động" />
              <Proof text="Chuyển lead qua Zalo 0965 325 555" />
            </div>
          </div>

          <div className="rounded-2xl border border-white/15 bg-white/10 p-4 shadow-[0_24px_70px_rgba(0,0,0,0.28)] backdrop-blur">
            {combo ? <ComboCard combo={combo} compact /> : <EmptyCombo />}
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <p className="section-label justify-center">
          Quy trình tạo lead
        </p>
        <h2 className="mx-auto mt-3 max-w-3xl text-center text-4xl font-medium leading-tight tracking-[-0.02em] text-brand-primary md:text-5xl">
          Static-first, rõ dữ liệu, chốt tư vấn qua Zalo
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-center text-brand-slate">
          Website tập trung tạo nhu cầu và chuyển khách sang tư vấn thủ công. Không booking online, không giữ giá tự động.
        </p>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <Info
            icon={<Plane size={22} />}
            title="Đọc dữ liệu vé bay"
            text="MVP dùng mock data dạng adapter, sau này thay bằng API thật qua GitHub Actions để không lộ secret key trên frontend."
          />
          <Info
            icon={<Hotel size={22} />}
            title="Đọc bảng giá khách sạn"
            text="Khách sạn dùng CSV tĩnh, validate hạn giá, blackout dates, chính sách trẻ em và điều kiện hoàn hủy trước khi tạo combo."
          />
          <Info
            icon={<ClipboardCheck size={22} />}
            title="Đề xuất rồi duyệt"
            text="Script tạo draft combo, người duyệt kiểm tra lại rồi mới publish để giảm rủi ro đăng sai giá hoặc sai điều kiện."
          />
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <p className="section-label">Combo đang publish</p>
            <h2 className="mt-4 text-4xl font-medium leading-tight tracking-[-0.02em] text-brand-primary md:text-5xl">
              Combo được chọn cho hôm nay
            </h2>
            <p className="mt-6 text-brand-slate">
              Dữ liệu được tạo từ bảng giá phòng và nguồn vé bay tham khảo. Thanh Nam kiểm tra lại trước khi giữ dịch vụ.
            </p>
          </div>
          <div className="rounded-2xl bg-brand-soft p-6">
            {combo ? <ComboCard combo={combo} compact /> : <EmptyCombo />}
          </div>
        </div>
      </section>

      <section className="bg-brand-soft py-20">
        <div className="container-page">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="section-label">Điểm đến chính</p>
              <h2 className="mt-4 text-4xl font-medium leading-tight tracking-[-0.02em] text-brand-primary md:text-5xl">
                Landing page tạo lead theo điểm đến
              </h2>
              <p className="mt-5 max-w-xl text-brand-slate">
                Ba điểm đến đầu tiên cho MVP, cấu trúc SEO gọn và không tạo nhiều URL mỏng.
              </p>
            </div>
            <Link className="hidden text-sm font-semibold text-brand-goldDark underline underline-offset-4 md:inline" href="/combo-du-lich/">
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
        <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-2xl border border-brand-hairline bg-white p-7">
            <p className="section-label">Nguyên tắc tư vấn</p>
            <h2 className="mt-4 text-3xl font-medium leading-tight text-brand-primary">Không cam kết realtime trên web tĩnh</h2>
            <p className="mt-5 text-sm leading-7 text-brand-slate">
              Chatbot chỉ lọc nhu cầu dựa trên dữ liệu đã publish. Khi khách có nhu cầu rõ, bot tóm tắt và chuyển sang Zalo
              để Thanh Nam kiểm tra lại vé, phòng và chính sách nhà cung cấp.
            </p>
          </div>
          <PriceNote />
        </div>
      </section>
    </>
  );
}

function Proof({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white/78 backdrop-blur">
      <Check size={14} className="text-brand-gold" />
      {text}
    </span>
  );
}

function Info({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-brand-hairline bg-white p-7 shadow-soft">
      <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft text-brand-goldDark">{icon}</div>
      <h3 className="text-2xl font-medium text-brand-primary">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-brand-slate">{text}</p>
    </div>
  );
}

function EmptyCombo() {
  return (
    <div className="rounded-2xl border border-dashed border-brand-hairline bg-white p-6 text-center text-brand-slate">
      Hệ thống đang cập nhật quỹ phòng và chặng bay HOT nhất trong ngày. Vui lòng bấm Chat Zalo để nhận thiết kế combo
      ngay lập tức!
    </div>
  );
}
