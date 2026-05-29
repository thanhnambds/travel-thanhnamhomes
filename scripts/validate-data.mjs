/**
 * validate-data.mjs
 * =================
 * Kiểm tra toàn bộ dữ liệu trước khi build.
 * Nếu có lỗi → process.exit(1) → build DỪNG lại.
 *
 * Bao gồm:
 * 1. Kiểm tra file tồn tại
 * 2. Kiểm tra config.json hợp lệ
 * 3. Kiểm tra hotels.csv hợp lệ
 * 4. Kiểm tra flights.mock.json hợp lệ
 * 5. Kiểm tra tours-public.json hợp lệ
 * 6. [B2B SECURITY SCAN] Quét toàn bộ file public — FAIL nếu chứa thông tin B2B
 */

import fs from "node:fs";
import path from "node:path";
import { dataDir, readHotels, readJson, toNumber } from "./shared.mjs";

const errors = [];
const warnings = [];

// ─────────────────────────────────────────────
// B2B Security: Danh sách từ khóa tuyệt đối cấm trong file public
// ─────────────────────────────────────────────
const FORBIDDEN_B2B_PATTERNS = [
  { pattern: /Hoàng\s*Việt/i,              label: "Tên đối tác: Hoàng Việt" },
  { pattern: /Viettrend/i,                  label: "Tên đối tác: Viettrend" },
  { pattern: /Cattour/i,                    label: "Tên đối tác: Cattour" },
  { pattern: /\bF1\b/,                      label: "Từ khóa đối tác: F1" },
  { pattern: /\bCOM\b/,                     label: "Từ khóa hoa hồng: COM" },
  { pattern: /hoa\s*hồng/i,                label: "Thông tin tài chính: hoa hồng" },
  { pattern: /commission/i,                 label: "Thông tin tài chính: commission" },
  { pattern: /\bsupplier\b/i,              label: "Từ khóa B2B: supplier" },
  { pattern: /nhà\s*cung\s*cấp/i,         label: "Từ khóa B2B: nhà cung cấp" },
  // "đại lý" chỉ block khi đi kèm context tài chính — tránh false positive với địa danh "Đại Lý" (Vân Nam TQ)
  { pattern: /\bđại\s*lý\b.*(?:hoa\s*hồng|COM|\d+%|commission)/i, label: "Từ khóa B2B: đại lý + tài chính" },
  { pattern: /(?:hoa\s*hồng|COM|commission).*\bđại\s*lý\b/i,       label: "Từ khóa B2B: đại lý + hoa hồng" },
  { pattern: /giá\s*net/i,                 label: "Giá nội bộ: giá net" },
  { pattern: /google\.com\/spreadsheets/i, label: "Link nội bộ: google.com/spreadsheets" },
  { pattern: /docs\.google\.com/i,         label: "Link nội bộ: docs.google.com" },
  { pattern: /"source_sheet_url"\s*:/,     label: "Field B2B: source_sheet_url" },
  { pattern: /"supplier_name"\s*:/,        label: "Field B2B: supplier_name" },
  { pattern: /"original_name"\s*:/,        label: "Field B2B: original_name" },
  { pattern: /"source_sheet_name"\s*:/,    label: "Field B2B: source_sheet_name" },
  { pattern: /"internal_notes"\s*:/,       label: "Field B2B: internal_notes" },
  { pattern: /"_internal_/,               label: "Field nội bộ: _internal_*" },
  { pattern: /"_supplier_/,               label: "Field nội bộ: _supplier_*" },
  { pattern: /"_commission/,              label: "Field nội bộ: _commission" },
];

/**
 * Quét một file public — trả về danh sách vi phạm.
 * @param {string} filePath - Đường dẫn tuyệt đối tới file JSON public
 * @param {string} label    - Tên hiển thị để log lỗi
 */
function scanPublicFile(filePath, label) {
  if (!fs.existsSync(filePath)) {
    errors.push(`[B2B SCAN] File không tồn tại: ${label}`);
    return;
  }

  const content = fs.readFileSync(filePath, "utf8");
  const fileViolations = [];

  for (const { pattern, label: patternLabel } of FORBIDDEN_B2B_PATTERNS) {
    if (pattern.test(content)) {
      fileViolations.push(patternLabel);
    }
  }

  if (fileViolations.length > 0) {
    errors.push(
      `[B2B SECURITY FAIL] ${label} chứa thông tin B2B bị cấm:\n` +
      fileViolations.map((v) => `    → ${v}`).join("\n")
    );
  } else {
    console.log(`  ✅ B2B scan passed: ${label}`);
  }
}

// ─────────────────────────────────────────────
// 1. Kiểm tra file tồn tại
// ─────────────────────────────────────────────
function assertFile(relativePath) {
  const fullPath = path.join(dataDir, relativePath);
  if (!fs.existsSync(fullPath)) {
    errors.push(`Missing data file: data/${relativePath}`);
  }
}

assertFile("hotels.csv");
assertFile("flights.mock.json");
assertFile("config.json");
assertFile("generated/tours-public.json");
assertFile("generated/hotels-public.json");

// ─────────────────────────────────────────────
// 2. Kiểm tra config.json
// ─────────────────────────────────────────────
const config = readJson("data/config.json");
if (!config.defaultDepartureCity) errors.push("config.defaultDepartureCity is required.");
if (!config.defaultMarginPercent) errors.push("config.defaultMarginPercent is required.");
if (!config.priceNote?.includes("Giá tham khảo tại thời điểm cập nhật")) {
  errors.push("config.priceNote must include the required price disclaimer.");
}

// ─────────────────────────────────────────────
// 3. Kiểm tra hotels.csv
// ─────────────────────────────────────────────
const hotels = readHotels();
const today = new Date();
for (const [index, hotel] of hotels.entries()) {
  const row = index + 2;
  if (!hotel.destination) errors.push(`hotels.csv row ${row}: destination is required.`);
  if (!hotel.hotel_name) errors.push(`hotels.csv row ${row}: hotel_name is required.`);
  if (!hotel.valid_to) errors.push(`hotels.csv row ${row}: valid_to is required.`);
  if (!toNumber(hotel.weekday_price) && !toNumber(hotel.weekend_price)) {
    errors.push(`hotels.csv row ${row}: weekday_price or weekend_price is required.`);
  }
  if (!hotel.cancellation_policy) {
    errors.push(`hotels.csv row ${row}: cancellation_policy is required.`);
  }
  if (hotel.valid_to && new Date(`${hotel.valid_to}T23:59:59+07:00`) < today) {
    warnings.push(`hotels.csv row ${row}: hotel rate is expired and will be ignored.`);
  }
  if (!config.destinations[hotel.destination]) {
    errors.push(`hotels.csv row ${row}: unknown destination "${hotel.destination}".`);
  }
}

// ─────────────────────────────────────────────
// 4. Kiểm tra flights.mock.json
// ─────────────────────────────────────────────
const flightData = readJson("data/flights.mock.json");
if (!flightData.source) errors.push("flights.mock.json source is required.");
if (!Array.isArray(flightData.flights) || flightData.flights.length === 0) {
  errors.push("flights.mock.json must include at least one flight.");
}

for (const [index, flight] of (flightData.flights ?? []).entries()) {
  const label = `flights.mock.json item ${index + 1}`;
  for (const key of ["flight_id", "origin", "destination", "airline", "departure_date", "departure_time", "price", "fare_conditions"]) {
    if (!flight[key]) errors.push(`${label}: ${key} is required.`);
  }
}

// ─────────────────────────────────────────────
// 5. Kiểm tra tours-public.json (logic hiện tại)
// Note: source_sheet_url đã bị XÓA khỏi required fields (không còn trong public data)
// ─────────────────────────────────────────────
const publicTours = readJson("data/generated/tours-public.json");
if (!Array.isArray(publicTours)) {
  errors.push("tours-public.json must be an array.");
}

for (const [index, tour] of (Array.isArray(publicTours) ? publicTours : []).entries()) {
  const label = `tours-public.json item ${index + 1}`;
  // Chú ý: source_sheet_url đã bị loại khỏi required list
  for (const key of ["id", "status", "title", "destination", "country", "duration", "airline", "departure_city", "price", "price_note", "updated_at"]) {
    if (!tour[key]) errors.push(`${label}: ${key} is required.`);
  }
  if (tour.status !== "published") {
    errors.push(`${label}: only published tours are allowed in tours-public.json.`);
  }
  if (!Array.isArray(tour.departure_dates) || tour.departure_dates.length === 0) {
    errors.push(`${label}: departure_dates must include at least one date.`);
  } else {
    for (const [dIndex, date] of tour.departure_dates.entries()) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        errors.push(`${label}: departure_dates[${dIndex}] "${date}" is not in YYYY-MM-DD format.`);
      } else {
        const d = new Date(`${date}T12:00:00+07:00`);
        if (isNaN(d.getTime())) {
          errors.push(`${label}: departure_dates[${dIndex}] "${date}" is an invalid calendar date.`);
        }
      }
    }
  }
  if (!Number.isFinite(tour.price) || tour.price <= 0) {
    errors.push(`${label}: price must be a positive number.`);
  }
  if (!tour.price_note?.includes("Giá tham khảo tại thời điểm cập nhật")) {
    errors.push(`${label}: price_note must include the required price disclaimer.`);
  }
}

// ─────────────────────────────────────────────
// 6. [B2B SECURITY SCAN] — Quan trọng nhất
// Quét tất cả file public — FAIL nếu có thông tin B2B
// ─────────────────────────────────────────────
console.log("\n🔒 B2B Security Scan — Kiểm tra file public...");

const publicFilesToScan = [
  { path: path.join(dataDir, "generated/hotels-public.json"), label: "hotels-public.json" },
  { path: path.join(dataDir, "generated/tours-public.json"),  label: "tours-public.json" },
  { path: path.join(dataDir, "generated/daily-combo.json"),   label: "daily-combo.json" },
  // combo-history.json — chỉ chứa metadata combo, không có B2B nhưng vẫn scan để an toàn
  { path: path.join(dataDir, "generated/combo-history.json"), label: "combo-history.json" },
  // draft-combo.json đã chuyển sang data/internal/ — không cần quét ở đây
  // (data/internal/ không bao giờ được deploy/build)
];

for (const { path: filePath, label } of publicFilesToScan) {
  scanPublicFile(filePath, label);
}

// ─────────────────────────────────────────────
// Report
// ─────────────────────────────────────────────
if (warnings.length) {
  console.warn("\n" + warnings.map((item) => `⚠️  Warning: ${item}`).join("\n"));
}

if (errors.length) {
  console.error("\n" + errors.map((item) => `❌ Error: ${item}`).join("\n"));
  console.error(`\n🚫 BUILD STOPPED: ${errors.length} lỗi cần sửa trước khi build.`);
  process.exit(1);
}

console.log(
  `\n✅ Data validation passed: ${hotels.length} hotels (CSV), ` +
  `${flightData.flights.length} flights, ` +
  `${publicTours.length} public tours. ` +
  `B2B scan: CLEAN.`
);
