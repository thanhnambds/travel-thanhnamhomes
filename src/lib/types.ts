export type ComboStatus = "draft" | "published" | "expired";

export interface Combo {
  combo_id: string;
  title: string;
  slug: string;
  destination: string;
  destination_slug: string;
  departure_city: string;
  duration: string;
  nights: number;
  start_date: string;
  end_date: string;
  flight_summary: string;
  airline: string;
  outbound_flight_time: string;
  return_flight_time: string;
  hotel_name: string;
  hotel_star: number;
  room_type: string;
  meal_plan: string;
  guests: {
    adults: number;
    children: number;
  };
  base_flight_price: number;
  hotel_price: number;
  fees: number;
  margin: number;
  total_price: number;
  price_note: string;
  included: string[];
  excluded: string[];
  cancellation_policy: string;
  child_policy: string;
  suitable_for: string[];
  status: ComboStatus;
  generated_at: string;
  updated_at: string;
  published_at: string | null;
  expires_at: string;
  source_log: {
    flight_source: string;
    hotel_source: string;
    flight_updated_at: string;
    price_updated_at: string;
  };
}

export interface SiteConfig {
  siteUrl: string;
  zaloUrl: string;
  defaultDepartureCity: string;
  defaultMarginPercent: number;
  defaultFees: number;
  priceNote: string;
  destinations: Record<
    string,
    {
      name: string;
      airport: string;
      marginPercent: number;
      preferredNights: number;
      audiences: string[];
    }
  >;
}

export type TourStatus = "draft" | "published" | "expired";

export interface PublicTour {
  id: string;
  status: TourStatus;
  title: string;
  destination: string;
  country: string;
  duration: string;
  airline: string;
  departure_city: string;
  departure_dates: string[];
  price: number;
  currency: "VND";
  price_note: string;
  program_url: string;
  source_sheet_url: string;
  source_sheet_name: string;
  source_rows: number[];
  updated_at: string;
  public_notes: string[];
}
