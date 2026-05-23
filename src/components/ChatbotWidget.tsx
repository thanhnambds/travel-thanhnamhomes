"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, MessageCircle, Send, X, ArrowRight, RotateCcw } from "lucide-react";
import type { Combo, PublicTour } from "@/lib/types";

type Message = {
  sender: "bot" | "user";
  text: string;
  timestamp: Date;
  tourCard?: PublicTour;
  actionButtons?: string[];
  isZaloBridge?: boolean;
};

export function ChatbotWidget({ combo, tours, zaloUrl }: { combo: Combo | null; tours: PublicTour[]; zaloUrl: string }) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  // Khởi tạo tin nhắn chào mừng mặc định
  useEffect(() => {
    if (messages.length === 0) {
      resetChat();
    }
  }, [messages]);

  function resetChat() {
    setMessages([
      {
        sender: "bot",
        text: "Kính chào Quý khách! Em là Trợ lý hành trình Concierge VIP từ **Thanh Nam Homes Travel**. Rất vinh dự được đồng hành cùng Quý khách thiết kế một kỳ nghỉ độc bản. Hôm nay Quý khách đang quan tâm đến điểm đến hay combo du lịch nào ạ?",
        timestamp: new Date(),
        actionButtons: [
          "Tìm Combo Đà Nẵng 3N2Đ",
          "Tìm Combo Phú Quốc 3N2Đ",
          "Tìm Combo Nha Trang 3N2Đ",
          "Tư vấn thiết kế kỳ nghỉ riêng"
        ]
      }
    ]);
  }

  function handleSend(text: string) {
    if (!text.trim()) return;

    // 1. Thêm tin nhắn của User
    const userMsg: Message = {
      sender: "user",
      text: text,
      timestamp: new Date()
    };
    setMessages((prev) => [...prev, userMsg]);
    setInputValue("");

    // 2. Trả lời thông minh sau 600ms giả lập gõ
    setTimeout(() => {
      const reply = analyzeAndReply(text);
      setMessages((prev) => [...prev, reply]);
    }, 600);
  }

  function handleActionButtonClick(buttonText: string) {
    // Nếu là các nút giữ chỗ/Zalo chuyên viên
    if (
      buttonText.includes("giữ chỗ") || 
      buttonText.includes("Zalo") || 
      buttonText.includes("tư vấn riêng") ||
      buttonText.includes("Đặt combo")
    ) {
      triggerZaloRedirect();
      return;
    }

    if (buttonText === "Tìm điểm đến khác" || buttonText === "Về Menu chính" || buttonText === "Menu chính") {
      resetChat();
      return;
    }

    // Chuyển nút hành động thành tin nhắn chat của user
    let queryText = buttonText;
    if (buttonText === "Tìm Combo Đà Nẵng 3N2Đ" || buttonText === "Combo Đà Nẵng 2.99M") queryText = "Đà Nẵng";
    if (buttonText === "Tìm Combo Phú Quốc 3N2Đ" || buttonText === "Combo Phú Quốc 3.89M") queryText = "Phú Quốc";
    if (buttonText === "Tìm Combo Nha Trang 3N2Đ" || buttonText === "Combo Nha Trang 3.49M") queryText = "Nha Trang";
    if (buttonText === "Tư vấn thiết kế kỳ nghỉ riêng" || buttonText === "Thiết kế hành trình riêng") queryText = "Bespoke";

    handleSend(queryText);
  }

  function triggerZaloRedirect() {
    // Tìm tour cuối cùng được hiển thị trong đoạn chat
    const lastTour = messages.slice().reverse().find((m) => m.tourCard)?.tourCard;
    let zaloText = "";

    if (lastTour) {
      zaloText = `Kính gửi Thanh Nam Homes Travel, tôi quan tâm chương trình đặc quyền: ${lastTour.title} (${lastTour.duration}), bay ${lastTour.airline}, khởi hành dự kiến ngày ${lastTour.departure_dates.map(formatDate).join(", ")}, giá công bố ${formatVnd(lastTour.price)}/người. Vui lòng kết nối chuyên viên tư vấn và kiểm tra tình trạng giữ chỗ giúp tôi.`;
    } else {
      zaloText = `Kính gửi Thanh Nam Homes Travel, tôi vừa trò chuyện với Trợ lý ảo Concierge VIP trên website và muốn kết nối với Chuyên viên tư vấn để được hỗ trợ thiết kế Kỳ nghỉ Độc bản. Xin cảm ơn!`;
    }

    const finalZaloUrl = `${zaloUrl}?text=${encodeURIComponent(zaloText)}`;
    window.open(finalZaloUrl, "_blank");

    // Thêm tin nhắn xác nhận trong khung chat
    setMessages((prev) => [
      ...prev,
      {
        sender: "bot",
        text: "Dạ, em đã chuyển tiếp thông tin chặng bay và đang kết nối Quý khách tới Zalo Chuyên viên VIP của Thanh Nam Travel. Chuyên viên sẽ lập tức phản hồi và hỗ trợ kiểm tra vé, phòng trống cho Quý khách ạ!",
        timestamp: new Date()
      }
    ]);
  }

  function analyzeAndReply(query: string): Message {
    const normalized = normalize(query);
    const hasDaNang = /da nang|my khe|ba na/.test(normalized);
    const hasPhuQuoc = /phu quoc|dao ngoc/.test(normalized);
    const hasNhaTrang = /nha trang|tran phu/.test(normalized);
    const hasHaLong = /ha long|tuan chau|du thuyen/.test(normalized);
    const hasBespoke = /thiet ke|rieng|bespoke|tu van|yeu cau|ca nhan/.test(normalized);
    const hasCheap = /re nhat|gia tot|gia re|uu dai|thap nhat|re/.test(normalized);
    const hasHello = /chao|xin chao|hello|hi|bonjour/.test(normalized);

    const now = new Date();

    if (hasHello) {
      return {
        sender: "bot",
        text: "Dạ, em xin kính chào Quý khách! Chúc Quý khách một ngày tốt lành. Hôm nay em có thể giúp gì cho kỳ nghỉ của Quý khách ạ? Em đang có sẵn các gói combo Đà Nẵng, Phú Quốc, Nha Trang với giá ưu đãi đặc biệt đấy ạ!",
        timestamp: now,
        actionButtons: ["Combo Đà Nẵng 2.99M", "Combo Phú Quốc 3.89M", "Combo Nha Trang 3.49M", "Thiết kế hành trình riêng"]
      };
    }

    if (hasDaNang) {
      const daNangTour = tours.find((t) => t.id === "combo-da-nang-3n2d") ?? tours.find((t) => t.destination.includes("Đà Nẵng"));
      if (daNangTour) {
        return {
          sender: "bot",
          text: "Dạ, em xin đề xuất **Combo Đà Nẵng 3N2Đ** tinh tuyển dành cho Quý khách. Đây là gói hành trình nghỉ dưỡng sát biển cực kỳ bán chạy:",
          timestamp: now,
          tourCard: daNangTour,
          actionButtons: ["Đăng ký giữ chỗ Đà Nẵng", "Tìm điểm đến khác"]
        };
      }
    }

    if (hasPhuQuoc) {
      const phuQuocTour = tours.find((t) => t.id === "combo-phu-quoc-3n2d") ?? tours.find((t) => t.destination.includes("Phú Quốc"));
      if (phuQuocTour) {
        return {
          sender: "bot",
          text: "Dạ, nghỉ dưỡng đảo Ngọc là lựa chọn tuyệt vời! Em xin đề xuất chương trình đặc quyền **Combo Phú Quốc 3N2Đ** với resort sang trọng sát biển:",
          timestamp: now,
          tourCard: phuQuocTour,
          actionButtons: ["Đăng ký giữ chỗ Phú Quốc", "Tìm điểm đến khác"]
        };
      }
    }

    if (hasNhaTrang) {
      const nhaTrangTour = tours.find((t) => t.id === "combo-nha-trang-3n2d") ?? tours.find((t) => t.destination.includes("Nha Trang"));
      if (nhaTrangTour) {
        return {
          sender: "bot",
          text: "Dạ, Nha Trang biển xanh cát trắng vẫy gọi! Em đề xuất **Combo Nha Trang 3N2Đ** nghỉ dưỡng 5 sao đắc địa mặt phố Trần Phú sầm uất:",
          timestamp: now,
          tourCard: nhaTrangTour,
          actionButtons: ["Đăng ký giữ chỗ Nha Trang", "Tìm điểm đến khác"]
        };
      }
    }

    if (hasHaLong) {
      const haLongTour = tours.find((t) => t.destination.includes("Hạ Long"));
      if (haLongTour) {
        return {
          sender: "bot",
          text: "Dạ, hành trình khám phá vịnh di sản Hạ Long trên du thuyền 5 sao đẳng cấp dành cho Quý khách:",
          timestamp: now,
          tourCard: haLongTour,
          actionButtons: ["Đăng ký giữ chỗ Hạ Long", "Tìm điểm đến khác"]
        };
      } else {
        return {
          sender: "bot",
          text: "Dạ, hiện tại các gói du thuyền Hạ Long 5 sao đang được cập nhật lại bảng giá ưu đãi chặng hè. Quý khách có muốn em kết nối Zalo chuyên viên gửi ngay bảng giá mới nhất trong vòng 5 phút không ạ?",
          timestamp: now,
          actionButtons: ["Kết nối Zalo tư vấn Hạ Long", "Về Menu chính"]
        };
      }
    }

    if (hasBespoke) {
      return {
        sender: "bot",
        text: "Dạ, thiết kế hành trình thiết kế riêng biệt (Bespoke Journey) chính là dịch vụ đặc quyền đỉnh cao của **Thanh Nam Homes Travel**. Để lên lịch trình tinh chọn nhất, Quý khách vui lòng kết nối nhanh với Chuyên viên tư vấn VIP qua Zalo. Chuyên viên sẽ thiết kế sơ đồ chặng bay, đặt resort sang trọng biệt lập và lên lịch trình gửi Quý khách lập tức ạ!",
        timestamp: now,
        isZaloBridge: true,
        actionButtons: ["Kết nối Zalo tư vấn riêng", "Về Menu chính"]
      };
    }

    if (hasCheap) {
      const sorted = [...tours].sort((a, b) => a.price - b.price);
      if (sorted.length > 0) {
        return {
          sender: "bot",
          text: `Dạ, em xin gợi ý chặng hành trình có giá ưu đãi đặc biệt tiết kiệm nhất hiện tại: **${sorted[0].title}** với giá công bố chỉ **${formatVnd(sorted[0].price)}/khách**.`,
          timestamp: now,
          tourCard: sorted[0],
          actionButtons: ["Đặt combo giá rẻ này", "Tìm điểm đến khác"]
        };
      }
    }

    // Hỗ trợ tìm kiếm thông minh từ do
    const queryWords = normalized
      .split(/\s+/)
      .filter((word) => word.length >= 3 && !["tour", "combo", "thang", "nhat", "gia", "nguoi"].includes(word));
    
    const matches = tours.filter((tour) => {
      const haystack = normalize(`${tour.title} ${tour.destination} ${tour.country} ${tour.duration} ${tour.airline}`);
      return queryWords.some((word) => haystack.includes(word));
    });

    if (matches.length > 0) {
      return {
        sender: "bot",
        text: `Dạ, dựa trên tìm kiếm "${query}" của Quý khách, em đề xuất hành trình phù hợp nhất sau đây:`,
        timestamp: now,
        tourCard: matches[0],
        actionButtons: ["Đặt giữ chỗ ngay", "Tìm điểm đến khác"]
      };
    }

    // Fallback mặc định
    return {
      sender: "bot",
      text: `Dạ, em đã ghi nhận yêu cầu tìm kiếm của Quý khách về: *"${query}"*. Do tình trạng vé máy bay khứ hồi và phòng khách sạn đối tác thay đổi liên tục theo giờ, em kính mời Quý khách kết nối trực tiếp với Chuyên viên tư vấn VIP qua Zalo để kiểm tra giá vé và phòng trống chính xác nhất tại thời điểm hiện tại cho Quý khách nhé!`,
      timestamp: now,
      isZaloBridge: true,
      actionButtons: ["Kết nối nhanh Zalo Chuyên viên", "Về Menu chính"]
    };
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {open && (
        <div className="mb-4 w-[calc(100vw-48px)] max-w-md overflow-hidden rounded-[30px] border border-brand-hairline bg-white shadow-soft transition-all duration-300 animate-scaleUp">
          
          {/* Header */}
          <div className="flex items-center justify-between border-b border-brand-hairline bg-slate-900 p-5 text-white">
            <div className="flex items-center gap-3">
              <Bot className="text-brand-gold animate-bounce" size={24} />
              <div>
                <p className="font-bold text-brand-gold tracking-wide">AI Concierge Assistant</p>
                <p className="text-[10px] text-white/50">Thanh Nam Travel VIP Concierge</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5">
              <button 
                className="rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
                onClick={resetChat}
                title="Bắt đầu lại cuộc hội thoại"
                aria-label="Làm mới chat"
              >
                <RotateCcw size={16} />
              </button>
              <button 
                className="rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white" 
                onClick={() => setOpen(false)} 
                aria-label="Đóng chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Chat Logs Area */}
          <div className="flex h-[420px] flex-col gap-4 overflow-y-auto bg-slate-50 p-5">
            {messages.map((msg, index) => (
              <div 
                key={index}
                className={`flex flex-col gap-2 ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                {/* Bubble */}
                <div 
                  className={`max-w-[85%] rounded-[20px] p-4 text-sm leading-relaxed shadow-sm border ${
                    msg.sender === "user"
                      ? "rounded-tr-none bg-slate-900 text-white border-slate-950"
                      : "rounded-tl-none bg-white text-brand-primary border-brand-hairline"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>

                {/* Structured Tour Card inside Chat Bubble */}
                {msg.tourCard && (
                  <div className="w-[85%] rounded-2xl border border-brand-hairline bg-white p-4 shadow-md animate-fadeIn mt-1.5">
                    <p className="font-bold text-brand-primary text-sm">{msg.tourCard.title}</p>
                    <ul className="mt-2 space-y-1.5 text-xs text-brand-slate">
                      <li>• <strong>Thời gian:</strong> {msg.tourCard.duration}</li>
                      <li>• <strong>Hàng không:</strong> {msg.tourCard.airline}</li>
                      <li>• <strong>Khởi hành từ:</strong> {msg.tourCard.departure_city}</li>
                      <li>• <strong>Các ngày:</strong> {msg.tourCard.departure_dates.map(formatDate).join(", ")}</li>
                      <li>• <strong>Giá ưu đãi:</strong> <span className="text-sm font-bold text-brand-goldDark">{formatVnd(msg.tourCard.price)}/khách</span></li>
                    </ul>
                    <p className="mt-2 border-t border-brand-hairline pt-2 text-[10px] leading-relaxed text-brand-slate italic">{msg.tourCard.price_note}</p>
                    {msg.tourCard.program_url && (
                      <a 
                        className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-brand-hairline px-3.5 py-1.5 text-[11px] font-bold text-brand-primary transition hover:bg-slate-50" 
                        href={msg.tourCard.program_url} 
                        target="_blank" 
                        rel="noreferrer"
                      >
                        Chi tiết lịch trình <ArrowRight size={12} />
                      </a>
                    )}
                  </div>
                )}

                {/* Quick Reply / Action Buttons */}
                {msg.actionButtons && msg.actionButtons.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-1 max-w-[90%]">
                    {msg.actionButtons.map((btn, btnIndex) => (
                      <button
                        key={btnIndex}
                        onClick={() => handleActionButtonClick(btn)}
                        className="rounded-full border border-brand-gold/30 bg-amber-50 px-3.5 py-2 text-xs font-bold text-brand-goldDark shadow-sm transition duration-300 hover:bg-brand-gold hover:text-brand-primary hover:border-brand-gold"
                      >
                        {btn}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Typing Sticky Input Bar */}
          <form 
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputValue);
            }}
            className="flex items-center gap-2 border-t border-brand-hairline bg-white p-4"
          >
            <input
              className="w-full rounded-full border border-brand-hairline bg-slate-50 px-4 py-3 text-sm text-brand-primary placeholder-brand-slate outline-none transition focus:border-brand-gold focus:bg-white focus:ring-1 focus:ring-brand-gold"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Nhập nội dung chát với trợ lý ảo..."
            />
            <button
              type="submit"
              disabled={!inputValue.trim()}
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white shadow-soft transition duration-300 hover:scale-105 hover:bg-slate-800 disabled:opacity-40 disabled:hover:scale-100"
              aria-label="Gửi tin nhắn"
            >
              <Send size={16} className="text-brand-gold" />
            </button>
          </form>

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
