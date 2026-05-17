import { hasBlackout, isDateInRange, readHotels, readJson, slugify, toNumber, writeJson, getNowIso } from "./shared.mjs";

const config = readJson("data/config.json");
const flightData = readJson("data/flights.mock.json");
const hotels = readHotels();
const adults = 2;
const children = 0;

function flightHour(flight) {
  return Number(flight.departure_time.split(":")[0]);
}

function hotelNightPrice(hotel, date) {
  const day = new Date(`${date}T12:00:00+07:00`).getDay();
  if (day === 0 || day === 6) return toNumber(hotel.weekend_price);
  return toNumber(hotel.weekday_price);
}

function candidatePairs(destinationCode, nights) {
  const outbound = flightData.flights.filter(
    (flight) => flight.origin === config.defaultDepartureCity && flight.destination === destinationCode
  );
  const inbound = flightData.flights.filter(
    (flight) => flight.origin === destinationCode && flight.destination === config.defaultDepartureCity
  );

  const pairs = [];
  for (const out of outbound) {
    const expectedReturnDate = new Date(`${out.departure_date}T12:00:00+07:00`);
    expectedReturnDate.setDate(expectedReturnDate.getDate() + nights);
    const returnDate = expectedReturnDate.toISOString().slice(0, 10);
    const back = inbound.find((flight) => flight.departure_date === returnDate);
    if (back) pairs.push({ out, back });
  }
  return pairs;
}

function scoreCandidate(candidate) {
  let score = 0;
  score += candidate.hotel.star_rating * 12;
  if (candidate.hotel.star_rating >= 4) score += 8;
  if (flightHour(candidate.outbound) >= 7 && flightHour(candidate.outbound) <= 11) score += 15;
  if (flightHour(candidate.returnFlight) >= 13 && flightHour(candidate.returnFlight) <= 18) score += 15;
  if (candidate.totalPrice < 12000000) score += 8;
  if (candidate.hotel.cancellation_policy.length > 20) score += 10;
  return score;
}

const candidates = [];

for (const [destinationSlug, destination] of Object.entries(config.destinations)) {
  const nights = destination.preferredNights ?? 2;
  const pairs = candidatePairs(destination.airport, nights);
  const validHotels = hotels.filter((hotel) => {
    if (hotel.destination !== destinationSlug) return false;
    if (toNumber(hotel.star_rating) < 3) return false;
    if (!hotel.cancellation_policy || !hotel.notes) return false;
    return true;
  });

  for (const pair of pairs) {
    if (flightHour(pair.out) >= 22 || flightHour(pair.out) < 6) continue;
    if (flightHour(pair.back) >= 22 || flightHour(pair.back) < 6) continue;

    for (const hotel of validHotels) {
      if (!isDateInRange(pair.out.departure_date, hotel.valid_from, hotel.valid_to)) continue;
      if (hasBlackout(pair.out.departure_date, hotel.blackout_dates)) continue;
      const nightPrice = hotelNightPrice(hotel, pair.out.departure_date);
      if (!nightPrice) continue;

      const flightTotal = (toNumber(pair.out.price) + toNumber(pair.back.price)) * adults;
      const hotelTotal = nightPrice * nights;
      const fees = config.defaultFees ?? 0;
      const marginPercent = destination.marginPercent ?? config.defaultMarginPercent;
      const margin = Math.round((flightTotal + hotelTotal + fees) * (marginPercent / 100));
      const totalPrice = flightTotal + hotelTotal + fees + margin;

      candidates.push({
        destinationSlug,
        destination,
        hotel: {
          ...hotel,
          star_rating: toNumber(hotel.star_rating)
        },
        outbound: pair.out,
        returnFlight: pair.back,
        nights,
        flightTotal,
        hotelTotal,
        fees,
        margin,
        totalPrice
      });
    }
  }
}

if (!candidates.length) {
  console.error("No valid combo candidate found. Check hotels.csv, flights.mock.json and config.json.");
  process.exit(1);
}

candidates.sort((a, b) => scoreCandidate(b) - scoreCandidate(a) || a.totalPrice - b.totalPrice);
const selected = candidates[0];
const now = getNowIso();
const start = selected.outbound.departure_date;
const end = selected.returnFlight.departure_date;
const duration = `${selected.nights + 1} ngày ${selected.nights} đêm`;
const comboId = `${selected.destinationSlug}-${start}-${selected.hotel.hotel_id}`.toLowerCase();

const combo = {
  combo_id: comboId,
  title: `Combo ${selected.destination.name} ${duration} bay từ Hà Nội, khách sạn ${selected.hotel.star_rating} sao`,
  slug: slugify(`combo ${selected.destination.name} ${duration} ha noi ${start}`),
  destination: selected.destination.name,
  destination_slug: selected.destinationSlug,
  departure_city: config.defaultDepartureCity,
  duration,
  nights: selected.nights,
  start_date: start,
  end_date: end,
  flight_summary: `${selected.outbound.origin}-${selected.outbound.destination} ${selected.outbound.flight_number} ${selected.outbound.departure_time}-${selected.outbound.arrival_time}, ${selected.returnFlight.origin}-${selected.returnFlight.destination} ${selected.returnFlight.flight_number} ${selected.returnFlight.departure_time}-${selected.returnFlight.arrival_time}`,
  airline: selected.outbound.airline === selected.returnFlight.airline ? selected.outbound.airline : `${selected.outbound.airline} / ${selected.returnFlight.airline}`,
  outbound_flight_time: selected.outbound.departure_time,
  return_flight_time: selected.returnFlight.departure_time,
  hotel_name: selected.hotel.hotel_name,
  hotel_star: selected.hotel.star_rating,
  room_type: selected.hotel.room_type,
  meal_plan: selected.hotel.meal_plan,
  guests: { adults, children },
  base_flight_price: selected.flightTotal,
  hotel_price: selected.hotelTotal,
  fees: selected.fees,
  margin: selected.margin,
  total_price: selected.totalPrice,
  price_note: config.priceNote,
  included: [
    `Vé máy bay khứ hồi tham khảo cho ${adults} người lớn`,
    `${selected.nights} đêm phòng ${selected.hotel.room_type}`,
    selected.hotel.meal_plan
  ],
  excluded: [
    "Hành lý ký gửi nếu chưa bao gồm trong hạng vé",
    "Xe đưa đón sân bay",
    "Chi phí cá nhân và dịch vụ không nêu trong phần bao gồm"
  ],
  cancellation_policy: selected.hotel.cancellation_policy,
  child_policy: selected.hotel.child_policy,
  suitable_for: selected.destination.audiences,
  status: "draft",
  generated_at: now,
  updated_at: now,
  published_at: null,
  expires_at: `${start}T23:59:59+07:00`,
  source_log: {
    flight_source: flightData.source,
    hotel_source: "data/hotels.csv",
    flight_updated_at: flightData.updated_at,
    price_updated_at: now
  }
};

writeJson("data/generated/draft-combo.json", combo);
console.log(`Draft combo generated: ${combo.title} (${combo.total_price} VND).`);
