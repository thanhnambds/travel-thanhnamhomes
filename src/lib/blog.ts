import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();

export interface BlogPost {
  slug: string;
  title: string;
  description: string;
  date: string;
  category: string;
  destination: string | null;
  hero_image: string;
  hero_alt: string;
  pillar_url: string;
  pillar_label: string;
  read_time: number;
  sections: Array<{
    heading: string;
    image: string;
    image_alt: string;
    content: string;
  }>;
  faq: Array<{ q: string; a: string }>;
}

export function getAllBlogPosts(): BlogPost[] {
  const filePath = path.join(rootDir, "data/blog-posts.json");
  if (!fs.existsSync(filePath)) return [];
  return JSON.parse(fs.readFileSync(filePath, "utf8")) as BlogPost[];
}

export function getBlogPostBySlug(slug: string): BlogPost | null {
  return getAllBlogPosts().find((post) => post.slug === slug) ?? null;
}

export function formatBlogDate(dateStr: string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date(dateStr));
}
