import fs from "node:fs";
import path from "node:path";
import type { Combo, PublicTour, SiteConfig, PublicHotel } from "./types";

const rootDir = process.cwd();

function readJson<T>(relativePath: string): T {
  return JSON.parse(fs.readFileSync(path.join(rootDir, relativePath), "utf8")) as T;
}

export function getConfig(): SiteConfig {
  return readJson<SiteConfig>("data/config.json");
}

export function getDailyCombo(): Combo | null {
  const combo = readJson<Partial<Combo>>("data/generated/daily-combo.json");
  return combo.combo_id ? (combo as Combo) : null;
}

export function getComboHistory() {
  return readJson<Array<{ combo_id: string; generated_at: string; destination: string; status: string }>>(
    "data/generated/combo-history.json"
  );
}

export function getPublicTours(): PublicTour[] {
  if (!fs.existsSync(path.join(rootDir, "data/generated/tours-public.json"))) {
    return [];
  }

  const rawTours = readJson<PublicTour[]>("data/generated/tours-public.json").filter((tour) => tour.status === "published");
  return rawTours.map((tour) => ({
    ...tour,
    program_url: "",
    source_sheet_url: "",
    source_sheet_name: "",
    source_rows: []
  }));
}

export function getPublicTourById(id: string): PublicTour | null {
  return getPublicTours().find((tour) => tour.id === id) ?? null;
}

export function getPublicHotels(): PublicHotel[] {
  if (!fs.existsSync(path.join(rootDir, "data/generated/hotels-public.json"))) {
    return [];
  }
  const rawHotels = readJson<PublicHotel[]>("data/generated/hotels-public.json");
  return rawHotels.map((hotel) => ({
    ...hotel,
    original_name: "",
    supplier_name: "",
    source_sheet_url: ""
  }));
}

export function isExpired(combo: Combo): boolean {
  return new Date(combo.expires_at).getTime() < Date.now();
}

export function formatVnd(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value) + "đ";
}

export function formatDate(value: string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(`${value}T12:00:00+07:00`));
}

export function formatShortDate(value: string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit"
  }).format(new Date(`${value}T12:00:00+07:00`));
}
