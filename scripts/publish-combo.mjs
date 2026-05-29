/**
 * publish-combo.mjs
 * =================
 * Publish draft combo thành daily-combo.json để website render.
 *
 * Input:  data/internal/draft-combo.json  (nháp nội bộ — chứa margin, fees)
 * Output: data/generated/daily-combo.json (public — chỉ có thông tin an toàn)
 *
 * LƯU Ý: Script này có thể được mở rộng để thêm bước sanitize B2B trước khi publish.
 */

import { readJson, writeJson, getNowIso } from "./shared.mjs";
import path from "node:path";
import fs from "node:fs";

const rootDir = process.cwd();

// Đọc draft từ data/internal/ (KHÔNG phải data/generated/)
const draftPath = "data/internal/draft-combo.json";
const draft = readJson(draftPath);

if (!draft || !draft.combo_id) {
  console.error("❌ No valid draft combo found.");
  console.error("   → Chạy: npm run generate:combo trước.");
  process.exit(1);
}

const now = getNowIso();

// Sanitize trước khi publish ra public — loại bỏ mọi field B2B nội bộ
const FIELDS_TO_STRIP = new Set([
  "margin",
  "base_flight_price",
  "hotel_price",
  "fees",
  "source_log",
]);

const published = {};
for (const [key, value] of Object.entries(draft)) {
  if (FIELDS_TO_STRIP.has(key)) continue;
  published[key] = value;
}

// Ghi đè status và timestamps
published.status = "published";
published.updated_at = now;
published.published_at = now;

// History entry — không chứa thông tin B2B
const historyPath = "data/generated/combo-history.json";
const history = readJson(historyPath) ?? [];
const historyEntry = {
  combo_id: published.combo_id,
  generated_at: published.generated_at,
  published_at: published.published_at,
  destination: published.destination,
  status: published.status,
};

writeJson("data/generated/daily-combo.json", published);
writeJson(historyPath, [historyEntry, ...history].slice(0, 60));

console.log(`✅ Published combo: ${published.title}`);
console.log(`   Total price: ${published.total_price?.toLocaleString("vi-VN")}đ`);
console.log(`   → data/generated/daily-combo.json`);
