import { ComboCard } from "@/components/ComboCard";
import { Faq } from "@/components/Faq";
import { PageHero } from "@/components/PageHero";
import { PriceNote } from "@/components/PriceNote";
import { getConfig, getDailyCombo } from "@/lib/data";

export function DestinationLanding({ slug, title, description }: { slug: string; title: string; description: string }) {
  const combo = getDailyCombo();
  const config = getConfig();
  const matched = combo?.destination_slug === slug ? combo : null;

  return (
    <>
      <PageHero eyebrow="Landing page điểm đến" title={title} description={description} />
      <section className="container-page grid gap-6 py-16 lg:grid-cols-[0.95fr_0.65fr]">
        <div>{matched ? <ComboCard combo={matched} /> : <NoCombo destination={config.destinations[slug]?.name ?? title} />}</div>
        <aside className="space-y-4">
          <div className="rounded-[22px] border border-brand-hairline bg-brand-stone p-6">
            <h2 className="text-3xl font-normal text-brand-primary">Phù hợp với</h2>
            <ul className="mt-5 space-y-2 text-sm leading-6 text-brand-slate">
              {(config.destinations[slug]?.audiences ?? ["gia đình", "cặp đôi", "nhóm bạn"]).map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-[22px] bg-[#0d9488] p-6 text-white">
            <h2 className="text-3xl font-medium">Quy trình dịch vụ</h2>
            <p className="mt-5 text-sm leading-6 text-white/90">
              Quý khách vui lòng chia sẻ mong muốn về điểm đến, ngày đi, số lượng người và tiêu chuẩn khách sạn qua Zalo. Chuyên viên của Thanh Nam sẽ thiết kế và báo giá lộ trình hoàn hảo nhất dành riêng cho quý khách.
            </p>
            <a className="mt-6 inline-flex rounded-full bg-white px-5 py-3 text-sm font-medium text-brand-primary" href={config.zaloUrl}>
              Gửi Zalo
            </a>
          </div>
          <PriceNote />
        </aside>
      </section>
      <Faq />
    </>
  );
}

function NoCombo({ destination }: { destination: string }) {
  return (
    <div className="rounded-[22px] border border-brand-hairline bg-white p-7">
      <h2 className="display-type text-4xl font-normal text-brand-primary">Đang cập nhật hành trình cho {destination}</h2>
      <p className="mt-5 leading-7 text-brand-slate">
        Đội ngũ chuyên viên của chúng tôi đang tinh tuyển những hành trình bay và phòng nghỉ cao cấp nhất tại {destination}. Quý khách vui lòng kết nối qua Zalo để nhận báo giá cá nhân hóa và được thiết kế lộ trình riêng biệt.
      </p>
    </div>
  );
}
