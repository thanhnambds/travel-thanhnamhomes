import { scoreLead } from "../src/lib/lead-scoring.ts";
import { getSafeTourContext, getSafeHotelContext, getSafeComboContext } from "../src/lib/ai-product-context.ts";

// Duplicate sanitizer pattern logic from route.ts for direct unit testing
const FORBIDDEN_WORDS = [
  /Hoàng\s*Việt/i,
  /Viettrend/i,
  /Cattour/i,
  /\bF1\b/,
  /\bCOM\b/,
  /hoa\s*hồng/i,
  /commission/i,
  /supplier/i,
  /source_sheet_url/i,
  /docs\.google\.com/i,
  /google\.com\/spreadsheets/i,
  /giá\s*net/i
];

function sanitizeOutput(text) {
  const hasLeak = FORBIDDEN_WORDS.some(regex => regex.test(text));
  if (hasLeak) {
    return "Thông tin này cần chuyên viên kiểm tra thêm. Anh/chị để lại số điện thoại/Zalo, bên em sẽ hỗ trợ chính xác hơn ạ.";
  }
  return text;
}

console.log("=== STARTING CHAT & SALES AGENT UNIT TESTS ===");
let passed = 0;
let failed = 0;

function assert(condition, message) {
  if (condition) {
    console.log(`  ✅ [PASS] ${message}`);
    passed++;
  } else {
    console.error(`  ❌ [FAIL] ${message}`);
    failed++;
  }
}

// ─────────────────────────────────────────────
// 1. Test Output Sanitizer
// ─────────────────────────────────────────────
console.log("\n1. Testing B2B Output Sanitizer...");

const leakedB2BResponse1 = "Chào chị, tour này bên đối tác Hoàng Việt bên em vận hành.";
const sanitized1 = sanitizeOutput(leakedB2BResponse1);
assert(
  sanitized1 === "Thông tin này cần chuyên viên kiểm tra thêm. Anh/chị để lại số điện thoại/Zalo, bên em sẽ hỗ trợ chính xác hơn ạ.",
  "Sanitizer should block 'Hoàng Việt' and return fallback text"
);

const leakedB2BResponse2 = "Giá net đại lý là 5.000.000đ đã cộng hoa hồng commission.";
const sanitized2 = sanitizeOutput(leakedB2BResponse2);
assert(
  sanitized2 === "Thông tin này cần chuyên viên kiểm tra thêm. Anh/chị để lại số điện thoại/Zalo, bên em sẽ hỗ trợ chính xác hơn ạ.",
  "Sanitizer should block 'hoa hồng' and 'commission' and return fallback text"
);

const leakedB2BResponse3 = "Bảng giá gốc ở link docs.google.com/spreadsheets/d/123";
const sanitized3 = sanitizeOutput(leakedB2BResponse3);
assert(
  sanitized3 === "Thông tin này cần chuyên viên kiểm tra thêm. Anh/chị để lại số điện thoại/Zalo, bên em sẽ hỗ trợ chính xác hơn ạ.",
  "Sanitizer should block google sheet links and return fallback text"
);

const cleanB2CResponse = "Chào anh/chị, gói du lịch Đà Nẵng này trọn gói vé bay khứ hồi Vietnam Airlines và khách sạn 4 sao ạ.";
const sanitizedClean = sanitizeOutput(cleanB2CResponse);
assert(
  sanitizedClean === cleanB2CResponse,
  "Sanitizer should let clean B2C marketing texts pass unaltered"
);

// ─────────────────────────────────────────────
// 2. Test Lead Scoring Engine
// ─────────────────────────────────────────────
console.log("\n2. Testing Lead Scoring Engine...");

// Test Case: Asks for price
const chatPrice = [{ role: "user", parts: [{ text: "Combo này giá bao nhiêu thế em?" }] }];
const scorePrice = scoreLead(chatPrice, true);
assert(
  scorePrice.score === 15, // 5 (product) + 10 (price)
  `Price query score should be 15, got ${scorePrice.score}`
);

// Test Case: Asks for availability + dates + guests
const chatDetailed = [{ role: "user", parts: [{ text: "Tuần sau ngày 15/06 bên em còn chỗ cho 4 người lớn không?" }] }];
const scoreDetailed = scoreLead(chatDetailed, true);
assert(
  scoreDetailed.score === 70, // 5 (product) + 20 (dates) + 20 (guests) + 25 (availability)
  `Detailed query score should be 70, got ${scoreDetailed.score}`
);
assert(
  scoreDetailed.label === "hot",
  `Detailed query label should be 'hot', got ${scoreDetailed.label}`
);

// Test Case: Leaves Phone + payment inquiry
const chatUrgent = [{ role: "user", parts: [{ text: "Số zalo của anh là 0912345678, anh muốn chuyển khoản cọc luôn để giữ chỗ nhé" }] }];
const scoreUrgent = scoreLead(chatUrgent, true);
assert(
  scoreUrgent.score === 105, // 5 (product) + 25 (availability) + 35 (payment) + 40 (contact)
  `Urgent query score should be 105, got ${scoreUrgent.score}`
);
assert(
  scoreUrgent.label === "urgent",
  `Urgent query label should be 'urgent', got ${scoreUrgent.label}`
);

// ─────────────────────────────────────────────
// 3. Test B2C Whitelisted context
// ─────────────────────────────────────────────
console.log("\n3. Testing B2C Whitelisted context...");
const tourContext = getSafeTourContext("combo-da-nang-3n2d");
if (tourContext) {
  assert(
    tourContext.supplier_name === undefined && tourContext.source_sheet_url === undefined,
    "Tour context must never expose B2B fields like supplier_name or source_sheet_url"
  );
  assert(
    tourContext.title !== undefined && tourContext.price !== undefined,
    "Tour context must contain B2C fields like title and price"
  );
} else {
  console.log("  ⚠️ Skip: tour context combo-da-nang-3n2d not found (this is normal if generated data is empty)");
}

console.log(`\n=== UNIT TESTS COMPLETE: ${passed} passed, ${failed} failed ===`);
if (failed === 0) {
  process.exit(0);
} else {
  process.exit(1);
}
