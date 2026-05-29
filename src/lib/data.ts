/**
 * src/lib/data.ts
 * ===============
 * Đọc dữ liệu từ data/generated/ (đã lọc B2B) và trả về cho client.
 *
 * QUY TẮC:
 * - CHỈ đọc từ data/generated/ — KHÔNG BAO GIỜ đọc từ data/internal/
 * - Sanitize thêm một lần nữa trước khi trả về (defense in depth)
 * - Bất kỳ field nào không có trong whitelist → bị loại bỏ
 */

import fs from "node:fs";
import path from "node:path";
import type { Combo, PublicTour, SiteConfig, PublicHotel } from "./types";

const rootDir = process.cwd();

function readJson<T>(relativePath: string): T {
  return JSON.parse(fs.readFileSync(path.join(rootDir, relativePath), "utf8")) as T;
}

// ─────────────────────────────────────────────
// Sanitize lần cuối — loại bỏ mọi field B2B trước khi render
// Defense in depth: dù filter-public-data.mjs đã lọc, layer này vẫn lọc lại
// ─────────────────────────────────────────────

/** Các field tuyệt đối cấm trong PublicHotel trả về client */
const HOTEL_FORBIDDEN_FIELDS = new Set([
  "supplier_name",
  "original_name",
  "source_sheet_url",
  "source_sheet_name",
  "source_rows",
  "commission",
  "internal_notes",
  "_internal_id",
  "_supplier_name",
  "_original_name",
  "_source_sheet_url",
  "_source_sheet_name",
  "_source_rows",
  "_internal_notes",
  "_commission",
]);

/** Các field tuyệt đối cấm trong PublicTour trả về client */
const TOUR_FORBIDDEN_FIELDS = new Set([
  "source_sheet_url",
  "source_sheet_name",
  "source_rows",
  "supplier_name",
  "original_name",
  "commission",
  "internal_notes",
  "_internal_id",
  "_source_sheet_url",
  "_source_sheet_name",
  "_source_rows",
  "_program_url_internal",
  "_supplier_name",
  "_original_name",
  "_commission",
  "_internal_notes",
]);

function sanitizeHotel(hotel: Record<string, unknown>): PublicHotel {
  const safe: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(hotel)) {
    if (HOTEL_FORBIDDEN_FIELDS.has(key)) continue;
    safe[key] = value;
  }
  return safe as PublicHotel;
}

function sanitizeTour(tour: Record<string, unknown>): PublicTour {
  const safe: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(tour)) {
    if (TOUR_FORBIDDEN_FIELDS.has(key)) continue;
    safe[key] = value;
  }

  // Sanitize program_url: không cho phép link Google hoặc external URL
  if (typeof safe.program_url === "string") {
    const url = safe.program_url;
    if (/google\.com|docs\.google|https?:\/\//i.test(url)) {
      safe.program_url = "";
    }
  }

  return safe as PublicTour;
}

// ─────────────────────────────────────────────
// Public API
// ─────────────────────────────────────────────

export function getConfig(): SiteConfig {
  return readJson<SiteConfig>("data/config.json");
}

export function getDailyCombo(): Combo | null {
  const combo = readJson<Partial<Combo>>("data/generated/daily-combo.json");
  return combo.combo_id ? (combo as Combo) : null;
}

export function getComboHistory() {
  return readJson<Array<{ combo_id: string; generated_at: string; destination: string; status: string }>>(
    "data/generated/combo-history.json"
  );
}

/**
 * Trả về danh sách tour public — CHỈ TỪ data/generated/
 * Đã qua 2 lớp lọc: filter-public-data.mjs + sanitizeTour()
 */
export function getPublicTours(): PublicTour[] {
  if (!fs.existsSync(path.join(rootDir, "data/generated/tours-public.json"))) {
    return [];
  }

  const rawTours = readJson<Record<string, unknown>[]>("data/generated/tours-public.json");
  if (!Array.isArray(rawTours)) return [];

  return rawTours
    .filter((tour) => tour.status === "published")
    .map(sanitizeTour);
}

export function getPublicTourById(id: string): PublicTour | null {
  return getPublicTours().find((tour) => tour.id === id) ?? null;
}

/**
 * Trả về danh sách hotel public — CHỈ TỪ data/generated/
 * Đã qua 2 lớp lọc: filter-public-data.mjs + sanitizeHotel()
 */
export function getPublicHotels(): PublicHotel[] {
  if (!fs.existsSync(path.join(rootDir, "data/generated/hotels-public.json"))) {
    return [];
  }

  const rawHotels = readJson<Record<string, unknown>[]>("data/generated/hotels-public.json");
  if (!Array.isArray(rawHotels)) return [];

  return rawHotels.map(sanitizeHotel);
}

export function isExpired(combo: Combo): boolean {
  return new Date(combo.expires_at).getTime() < Date.now();
}

export function formatVnd(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value) + "đ";
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(`${value}T12:00:00+07:00`));
}

export function formatShortDate(value: string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit"
  }).format(new Date(`${value}T12:00:00+07:00`));
}
