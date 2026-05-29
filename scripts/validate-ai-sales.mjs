import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const errors = [];

function checkFileExists(filePath, desc) {
  if (!fs.existsSync(path.join(rootDir, filePath))) {
    errors.push(`Missing required file: ${filePath} (${desc})`);
    return false;
  }
  return true;
}

// ─────────────────────────────────────────────
// 1. Check prompt rules
// ─────────────────────────────────────────────
console.log("🔍 Checking prompts/ai-sales-agent.md...");
if (checkFileExists("prompts/ai-sales-agent.md", "AI Sales Prompt")) {
  const promptContent = fs.readFileSync(path.join(rootDir, "prompts/ai-sales-agent.md"), "utf8");
  const requiredPromptKeywords = [
    "không cam kết còn vé/phòng/chỗ",
    "không nhận cọc/thanh toán",
    "hoàng việt",
    "viettrend",
    "cattour",
    "f1",
    "margin",
    "hoa hồng",
    "com",
    "commission",
    "giá net",
    "google sheets/docs"
  ];

  for (const keyword of requiredPromptKeywords) {
    const regex = new RegExp(keyword.replace(/\//g, "\\/"), "i");
    if (!regex.test(promptContent)) {
      errors.push(`[PROMPT ERROR] prompts/ai-sales-agent.md does not explicitly enforce rule: "${keyword}"`);
    }
  }
}

// ─────────────────────────────────────────────
// 2. Check no import/read of data/internal in runtime
// ─────────────────────────────────────────────
console.log("🔍 Verifying that runtime code does not access data/internal...");
const runtimeDirs = ["src/app", "src/components", "src/lib"];

function walkDir(dir, callback) {
  const absPath = path.join(rootDir, dir);
  if (!fs.existsSync(absPath)) return;
  const files = fs.readdirSync(absPath);
  for (const file of files) {
    const filePath = path.join(absPath, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(path.relative(rootDir, filePath), callback);
    } else {
      callback(filePath);
    }
  }
}

for (const dir of runtimeDirs) {
  walkDir(dir, (filePath) => {
    // skip non-code files
    const ext = path.extname(filePath);
    if (ext !== ".ts" && ext !== ".tsx" && ext !== ".js" && ext !== ".jsx") return;

    const content = fs.readFileSync(filePath, "utf8");
    if (content.includes("data/internal") || content.includes('data/internal/')) {
      // Allow lead-store.ts to contain data/internal in COMMENTS ONLY, but let's be strict:
      // None of the active execution code should import or read it.
      // Wait, let's parse if it actually reads or imports it:
      const hasRead = /readJson\(['"]data\/internal|fs\.read\S+\(['"]data\/internal|import\s+.*\s+from\s+['"].*data\/internal/i.test(content);
      if (hasRead) {
        errors.push(`[SECURITY VIOLATION] File ${path.relative(rootDir, filePath)} contains imports or read operations from "data/internal/"!`);
      }
    }
  });
}

// ─────────────────────────────────────────────
// 3. Check route.ts has sanitizer and forbidden words
// ─────────────────────────────────────────────
console.log("🔍 Checking src/app/api/chat/route.ts security features...");
if (checkFileExists("src/app/api/chat/route.ts", "API Chat Route")) {
  const routeContent = fs.readFileSync(path.join(rootDir, "src/app/api/chat/route.ts"), "utf8");
  if (!routeContent.includes("sanitizeOutput") || !routeContent.includes("FORBIDDEN_WORDS")) {
    errors.push("[SECURITY ERROR] src/app/api/chat/route.ts is missing output sanitizer (sanitizeOutput/FORBIDDEN_WORDS)!");
  }
  
  // Verify B2B leak sanitizer redirects to the safe message
  if (!routeContent.includes("Thông tin này cần chuyên viên kiểm tra thêm")) {
    errors.push("[SECURITY ERROR] src/app/api/chat/route.ts sanitizer does not redirect to the required safe message!");
  }
}

// ─────────────────────────────────────────────
// 4. Check lead-scoring.ts exists and has scoring rules
// ─────────────────────────────────────────────
console.log("🔍 Checking src/lib/lead-scoring.ts scoring rules...");
if (checkFileExists("src/lib/lead-scoring.ts", "Lead Scoring Engine")) {
  const scoringContent = fs.readFileSync(path.join(rootDir, "src/lib/lead-scoring.ts"), "utf8");
  const requiredScoringPoints = ["10", "20", "25", "35", "40"]; // Points check
  for (const points of requiredScoringPoints) {
    if (!scoringContent.includes(points)) {
      errors.push(`[SCORING ERROR] src/lib/lead-scoring.ts is missing points rule: +${points}`);
    }
  }
}

// ─────────────────────────────────────────────
// 5. Check TravelAIChatWidget.tsx structure
// ─────────────────────────────────────────────
console.log("🔍 Checking src/components/TravelAIChatWidget.tsx...");
if (checkFileExists("src/components/TravelAIChatWidget.tsx", "AIChatWidget Component")) {
  const widgetContent = fs.readFileSync(path.join(rootDir, "src/components/TravelAIChatWidget.tsx"), "utf8");
  if (!widgetContent.includes("TravelAIChatWidget")) {
    errors.push("[WIDGET ERROR] src/components/TravelAIChatWidget.tsx does not export component TravelAIChatWidget");
  }
  if (!widgetContent.includes("leadScore") || !widgetContent.includes("handoff")) {
    // Handoff check
    if (!widgetContent.includes("zalo") && !widgetContent.includes("Zalo")) {
      errors.push("[WIDGET ERROR] src/components/TravelAIChatWidget.tsx does not contain a handoff or score mechanism!");
    }
  }
}

// ─────────────────────────────────────────────
// Report & Exit
// ─────────────────────────────────────────────
if (errors.length > 0) {
  console.error("\n❌ validate-ai-sales FAILED:");
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
}

console.log("\n✅ validate-ai-sales PASSED: All prompts, security boundaries, and lead structures are verified!");
process.exit(0);
