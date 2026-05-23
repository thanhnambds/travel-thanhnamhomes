import fs from "node:fs";
import path from "node:path";
import https from "node:https";

const rootDir = process.cwd();
const localHtmlPath = "/Users/nam/.gemini/antigravity/brain/e2b28671-96d3-4d61-99ae-319dbc7f7b62/.system_generated/steps/1888/content.md";
const toursPath = path.join(rootDir, "data/generated/tours-public.json");

// Helper to slugify strings for IDs/slugs
function slugify(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// Helpers to clean HTML and extract content without external packages (zero-dependency)
function extractText(html) {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

function extractLink(html) {
  const match = html.match(/href="([^"]*)"/);
  return match ? match[1].trim() : "";
}

function extractDivItems(html) {
  const items = [];
  const matches = html.matchAll(/<div class="field-item[^>]*>([\s\S]*?)<\/div>/g);
  for (const match of matches) {
    items.push(extractText(match[1]));
  }
  if (items.length === 0) {
    const text = extractText(html);
    if (text) items.push(text);
  }
  return items;
}

// Parse complex Vietnamese date formats like "19/06; 02/10/2026" or "22/05/2026" into ["2026-06-19", "2026-10-02"]
function parseDates(dateItems) {
  const dates = [];
  
  const text = dateItems.join(" ").trim();
  if (!text) return [];
  
  let year = "2026";
  const yearMatch = text.match(/\b(2025|2026|2027)\b/);
  if (yearMatch) {
    year = yearMatch[1];
  }
  
  if (text.toLowerCase().includes("tháng")) {
    // Style A: "Tháng 06: 04, 11, 25 Tháng 07: 02, 09, 16..."
    const sections = text.split(/Tháng|tháng/i).map(s => s.trim()).filter(Boolean);
    for (const section of sections) {
      const match = section.match(/^(\d{1,2})(?:\/(\d{4}))?\s*:/);
      if (!match) continue;
      
      const m = match[1].padStart(2, "0");
      const sectionYear = match[2] || year;
      
      const daysPart = section.slice(section.indexOf(":") + 1).trim();
      const numbers = daysPart.split(/[^0-9]+/).map(n => n.trim()).filter(Boolean);
      for (const num of numbers) {
        const dayVal = parseInt(num, 10);
        // Ngày hợp lệ phải từ 1 đến 31 và không trùng với năm
        if (dayVal >= 1 && dayVal <= 31 && num !== sectionYear) {
          const d = num.padStart(2, "0");
          dates.push(`${sectionYear}-${m}-${d}`);
        }
      }
    }
  } else {
    // Style B: Standard DD/MM/YYYY or DD/MM list
    for (const item of dateItems) {
      const parts = item.split(/[;,]/).map(p => p.trim()).filter(Boolean);
      for (const part of parts) {
        const match = part.match(/(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?/);
        if (match) {
          const d = match[1].padStart(2, "0");
          const m = match[2].padStart(2, "0");
          let y = year;
          if (match[3]) {
            y = match[3].length === 2 ? "20" + match[3] : match[3];
          }
          dates.push(`${y}-${m}-${d}`);
        }
      }
    }
  }
  
  return Array.from(new Set(dates)).sort();
}

function parseMinPrice(priceCellHtml) {
  const priceItems = extractDivItems(priceCellHtml);
  const prices = [];
  for (const item of priceItems) {
    const cleaned = item.replace(/[^0-9]/g, "");
    if (cleaned) {
      const num = parseInt(cleaned, 10);
      if (num > 0) prices.push(num);
    }
  }
  return prices.length > 0 ? Math.min(...prices) : 0;
}

function parseCommission(comCellHtml) {
  const comText = extractText(comCellHtml).replace(/[^0-9]/g, "");
  return comText ? parseInt(comText, 10) : 0;
}

function getDestinationAndCountry(categoryName, title) {
  let destination = categoryName.replace("Tour", "").trim();
  let country = destination;
  
  if (destination.includes("Châu Âu")) {
    destination = "Châu Âu";
    country = "Châu Âu";
  } else if (destination.includes("Úc")) {
    destination = "Úc";
    country = "Úc";
  } else if (destination.includes("Châu Mỹ")) {
    destination = "Mỹ";
    country = "Châu Mỹ";
  } else if (destination.includes("Singapore")) {
    destination = "Singapore";
    country = "Singapore - Malaysia";
  } else if (destination.includes("nội địa") || destination.includes("Trong nước")) {
    destination = "Trong nước";
    country = "Việt Nam";
  } else if (destination.includes("Thái Lan")) {
    destination = "Bangkok";
    country = "Thái Lan";
  } else if (destination.includes("Nhật Bản")) {
    destination = "Tokyo";
    country = "Nhật Bản";
  } else if (destination.includes("Hàn Quốc")) {
    destination = "Seoul";
    country = "Hàn Quốc";
  } else if (destination.includes("Đài Loan")) {
    destination = "Đài Loan";
    country = "Đài Loan";
  } else if (destination.includes("Trung Quốc")) {
    destination = "Thượng Hải";
    country = "Trung Quốc";
  }
  
  return { destination, country };
}

// Main logic
function parseHtml(html) {
  console.log("Starting HTML parsing of partner tour schedule...");
  const scrapedTours = [];
  
  // Split by category headings
  const blocks = html.split("<span class=\"field-content\"><h3>");
  console.log(`Found ${blocks.length - 1} category blocks.`);
  
  let globalIndex = 0;
  for (let i = 1; i < blocks.length; i++) {
    const block = blocks[i];
    const catEndIdx = block.indexOf("</h3>");
    if (catEndIdx === -1) continue;
    const categoryName = block.slice(0, catEndIdx).trim();
    
    // Find tbody
    const tbodyStart = block.indexOf("<tbody>");
    const tbodyEnd = block.indexOf("</tbody>");
    if (tbodyStart === -1 || tbodyEnd === -1) continue;
    const tbodyHtml = block.slice(tbodyStart + 7, tbodyEnd);
    
    // Parse rows
    const rows = tbodyHtml.split("</tr>");
    let rowCount = 0;
    
    for (const row of rows) {
      if (!row.includes("<tr") && !row.includes("<td")) continue;
      
      const cells = row.split("</td>");
      if (cells.length < 5) continue;
      
      // 1. Title and Program Link
      const titleMatch = cells[0].match(/<a[^>]*>([\s\S]*?)<\/a>/);
      const title = titleMatch ? extractText(titleMatch[1]) : extractText(cells[0]);
      let programUrl = extractLink(cells[0]);
      if (programUrl && !programUrl.startsWith("http")) {
        programUrl = "https://www.hoangviettravel.com.vn" + programUrl;
      }
      
      if (!title || title.includes("STICKY")) continue;
      
      // 2. Departure dates
      const dateItems = extractDivItems(cells[1]);
      const departureDates = parseDates(dateItems);
      if (departureDates.length === 0) continue; // Skip if no valid departure dates
      
      // 3. Duration
      const duration = extractText(cells[2]) || "Đang cập nhật";
      
      // 4. Price (Min Price)
      const price = parseMinPrice(cells[3]);
      if (price <= 0) continue; // Skip if price is invalid
      
      // 5. Commission (COM)
      const commission = parseCommission(cells[4]);
      
      // 6. Download / Share Link
      let downloadLink = "";
      if (cells[5]) {
        downloadLink = extractText(cells[5]).includes("http") ? extractText(cells[5]) : extractLink(cells[5]);
      }
      
      // Get standard destination/country
      const { destination, country } = getDestinationAndCountry(categoryName, title);
      
      const id = `f1-hoangviet-${slugify(title).slice(0, 40)}-${globalIndex++}`;
      
      scrapedTours.push({
        id,
        status: "published",
        title,
        destination,
        country,
        duration,
        airline: title.includes("VNA") || title.includes("Vietnam Airlines") ? "VNA" : (title.includes("VJ") || title.includes("Vietjet") ? "Vietjet" : "Đang cập nhật"),
        departure_city: "Hà Nội",
        departure_dates: departureDates,
        price,
        currency: "VND",
        price_note: `Giá tham khảo tại thời điểm cập nhật từ đối tác F1. COM hoa hồng đại lý: ${new Intl.NumberFormat("vi-VN").format(commission)}đ. Vui lòng liên hệ để kiểm tra giá chính xác trước khi giữ dịch vụ.`,
        program_url: downloadLink || programUrl || "https://www.hoangviettravel.com.vn/lich-tour-danh-cho-dai-ly",
        source_sheet_url: "https://www.hoangviettravel.com.vn/lich-tour-danh-cho-dai-ly",
        source_sheet_name: "Hoàng Việt Travel F1",
        source_rows: [i],
        updated_at: new Date().toISOString(),
        public_notes: [
          `Nhà cung cấp: Hoàng Việt Travel (Đối tác chiến lược F1).`,
          `Mức hoa hồng đại lý (COM) của bạn: ${new Intl.NumberFormat("vi-VN").format(commission)}đ.`
        ]
      });
      rowCount++;
    }
    console.log(`Parsed Category "${categoryName}": ${rowCount} valid tours extracted.`);
  }
  
  return scrapedTours;
}

// Load, Merge, and Save
function run() {
  let html = "";
  
  if (fs.existsSync(localHtmlPath)) {
    console.log("Loading partner page HTML from local cache file...");
    html = fs.readFileSync(localHtmlPath, "utf8");
  } else {
    console.error("Local cached content.md not found. Please ensure URL was fetched first!");
    process.exit(1);
  }
  
  const scrapedTours = parseHtml(html);
  console.log(`\nSuccessfully extracted ${scrapedTours.length} total tours from F1 partner.`);
  
  // Read existing tours database
  let existingTours = [];
  if (fs.existsSync(toursPath)) {
    console.log("Reading existing website tours database...");
    existingTours = JSON.parse(fs.readFileSync(toursPath, "utf8"));
  }
  
  // Remove older F1 partner tours to avoid duplicate accumulation
  const nonPartnerTours = existingTours.filter(tour => tour.source_sheet_name !== "Hoàng Việt Travel F1");
  console.log(`Kept ${nonPartnerTours.length} original tours (combos/curated tours).`);
  
  // Merge the new scraped F1 tours
  const mergedTours = [...nonPartnerTours, ...scrapedTours];
  
  // Write back to tours-public.json
  fs.mkdirSync(path.dirname(toursPath), { recursive: true });
  fs.writeFileSync(toursPath, JSON.stringify(mergedTours, null, 2) + "\n");
  console.log(`\nTours database successfully updated at: data/generated/tours-public.json`);
  console.log(`Total tours now live on the site: ${mergedTours.length} tours.`);
}

run();
