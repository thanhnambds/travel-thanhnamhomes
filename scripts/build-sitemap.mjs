import fs from "node:fs";
import path from "node:path";
import { readJson, rootDir } from "./shared.mjs";

const config = readJson("data/config.json");
const urls = [
  "/",
  "/combo-du-lich/",
  "/combo-phu-quoc/",
  "/combo-da-nang/",
  "/combo-nha-trang/",
  "/tour-trung-quoc/",
  "/ve-may-bay-khach-san/",
  "/lien-he/"
];

const now = new Date().toISOString();
const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${config.siteUrl}${url}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>${url === "/" ? "1.0" : "0.8"}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

fs.mkdirSync(path.join(rootDir, "public"), { recursive: true });
fs.writeFileSync(path.join(rootDir, "public", "sitemap.xml"), sitemap);
fs.writeFileSync(
  path.join(rootDir, "public", "robots.txt"),
  `User-agent: *
Allow: /

Sitemap: ${config.siteUrl}/sitemap.xml
`
);

console.log("Generated public/sitemap.xml and public/robots.txt.");
