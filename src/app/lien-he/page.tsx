import { MessageCircle, Phone } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { PriceNote } from "@/components/PriceNote";
import { getConfig } from "@/lib/data";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Liên hệ tư vấn combo du lịch",
  "Liên hệ Travel Thanh Nam Homes qua Zalo để kiểm tra giá vé và phòng mới nhất.",
  "/lien-he/"
);

export default function ContactPage() {
  const config = getConfig();

  return (
    <>
      <PageHero
        eyebrow="Liên hệ"
        title="Gửi nhu cầu combo du lịch qua Zalo"
        description="Cung cấp điểm đến, ngày đi, số người, ngân sách và tiêu chuẩn khách sạn để được kiểm tra giá mới nhất."
      />
      <section className="container-page grid gap-5 py-10 md:grid-cols-2">
        <a className="focus-ring rounded-lg border border-slate-200 bg-white p-6 shadow-sm" href={config.zaloUrl}>
          <MessageCircle className="text-brand-teal" size={28} />
          <h2 className="mt-4 text-2xl font-semibold text-brand-ink">Zalo Thanh Nam</h2>
          <p className="mt-2 text-slate-600">https://zalo.me/0965325555</p>
        </a>
        <div className="rounded-lg border border-slate-200 bg-white p-6 shadow-sm">
          <Phone className="text-brand-teal" size={28} />
          <h2 className="mt-4 text-2xl font-semibold text-brand-ink">Số điện thoại</h2>
          <p className="mt-2 text-slate-600">0965 325 555</p>
        </div>
      </section>
      <section className="container-page pb-10">
        <PriceNote />
      </section>
    </>
  );
}
