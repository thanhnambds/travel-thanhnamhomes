"use client";

import { FormEvent, useState } from "react";
import { Award, CheckCircle2, MessageCircle, Phone, Sparkles, X } from "lucide-react";

export function FloatingContact({ zaloUrl }: { zaloUrl: string }) {
  const [isOpenForm, setIsOpenForm] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [destination, setDestination] = useState("Đà Nẵng");
  const [customDestination, setCustomDestination] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const hotlineNumber = "0965325555";

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!name.trim() || !phone.trim()) return;

    const chosenDestination = destination === "Khác" ? customDestination : destination;
    
    // Tạo tin nhắn Zalo cực kỳ lịch thiệp
    const message = `Kính gửi Thanh Nam Homes Travel, tôi muốn đăng ký tư vấn thiết kế Kỳ nghỉ Độc bản.
- Họ tên: ${name.trim()}
- Số điện thoại (Zalo): ${phone.trim()}
- Điểm đến mong muốn: ${chosenDestination || "Cần tư vấn"}

Rất mong sớm nhận được phản hồi và thiết kế từ quý công ty!`;

    const encodedMessage = encodeURIComponent(message);
    const finalZaloUrl = `${zaloUrl}?text=${encodedMessage}`;

    // Mở Zalo
    window.open(finalZaloUrl, "_blank");

    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setName("");
      setPhone("");
      setCustomDestination("");
      setIsOpenForm(false);
    }, 3000);
  }

  return (
    <>
      {/* Bộ nút nổi bên góc trái dưới màn hình */}
      <div className="fixed bottom-6 left-6 z-40 flex flex-col gap-3">
        {/* Nút Gọi Hotline khẩn cấp */}
        <a
          href={`tel:${hotlineNumber}`}
          className="focus-ring relative flex h-12 w-12 items-center justify-center rounded-full bg-brand-coral text-white shadow-soft transition duration-300 hover:scale-105"
          aria-label="Gọi hotline"
          title="Gọi Hotline khẩn cấp"
        >
          {/* Vòng tròn lan tỏa động (Ripple Effect) */}
          <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-brand-coral/40 opacity-75"></span>
          <Phone size={20} className="relative z-10" />
        </a>

        {/* Nút Trò chuyện Zalo nhanh */}
        <a
          href={zaloUrl}
          target="_blank"
          rel="noreferrer"
          className="focus-ring flex h-12 w-12 items-center justify-center rounded-full bg-[#0068ff] text-white shadow-soft transition duration-300 hover:scale-105 hover:bg-[#0057d4] border border-white/20"
          aria-label="Trò chuyện Zalo"
          title="Trò chuyện Zalo trực tiếp"
        >
          <MessageCircle size={20} />
        </a>

        {/* Nút Đăng ký kỳ nghỉ thiết kế riêng (Bespoke Sparkle) */}
        <button
          onClick={() => setIsOpenForm(true)}
          className="focus-ring flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-brand-gold to-brand-goldDark text-brand-primary shadow-soft transition duration-300 hover:scale-105 hover:brightness-110 border border-brand-gold/30"
          aria-label="Thiết kế kỳ nghỉ độc bản"
          title="Thiết kế Kỳ nghỉ Độc bản (Bespoke)"
        >
          <Sparkles size={20} className="text-brand-primary animate-pulse" />
        </button>
      </div>

      {/* Modal Popup Đăng ký Kỳ nghỉ Thiết kế riêng */}
      {isOpenForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm transition-all duration-300 animate-fadeIn">
          <div className="relative w-full max-w-md overflow-hidden rounded-[30px] border border-brand-gold/20 bg-slate-900 text-white shadow-[0_24px_80px_rgba(0,0,0,0.6)] animate-scaleUp">
            
            {/* Header Modal */}
            <div className="flex items-center justify-between border-b border-white/10 bg-gradient-to-r from-brand-primary to-slate-950 p-6">
              <div className="flex items-center gap-2.5">
                <Award className="text-brand-gold animate-bounce" size={24} />
                <div>
                  <h3 className="text-lg font-bold text-brand-gold tracking-wide">Kỳ Nghỉ Độc Bản</h3>
                  <p className="text-xs text-white/50">Bespoke Travel Consultation</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpenForm(false)}
                className="rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
                aria-label="Đóng"
              >
                <X size={18} />
              </button>
            </div>

            {/* Body Form */}
            <div className="p-6">
              {submitted ? (
                <div className="flex flex-col items-center justify-center py-10 text-center animate-scaleUp">
                  <CheckCircle2 className="text-brand-gold animate-pulse" size={60} />
                  <h4 className="mt-4 text-xl font-bold text-brand-gold">Đăng Ký Thành Công!</h4>
                  <p className="mt-2 text-sm leading-relaxed text-white/70 max-w-xs">
                    Hệ thống đang mở ứng dụng Zalo để chuyển tiếp yêu cầu của Quý khách. Chuyên viên sẽ liên hệ lại ngay trong vòng 15 phút.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <p className="text-sm leading-relaxed text-white/80">
                    Hãy chia sẻ mong muốn của Quý khách, đội ngũ chuyên viên của **Thanh Nam Travel** sẽ tinh tuyển hành trình riêng biệt và phản hồi lập tức.
                  </p>

                  {/* Trường Tên */}
                  <label className="block text-sm font-semibold text-brand-gold">
                    Họ tên Quý khách *
                    <input
                      type="text"
                      required
                      placeholder="Ví dụ: Nguyễn Thanh Nam"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-brand-gold focus:bg-white/10 focus:ring-1 focus:ring-brand-gold"
                    />
                  </label>

                  {/* Trường Số điện thoại */}
                  <label className="block text-sm font-semibold text-brand-gold">
                    Số điện thoại (Nhận báo giá Zalo) *
                    <input
                      type="tel"
                      required
                      placeholder="Ví dụ: 0965325555"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-brand-gold focus:bg-white/10 focus:ring-1 focus:ring-brand-gold"
                    />
                  </label>

                  {/* Trường Điểm đến */}
                  <label className="block text-sm font-semibold text-brand-gold">
                    Điểm đến mong muốn
                    <select
                      value={destination}
                      onChange={(e) => setDestination(e.target.value)}
                      className="mt-1.5 w-full rounded-xl border border-white/10 bg-slate-900 px-4 py-3 text-sm text-white outline-none transition focus:border-brand-gold focus:ring-1 focus:ring-brand-gold"
                    >
                      <option>Đà Nẵng</option>
                      <option>Phú Quốc</option>
                      <option>Nha Trang</option>
                      <option>Hạ Long</option>
                      <option>Khác</option>
                    </select>
                  </label>

                  {/* Trường Điểm đến khác */}
                  {destination === "Khác" && (
                    <label className="block text-sm font-semibold text-brand-gold animate-fadeIn">
                      Nhập điểm đến khác
                      <input
                        type="text"
                        required
                        placeholder="Ví dụ: Quy Nhơn, Sapa, Nhật Bản..."
                        value={customDestination}
                        onChange={(e) => setCustomDestination(e.target.value)}
                        className="mt-1.5 w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-white/30 outline-none transition focus:border-brand-gold focus:bg-white/10 focus:ring-1 focus:ring-brand-gold"
                      />
                    </label>
                  )}

                  {/* Nút gửi yêu cầu */}
                  <button
                    type="submit"
                    className="w-full rounded-xl bg-gradient-to-r from-brand-gold to-brand-goldDark py-3.5 text-sm font-bold text-brand-primary shadow-lg transition duration-300 hover:brightness-110"
                  >
                    Gửi Yêu Cầu & Kết Nối Zalo
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
