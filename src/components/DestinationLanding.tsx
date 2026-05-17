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
      <section className="container-page grid gap-6 py-10 lg:grid-cols-[0.95fr_0.65fr]">
        <div>{matched ? <ComboCard combo={matched} /> : <NoCombo destination={config.destinations[slug]?.name ?? title} />}</div>
        <aside className="space-y-4">
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-xl font-semibold text-brand-ink">Phù hợp với</h2>
            <ul className="mt-3 space-y-2 text-sm leading-6 text-slate-700">
              {(config.destinations[slug]?.audiences ?? ["gia đình", "cặp đôi", "nhóm bạn"]).map((item) => (
                <li key={item}>- {item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white p-5">
            <h2 className="text-xl font-semibold text-brand-ink">Cách chốt lead</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600">
              Khách gửi ngày đi, số người, ngân sách và tiêu chuẩn khách sạn qua Zalo. Thanh Nam kiểm tra lại vé và
              phòng trước khi báo giá chính xác.
            </p>
            <a className="mt-4 inline-flex rounded-md bg-brand-teal px-4 py-2 font-semibold text-white" href={config.zaloUrl}>
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
    <div className="rounded-lg border border-slate-200 bg-white p-6">
      <h2 className="text-2xl font-semibold text-brand-ink">Chưa có combo published cho {destination}</h2>
      <p className="mt-3 leading-7 text-slate-600">
        Landing page vẫn nhận lead. Chatbot sẽ tóm tắt nhu cầu để Thanh Nam kiểm tra giá thực tế qua Zalo.
      </p>
    </div>
  );
}
