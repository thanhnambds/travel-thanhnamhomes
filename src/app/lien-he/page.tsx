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
      <section className="container-page grid gap-5 py-16 md:grid-cols-2">
        <a className="focus-ring rounded-[22px] border border-brand-hairline bg-brand-stone p-7" href={config.zaloUrl}>
          <MessageCircle className="text-brand-coral" size={28} />
          <h2 className="mt-6 text-3xl font-normal text-brand-primary">Zalo Thanh Nam</h2>
          <p className="mt-3 text-brand-slate">https://zalo.me/0965325555</p>
        </a>
        <div className="rounded-[22px] bg-brand-green p-7 text-white">
          <Phone className="text-brand-softCoral" size={28} />
          <h2 className="mt-6 text-3xl font-normal">Số điện thoại</h2>
          <p className="mt-3 text-brand-muted">0965 325 555</p>
        </div>
      </section>
      <section className="container-page pb-16">
        <PriceNote />
      </section>
    </>
  );
}
