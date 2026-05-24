import { PageHero } from "@/components/PageHero";
import { pageMetadata } from "@/lib/seo";
import { getAllBlogPosts, formatBlogDate } from "@/lib/blog";
import Link from "next/link";
import Image from "next/image";
import { Clock, Tag } from "lucide-react";

export const metadata = pageMetadata(
  "Tin tức & Cẩm nang du lịch",
  "Cập nhật những xu hướng du lịch mới nhất và cẩm nang nghỉ dưỡng đẳng cấp từ Thanh Nam Travel.",
  "/tin-tuc/"
);

export default function NewsPage() {
  const posts = getAllBlogPosts();

  return (
    <>
      <PageHero
        eyebrow="Tạp chí du lịch"
        title="Cẩm nang & Xu hướng"
        description="Khám phá các bài viết chia sẻ kinh nghiệm nghỉ dưỡng và những điểm đến đang được giới tinh hoa ưa chuộng."
      />
      <section className="container-page py-16">
        {posts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-brand-hairline bg-brand-stone p-8 text-center text-brand-slate">
            Đang cập nhật bài viết mới. Vui lòng quay lại sau.
          </div>
        ) : (
          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                href={`/tin-tuc/${post.slug}/`}
                className="group focus-ring flex flex-col overflow-hidden rounded-2xl border border-brand-hairline bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-lg"
              >
                {/* Ảnh bìa bài viết */}
                <div className="relative h-52 w-full overflow-hidden">
                  <Image
                    src={post.hero_image}
                    alt={post.hero_alt}
                    fill
                    className="object-cover transition duration-500 group-hover:scale-105"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    unoptimized
                  />
                </div>

                {/* Nội dung thẻ bài viết */}
                <div className="flex flex-1 flex-col p-5">
                  <div className="mb-3 flex flex-wrap items-center gap-2">
                    <span className="inline-flex items-center gap-1 rounded-full bg-brand-soft px-2.5 py-1 text-xs font-semibold text-brand-goldDark">
                      <Tag size={10} />
                      {post.category}
                    </span>
                    <span className="inline-flex items-center gap-1 text-xs text-brand-slate">
                      <Clock size={10} />
                      {post.read_time} phút đọc
                    </span>
                  </div>

                  <h3 className="flex-1 text-lg font-bold leading-snug text-brand-primary line-clamp-2">
                    {post.title}
                  </h3>
                  <p className="mt-2 text-sm leading-6 text-brand-slate line-clamp-2">
                    {post.description}
                  </p>

                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-brand-slate">{formatBlogDate(post.date)}</span>
                    <span className="text-xs font-semibold text-brand-goldDark underline underline-offset-4">
                      Đọc tiếp →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>
    </>
  );
}

