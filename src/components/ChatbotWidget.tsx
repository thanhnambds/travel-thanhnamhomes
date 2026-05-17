"use client";

import { useMemo, useState } from "react";
import { MessageCircle, Send, X } from "lucide-react";
import type { Combo } from "@/lib/types";

type FormState = {
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

export function ChatbotWidget({ combo, zaloUrl }: { combo: Combo | null; zaloUrl: string }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState<FormState>(initialState);

  const summary = useMemo(() => {
    const destination = form.destination || combo?.destination || "điểm đến phù hợp";
    return `Tôi quan tâm combo ${destination}, đi ${form.adults || "2"} người lớn, ${form.children || "0"} trẻ em, bay từ ${form.departure || "Hà Nội"}, ngày đi dự kiến ${form.date || "chưa chốt"}, số đêm ${form.nights || combo?.nights || "cần tư vấn"}, khách sạn ${form.hotelStar || "cần tư vấn"} sao, ưu tiên ${form.priority || "giá và lịch trình hợp lý"}, ngân sách khoảng ${form.budget || "cần tư vấn"}. Vui lòng kiểm tra giá vé/phòng mới nhất.`;
  }, [combo, form]);

  return (
    <div className="fixed bottom-4 right-4 z-40">
      {open && (
        <div className="mb-3 w-[calc(100vw-32px)] max-w-md rounded-lg border border-slate-200 bg-white shadow-soft">
          <div className="flex items-center justify-between border-b border-slate-200 p-4">
            <div>
              <p className="font-semibold text-brand-ink">Tư vấn combo</p>
              <p className="text-xs text-slate-500">Bot chỉ lọc nhu cầu từ dữ liệu có sẵn.</p>
            </div>
            <button className="focus-ring rounded-md p-2 text-slate-600" onClick={() => setOpen(false)} aria-label="Đóng chat">
              <X size={18} />
            </button>
          </div>
          <div className="max-h-[70vh] space-y-3 overflow-auto p-4">
            <p className="rounded-lg bg-brand-mist p-3 text-sm leading-6 text-brand-ink">
              Em cần vài thông tin để tóm tắt nhu cầu. Giá và tình trạng chỗ sẽ được Thanh Nam kiểm tra lại qua Zalo.
            </p>
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
                  className="mt-1 w-full rounded-md border border-slate-300 bg-white px-3 py-2 text-sm"
                  value={form.priority}
                  onChange={(event) => setForm({ ...form, priority: event.target.value })}
                >
                  <option>Giờ bay đẹp</option>
                  <option>Giá tốt</option>
                  <option>Khách sạn tốt hơn</option>
                </select>
              </label>
            </div>
            <div className="rounded-lg border border-slate-200 bg-slate-50 p-3">
              <p className="text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Tóm tắt gửi Zalo</p>
              <p className="mt-2 text-sm leading-6 text-slate-700">{summary}</p>
            </div>
            <p className="text-xs leading-5 text-slate-500">
              Chatbot không cam kết còn vé, còn phòng hoặc giữ giá. Dữ liệu chỉ là tham khảo tại thời điểm cập nhật.
            </p>
            <a
              className="focus-ring flex items-center justify-center gap-2 rounded-md bg-brand-teal px-4 py-3 font-semibold text-white"
              href={zaloUrl}
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
        className="mt-1 w-full rounded-md border border-slate-300 px-3 py-2 text-sm"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}
