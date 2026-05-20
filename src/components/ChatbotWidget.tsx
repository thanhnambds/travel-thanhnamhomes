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
    <div className="fixed bottom-6 right-6 z-40">
      {open && (
        <div className="mb-4 w-[calc(100vw-48px)] max-w-md overflow-hidden rounded-[24px] border border-brand-hairline/80 bg-white/95 backdrop-blur-md shadow-2xl transition-all duration-300">
          <div className="flex items-center justify-between border-b border-brand-hairline/30 bg-gradient-to-r from-brand-primary to-brand-goldDark p-5 text-white">
            <div>
              <p className="display-type text-lg font-normal text-white">Trợ lý du lịch cá nhân</p>
              <p className="text-[10px] uppercase tracking-wider font-bold text-white/70">Tư vấn thông minh & chốt qua Zalo</p>
            </div>
            <button className="focus-ring rounded-full p-2 text-white/80 transition hover:bg-white/10 hover:text-white" onClick={() => setOpen(false)} aria-label="Đóng chat">
              <X size={18} />
            </button>
          </div>
          <div className="max-h-[60vh] space-y-4 overflow-auto p-5">
            <p className="rounded-xl bg-brand-soft border border-brand-coral/10 p-3.5 text-xs leading-6 text-brand-ink font-medium">
              Xin chào! Tôi có thể hỗ trợ lọc nhanh hàng chục tour và combo đã duyệt trên hệ thống. Hãy hỏi nhanh (ví dụ: "Phú Quốc tháng 7") hoặc điền thông tin bên dưới, tôi sẽ tóm tắt nhu cầu gửi trực tiếp qua Zalo.
            </p>
            <label className="block text-xs font-bold uppercase tracking-wider text-brand-primary">
              Hỏi nhanh hành trình
              <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-brand-hairline bg-white px-3 py-2.5 shadow-sm focus-within:border-brand-coral/60 transition-all">
                <Search size={15} className="shrink-0 text-brand-slate" />
                <input
                  className="w-full text-sm outline-none bg-transparent"
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
              <Field label="Điểm đến mong muốn" value={form.destination} onChange={(value) => setForm({ ...form, destination: value })} placeholder={combo?.destination ?? "Phú Quốc, Đà Nẵng..."} />
              <Field label="Ngày khởi hành dự kiến" value={form.date} onChange={(value) => setForm({ ...form, date: value })} placeholder="Ví dụ: cuối tháng 6" />
              <div className="grid grid-cols-3 gap-2">
                <Field label="Số đêm" value={form.nights} onChange={(value) => setForm({ ...form, nights: value })} placeholder="2" />
                <Field label="Người lớn" value={form.adults} onChange={(value) => setForm({ ...form, adults: value })} placeholder="2" />
                <Field label="Trẻ em" value={form.children} onChange={(value) => setForm({ ...form, children: value })} placeholder="0" />
              </div>
              <Field label="Nơi khởi hành (Bay từ)" value={form.departure} onChange={(value) => setForm({ ...form, departure: value })} placeholder="Hà Nội" />
              <div className="grid grid-cols-2 gap-2">
                <Field label="Dự kiến ngân sách" value={form.budget} onChange={(value) => setForm({ ...form, budget: value })} placeholder="10-15 triệu" />
                <Field label="Tiêu chuẩn khách sạn" value={form.hotelStar} onChange={(value) => setForm({ ...form, hotelStar: value })} placeholder="4 sao" />
              </div>
              <label className="text-xs font-bold uppercase tracking-wider text-brand-primary">
                Tiêu chí ưu tiên
                <select
                  className="mt-1.5 w-full rounded-lg border border-brand-hairline bg-white px-3 py-2.5 text-sm focus:border-brand-coral/60 focus:outline-none"
                  value={form.priority}
                  onChange={(event) => setForm({ ...form, priority: event.target.value })}
                >
                  <option>Giờ bay đẹp</option>
                  <option>Giá tốt</option>
                  <option>Khách sạn tốt hơn</option>
                </select>
              </label>
            </div>
            <div className="rounded-xl border border-brand-hairline/80 bg-brand-blueWash p-4">
              <p className="mono-label text-[10px] uppercase font-bold text-brand-slate tracking-widest">Tóm tắt nhu cầu gửi Zalo</p>
              <p className="mt-2 text-xs leading-5 text-brand-ink font-semibold italic">"{summary}"</p>
            </div>
            <p className="text-[10px] leading-relaxed text-brand-slate">
              * Lưu ý: Giá trị combo và tình trạng chỗ/phòng có thể thay đổi liên tục. Chuyên viên sẽ đối chiếu trực tiếp khi nhận được yêu cầu qua Zalo.
            </p>
            <a
              className="focus-ring flex items-center justify-center gap-2 rounded-full bg-brand-gold px-4 py-3.5 text-xs font-bold uppercase tracking-widest text-brand-primary shadow-md hover:bg-brand-goldLight transition-all duration-300 hover:-translate-y-0.5"
              href={zaloHref}
              target="_blank"
              rel="noreferrer"
            >
              <Send size={14} />
              Gửi yêu cầu qua Zalo
            </a>
          </div>
        </div>
      )}
      <button
        className="focus-ring relative flex h-14 w-14 items-center justify-center rounded-full bg-brand-coral text-white shadow-lg transition-transform duration-300 hover:scale-110 active:scale-95 pulse-gold-glow"
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
