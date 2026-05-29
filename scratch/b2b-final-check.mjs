import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();

const targetDirs = [
  "data/generated",
  "src",
  "public",
  "out",
  ".next/server/app"
];

const patterns = [
  { regex: /Hoàng\s*Việt/i, name: "Hoàng Việt" },
  { regex: /Viettrend/i, name: "Viettrend" },
  { regex: /Cattour/i, name: "Cattour" },
  { regex: /\bF1\b/, name: "F1 (word boundary)" },
  { regex: /\bCOM\b/, name: "COM (word boundary)" },
  { regex: /hoa\s*hồng/i, name: "hoa hồng" },
  { regex: /commission/i, name: "commission" },
  { regex: /supplier/i, name: "supplier" },
  { regex: /source_sheet_url/i, name: "source_sheet_url" },
  { regex: /docs\.google\.com/i, name: "docs.google.com" },
  { regex: /google\.com\/spreadsheets/i, name: "google.com/spreadsheets" },
  { regex: /giá\s*net/i, name: "giá net" }
];

function walkDir(dir, callback) {
  const absolutePath = path.join(rootDir, dir);
  if (!fs.existsSync(absolutePath)) {
    return;
  }
  const files = fs.readdirSync(absolutePath);
  for (const file of files) {
    const filePath = path.join(absolutePath, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDir(path.relative(rootDir, filePath), callback);
    } else {
      callback(filePath);
    }
  }
}

console.log("=== STARTING B2B KEYWORD SECURITY CHECK ===");
let totalMatches = 0;
const results = {};

for (const dir of targetDirs) {
  console.log(`Scanning directory: ${dir}...`);
  walkDir(dir, (filePath) => {
    // Avoid binary/large media files
    const ext = path.extname(filePath).toLowerCase();
    if (ext === ".png" || ext === ".jpg" || ext === ".jpeg" || ext === ".gif" || ext === ".ico" || ext === ".mp4" || ext === ".map") {
      return;
    }
    
    let content;
    try {
      content = fs.readFileSync(filePath, "utf8");
    } catch (e) {
      // Skip files that can't be read
      return;
    }
    
    const fileMatches = [];
    for (const pattern of patterns) {
      if (pattern.regex.test(content)) {
        fileMatches.push(pattern.name);
      }
    }
    
    if (fileMatches.length > 0) {
      const relPath = path.relative(rootDir, filePath);
      results[relPath] = fileMatches;
      totalMatches += fileMatches.length;
    }
  });
}

console.log("\n=== SECURITY CHECK RESULTS ===");
if (totalMatches === 0) {
  console.log("✅ SUCCESS: No B2B keywords found in the checked directories!");
} else {
  console.log(`⚠️ WARNING: Found matches in ${Object.keys(results).length} files:`);
  for (const [file, matches] of Object.entries(results)) {
    console.log(`- ${file}: [${matches.join(", ")}]`);
  }
}
console.log("===============================");
