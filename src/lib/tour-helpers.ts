import type { PublicTour } from "./types";

export function tourImage(country: string): string {
  const normalized = country.toLowerCase();
  if (normalized.includes("trung") || normalized.includes("hong") || normalized.includes("dai") || normalized.includes("đài")) return "/images/tours/china.png";
  if (normalized.includes("thai") || normalized.includes("thái")) return "/images/tours/thailand.png";
  if (normalized.includes("nhat") || normalized.includes("nhật")) return "/images/tours/japan.png";
  if (normalized.includes("han") || normalized.includes("hàn")) return "/images/tours/japan.png";
  if (normalized.includes("bali") || normalized.includes("indo") || normalized.includes("malaysia") || normalized.includes("singapore")) return "/images/tours/bali.png";
  return "/images/ha-long.png";
}

export function tourHref(tour: Pick<PublicTour, "id">): string {
  return `/tour/${tour.id}/`;
}

export function normalizeSearch(value?: any): string {
  if (value === null || value === undefined) return "";
  return String(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}
