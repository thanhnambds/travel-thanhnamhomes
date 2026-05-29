/**
 * filter-public-data.mjs
 * ======================
 * Đọc dữ liệu đã normalize (data/internal/) → lọc sạch B2B → xuất ra data/generated/
 *
 * Input (data/internal/ — nội bộ):
 *   - data/internal/hotels-normalized.json
 *   - data/internal/tours-normalized.json
 *
 * Output (data/generated/ — public, chỉ chứa thông tin an toàn):
 *   - data/generated/hotels-public.json   ← OVERWRITE file cũ!
 *   - data/generated/tours-public.json    ← OVERWRITE file cũ!
 *
 * QUY TẮC LỌC:
 * Tuyệt đối không được xuất ra public bất kỳ field nào chứa:
 *   supplier_name, original_name, source_sheet_url, source_sheet_name,
 *   source_rows, commission, COM, hoa hồng, giá net, internal_notes,
 *   Hoàng Việt, Viettrend, Cattour, F1, google.com/spreadsheets, docs.google.com
 */

import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const internalDir = path.join(rootDir, "data/internal");
const generatedDir = path.join(rootDir, "data/generated");

// ─────────────────────────────────────────────
// Forbidden patterns — bất kỳ chuỗi nào match sẽ làm FAIL build
// ─────────────────────────────────────────────
const FORBIDDEN_PATTERNS = [
  /Hoàng\s*Việt/i,
  /Viettrend/i,
  /Cattour/i,
  /\bF1\b/,
  /\bCOM\b/,
  /hoa\s*hồng/i,
  /commission/i,
  /supplier/i,
  /nhà\s*cung\s*cấp/i,
  // "đại lý" chỉ block khi đi kèm context tài chính — tránh false positive với địa danh "Đại Lý" (Vân Nam)
  /\bđại\s*lý\b.*(?:hoa\s*hồng|COM|\d+%|commission)/i,
  /(?:hoa\s*hồng|COM|commission).*\bđại\s*lý\b/i,
  /giá\s*net/i,
  /google\.com\/spreadsheets/i,
  /docs\.google\.com/i,
  /"source_sheet_url"\s*:/,
  /"supplier_name"\s*:/,
  /"original_name"\s*:/,
  /"source_sheet_name"\s*:/,
  /"internal_notes"\s*:/,
  /"_internal_/,
  /"_supplier_/,
  /"_commission/,
];

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
 * Tạo ID sạch cho hotel — không chứa tên supplier, không chứa F1/viettrend/...
 * Format: "hotel-{destination-slug}-{hotel-name-slug}"
 * Nếu vẫn conflict → thêm index
 */
function generateSafeHotelId(hotel, index) {
  const destSlug = slugify(hotel.destination || "vn");
  const nameSlug = slugify(hotel.hotel_name || `hotel-${index}`).slice(0, 40);
  return `hotel-${destSlug}-${nameSlug}`;
}

/**
 * Kiểm tra một giá trị (bất kỳ type) có chứa pattern cấm không.
 * Trả về pattern đầu tiên match, hoặc null nếu sạch.
 */
function findForbiddenPattern(value) {
  if (value === null || value === undefined) return null;
  const str = typeof value === "string" ? value : JSON.stringify(value);
  for (const pattern of FORBIDDEN_PATTERNS) {
    if (pattern.test(str)) return pattern.toString();
  }
  return null;
}

/**
 * Sanitize một object: chỉ giữ các key được whitelist.
 * Trả về { clean, violations } — violations là danh sách vi phạm nếu có.
 */
function sanitizeObject(obj, allowedKeys) {
  const clean = {};
  const violations = [];

  for (const key of allowedKeys) {
    const value = obj[key];
    // Skip undefined keys
    if (value === undefined) continue;

    // Check key name
    const keyViolation = findForbiddenPattern(key);
    if (keyViolation) {
      violations.push(`Key "${key}" matches forbidden pattern: ${keyViolation}`);
      continue;
    }

    // Check value content
    const valueViolation = findForbiddenPattern(value);
    if (valueViolation) {
      violations.push(`Field "${key}" value matches forbidden pattern: ${valueViolation}`);
      continue;
    }

    clean[key] = value;
  }

  return { clean, violations };
}

// ─────────────────────────────────────────────
// Whitelist các field được phép xuất ra public
// ─────────────────────────────────────────────
const HOTEL_PUBLIC_KEYS = [
  "id",
  "hotel_name",
  "destination",
  "country",
  "stars",
  "updated_at",
];

const TOUR_PUBLIC_KEYS = [
  "id",
  "status",
  "title",
  "destination",
  "country",
  "duration",
  "airline",
  "departure_city",
  "departure_dates",
  "price",
  "currency",
  "price_note",
  "program_url",
  "public_notes",
  "updated_at",
];

// ─────────────────────────────────────────────
// Filter Hotels
// ─────────────────────────────────────────────
function filterHotels() {
  const inPath = path.join(internalDir, "hotels-normalized.json");
  const hotels = readJson(inPath);

  if (!Array.isArray(hotels)) {
    console.error("❌ ERROR: data/internal/hotels-normalized.json không tồn tại.");
    console.error("   → Chạy: npm run normalize:data trước.");
    process.exit(1);
  }

  const publicHotels = [];
  const allViolations = [];

  for (const [idx, hotel] of hotels.entries()) {
    // Re-generate ID sạch — không dùng ID gốc có thể chứa tên supplier (vd: f1-viettrend-...)
    // ID mới: "hotel-{index}" hoặc dựa trên tên hotel + destination (không có B2B)
    const safeId = generateSafeHotelId(hotel, idx);
    const hotelWithSafeId = { ...hotel, id: safeId };

    const { clean, violations } = sanitizeObject(hotelWithSafeId, HOTEL_PUBLIC_KEYS);

    if (violations.length > 0) {
      allViolations.push({ id: hotel.id, violations });
    }

    // Chỉ thêm vào public nếu có hotel_name và destination
    if (clean.hotel_name && clean.destination) {
      publicHotels.push(clean);
    }
  }

  if (allViolations.length > 0) {
    console.warn(`⚠️  ${allViolations.length} hotels có field bị loại bỏ do chứa thông tin B2B:`);
    for (const v of allViolations.slice(0, 5)) {
      console.warn(`   - ${v.id}: ${v.violations.join("; ")}`);
    }
    if (allViolations.length > 5) {
      console.warn(`   ... và ${allViolations.length - 5} hotels khác`);
    }
  }

  const outPath = path.join(generatedDir, "hotels-public.json");
  writeJson(outPath, publicHotels);
  console.log(`✅ hotels-public.json: ${publicHotels.length} hotels (sạch B2B)`);
  return publicHotels.length;
}

// ─────────────────────────────────────────────
// Filter Tours
// ─────────────────────────────────────────────
function filterTours() {
  const inPath = path.join(internalDir, "tours-normalized.json");
  const tours = readJson(inPath);

  if (!Array.isArray(tours)) {
    console.error("❌ ERROR: data/internal/tours-normalized.json không tồn tại.");
    console.error("   → Chạy: npm run normalize:data trước.");
    process.exit(1);
  }

  const publicTours = [];
  const allViolations = [];

  for (const tour of tours) {
    const { clean, violations } = sanitizeObject(tour, TOUR_PUBLIC_KEYS);

    if (violations.length > 0) {
      allViolations.push({ id: tour.id, violations });
    }

    // Chỉ giữ tour published
    if (clean.status !== "published") continue;

    // Skip tour không có title — dữ liệu chưa đầy đủ
    if (!clean.title) {
      console.warn(`  ⚠️  Bỏ qua tour id="${tour.id}": title rỗng (dữ liệu chưa đầy đủ)`);
      continue;
    }

    // Sanitize program_url: chỉ cho phép đường dẫn tương đối (bắt đầu bằng /)
    // Tuyệt đối không cho phép link Google Docs/Sheets
    if (clean.program_url) {
      const isGoogleUrl = /google\.com|docs\.google\.com/i.test(clean.program_url);
      const isAbsoluteExternal = /^https?:\/\//i.test(clean.program_url);
      if (isGoogleUrl || isAbsoluteExternal) {
        clean.program_url = "";
      }
    }

    publicTours.push(clean);
  }

  if (allViolations.length > 0) {
    console.warn(`⚠️  ${allViolations.length} tours có field bị loại bỏ do chứa thông tin B2B:`);
    for (const v of allViolations.slice(0, 5)) {
      console.warn(`   - ${v.id}: ${v.violations.join("; ")}`);
    }
  }

  const outPath = path.join(generatedDir, "tours-public.json");
  writeJson(outPath, publicTours);
  console.log(`✅ tours-public.json: ${publicTours.length} tours published (sạch B2B)`);
  return publicTours.length;
}

// ─────────────────────────────────────────────
// Main
// ─────────────────────────────────────────────
console.log("🔒 filter-public-data.mjs — Lọc dữ liệu B2B, xuất bản sạch ra data/generated/\n");

const hotelCount = filterHotels();
const tourCount = filterTours();

console.log(`\n✅ Filter hoàn tất: ${hotelCount} hotels, ${tourCount} tours`);
console.log("👉 Bước tiếp theo: npm run validate:data");
