import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getAllBlogPosts, getBlogPostBySlug, formatBlogDate } from "@/lib/blog";
import { pageMetadata } from "@/lib/seo";
import { getConfig } from "@/lib/data";
import { MessageCircle, Clock, Tag, ChevronRight } from "lucide-react";

interface BlogPostPageProps {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return getAllBlogPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) return { title: "Bài viết không tồn tại" };

  return {
    ...pageMetadata(post.title, post.description, `/tin-tuc/${slug}/`),
    openGraph: {
      title: post.title,
      description: post.description,
      url: `https://travel.thanhnamhomes.vn/tin-tuc/${slug}/`,
      images: [{ url: post.hero_image, alt: post.hero_alt }],
      type: "article",
      locale: "vi_VN",
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params;
  const post = getBlogPostBySlug(slug);
  if (!post) notFound();

  const config = getConfig();
  const allPosts = getAllBlogPosts().filter((p) => p.slug !== slug).slice(0, 2);

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.description,
    image: post.hero_image,
    datePublished: post.date,
    dateModified: post.date,
    author: {
      "@type": "Organization",
      name: "Thanh Nam Homes Travel",
      url: config.siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "Thanh Nam Homes Travel",
      logo: { "@type": "ImageObject", url: `${config.siteUrl}/apple-touch-icon.png` },
    },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${config.siteUrl}/tin-tuc/${slug}/` },
  };

  const faqSchema = post.faq.length > 0 ? {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: post.faq.map((item) => ({
      "@type": "Question",
      name: item.q,
      acceptedAnswer: { "@type": "Answer", text: item.a },
    })),
  } : null;

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }} />
      {faqSchema && <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />}

      {/* Hero có ảnh nền Unsplash */}
      <section className="relative overflow-hidden bg-brand-primary">
        <div className="absolute inset-0">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.hero_image}
            alt={post.hero_alt}
            className="h-full w-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-brand-primary" />
        </div>
        <div className="container-page relative py-20 text-white">
          {/* Breadcrumb */}
          <nav className="mb-6 flex items-center gap-2 text-sm text-white/60">
            <Link href="/" className="hover:text-white transition">Trang chủ</Link>
            <ChevronRight size={14} />
            <Link href="/tin-tuc/" className="hover:text-white transition">Cẩm nang</Link>
            <ChevronRight size={14} />
            <span className="text-white/80 line-clamp-1">{post.title}</span>
          </nav>

          <div className="flex flex-wrap items-center gap-3 mb-5">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-brand-gold/20 px-3 py-1 text-xs font-semibold text-brand-gold">
              <Tag size={12} />
              {post.category}
            </span>
            <span className="inline-flex items-center gap-1.5 text-xs text-white/60">
              <Clock size={12} />
              {post.read_time} phút đọc
            </span>
            <span className="text-xs text-white/60">{formatBlogDate(post.date)}</span>
          </div>

          <h1 className="max-w-4xl text-3xl font-bold leading-tight tracking-[-0.02em] md:text-5xl">
            {post.title}
          </h1>
          <p className="mt-5 max-w-3xl text-base leading-7 text-white/75 md:text-lg">
            {post.description}
          </p>

          <Link
            href={`${config.zaloUrl}?text=Tôi muốn tư vấn về ${post.title}`}
            className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/30 bg-white/10 px-5 py-2.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-white/20"
          >
            <MessageCircle size={16} />
            Nhận tư vấn miễn phí qua Zalo
          </Link>
        </div>
      </section>

      {/* Nội dung chính */}
      <section className="container-page py-14">
        <div className="mx-auto max-w-4xl">
          {post.sections.map((section, index) => (
            <div key={index} className="mb-14">
              {/* Ảnh section — dùng img thường để load ảnh Unsplash */}
              <div className="mb-6 overflow-hidden rounded-2xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={section.image}
                  alt={section.image_alt}
                  className="h-64 w-full object-cover md:h-96"
                  loading={index === 0 ? "eager" : "lazy"}
                />
              </div>

              <h2 className="mb-4 text-2xl font-bold leading-snug text-brand-primary md:text-3xl">
                {section.heading}
              </h2>
              <div className="prose prose-slate max-w-none text-brand-slate">
                {section.content.split("\n\n").map((paragraph, pIndex) => (
                  <p
                    key={pIndex}
                    className="mb-4 leading-8 text-brand-slate"
                    dangerouslySetInnerHTML={{
                      __html: paragraph.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-brand-primary">$1</strong>')
                    }}
                  />
                ))}
              </div>

              {index === 1 && (
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link
                    href={post.pillar_url}
                    className="inline-flex items-center gap-2 rounded-full bg-brand-primary px-5 py-2.5 text-sm font-bold text-white transition hover:bg-black"
                  >
                    {post.pillar_label}
                  </Link>
                  <Link
                    href={`${config.zaloUrl}?text=Tôi muốn tư vấn combo ${post.title}`}
                    className="inline-flex items-center gap-2 rounded-full border border-brand-hairline bg-white px-5 py-2.5 text-sm font-bold text-brand-primary transition hover:bg-brand-soft"
                  >
                    <MessageCircle size={15} />
                    Nhận báo giá qua Zalo
                  </Link>
                </div>
              )}
            </div>
          ))}

          {/* FAQ */}
          {post.faq.length > 0 && (
            <div className="mb-14 rounded-2xl border border-brand-hairline bg-brand-soft p-6 md:p-8">
              <h2 className="mb-6 text-2xl font-bold text-brand-primary">Câu hỏi thường gặp</h2>
              <div className="divide-y divide-brand-hairline">
                {post.faq.map((item, index) => (
                  <details key={index} className="group py-5" open={index === 0}>
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4">
                      <h3 className="text-base font-bold text-brand-primary">{item.q}</h3>
                      <span className="shrink-0 rounded-full border border-brand-hairline bg-white px-3 py-1 text-xs text-brand-slate group-open:bg-brand-primary group-open:text-white transition">
                        ▾
                      </span>
                    </summary>
                    <p className="mt-3 leading-7 text-brand-slate">{item.a}</p>
                  </details>
                ))}
              </div>
            </div>
          )}

          {/* CTA cuối bài */}
          <div className="rounded-2xl bg-brand-primary p-8 text-center text-white">
            <p className="section-label-dark justify-center">Thanh Nam Travel</p>
            <h2 className="mt-3 text-2xl font-bold">Sẵn sàng lên kế hoạch cho chuyến đi?</h2>
            <p className="mt-3 text-white/75">
              Nhắn tin Zalo để nhận tư vấn combo phù hợp nhất — chúng tôi kiểm tra giá và chỗ trống thực tế trước khi báo giá cho bạn.
            </p>
            <div className="mt-6 flex flex-wrap justify-center gap-4">
              <Link
                href={`${config.zaloUrl}?text=Tôi muốn tư vấn combo du lịch sau khi đọc bài: ${post.title}`}
                className="btn-brand-gold"
              >
                <MessageCircle size={18} />
                Nhắn tin Zalo ngay
              </Link>
              <Link href={post.pillar_url} className="btn-hero-outline">
                {post.pillar_label}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bài viết liên quan */}
      {allPosts.length > 0 && (
        <section className="bg-brand-soft py-14">
          <div className="container-page">
            <p className="section-label">Đọc thêm</p>
            <h2 className="mt-3 text-2xl font-bold text-brand-primary">Bài viết liên quan</h2>
            <div className="mt-6 grid gap-6 sm:grid-cols-2">
              {allPosts.map((related) => (
                <Link
                  key={related.slug}
                  href={`/tin-tuc/${related.slug}/`}
                  className="group flex flex-col overflow-hidden rounded-2xl border border-brand-hairline bg-white shadow-soft transition hover:-translate-y-1 hover:shadow-lg"
                >
                  <div className="h-44 w-full overflow-hidden">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={related.hero_image}
                      alt={related.hero_alt}
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <p className="text-xs text-brand-slate">{formatBlogDate(related.date)}</p>
                    <h3 className="mt-2 flex-1 text-base font-bold leading-snug text-brand-primary line-clamp-2">
                      {related.title}
                    </h3>
                    <span className="mt-3 text-xs font-semibold text-brand-goldDark underline underline-offset-4">
                      Đọc tiếp →
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}
    </>
  );
}
