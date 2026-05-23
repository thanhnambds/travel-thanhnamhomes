"use client";

import { useMemo, useState } from "react";
import { Bot, MessageCircle, Search, Send, X } from "lucide-react";
import type { Combo, PublicTour } from "@/lib/types";

type FormState = {
  question: string;
  destination: string;
  date: string;
  nights: string;
  adults: string;
  children: string;
  departure: string;
  budget: string;
  hotelStar: string;
  priority: string;
};

const initialState: FormState = {
  question: "",
  destination: "",
  date: "",
  nights: "",
  adults: "2",
  children: "0",
  departure: "Hà Nội",
  budget: "",
  hotelStar: "",
  priority: "Giờ bay đẹp"
};

export function ChatbotWidget({ combo, tours, zaloUrl }: { combo: Combo | null; tours: PublicTour[]; zaloUrl: string }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(initialState);

  const suggestedTours = useMemo(() => findTours(form.question, tours), [form.question, tours]);
  const bestTour = suggestedTours[0] ?? null;

  const summary = useMemo(() => {
    if (bestTour) {
      return `Kính gửi Thanh Nam Homes Travel, tôi quan tâm chương trình đặc quyền: ${bestTour.title} (${bestTour.duration}), bay ${bestTour.airline}, khởi hành dự kiến ngày ${bestTour.departure_dates.map(formatDate).join(", ")}, giá công bố ${formatVnd(bestTour.price)}/người. Vui lòng kết nối chuyên viên tư vấn và kiểm tra tình trạng giữ chỗ giúp tôi.`;
    }

    const destination = form.destination || combo?.destination || "điểm đến mong muốn";
    return `Kính gửi Thanh Nam Homes Travel, tôi cần tư vấn thiết kế hành trình thiết kế riêng đi ${destination}. Thông tin cơ bản: đoàn gồm ${form.adults || "2"} người lớn, ${form.children || "0"} trẻ em; xuất phát từ ${form.departure || "Hà Nội"}, thời gian khởi hành dự kiến ${form.date || "chưa chốt"}, nghỉ dưỡng ${form.nights || combo?.nights || "cần tư vấn"} đêm; tiêu chuẩn khách sạn ${form.hotelStar || "cần tư vấn"} sao; ưu tiên dịch vụ ${form.priority || "Giờ bay đẹp"}; ngân sách khoảng ${form.budget || "cần tư vấn"}. Xin trân trọng cảm ơn!`;
  }, [bestTour, combo, form]);

  const zaloHref = `${zaloUrl}?text=${encodeURIComponent(summary)}`;

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {open && (
        <div className="mb-4 w-[calc(100vw-48px)] max-w-md overflow-hidden rounded-[26px] border border-brand-hairline bg-white shadow-soft transition-all duration-300">
          <div className="flex items-center justify-between border-b border-brand-hairline bg-slate-900 p-5 text-white">
            <div>
              <p className="font-semibold text-brand-gold">Thanh Nam Travel Concierge</p>
              <p className="text-[11px] text-white/60">Thiết kế kỳ nghỉ độc bản dành riêng cho giới tinh hoa</p>
            </div>
            <button className="focus-ring rounded-full p-2 text-white/80 hover:bg-white/10 hover:text-white" onClick={() => setOpen(false)} aria-label="Đóng chat">
              <X size={18} />
            </button>
          </div>
          <div className="max-h-[60vh] space-y-4 overflow-auto p-5">
            <p className="rounded-2xl bg-brand-stone p-4 text-sm leading-relaxed text-brand-ink border border-brand-hairline/50">
              Kính chào Quý khách! Tôi là Trợ lý kỳ nghỉ VIP từ <strong>Thanh Nam Homes Travel</strong>. Tôi sẽ giúp Quý khách tinh chọn những hành trình du lịch đẳng cấp và tối ưu chi phí nhất. Hãy đặt câu hỏi hoặc gửi mong muốn của Quý khách dưới đây.
            </p>
            <label className="block text-sm font-semibold text-brand-primary">
              Tìm kiếm nhanh tour & combo
              <div className="mt-1.5 flex items-center gap-2 rounded-xl border border-brand-hairline bg-white px-3.5 py-2.5 shadow-sm focus-within:border-brand-gold focus-within:ring-1 focus-within:ring-brand-gold">
                <Search size={18} className="shrink-0 text-brand-slate" />
                <input
                  className="w-full text-sm outline-none text-brand-primary"
                  value={form.question}
                  onChange={(event) => setForm({ ...form, question: event.target.value })}
                  placeholder="Ví dụ: Phú Quốc resort 4 sao, Đà Nẵng rẻ nhất..."
                />
              </div>
            </label>
            {form.question.trim() && (
              <TourAnswer question={form.question} tours={suggestedTours} />
            )}
            <div className="grid gap-3">
              <Field label="Điểm đến mong muốn" value={form.destination} onChange={(value) => setForm({ ...form, destination: value })} placeholder={combo?.destination ?? "Phú Quốc, Đà Nẵng, Nha Trang..."} />
              <Field label="Thời gian khởi hành" value={form.date} onChange={(value) => setForm({ ...form, date: value })} placeholder="Ví dụ: Cuối tháng 6, đầu tháng 7..." />
              <div className="grid grid-cols-3 gap-2">
                <Field label="Số đêm nghỉ" value={form.nights} onChange={(value) => setForm({ ...form, nights: value })} placeholder="2" />
                <Field label="Khách lớn" value={form.adults} onChange={(value) => setForm({ ...form, adults: value })} placeholder="2" />
                <Field label="Trẻ em" value={form.children} onChange={(value) => setForm({ ...form, children: value })} placeholder="0" />
              </div>
              <Field label="Điểm xuất phát" value={form.departure} onChange={(value) => setForm({ ...form, departure: value })} placeholder="Hà Nội / TP. HCM" />
              <div className="grid grid-cols-2 gap-2">
                <Field label="Ngân sách dự kiến" value={form.budget} onChange={(value) => setForm({ ...form, budget: value })} placeholder="10 - 15 triệu/người" />
                <Field label="Khách sạn (Sao)" value={form.hotelStar} onChange={(value) => setForm({ ...form, hotelStar: value })} placeholder="4 sao hoặc 5 sao" />
              </div>
              <label className="text-sm font-semibold text-brand-primary">
                Ưu tiên đặc quyền
                <select
                  className="mt-1.5 w-full rounded-xl border border-brand-hairline bg-white px-3.5 py-2.5 text-sm outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
                  value={form.priority}
                  onChange={(event) => setForm({ ...form, priority: event.target.value })}
                >
                  <option>Giờ bay đẹp nhất</option>
                  <option>Tối ưu chi phí tối đa</option>
                  <option>Resort/Khách sạn cao cấp nhất</option>
                </select>
              </label>
            </div>
            <div className="rounded-xl border border-brand-hairline bg-brand-soft p-4">
              <p className="mono-label text-xs uppercase text-brand-goldDark font-bold tracking-wider">TÓM TẮT ĐẶC QUYỀN GỬI CHUYÊN VIÊN</p>
              <p className="mt-2 text-sm leading-relaxed text-brand-ink italic">"{summary}"</p>
            </div>
            <p className="text-[11px] leading-relaxed text-brand-slate">
              * Lưu ý: Dữ liệu mang tính chất tham khảo tại thời điểm cập nhật. Chuyên viên của chúng tôi sẽ liên hệ lại để xác nhận tình trạng vé và phòng chính xác nhất trước khi làm dịch vụ.
            </p>
            <a
              className="focus-ring flex items-center justify-center gap-2 rounded-xl bg-brand-gold px-4 py-3.5 text-sm font-bold text-brand-primary shadow-md transition duration-300 hover:bg-brand-goldLight"
              href={zaloHref}
              target="_blank"
              rel="noreferrer"
            >
              <Send size={17} />
              Kết nối Chuyên viên VIP qua Zalo
            </a>
          </div>
        </div>
      )}
      <button
        className="focus-ring flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-soft transition duration-300 hover:scale-105 hover:bg-slate-800 border border-brand-gold"
        onClick={() => setOpen((value) => !value)}
        aria-label="Mở chatbot"
      >
        <MessageCircle size={24} className="text-brand-gold animate-pulse" />
      </button>
    </div>
  );
}

function TourAnswer({ question, tours }: { question: string; tours: PublicTour[] }) {
  if (!tours.length) {
    return (
      <div className="rounded-2xl border border-brand-hairline bg-white p-4 text-sm leading-relaxed text-brand-ink shadow-sm">
        <div className="mb-2.5 flex items-center gap-2 font-bold text-brand-goldDark">
          <Bot size={18} />
          Kết quả từ dữ liệu đã duyệt
        </div>
        Dạ, hiện tại hệ thống chưa tìm thấy tour khớp chính xác với yêu cầu "{question}" trong danh sách đã duyệt. Xin Quý khách vui lòng điền form dưới đây hoặc nhắn Zalo để chuyên viên thiết kế riêng hành trình độc bản.
      </div>
    );
  }

  const tour = tours[0];

  return (
    <div className="rounded-2xl border border-brand-hairline bg-white p-4 text-sm leading-relaxed text-brand-ink shadow-sm">
      <div className="mb-3 flex items-center gap-2 font-bold text-brand-goldDark">
        <Bot size={18} />
        Hành trình đề xuất tốt nhất
      </div>
      <p className="font-semibold text-brand-primary">{tour.title}</p>
      <ul className="mt-2.5 space-y-1.5 text-xs text-brand-slate">
        <li>• <strong>Thời gian:</strong> {tour.duration}</li>
        <li>• <strong>Hàng không:</strong> {tour.airline}</li>
        <li>• <strong>Khởi hành từ:</strong> {tour.departure_city}</li>
        <li>• <strong>Các ngày khởi hành:</strong> {tour.departure_dates.map(formatDate).join(", ")}</li>
        <li>• <strong>Giá tham khảo:</strong> <span className="text-sm font-bold text-brand-goldDark">{formatVnd(tour.price)}/người</span></li>
      </ul>
      <p className="mt-3 border-t border-brand-hairline pt-2.5 text-[11px] leading-relaxed text-brand-slate italic">{tour.price_note}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {tour.program_url && (
          <a className="rounded-full border border-brand-hairline px-3 py-1.5 text-xs font-semibold text-brand-primary transition hover:bg-brand-soft" href={tour.program_url} target="_blank" rel="noreferrer">
            Xem lịch trình chi tiết
          </a>
        )}
        <a className="rounded-full border border-brand-hairline px-3 py-1.5 text-xs font-semibold text-brand-primary transition hover:bg-brand-soft" href={tour.source_sheet_url} target="_blank" rel="noreferrer">
          Nguồn bảng giá đối tác
        </a>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
}) {
  return (
    <label className="text-sm font-semibold text-brand-primary">
      {label}
      <input
        className="mt-1.5 w-full rounded-xl border border-brand-hairline px-3.5 py-2.5 text-sm focus:border-brand-gold focus:ring-1 focus:ring-brand-gold focus:outline-none"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}

function findTours(question: string, tours: PublicTour[]): PublicTour[] {
  const normalizedQuestion = normalize(question);
  if (!normalizedQuestion) return [];

  const month = extractMonth(normalizedQuestion);
  const hasCheapIntent = /re nhat|gia tot|gia re|thap nhat|cheap/.test(normalizedQuestion);
  const queryWords = normalizedQuestion
    .split(/\s+/)
    .filter((word) => word.length >= 3 && !["tour", "combo", "thang", "nhat", "gia", "nguoi"].includes(word));

  const matches = tours.filter((tour) => {
    const haystack = normalize(`${tour.title} ${tour.destination} ${tour.country} ${tour.duration} ${tour.airline}`);
    const destinationMatch = queryWords.some((word) => haystack.includes(word));
    const monthMatch = month ? tour.departure_dates.some((date) => Number(date.slice(5, 7)) === month) : true;
    return destinationMatch && monthMatch;
  });

  return matches.sort((a, b) => {
    if (hasCheapIntent) return a.price - b.price;
    return a.departure_dates[0].localeCompare(b.departure_dates[0]) || a.price - b.price;
  });
}

function extractMonth(value: string): number | null {
  const monthMatch = value.match(/(?:thang|th)\s*(\d{1,2})/) ?? value.match(/(?:^|\D)(\d{1,2})\s*\/\s*2026/);
  if (!monthMatch) return null;
  const month = Number(monthMatch[1]);
  return month >= 1 && month <= 12 ? month : null;
}

function normalize(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/[^\w\s/]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function formatVnd(value: number): string {
  return new Intl.NumberFormat("vi-VN").format(value) + "đ";
}

function formatDate(value: string): string {
  return new Intl.DateTimeFormat("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric"
  }).format(new Date(`${value}T12:00:00+07:00`));
}
