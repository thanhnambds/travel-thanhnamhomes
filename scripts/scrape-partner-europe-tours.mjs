import fs from "node:fs";
import path from "node:path";
import https from "node:https";

const rootDir = process.cwd();
const toursPath = path.join(rootDir, "data/generated/tours-public.json");

const spreadsheetBaseUrl = "https://docs.google.com/spreadsheets/d/1cHIR4-aKnX6GUFnV2Ws8IWmXHECrUvvoVzGXiUjknt8/gviz/tq?tqx=out:csv";

const TABS = [
  { gid: "427656824", category: "Châu Âu", defaultDestination: "Châu Âu", defaultCountry: "Châu Âu", sourceName: "Đối tác F1 Châu Âu" },
  { gid: "748989795", category: "Trung Quốc", defaultDestination: "Thượng Hải", defaultCountry: "Trung Quốc", sourceName: "Đối tác F1 Trung Quốc" },
  { gid: "592197310", category: "Nhật Bản", defaultDestination: "Tokyo", defaultCountry: "Nhật Bản", sourceName: "Đối tác F1 Nhật Bản" },
  { gid: "1680885794", category: "Hàn Quốc", defaultDestination: "Seoul", defaultCountry: "Hàn Quốc", sourceName: "Đối tác F1 Hàn Quốc" },
  { gid: "294941338", category: "Đài Loan", defaultDestination: "Đài Bắc", defaultCountry: "Đài Loan", sourceName: "Đối tác F1 Đài Loan" },
  { gid: "1198205320", category: "Thái Lan", defaultDestination: "Bangkok", defaultCountry: "Thái Lan", sourceName: "Đối tác F1 Thái Lan" },
  { gid: "638133474", category: "Singapore", defaultDestination: "Singapore", defaultCountry: "Singapore - Malaysia", sourceName: "Đối tác F1 Đông Nam Á" },
  { gid: "1672152197", category: "Trong nước", defaultDestination: "Trong nước", defaultCountry: "Việt Nam", sourceName: "Đối tác F1 Nội Địa Bay" },
  { gid: "828333297", category: "Trong nước", defaultDestination: "Trong nước", defaultCountry: "Việt Nam", sourceName: "Đối tác F1 Nội Địa Bộ" }
];

const DOC_TITLES = {
  // Châu Âu
  "1pDi0QtSqq6k7OUgOXRThY8LCbkzn1uFL": "Tour Châu Âu Cao Cấp 4 Nước: Pháp - Thụy Sĩ - Ý - Vatican 10N9Đ",
  "1oHyToSkT5dNoMdyUfldTmhPFSXmboxRE": "Tour 5 Nước Tây Âu: Pháp - Luxembourg - Đức - Bỉ - Hà Lan 10N9Đ",
  "18KZ0sc5nkQRCBqfohp28481VqkPybQOR": "Tour 3 Nước Cổ Kính: Pháp - Thụy Sĩ - Ý 9N8Đ (Hàng không Vietnam Airlines)",
  "1G2Vb49N8MF2RnulWNUUN7mJNqDeiFkMm": "Tour Tây Âu Mùa Hè: Pháp - Bỉ - Hà Lan - Đức 9N8Đ",
  "1nEnYvbV9IZUrmsema6h8xH67meN0EbIv": "Tour Siêu Du Lịch Châu Âu 5 Nước 11N10Đ (Vietnam Airlines 4*)",
  "1G1RaEwVziwOSE7ec0rYPiJUeLDZE8UkK": "Tour Châu Âu Mùa Thu Vàng: Pháp - Thụy Sĩ - Ý 11N10Đ",
  "10oGtuNwjWbiwpkkRVYmiEF1_DmcjAImj": "Tour Cao Cấp Tây Âu: Pháp - Thụy Sĩ - Ý - Vatican 10N9Đ (Bay Vietnam Airlines)",
  "1TQPQVjiMuOvJmOV66lxG7gMZZaY8ZnzR": "Tour Tây Âu Thịnh Vượng: Pháp - Đức - Bỉ - Hà Lan 11N10Đ",
  
  // Hàn Quốc
  "18KZ0sc5nkQRCBqfohp28481VqkPybQOR": "Tour Hàn Quốc Cao Cấp 5 Ngày 4 Đêm (Hàng không Vietnam Airlines)",
  "1G2Vb49N8MF2RnulWNUUN7mJNqDeiFkMm": "Tour Hàn Quốc Mùa Hoa Anh Đào 5N4Đ"
};

// Robust CSV parser
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
        i++; 
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      currentRow.push(currentVal);
      currentVal = "";
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') {
        i++; 
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

function extractDocId(url) {
  if (!url) return "";
  const match = url.match(/\/d\/([a-zA-Z0-9-_]+)/);
  return match ? match[1] : "";
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

// Intelligent dynamic column detection - keeping the FIRST match to prevent overlaps
function detectColumns(headers) {
  const mapping = {
    duration: -1,
    airline: -1,
    departure: -1,
    price: -1,
    programUrl: -1,
    title: -1
  };

  headers.forEach((header, idx) => {
    const cleanHeader = header.trim().toUpperCase().replace(/\s+/g, " ");
    if (!cleanHeader) return;
    
    // 1. Duration (Số ngày)
    if (cleanHeader.includes("SỐ NGÀY") || cleanHeader.includes("THỜI GIAN") || cleanHeader.includes("NGÀY/ĐÊM") || cleanHeader.includes("ẢNH ĐOÀN ĂN UỐNG SỐ NGÀY")) {
      if (mapping.duration === -1) mapping.duration = idx;
    }
    
    // 2. Airline (Hãng bay)
    if (cleanHeader.includes("HÃNG BAY") || cleanHeader.includes("HÀNG KHÔNG") || cleanHeader.includes("MÁY BAY") || cleanHeader.includes("PHƯƠNG TIỆN")) {
      if (mapping.airline === -1) mapping.airline = idx;
    }
    
    // 3. Departure Date (Lịch khởi hành)
    if (cleanHeader.includes("KHỞI HÀNH") || cleanHeader.includes("NGÀY ĐI") || cleanHeader.includes("LỊCH ĐI") || cleanHeader.includes("NGÀY KH") || cleanHeader.includes("NGÀY TOUR") || cleanHeader.includes("NGÀY KHỞI HÀNH")) {
      if (mapping.departure === -1) mapping.departure = idx;
    }
    
    // 4. Price (Giá bán)
    if (cleanHeader.includes("GIÁ BÁN") || cleanHeader.includes("GIÁ TOUR") || cleanHeader.includes("GIÁ") || cleanHeader.includes("GIÁ NET")) {
      if (mapping.price === -1 || cleanHeader === "GIÁ" || cleanHeader === "GIÁ BÁN" || cleanHeader === "GIÁ TOUR") {
        mapping.price = idx;
      }
    }
    
    // 5. Program Link (Google Doc)
    if (cleanHeader.includes("LINK") || cleanHeader.includes("CHƯƠNG TRÌNH") || cleanHeader.includes("TÀI LIỆU") || cleanHeader.includes("ĐỐI TÁC") || cleanHeader.includes("CT TOUR") || cleanHeader.includes("CT GỬI")) {
      if (cleanHeader.includes("LINK CHƯƠNG TRÌNH") || cleanHeader.includes("CT ĐỐI TÁC") || cleanHeader.includes("CT GỬI ĐỐI TÁC") || cleanHeader.includes("CT TOUR NLG")) {
        mapping.programUrl = idx;
      } else if (mapping.programUrl === -1) {
        mapping.programUrl = idx;
      }
    }
    
    // 6. Title
    if (cleanHeader.includes("TUYẾN") || cleanHeader.includes("LỊCH TRÌNH") || cleanHeader.includes("CHƯƠNG TRÌNH") || cleanHeader.includes("TOUR SÀI GÒN") || cleanHeader.includes("HN -THÀNH ĐÔ")) {
      if (mapping.title === -1) mapping.title = idx;
    }
  });

  return mapping;
}

async function scrapeTab(tabSpec, today) {
  const sheetUrl = `${spreadsheetBaseUrl}&gid=${tabSpec.gid}`;
  console.log(`\n--------------------------------------------------`);
  console.log(`📡 Fetching tab: [${tabSpec.category}] (gid: ${tabSpec.gid})...`);
  
  try {
    const csvContent = await fetchUrl(sheetUrl);
    const rows = parseCsv(csvContent);
    if (rows.length === 0) return [];
    
    // Find header row
    let headerRowIndex = -1;
    let mapping = null;
    
    for (let i = 0; i < Math.min(rows.length, 10); i++) {
      const row = rows[i];
      const testMapping = detectColumns(row);
      const matchCount = Object.values(testMapping).filter(idx => idx !== -1).length;
      if (matchCount >= 3) {
        headerRowIndex = i;
        mapping = testMapping;
        break;
      }
    }
    
    if (headerRowIndex === -1) {
      console.warn(`⚠️ Warning: Could not detect headers for tab ${tabSpec.category}. Using fallback layout.`);
      mapping = {
        duration: 0,
        airline: 1,
        departure: 5,
        price: 6,
        programUrl: 11,
        title: -1
      };
      headerRowIndex = 0;
    } else {
      console.log(`✅ Header detected at row ${headerRowIndex + 1}:`, mapping);
    }
    
    let currentYear = 2026;
    let activeDocLink = "";
    let activeDuration = "";
    let activeAirline = "";
    let activeTitle = "";
    
    const tourGroups = new Map();
    let skippedCount = 0;
    let validRowsCount = 0;
    
    for (let idx = headerRowIndex + 1; idx < rows.length; idx++) {
      const row = rows[idx];
      if (!row || row.length === 0) continue;
      
      const duration = mapping.duration !== -1 ? (row[mapping.duration] ?? "").trim() : "";
      const airline = mapping.airline !== -1 ? (row[mapping.airline] ?? "").trim() : "";
      const departureVal = mapping.departure !== -1 ? (row[mapping.departure] ?? "").trim() : "";
      const priceVal = mapping.price !== -1 ? (row[mapping.price] ?? "").trim() : "";
      const docLink = mapping.programUrl !== -1 ? (row[mapping.programUrl] ?? "").trim() : "";
      const titleText = mapping.title !== -1 ? (row[mapping.title] ?? "").trim() : "";
      
      // Update year context
      if (departureVal === "2026" || departureVal === "2027" || departureVal === "2025") {
        currentYear = parseInt(departureVal, 10);
        continue;
      }
      
      if (duration && duration.length > 2) activeDuration = duration;
      if (airline && airline.length > 1) activeAirline = airline;
      if (docLink && docLink.includes("docs.google.com")) activeDocLink = docLink;
      if (titleText && titleText.length > 5) activeTitle = titleText;
      
      // Skip row if no price or departure date
      if (!priceVal || !departureVal || departureVal.length < 3) {
        skippedCount++;
        continue;
      }
      
      const cleanPriceStr = priceVal.replace(/[^0-9]/g, "");
      const price = cleanPriceStr ? parseInt(cleanPriceStr, 10) : 0;
      if (price < 100000) {
        skippedCount++;
        continue;
      }
      
      // Parse departure date
      const cleanDept = departureVal.replace(/\([^)]*\)/g, "").replace(/\n/g, " ").trim();
      const dateParts = cleanDept.split("-")[0].trim().split("/");
      if (dateParts.length < 2) {
        skippedCount++;
        continue;
      }
      
      const day = dateParts[0].trim().padStart(2, "0");
      const month = dateParts[1].trim().padStart(2, "0");
      
      // Smart Year extraction: if year is in the date cell, use it! Otherwise, use currentYear
      const year = dateParts[2] && dateParts[2].trim().length >= 4 ? parseInt(dateParts[2].trim(), 10) : currentYear;
      
      const dateString = `${year}-${month}-${day}`;
      const departureDateObj = new Date(`${dateString}T12:00:00+07:00`);
      
      // QA Check: Departure date must be in the FUTURE
      if (departureDateObj < today) {
        skippedCount++;
        continue;
      }
      
      const uniqueGroupId = activeDocLink || activeTitle || `generic-${tabSpec.category}`;
      const docId = extractDocId(activeDocLink);
      
      if (!tourGroups.has(uniqueGroupId)) {
        tourGroups.set(uniqueGroupId, {
          docId,
          programUrl: activeDocLink,
          duration: activeDuration || "5 Ngày 4 Đêm",
          airline: activeAirline || "Hãng bay VIP",
          title: activeTitle,
          prices: [],
          departureDates: []
        });
      }
      
      const groupObj = tourGroups.get(uniqueGroupId);
      groupObj.prices.push(price);
      groupObj.departureDates.push(dateString);
      validRowsCount++;
    }
    
    console.log(`Processed: ${validRowsCount} valid tour dates rows, skipped ${skippedCount} empty/past rows.`);
    
    const parsedTours = [];
    let groupIdx = 0;
    
    for (const group of tourGroups.values()) {
      const sortedDates = Array.from(new Set(group.departureDates)).sort();
      if (sortedDates.length === 0) continue; 
      
      const minPrice = Math.min(...group.prices);
      
      // Build B2C Title
      let tourTitle = "";
      if (group.docId && DOC_TITLES[group.docId]) {
        tourTitle = DOC_TITLES[group.docId];
      } else if (group.title && group.title.length > 10) {
        tourTitle = group.title.replace(/\n/g, " ").replace(/\s+/g, " ").trim();
        tourTitle = tourTitle.slice(0, 1).toUpperCase() + tourTitle.slice(1);
      } else {
        tourTitle = `Tour Du Lịch ${tabSpec.category} Cao Cấp ${group.duration}`;
      }
      
      const id = `f1-${slugify(tabSpec.category)}-${slugify(tourTitle).slice(0, 30)}-${groupIdx++}`;
      
      parsedTours.push({
        id,
        status: "published",
        title: tourTitle,
        destination: tabSpec.defaultDestination,
        country: tabSpec.defaultCountry,
        duration: group.duration,
        airline: group.airline,
        departure_city: "Hà Nội",
        departure_dates: sortedDates,
        price: minPrice,
        currency: "VND",
        price_note: "Giá tham khảo tại thời điểm cập nhật từ đối tác F1. Vui lòng liên hệ để kiểm tra giá và tình trạng chỗ chính xác.",
        program_url: group.programUrl || "https://docs.google.com/spreadsheets/d/1cHIR4-aKnX6GUFnV2Ws8IWmXHECrUvvoVzGXiUjknt8/edit",
        source_sheet_url: sheetUrl,
        source_sheet_name: tabSpec.sourceName,
        source_rows: [1],
        updated_at: new Date().toISOString()
      });
    }
    
    console.log(`✨ Successfully parsed ${parsedTours.length} unique tours from tab [${tabSpec.category}].`);
    return parsedTours;
    
  } catch (err) {
    console.error(`❌ Error scraping tab ${tabSpec.category}:`, err);
    return [];
  }
}

async function main() {
  console.log("==================================================");
  console.log("🚀 STARTING TTA GOOGLE SHEETS MULTI-TAB SCRA-PER");
  console.log("==================================================");
  
  const today = new Date();
  today.setHours(0, 0, 0, 0); 
  
  const allParsedTours = [];
  
  for (const tabSpec of TABS) {
    const tabTours = await scrapeTab(tabSpec, today);
    allParsedTours.push(...tabTours);
  }
  
  console.log(`\n==================================================`);
  console.log(`🎉 Scrape completed! Total F1 tours extracted: ${allParsedTours.length}`);
  console.log("==================================================");
  
  if (allParsedTours.length === 0) {
    console.warn("No upcoming tours found across any tabs. Database update skipped.");
    return;
  }
  
  // Read existing tours database
  let existingTours = [];
  if (fs.existsSync(toursPath)) {
    console.log("Reading existing website tours database...");
    existingTours = JSON.parse(fs.readFileSync(toursPath, "utf8"));
  }
  
  // Remove older F1 tours from ALL of our specific partner source names to prevent duplicates
  const targetSourceNames = TABS.map(tab => tab.sourceName);
  const cleanTours = existingTours.filter(tour => !targetSourceNames.includes(tour.source_sheet_name));
  console.log(`Kept ${cleanTours.length} other custom combos/tours.`);
  
  // Merge the new scraped tours
  const mergedTours = [...cleanTours, ...allParsedTours];
  
  // Write back to tours-public.json
  fs.mkdirSync(path.dirname(toursPath), { recursive: true });
  fs.writeFileSync(toursPath, JSON.stringify(mergedTours, null, 2) + "\n");
  console.log(`\n✅ Tours database successfully updated at: data/generated/tours-public.json`);
  console.log(`📈 Total tours now live on the site: ${mergedTours.length} tours.`);
}

main().catch(console.error);
