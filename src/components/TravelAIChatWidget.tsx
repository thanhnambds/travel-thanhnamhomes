"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, MessageCircle, Send, X, RotateCcw, Loader2, Sparkles, PhoneCall } from "lucide-react";
import type { MessagePart } from "@/lib/lead-scoring";

type Message = {
  sender: "bot" | "user";
  text: string;
  timestamp: Date;
  isLoading?: boolean;
};

interface ChatWidgetProps {
  productId: string;
  productType: "tour" | "hotel" | "combo";
  productTitle: string;
  initialPrice: number;
  zaloUrl: string;
  renderTriggerButton?: boolean;
  externalOpen?: boolean;
  onExternalClose?: () => void;
}

export function TravelAIChatWidget({
  productId,
  productType,
  productTitle,
  initialPrice,
  zaloUrl,
  renderTriggerButton = true,
  externalOpen,
  onExternalClose,
}: ChatWidgetProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<Array<{ role: "user" | "model"; parts: [MessagePart] }>>([]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [leadScore, setLeadScore] = useState(5); // Start with 5 since they are looking at the product
  const [leadLabel, setLeadLabel] = useState<"cold" | "warm" | "hot" | "urgent">("cold");
  
  // Lead info captured
  const [phone, setPhone] = useState("");
  const [phoneSubmitted, setPhoneSubmitted] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (externalOpen !== undefined) {
      setOpen(externalOpen);
    }
  }, [externalOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (messages.length === 0) {
      resetChat();
    }
  }, [productId]);

  function resetChat() {
    const welcome = `Dạ em chào anh/chị! Em là **Nam** - trợ lý AI của **Thanh Nam Homes Travel** 🌸\n\nEm thấy anh/chị đang quan tâm sản phẩm **${productTitle}** (giá tham khảo từ **${new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(initialPrice)}/khách**).\n\nAnh/chị dự kiến khởi hành vào **ngày nào** và đoàn mình đi khoảng **bao nhiêu người** để em tính toán giá chính xác nhất ạ?`;
    setMessages([
      {
        sender: "bot",
        text: welcome,
        timestamp: new Date(),
      },
    ]);
    setHistory([]);
    setLeadScore(5);
    setLeadLabel("cold");
    setPhone("");
    setPhoneSubmitted(false);
  }

  async function handleSend(text: string) {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      sender: "user",
      text: text.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [
      ...prev,
      userMsg,
      { sender: "bot", text: "", timestamp: new Date(), isLoading: true },
    ]);
    setInputValue("");
    setIsLoading(true);

    const newHistory: Array<{ role: "user" | "model"; parts: [MessagePart] }> = [
      ...history,
      { role: "user", parts: [{ text: text.trim() }] },
    ];

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newHistory,
          productId,
          productType,
        }),
      });

      const data = await res.json() as {
        text: string;
        lead_score: number;
        lead_label: "cold" | "warm" | "hot" | "urgent";
        handoff_required: boolean;
      };

      setLeadScore(data.lead_score);
      setLeadLabel(data.lead_label);

      setHistory([
        ...newHistory,
        { role: "model", parts: [{ text: data.text }] },
      ]);

      setMessages((prev) => [
        ...prev.filter((m) => !m.isLoading),
        { sender: "bot", text: data.text, timestamp: new Date() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev.filter((m) => !m.isLoading),
        {
          sender: "bot",
          text: "Dạ, hệ thống đang bận một chút. Anh/chị nhắn tin Zalo với Mr. Nam để nhận tư vấn nhanh nhất nhé ạ!",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  // Create prefilled Zalo summary
  function getZaloHandoffLink() {
    const userTexts = messages
      .filter((m) => m.sender === "user")
      .map((m) => m.text)
      .join(" | ");

    const text = `Xin chào Mr. Nam, em đang quan tâm đến "${productTitle}". 
Thông tin nhu cầu: ${userTexts ? `[${userTexts}]` : ""}
${phone ? `Số điện thoại của em: ${phone}` : ""}
Nhờ anh kiểm tra tình trạng chỗ và giá mới nhất giúp em.`;

    return `${zaloUrl}?text=${encodeURIComponent(text)}`;
  }

  function handlePhoneSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!/^\d{9,11}$/.test(phone)) {
      alert("Vui lòng nhập số điện thoại hợp lệ (9 - 11 chữ số).");
      return;
    }
    setPhoneSubmitted(true);
    handleSend(`Số điện thoại liên hệ của tôi là: ${phone}`);
  }

  return (
    <>
      {/* Inline CTA Button to trigger chat */}
      {renderTriggerButton !== false && (
        <button
          onClick={() => setOpen(true)}
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brand-gold to-brand-goldDark py-3.5 text-sm font-bold text-brand-primary transition-all duration-300 hover:opacity-95 shadow-md active:scale-95"
        >
          <Sparkles size={16} className="text-brand-primary animate-pulse" />
          Hỏi AI về tư vấn chi tiết
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="relative flex h-[600px] w-full max-w-lg flex-col overflow-hidden rounded-[28px] border border-white/20 bg-white/90 shadow-2xl backdrop-blur-md transition-all animate-scaleUp">
            
            {/* Header */}
            <div className="flex items-center justify-between bg-brand-primary px-6 py-4 text-white">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-gold text-brand-primary">
                  <Bot size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-bold">Trợ Lý Ải Tư Vấn — Nam</h3>
                  <p className="text-[11px] text-brand-goldLight">Tư vấn sản phẩm: {productTitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={resetChat}
                  className="rounded-full p-1.5 hover:bg-white/10 transition"
                  title="Làm mới chat"
                >
                  <RotateCcw size={16} />
                </button>
                <button
                  onClick={() => {
                    setOpen(false);
                    onExternalClose?.();
                  }}
                  className="rounded-full p-1.5 hover:bg-white/10 transition"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto bg-[#fdfaf2]/50 p-6 space-y-4">
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.sender === "bot" && (
                    <div className="mr-2.5 mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-primary">
                      <Bot size={13} className="text-brand-gold" />
                    </div>
                  )}
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                      msg.sender === "user"
                        ? "bg-brand-primary text-white rounded-tr-none"
                        : "bg-white text-brand-primary border border-brand-hairline rounded-tl-none"
                    }`}
                  >
                    {msg.isLoading ? (
                      <span className="flex items-center gap-1.5 text-brand-slate">
                        <Loader2 size={14} className="animate-spin text-brand-goldDark" />
                        <span className="text-xs">Đang lập lịch trình...</span>
                      </span>
                    ) : (
                      <div className="space-y-1.5 whitespace-pre-wrap">
                        {renderMarkdownText(msg.text)}
                      </div>
                    )}
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Hot/Urgent Lead Call to Action Form */}
            {leadScore >= 60 && !phoneSubmitted && (
              <div className="border-t border-brand-hairline bg-amber-50 p-4 animate-fade-in-up">
                <p className="text-xs font-semibold text-brand-goldDark flex items-center gap-1.5">
                  <PhoneCall size={14} />
                  Nhận Báo Giá Cá Nhân Hóa
                </p>
                <p className="mt-1 text-[11px] text-brand-slate">
                  Nhu cầu của bạn rất hấp dẫn! Để lại số điện thoại/Zalo để chuyên viên Mr. Nam gửi lịch trình thực tế và giữ giá tốt nhất nhé.
                </p>
                <form onSubmit={handlePhoneSubmit} className="mt-3 flex gap-2">
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Nhập số điện thoại/Zalo của bạn..."
                    className="flex-1 rounded-lg border border-brand-hairline bg-white px-3 py-2 text-xs outline-none focus:border-brand-gold"
                  />
                  <button
                    type="submit"
                    className="rounded-lg bg-brand-primary px-4 py-2 text-xs font-bold text-white hover:bg-brand-gold hover:text-brand-primary transition"
                  >
                    Gửi Số
                  </button>
                </form>
              </div>
            )}

            {/* Bottom Actions Area */}
            <div className="border-t border-brand-hairline bg-white p-4 flex flex-col gap-2">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(inputValue);
                }}
                className="flex gap-2"
              >
                <input
                  ref={inputRef}
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  placeholder="Hỏi về thời gian đi, giá, trẻ em..."
                  className="flex-1 rounded-full border border-brand-hairline bg-slate-50 px-4 py-2.5 text-xs text-brand-primary outline-none focus:border-brand-gold focus:bg-white"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={!inputValue.trim() || isLoading}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-primary text-white transition hover:scale-105 disabled:opacity-40"
                >
                  {isLoading ? (
                    <Loader2 size={15} className="animate-spin text-brand-gold" />
                  ) : (
                    <Send size={15} className="text-brand-gold" />
                  )}
                </button>
              </form>

              {/* Handoff Zalo Direct Button */}
              <div className="flex items-center justify-between gap-4 mt-2">
                <span className="text-[10px] text-brand-slate font-medium">
                  Đánh giá Lead: {leadScore}/100 ({leadLabel.toUpperCase()})
                </span>
                <a
                  href={getZaloHandoffLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-600 px-3 py-1.5 text-xs font-bold text-white hover:bg-emerald-500 transition shadow-sm"
                >
                  <MessageCircle size={14} />
                  Handoff Zalo Mr. Nam
                </a>
              </div>
            </div>

          </div>
        </div>
      )}
    </>
  );
}

function renderMarkdownText(text: string) {
  return text.split("\n").map((line, i) => {
    if (line.trim() === "") return <div key={i} className="h-1" />;

    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return (
          <strong key={j} className="font-bold text-brand-primary">
            {part.slice(2, -2)}
          </strong>
        );
      }
      return part;
    });

    if (line.trim().startsWith("- ") || line.trim().startsWith("• ")) {
      return (
        <div key={i} className="flex gap-2 pl-1">
          <span className="mt-1.5 shrink-0 h-1.5 w-1.5 rounded-full bg-brand-gold" />
          <span>{parts.map((p) => (typeof p === "string" ? p.replace(/^[-•]\s/, "") : p))}</span>
        </div>
      );
    }

    return <p key={i}>{parts}</p>;
  });
}
