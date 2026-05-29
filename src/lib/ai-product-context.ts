import fs from "node:fs";
import path from "node:path";
import type { PublicTour, PublicHotel, Combo } from "./types";

const rootDir = process.cwd();

function readJson<T>(relativePath: string): T | null {
  const fullPath = path.join(rootDir, relativePath);
  if (!fs.existsSync(fullPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(fullPath, "utf8")) as T;
  } catch {
    return null;
  }
}

// B2C whitelists to ensure no internal info leaks to AI context
const SAFE_TOUR_KEYS = [
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
] as const;

const SAFE_HOTEL_KEYS = [
  "id",
  "hotel_name",
  "destination",
  "country",
  "stars",
  "updated_at",
] as const;

const SAFE_COMBO_KEYS = [
  "combo_id",
  "title",
  "slug",
  "destination",
  "departure_city",
  "duration",
  "nights",
  "start_date",
  "end_date",
  "flight_summary",
  "airline",
  "outbound_flight_time",
  "return_flight_time",
  "hotel_name",
  "hotel_star",
  "room_type",
  "meal_plan",
  "total_price",
  "price_note",
  "included",
  "excluded",
  "cancellation_policy",
  "child_policy",
  "suitable_for",
  "status",
  "updated_at",
  "expires_at",
] as const;

export function getSafeTourContext(id: string): Partial<PublicTour> | null {
  const tours = readJson<PublicTour[]>("data/generated/tours-public.json");
  if (!tours) return null;
  const tour = tours.find((t) => t.id === id);
  if (!tour) return null;

  const safeTour: Partial<PublicTour> = {};
  for (const key of SAFE_TOUR_KEYS) {
    if (tour[key] !== undefined) {
      safeTour[key] = tour[key] as any;
    }
  }
  return safeTour;
}

export function getSafeHotelContext(id: string): Partial<PublicHotel> | null {
  const hotels = readJson<PublicHotel[]>("data/generated/hotels-public.json");
  if (!hotels) return null;
  const hotel = hotels.find((h) => h.id === id);
  if (!hotel) return null;

  const safeHotel: Partial<PublicHotel> = {};
  for (const key of SAFE_HOTEL_KEYS) {
    if (hotel[key] !== undefined) {
      safeHotel[key] = hotel[key] as any;
    }
  }
  return safeHotel;
}

export function getSafeComboContext(): Partial<Combo> | null {
  const combo = readJson<Combo>("data/generated/daily-combo.json");
  if (!combo) return null;

  const safeCombo: Partial<Combo> = {};
  for (const key of SAFE_COMBO_KEYS) {
    if (combo[key] !== undefined) {
      safeCombo[key] = combo[key] as any;
    }
  }
  return safeCombo;
}

export function getAllSafeProductsContext(): {
  dailyCombo: Partial<Combo> | null;
  toursCount: number;
  hotelsCount: number;
} {
  const dailyCombo = getSafeComboContext();
  const tours = readJson<PublicTour[]>("data/generated/tours-public.json") || [];
  const hotels = readJson<PublicHotel[]>("data/generated/hotels-public.json") || [];
  return {
    dailyCombo,
    toursCount: tours.filter(t => t.status === "published").length,
    hotelsCount: hotels.length
  };
}
