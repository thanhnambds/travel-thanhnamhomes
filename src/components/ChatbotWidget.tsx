"use client";

import { useEffect, useRef, useState } from "react";
import { Bot, MessageCircle, Send, X, RotateCcw, Loader2 } from "lucide-react";
import type { Combo, PublicTour } from "@/lib/types";

type GeminiMessage = {
  role: "user" | "model";
  parts: [{ text: string }];
};

type Message = {
  sender: "bot" | "user";
  text: string;
  timestamp: Date;
  isLoading?: boolean;
};

const WELCOME_TEXT =
  "Xin chào! Em là **Nam** - Trợ lý tư vấn du lịch của **Thanh Nam Homes Travel** 🌟\n\nEm có thể giúp anh/chị:\n- 🗺️ Tư vấn tour & combo du lịch\n- 💰 Tính giá cho cả đoàn (người lớn, trẻ em)\n- 🍜 Gợi ý ăn gì, chơi gì, ở đâu\n- ✈️ Tư vấn lịch trình, thời điểm đi\n\nAnh/chị đang quan tâm đến điểm đến nào ạ?";

const QUICK_REPLIES = [
  "Combo Đà Nẵng giá bao nhiêu?",
  "Phú Quốc đi mấy ngày hợp lý?",
  "3 người lớn 1 trẻ em 5 tuổi đi Nha Trang hết bao nhiêu?",
  "Nha Trang ăn hải sản ở đâu ngon?",
];

export function ChatbotWidget({
  combo,
  tours,
  zaloUrl,
}: {
  combo: Combo | null;
  tours: PublicTour[];
  zaloUrl: string;
}) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [history, setHistory] = useState<GeminiMessage[]>([]); // lịch sử gửi lên API
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Cuộn xuống cuối khi có tin nhắn mới
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Khởi tạo tin nhắn chào
  useEffect(() => {
    if (messages.length === 0) {
      resetChat();
    }
  }, []);

  // Focus input khi mở chat
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [open]);

  function resetChat() {
    setMessages([
      {
        sender: "bot",
        text: WELCOME_TEXT,
        timestamp: new Date(),
      },
    ]);
    setHistory([]);
  }

  async function handleSend(text: string) {
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      sender: "user",
      text: text.trim(),
      timestamp: new Date(),
    };

    // Thêm tin nhắn user + placeholder loading
    setMessages((prev) => [
      ...prev,
      userMsg,
      { sender: "bot", text: "", timestamp: new Date(), isLoading: true },
    ]);
    setInputValue("");
    setIsLoading(true);

    // Cập nhật history cho API
    const newHistory: GeminiMessage[] = [
      ...history,
      { role: "user", parts: [{ text: text.trim() }] },
    ];

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newHistory }),
      });

      const data = await res.json() as { text?: string; error?: string };
      const replyText =
        data.text ??
        data.error ??
        "Dạ, em đang gặp sự cố nhỏ. Anh/chị vui lòng thử lại sau ít giây hoặc liên hệ Zalo để được hỗ trợ ngay nhé!";

      // Cập nhật history với cả 2 lượt
      setHistory([
        ...newHistory,
        { role: "model", parts: [{ text: replyText }] },
      ]);

      // Thay thế loading bằng câu trả lời thật
      setMessages((prev) => [
        ...prev.filter((m) => !m.isLoading),
        { sender: "bot", text: replyText, timestamp: new Date() },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev.filter((m) => !m.isLoading),
        {
          sender: "bot",
          text: "Dạ, mạng đang có vấn đề nhỏ. Anh/chị thử lại sau giây lát hoặc nhắn Zalo để em hỗ trợ ngay ạ!",
          timestamp: new Date(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-40">
      {open && (
        <div className="mb-4 w-[calc(100vw-48px)] max-w-md overflow-hidden rounded-[28px] border border-brand-hairline bg-white shadow-2xl transition-all duration-300 animate-scaleUp">
          
          {/* Header */}
          <div className="flex items-center justify-between bg-slate-900 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="relative flex h-9 w-9 items-center justify-center rounded-full bg-brand-gold">
                <Bot size={18} className="text-slate-900" />
                <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-slate-900 bg-emerald-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">Nam - Trợ lý Du lịch AI</p>
                <p className="text-[11px] text-emerald-400">● Đang hoạt động</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                className="rounded-full p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
                onClick={resetChat}
                title="Bắt đầu lại"
                aria-label="Làm mới chat"
              >
                <RotateCcw size={15} />
              </button>
              <button
                className="rounded-full p-2 text-white/50 transition hover:bg-white/10 hover:text-white"
                onClick={() => setOpen(false)}
                aria-label="Đóng chat"
              >
                <X size={17} />
              </button>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex h-[400px] flex-col gap-3 overflow-y-auto bg-slate-50 p-4 scroll-smooth">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                {msg.sender === "bot" && (
                  <div className="mr-2 mt-1 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-900">
                    <Bot size={13} className="text-brand-gold" />
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "rounded-tr-none bg-slate-900 text-white"
                      : "rounded-tl-none border border-brand-hairline bg-white text-brand-primary"
                  }`}
                >
                  {msg.isLoading ? (
                    <span className="flex items-center gap-1.5 text-brand-slate">
                      <Loader2 size={14} className="animate-spin" />
                      <span className="text-xs">Đang soạn câu trả lời...</span>
                    </span>
                  ) : (
                    <div className="space-y-1 text-sm leading-relaxed">
                      {renderMarkdown(msg.text)}
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Quick replies - chỉ hiện sau tin chào đầu tiên */}
            {messages.length === 1 && messages[0].sender === "bot" && (
              <div className="flex flex-col gap-2 pl-9">
                <p className="text-[11px] text-brand-slate">💡 Câu hỏi gợi ý:</p>
                {QUICK_REPLIES.map((q, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(q)}
                    className="w-fit rounded-full border border-brand-gold/40 bg-amber-50 px-3.5 py-2 text-left text-xs font-medium text-brand-goldDark transition hover:bg-brand-gold hover:text-slate-900"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend(inputValue);
            }}
            className="flex items-center gap-2 border-t border-brand-hairline bg-white p-3"
          >
            <input
              ref={inputRef}
              className="w-full rounded-full border border-brand-hairline bg-slate-50 px-4 py-2.5 text-sm text-brand-primary placeholder-brand-slate outline-none transition focus:border-brand-gold focus:bg-white focus:ring-1 focus:ring-brand-gold"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Hỏi về tour, giá, ăn chơi..."
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 text-white shadow transition duration-300 hover:scale-105 hover:bg-slate-800 disabled:opacity-40 disabled:hover:scale-100"
              aria-label="Gửi tin nhắn"
            >
              {isLoading ? (
                <Loader2 size={15} className="animate-spin text-brand-gold" />
              ) : (
                <Send size={15} className="text-brand-gold" />
              )}
            </button>
          </form>

          {/* Footer note */}
          <div className="bg-white px-4 pb-3 text-center">
            <p className="text-[10px] text-brand-slate">
              Powered by Gemini AI · Câu trả lời mang tính tham khảo
            </p>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        className="relative flex h-14 w-14 items-center justify-center rounded-full bg-slate-900 text-white shadow-lg transition duration-300 hover:scale-105 hover:bg-slate-800 border border-brand-gold"
        onClick={() => setOpen((v) => !v)}
        aria-label="Mở chatbot"
      >
        {open ? (
          <X size={22} className="text-brand-gold" />
        ) : (
          <>
            <MessageCircle size={24} className="text-brand-gold" />
            <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-emerald-500 text-[9px] font-bold text-white">
              AI
            </span>
          </>
        )}
      </button>
    </div>
  );
}

// Lightweight inline markdown renderer - xử lý **bold**, bullet points, line breaks
function renderMarkdown(text: string) {
  return text.split("\n").map((line, i) => {
    // Dòng trống
    if (line.trim() === "") return <div key={i} className="h-1" />;

    // Render **bold** inline
    const parts = line.split(/(\*\*[^*]+\*\*)/g).map((part, j) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={j} className="font-semibold text-slate-900">{part.slice(2, -2)}</strong>;
      }
      return part;
    });

    // Bullet point
    if (line.trim().startsWith("- ") || line.trim().startsWith("• ")) {
      return (
        <div key={i} className="flex gap-2">
          <span className="mt-0.5 shrink-0 text-brand-gold">•</span>
          <span>{parts.map((p, j) => (typeof p === "string" ? p.replace(/^[-•]\s/, "") : p))}</span>
        </div>
      );
    }

    return <p key={i}>{parts}</p>;
  });
}

