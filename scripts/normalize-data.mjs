/**
 * normalize-data.mjs
 * ==================
 * Đọc dữ liệu raw từ data/internal/ → chuẩn hóa → lưu lại vào data/internal/
 *
 * Input (data/internal/ — chứa B2B raw):
 *   - data/internal/hotels-raw.json         (từ scrape-partner-hotels.mjs)
 *   - data/internal/europe-tours-raw.json   (từ scrape-partner-europe-tours.mjs)
 *   - data/internal/tours-raw.json          (từ scrape-partner-tours.mjs)
 *   - data/generated/tours-public.json      (combo nội địa thủ công — không có B2B)
 *
 * Output (data/internal/ — KHÔNG được commit, KHÔNG được đưa ra client):
 *   - data/internal/hotels-normalized.json
 *   - data/internal/tours-normalized.json
 *
 * CẢNH BÁO: File output vẫn còn chứa thông tin B2B nội bộ (prefix _internal_*).
 * Bước tiếp theo: chạy filter-public-data.mjs để sinh bản sạch cho website.
 */

import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const internalDir = path.join(rootDir, "data/internal");
const generatedDir = path.join(rootDir, "data/generated");

// Disclaimer giá chuẩn — dùng thay thế price_note B2B
const SAFE_PRICE_NOTE = "Giá tham khảo tại thời điểm cập nhật, có thể thay đổi theo tình trạng chỗ và chính sách đối tác. Vui lòng liên hệ để kiểm tra giá chính xác trước khi giữ dịch vụ.";

// Pattern B2B cần phát hiện và loại bỏ khỏi text fields
const B2B_TEXT_PATTERNS = [
  /COM\s*(hoa\s*hồng|đại\s*lý)/i,
  /hoa\s*hồng/i,
  /commission/i,
  /\bCOM\b/,
  /đối\s*tác\s*F1/i,
  /\bF1\b/,
  /Viettrend/i,
  /Hoàng\s*Việt/i,
  /Cattour/i,
  /giá\s*net/i,
  /supplier/i,
  /google\.com\/spreadsheets/i,
  /docs\.google\.com/i,
  /nhà\s*cung\s*cấp/i,
];

/**
 * Kiểm tra text có chứa thông tin B2B không.
 */
function containsB2B(text) {
  if (!text) return false;
  return B2B_TEXT_PATTERNS.some((pattern) => pattern.test(text));
}

function readJson(filePath) {
  if (!fs.existsSync(filePath)) return null;
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function writeJson(filePath, data) {
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2) + "\n");
}

/**
 * Tạo slug an toàn từ text tiếng Việt
 */
function slugify(value) {
  return (value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

/**
 * Tạo ID sạch cho tour — không chứa tên supplier
 * Nếu ID gốc chứa từ khóa B2B → dùng destination + index
 */
function generateSafeTourId(tour, index, rawId) {
  const B2B_ID_PATTERNS = [/f1/i, /viettrend/i, /hoangviet/i, /hoang.viet/i, /cattour/i];
  const isDirty = B2B_ID_PATTERNS.some((p) => p.test(rawId));
  if (!isDirty) return rawId;

  // Tạo ID mới từ destination + title
  const destSlug = slugify(tour.destination || "tour");
  const titleSlug = slugify((tour.title || `tour-${index}`).slice(0, 40));
  return `${destSlug}-${titleSlug}-${index}`.slice(0, 80);
}

function getNowIso() {
  const now = new Date();
  const utc = now.getTime() + now.getTimezoneOffset() * 60000;
  return new Date(utc + 7 * 60 * 60000).toISOString().replace("Z", "+07:00");
}

// ─────────────────────────────────────────────
// 1. Normalize Hotels
// Input: data/internal/hotels-raw.json (từ scrape-partner-hotels.mjs)
// ─────────────────────────────────────────────
function normalizeHotels() {
  const rawPath = path.join(internalDir, "hotels-raw.json");
  const rawHotels = readJson(rawPath);

  if (!Array.isArray(rawHotels)) {
    console.warn("⚠️  data/internal/hotels-raw.json không tồn tại hoặc rỗng.");
    console.warn("   → Chạy: npm run scrape:hotels trước (hoặc bỏ qua nếu dùng hotels.csv).");
    return 0;
  }

  const normalized = rawHotels.map((hotel, index) => {
    const id = hotel.id || `hotel-${index}`;
    return {
      // === INTERNAL FIELDS (B2B — không được đưa ra public) ===
      _internal_id: id,
      _supplier_name: hotel.supplier_name || null,
      _original_name: hotel.original_name || null,
      _source_sheet_url: hotel.source_sheet_url || null,
      _source_sheet_name: hotel.source_sheet_name || null,
      _source_rows: hotel.source_rows || [],
      _internal_notes: hotel.internal_notes || null,
      _commission: hotel.commission || null,

      // === PUBLIC FIELDS (sẽ được lọc bởi filter-public-data.mjs) ===
      id: id,
      hotel_name: (hotel.hotel_name || "").trim(),
      destination: (hotel.destination || "").trim(),
      country: hotel.country || "Việt Nam",
      stars: hotel.stars ?? null,
      updated_at: hotel.updated_at || getNowIso(),
    };
  });

  // Deduplicate by id
  const seen = new Set();
  const deduped = normalized.filter((h) => {
    if (seen.has(h.id)) return false;
    seen.add(h.id);
    return true;
  });

  const outPath = path.join(internalDir, "hotels-normalized.json");
  writeJson(outPath, deduped);
  console.log(`✅ hotels-normalized.json: ${deduped.length} khách sạn (raw: ${rawHotels.length})`);
  return deduped.length;
}

// ─────────────────────────────────────────────
// 2. Normalize Tours
// Input (merge từ nhiều nguồn):
//   - data/internal/europe-tours-raw.json  (từ scrape-partner-europe-tours.mjs)
//   - data/internal/tours-raw.json         (từ scrape-partner-tours.mjs)
//   - data/generated/tours-public.json     (combo nội địa thủ công — ưu tiên giữ nguyên)
// ─────────────────────────────────────────────
function normalizeTours() {
  // Đọc từ tất cả nguồn raw
  const europeTours = readJson(path.join(internalDir, "europe-tours-raw.json")) ?? [];
  const hoangvietTours = readJson(path.join(internalDir, "tours-raw.json")) ?? [];

  // Combo nội địa thủ công — không có B2B, giữ nguyên (đây là tours curated của TNH)
  const manualTours = readJson(path.join(generatedDir, "tours-public.json")) ?? [];

  const sourceStats = {
    europe: europeTours.length,
    hoangviet: hoangvietTours.length,
    manual: manualTours.length,
  };
  console.log(`  📦 Sources: europe=${sourceStats.europe}, hoangviet=${sourceStats.hoangviet}, manual/curated=${sourceStats.manual}`);

  // Gộp tất cả raw tours (F1 partner) để normalize
  const allRawTours = [...europeTours, ...hoangvietTours];

  // Normalize tours từ partner F1 (có B2B fields)
  const normalizedPartnerTours = allRawTours.map((tour, index) => {
    const rawId = tour.id || `tour-${index}`;
    const safeId = generateSafeTourId(tour, index, rawId);

    return {
      // === INTERNAL FIELDS (B2B — không được đưa ra public) ===
      _internal_id: rawId,
      _source_sheet_url: tour.source_sheet_url || null,
      _source_sheet_name: tour.source_sheet_name || null,
      _source_rows: tour.source_rows || [],
      _program_url_internal: tour.program_url || null,
      _supplier_name: tour.supplier_name || null,
      _original_name: tour.original_name || null,
      _commission: tour.commission || null,
      _internal_notes: tour.internal_notes || null,

      // === PUBLIC FIELDS ===
      id: safeId,
      status: tour.status || "draft",
      title: (tour.title || "").trim(),
      destination: (tour.destination || "").trim(),
      country: tour.country || "Việt Nam",
      duration: tour.duration || "",
      airline: tour.airline || "",
      departure_city: tour.departure_city || "",
      departure_dates: Array.isArray(tour.departure_dates) ? tour.departure_dates : [],
      price: typeof tour.price === "number" ? tour.price : 0,
      currency: tour.currency || "VND",
      // Nếu price_note chứa B2B → thay bằng disclaimer chuẩn
      price_note: containsB2B(tour.price_note) ? SAFE_PRICE_NOTE : (tour.price_note || SAFE_PRICE_NOTE),
      program_url: tour.program_url || "",
      // Lọc public_notes: loại bỏ dòng nào chứa thông tin B2B
      public_notes: Array.isArray(tour.public_notes)
        ? tour.public_notes.filter((note) => !containsB2B(note))
        : [],
      updated_at: tour.updated_at || getNowIso(),
    };
  });

  // Normalize manual/curated tours (combo nội địa — không có B2B, chỉ map fields chuẩn)
  const normalizedManualTours = manualTours.map((tour, index) => {
    const rawId = tour.id || `manual-${index}`;
    return {
      // Combo nội địa không có B2B fields
      _internal_id: rawId,
      _source_sheet_url: null,
      _source_sheet_name: "TNH_MANUAL",
      _source_rows: [],
      _program_url_internal: null,
      _supplier_name: null,
      _original_name: null,
      _commission: null,
      _internal_notes: null,

      // PUBLIC FIELDS — giữ nguyên từ manual tours
      id: rawId,
      status: tour.status || "published",
      title: (tour.title || "").trim(),
      destination: (tour.destination || "").trim(),
      country: tour.country || "Việt Nam",
      duration: tour.duration || "",
      airline: tour.airline || "",
      departure_city: tour.departure_city || "",
      departure_dates: Array.isArray(tour.departure_dates) ? tour.departure_dates : [],
      price: typeof tour.price === "number" ? tour.price : 0,
      currency: tour.currency || "VND",
      price_note: containsB2B(tour.price_note) ? SAFE_PRICE_NOTE : (tour.price_note || SAFE_PRICE_NOTE),
      program_url: tour.program_url || "",
      public_notes: Array.isArray(tour.public_notes)
        ? tour.public_notes.filter((note) => !containsB2B(note))
        : [],
      updated_at: tour.updated_at || getNowIso(),
    };
  });

  // Gộp: manual tours trước (ưu tiên), sau đó partner tours
  const allNormalized = [...normalizedManualTours, ...normalizedPartnerTours];

  const outPath = path.join(internalDir, "tours-normalized.json");
  writeJson(outPath, allNormalized);
  console.log(`✅ tours-normalized.json: ${allNormalized.length} tours (manual: ${normalizedManualTours.length}, partner: ${normalizedPartnerTours.length})`);
  return allNormalized.length;
}

// ─────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────
console.log("🔄 normalize-data.mjs — Chuẩn hóa dữ liệu raw vào data/internal/");
console.log("⚠️  CẢNH BÁO: Output chứa thông tin B2B nội bộ. Không được đưa ra client!\n");

const hotelCount = normalizeHotels();
const tourCount = normalizeTours();

console.log(`\n✅ Normalize hoàn tất: ${hotelCount} hotels, ${tourCount} tours`);
console.log("👉 Bước tiếp theo: npm run filter:public");
