import fs from "node:fs";
import path from "node:path";
import https from "node:https";

const rootDir = process.cwd();
// ⚠️  OUTPUT: data/internal/ — KHÔNG phải data/generated/
// File này chứa dữ liệu raw B2B (supplier_name, source_sheet_url, original_name).
// Để sinh file public sạch, chạy: npm run normalize:data && npm run filter:public
const outputFile = path.join(rootDir, "data/internal/hotels-raw.json");

const supplierName = "Viettrend Travel F1";

const partnerSheets = [
  {
    name: "Khách sạn Miền Bắc",
    url: "https://docs.google.com/spreadsheets/d/1iKg4Vu6rSydNMGOJScHibOJLodRi7iVM8zWaB737Se4/gviz/tq?tqx=out:csv&gid=1602890560",
    editUrl: "https://docs.google.com/spreadsheets/d/1iKg4Vu6rSydNMGOJScHibOJLodRi7iVM8zWaB737Se4/edit#gid=1602890560"
  },
  {
    name: "Khách sạn Miền Trung",
    url: "https://docs.google.com/spreadsheets/d/19WtS3E6daKQofzDDPTa1p9UncjI-E6zGVoMScCv4fU4/gviz/tq?tqx=out:csv&gid=1602890560",
    editUrl: "https://docs.google.com/spreadsheets/d/19WtS3E6daKQofzDDPTa1p9UncjI-E6zGVoMScCv4fU4/edit#gid=1602890560"
  },
  {
    name: "Khách sạn Miền Nam",
    url: "https://docs.google.com/spreadsheets/d/1_ZQx0Ohb2xseLXuzKsPeKej5xMfgKRbZszegCiCNQps/gviz/tq?tqx=out:csv&gid=1602890560",
    editUrl: "https://docs.google.com/spreadsheets/d/1_ZQx0Ohb2xseLXuzKsPeKej5xMfgKRbZszegCiCNQps/edit#gid=1602890560"
  }
];

const DESTINATION_KEYWORDS = [
  "SAPA", "HÀ GIANG", "HÒA BÌNH", "TUYÊN QUANG", "SƠN LA", "YÊN BÁI", "NINH BÌNH", "VĨNH PHÚC", "PHÚ THỌ", "HÀ NỘI", 
  "BẮC GIANG", "BẮC NINH", "HÀ NAM", "QUẢNG NINH", "DU THUYỀN", "CÁT BÀ", "HẢI PHÒNG", "CAO BẰNG", "LẠNG SƠN",
  "THANH HÓA", "NGHỆ AN", "HÀ TĨNH", "QUẢNG BÌNH", "HUẾ", "QUẢNG TRỊ", "ĐÀ NẴNG", "QUY NHƠN", "QUẢNG NAM", "HỘI AN", 
  "NHA TRANG", "ĐÀ LẠT", "PHÚ YÊN", "NINH THUẬN", "MŨI NÉ", "BÌNH THUẬN", "TÂY NINH", "SÀI GÒN", "CÔN ĐẢO", 
  "VŨNG TÀU", "CẦN THƠ", "PHÚ QUỐC", "TP HCM", "HỒ CHÍ MINH", "ĐẮK LẮK", "KOM TUM"
];

// Robust CSV parser that handles newlines, commas, and escaped quotes inside double quotes
function parseCsv(content) {
  const rows = [];
  let currentVal = "";
  let currentRow = [];
  let inQuotes = false;
  
  for (let i = 0; i < content.length; i++) {
    const char = content[i];
    const nextChar = content[i + 1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        currentVal += '"';
        i++; // skip next quote
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentVal);
      currentVal = "";
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; // skip \n
      }
      currentRow.push(currentVal);
      rows.push(currentRow);
      currentRow = [];
      currentVal = "";
    } else {
      currentVal += char;
    }
  }
  
  if (currentVal || currentRow.length > 0) {
    currentRow.push(currentVal);
    rows.push(currentRow);
  }
  
  return rows;
}

function fetchUrl(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { "User-Agent": "Mozilla/5.0" } }, (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        resolve(data);
      });
    }).on("error", (err) => {
      reject(err);
    });
  });
}

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

function extractStars(name) {
  const clean = name.toUpperCase();
  // Match patterns like "5 SAO", "5*", "5-STAR", " 5 " or ends with " 5"
  const match = clean.match(/\b(3|4|5|6)\s*(SAO|\*|STAR)\b/) || clean.match(/\s+(3|4|5|6)$/);
  if (match) {
    return parseInt(match[1], 10);
  }
  return null;
}

function cleanHotelName(name) {
  let clean = name.replace(/\r?\n|\r/g, " ").trim();
  
  // Remove leading/trailing quotes, commas, brackets or spaces
  clean = clean.replace(/^[,\s"'\(\)\[\]\-]+/g, "");
  clean = clean.replace(/[,\s"'\(\)\[\]\-]+$/g, "");

  // Remove standard prefixes (like SP_, HG_, ĐN_, C.THƠ_, B.TH_, BTH_, VT_, CĐ_ etc.)
  // Matches any characters up to the first underscore, e.g. "C.THƠ_" -> removes "C.THƠ_"
  clean = clean.replace(/^[^_]+_/g, "");
  
  // Remove rating indicators like 5*, 4*, 3*, 5 sao, 4 sao, 3 sao, 5 *, 5star
  clean = clean.replace(/\s*\d+\s*(\*|sao|star)\b/gi, "");
  clean = clean.replace(/\s*\d+\s*\*/gi, "");
  
  // Final clean up of quotes and commas
  clean = clean.replace(/^[,\s"'\(\)\[\]\-]+/g, "");
  clean = clean.replace(/[,\s"'\(\)\[\]\-]+$/g, "");

  return clean.replace(/\s+/g, " ").trim();
}

async function main() {
  console.log("Starting robust scrape for F1 Viettrend hotels from spreadsheets...");
  const allHotels = [];
  
  for (const sheet of partnerSheets) {
    try {
      console.log(`\nFetching sheet: ${sheet.name}...`);
      const csvContent = await fetchUrl(sheet.url);
      
      const rows = parseCsv(csvContent);
      let headerRowIndex = -1;
      let headers = [];
      
      // 1. Detect header row by checking keywords match count
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i].map(c => c.trim().toUpperCase());
        const matchCount = row.filter(cell => DESTINATION_KEYWORDS.includes(cell)).length;
        if (matchCount >= 3) {
          headerRowIndex = i;
          headers = rows[i].map(c => c.trim());
          console.log("Headers detected.");
          break;
        }
      }
      
      if (headerRowIndex === -1) {
        console.warn(`Could not detect destination header row in sheet ${sheet.name}. Skipping...`);
        continue;
      }
      
      // 2. Build mapping of column index to normalized destination
      const colDestinations = [];
      let currentDestination = "";
      
      for (let colIdx = 0; colIdx < headers.length; colIdx++) {
        const rawDest = headers[colIdx].trim().toUpperCase();
        if (DESTINATION_KEYWORDS.includes(rawDest)) {
          currentDestination = headers[colIdx].trim();
        } else if (rawDest === "" && currentDestination !== "") {
          // keep previous
        } else {
          currentDestination = "";
        }
        colDestinations.push(currentDestination);
      }
      
      // 3. Extract hotels from each column
      let hotelCount = 0;
      const columns = headers.length;
      
      for (let colIdx = 0; colIdx < columns; colIdx++) {
        const destination = colDestinations[colIdx];
        if (!destination) continue;
        
        const normDest = destination
          .split(" ")
          .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
          .join(" ")
          .replace("Tp Hcm", "Sài Gòn")
          .replace("Tphcm", "Sài Gòn")
          .replace("Hồ Chí Minh", "Sài Gòn")
          .replace("Du Thuyen", "Du thuyền")
          .replace("Du thuyền", "Du thuyền Hạ Long");
          
        for (let rowIdx = headerRowIndex + 1; rowIdx < rows.length; rowIdx++) {
          const rowCells = rows[rowIdx];
          const cellContent = (rowCells[colIdx] ?? "").trim();
          
          if (cellContent && cellContent.length > 2) {
            if (cellContent.startsWith("http") || cellContent.includes("https://") || cellContent.toUpperCase().includes("KHÁCH SẠN")) {
              continue;
            }
            
            const cleanName = cleanHotelName(cellContent);
            if (cleanName.length < 3) continue;
            
            const stars = extractStars(cellContent);
            
            const hotelId = `f1-viettrend-${slugify(normDest)}-${slugify(cleanName)}`.slice(0, 80);
            
            allHotels.push({
              id: hotelId,
              hotel_name: cleanName,
              original_name: cellContent.replace(/\r?\n|\r/g, " ").trim(),
              destination: normDest,
              country: "Việt Nam",
              supplier_name: supplierName,
              stars: stars,
              source_sheet_url: sheet.editUrl,
              updated_at: new Date().toISOString()
            });
            hotelCount++;
          }
        }
      }
      
      console.log(`Extracted ${hotelCount} hotels from ${sheet.name}.`);
    } catch (err) {
      console.error(`Error processing sheet ${sheet.name}:`, err);
    }
  }
  
  const uniqueHotelsMap = new Map();
  for (const hotel of allHotels) {
    uniqueHotelsMap.set(hotel.id, hotel);
  }
  const uniqueHotels = Array.from(uniqueHotelsMap.values());
  
  console.log(`\nTotal unique F1 Viettrend hotels parsed successfully: ${uniqueHotels.length}`);
  
  fs.mkdirSync(path.dirname(outputFile), { recursive: true });
  fs.writeFileSync(outputFile, JSON.stringify(uniqueHotels, null, 2) + "\n");
  console.log(`\n✅ [RAW B2B] Saved ${uniqueHotels.length} hotels to: data/internal/hotels-raw.json`);
  console.log(`⚠️  File này CHỨA dữ liệu B2B (supplier, sheet URL). Không deploy trực tiếp!`);
  console.log(`👉 Bước tiếp theo: npm run normalize:data && npm run filter:public`);

}

main().catch(console.error);
