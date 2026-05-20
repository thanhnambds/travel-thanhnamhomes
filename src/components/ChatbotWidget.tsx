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
      return `Tôi quan tâm tour ${bestTour.title}, ${bestTour.duration}, bay ${bestTour.airline}, khởi hành ${bestTour.departure_dates.map(formatDate).join(", ")}, giá tham khảo ${formatVnd(bestTour.price)}/người. Vui lòng kiểm tra giúp tình trạng chỗ và giá mới nhất.`;
    }

    const destination = form.destination || combo?.destination || "điểm đến phù hợp";
    return `Tôi quan tâm combo/tour ${destination}, đi ${form.adults || "2"} người lớn, ${form.children || "0"} trẻ em, bay từ ${form.departure || "Hà Nội"}, ngày đi dự kiến ${form.date || "chưa chốt"}, số đêm ${form.nights || combo?.nights || "cần tư vấn"}, khách sạn ${form.hotelStar || "cần tư vấn"} sao, ưu tiên ${form.priority || "giá và lịch trình hợp lý"}, ngân sách khoảng ${form.budget || "cần tư vấn"}. Vui lòng kiểm tra giá mới nhất.`;
  }, [bestTour, combo, form]);

  const zaloHref = `${zaloUrl}?text=${encodeURIComponent(summary)}`;

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {open && (
        <div className="mb-3 w-[calc(100vw-32px)] max-w-md overflow-hidden rounded-[22px] border border-brand-hairline bg-white shadow-soft">
          <div className="flex items-center justify-between border-b border-brand-hairline bg-brand-primary p-4 text-white">
            <div>
              <p className="font-medium">Trợ lý tour & combo</p>
              <p className="text-xs text-brand-muted">Chỉ tư vấn theo dữ liệu đã duyệt trên web.</p>
            </div>
            <button className="focus-ring rounded-full p-2 text-white" onClick={() => setOpen(false)} aria-label="Đóng chat">
              <X size={18} />
            </button>
          </div>
          <div className="max-h-[70vh] space-y-3 overflow-auto p-4">
            <p className="rounded-lg bg-brand-stone p-3 text-sm leading-6 text-brand-ink">
              Anh/chị hỏi tour hoặc combo cần tìm. Em sẽ lọc trong danh sách đang mở bán, sau đó tóm tắt để Thanh Nam kiểm tra lại qua Zalo.
            </p>
            <label className="block text-sm font-medium text-brand-ink">
              Hỏi nhanh
              <div className="mt-1 flex items-center gap-2 rounded-md border border-brand-hairline bg-white px-3 py-2">
                <Search size={16} className="shrink-0 text-brand-slate" />
                <input
                  className="w-full text-sm outline-none"
                  value={form.question}
                  onChange={(event) => setForm({ ...form, question: event.target.value })}
                  placeholder="Ví dụ: Thượng Hải tháng 6 rẻ nhất"
                />
              </div>
            </label>
            {form.question.trim() && (
              <TourAnswer question={form.question} tours={suggestedTours} />
            )}
            <div className="grid gap-3">
              <Field label="Điểm đến" value={form.destination} onChange={(value) => setForm({ ...form, destination: value })} placeholder={combo?.destination ?? "Phú Quốc, Đà Nẵng..."} />
              <Field label="Ngày đi dự kiến" value={form.date} onChange={(value) => setForm({ ...form, date: value })} placeholder="Ví dụ: cuối tháng 6" />
              <div className="grid grid-cols-3 gap-2">
                <Field label="Số đêm" value={form.nights} onChange={(value) => setForm({ ...form, nights: value })} placeholder="2" />
                <Field label="Người lớn" value={form.adults} onChange={(value) => setForm({ ...form, adults: value })} placeholder="2" />
                <Field label="Trẻ em" value={form.children} onChange={(value) => setForm({ ...form, children: value })} placeholder="0" />
              </div>
              <Field label="Bay từ" value={form.departure} onChange={(value) => setForm({ ...form, departure: value })} placeholder="Hà Nội" />
              <div className="grid grid-cols-2 gap-2">
                <Field label="Ngân sách" value={form.budget} onChange={(value) => setForm({ ...form, budget: value })} placeholder="10-15 triệu" />
                <Field label="Sao KS" value={form.hotelStar} onChange={(value) => setForm({ ...form, hotelStar: value })} placeholder="4" />
              </div>
              <label className="text-sm font-medium text-brand-ink">
                Ưu tiên
                <select
                  className="mt-1 w-full rounded-md border border-brand-hairline bg-white px-3 py-2 text-sm"
                  value={form.priority}
                  onChange={(event) => setForm({ ...form, priority: event.target.value })}
                >
                  <option>Giờ bay đẹp</option>
                  <option>Giá tốt</option>
                  <option>Khách sạn tốt hơn</option>
                </select>
              </label>
            </div>
            <div className="rounded-lg border border-brand-hairline bg-brand-blueWash p-3">
              <p className="mono-label text-xs uppercase text-brand-slate">Tóm tắt gửi Zalo</p>
              <p className="mt-2 text-sm leading-6 text-brand-ink">{summary}</p>
            </div>
            <p className="text-xs leading-5 text-brand-slate">
              Chatbot không cam kết còn vé, còn phòng hoặc giữ giá. Dữ liệu chỉ là tham khảo tại thời điểm cập nhật.
            </p>
            <a
              className="focus-ring flex items-center justify-center gap-2 rounded-full bg-brand-primary px-4 py-3 text-sm font-medium text-white"
              href={zaloHref}
              target="_blank"
              rel="noreferrer"
            >
              <Send size={17} />
              Gửi nhu cầu qua Zalo
            </a>
          </div>
        </div>
      )}
      <button
        className="focus-ring flex h-14 w-14 items-center justify-center rounded-full bg-brand-coral text-white shadow-soft"
        onClick={() => setOpen((value) => !value)}
        aria-label="Mở chatbot"
      >
        <MessageCircle size={24} />
      </button>
    </div>
  );
}

function TourAnswer({ question, tours }: { question: string; tours: PublicTour[] }) {
  if (!tours.length) {
    return (
      <div className="rounded-lg border border-brand-hairline bg-white p-3 text-sm leading-6 text-brand-ink">
        <div className="mb-2 flex items-center gap-2 font-medium">
          <Bot size={16} />
          Kết quả từ dữ liệu đã duyệt
        </div>
        Hiện em chưa thấy tour phù hợp với câu hỏi "{question}" trong danh sách đang mở bán trên web. Anh/chị gửi nhu cầu qua Zalo để Thanh Nam kiểm tra thêm với đối tác.
      </div>
    );
  }

  const tour = tours[0];

  return (
    <div className="rounded-lg border border-brand-hairline bg-white p-3 text-sm leading-6 text-brand-ink">
      <div className="mb-2 flex items-center gap-2 font-medium">
        <Bot size={16} />
        Tour phù hợp nhất
      </div>
      <p>
        Em tìm thấy <strong>{tour.title}</strong>, {tour.duration}, bay {tour.airline}, khởi hành{" "}
        {tour.departure_dates.map(formatDate).join(", ")}, giá tham khảo{" "}
        <strong>{formatVnd(tour.price)}/người</strong>.
      </p>
      <p className="mt-2 text-xs leading-5 text-brand-slate">{tour.price_note}</p>
      <div className="mt-3 flex flex-wrap gap-2">
        {tour.program_url && (
          <a className="rounded-full border border-brand-hairline px-3 py-1.5 text-xs font-medium text-brand-primary" href={tour.program_url} target="_blank" rel="noreferrer">
            Xem lịch trình
          </a>
        )}
        <a className="rounded-full border border-brand-hairline px-3 py-1.5 text-xs font-medium text-brand-primary" href={tour.source_sheet_url} target="_blank" rel="noreferrer">
          Nguồn dữ liệu
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
    <label className="text-sm font-medium text-brand-ink">
      {label}
      <input
        className="mt-1 w-full rounded-md border border-brand-hairline px-3 py-2 text-sm focus:border-brand-focus focus:outline-none"
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
