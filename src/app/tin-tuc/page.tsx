import { PageHero } from "@/components/PageHero";
import { pageMetadata } from "@/lib/seo";
import Link from "next/link";
import Image from "next/image";

export const metadata = pageMetadata(
  "Tin tức & Cẩm nang du lịch",
  "Cập nhật những xu hướng du lịch mới nhất và cẩm nang nghỉ dưỡng đẳng cấp từ Thanh Nam Travel.",
  "/tin-tuc/"
);

export default function NewsPage() {
  return (
    <>
      <PageHero
        eyebrow="Tạp chí du lịch"
        title="Cẩm nang & Xu hướng"
        description="Khám phá các bài viết chia sẻ kinh nghiệm nghỉ dưỡng và những điểm đến đang được giới tinh hoa ưa chuộng."
      />
      <section className="container-page py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {[
            { title: "Top 5 Resort xa hoa bậc nhất tại Phú Quốc năm nay", img: "/images/phu-quoc.png", date: "20/05/2026" },
            { title: "Kinh nghiệm tận hưởng hải trình trên du thuyền 5 sao", img: "/images/ha-long.png", date: "15/05/2026" },
            { title: "Tại sao nên thuê trợ lý du lịch cá nhân cho kỳ nghỉ?", img: "/images/nha-trang.png", date: "10/05/2026" }
          ].map((post, i) => (
            <Link key={i} href="#" className="group focus-ring block flex-col overflow-hidden rounded-2xl border border-brand-hairline bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-lg">
              <div className="relative h-48 w-full overflow-hidden">
                <Image src={post.img} alt={post.title} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width: 768px) 100vw, 33vw" />
              </div>
              <div className="p-5">
                <p className="text-xs text-brand-slate mb-2">{post.date}</p>
                <h3 className="text-lg font-bold text-brand-primary leading-snug line-clamp-2">{post.title}</h3>
                <p className="mt-3 text-sm text-brand-slate line-clamp-2">Đọc tiếp bài viết này để cập nhật thêm những thông tin và mẹo hữu ích cho chuyến đi của bạn thêm phần trọn vẹn.</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </>
  );
}
