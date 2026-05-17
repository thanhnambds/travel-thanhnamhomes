import fs from "node:fs";
import path from "node:path";
import { dataDir, readHotels, readJson, toNumber } from "./shared.mjs";

const errors = [];
const warnings = [];

function assertFile(relativePath) {
  const fullPath = path.join(dataDir, relativePath);
  if (!fs.existsSync(fullPath)) {
    errors.push(`Missing data file: data/${relativePath}`);
  }
}

assertFile("hotels.csv");
assertFile("flights.mock.json");
assertFile("config.json");

const config = readJson("data/config.json");
if (!config.defaultDepartureCity) errors.push("config.defaultDepartureCity is required.");
if (!config.defaultMarginPercent) errors.push("config.defaultMarginPercent is required.");
if (!config.priceNote?.includes("Giá tham khảo tại thời điểm cập nhật")) {
  errors.push("config.priceNote must include the required price disclaimer.");
}

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

if (warnings.length) {
  console.warn(warnings.map((item) => `Warning: ${item}`).join("\n"));
}

if (errors.length) {
  console.error(errors.map((item) => `Error: ${item}`).join("\n"));
  process.exit(1);
}

console.log(`Data validation passed: ${hotels.length} hotels, ${flightData.flights.length} flights.`);
