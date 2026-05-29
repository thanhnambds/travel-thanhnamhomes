import fs from "node:fs";
import path from "node:path";

const rootDir = process.cwd();
const toursPath = path.join(rootDir, "data/generated/tours-public.json");

const tours = JSON.parse(fs.readFileSync(toursPath, "utf8"));
const singaporeTours = tours.filter(tour => tour.source_sheet_name === "Đối tác F1 Đông Nam Á");

console.log(`Found ${singaporeTours.length} tours from Singapore tab:`);
singaporeTours.forEach(tour => {
  console.log(`- Title: "${tour.title}" | Destination: "${tour.destination}" | Price: ${tour.price}`);
});
