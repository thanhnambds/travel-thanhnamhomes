import type { LeadData } from "./lead-store";

/**
 * Tóm tắt nhu cầu khách hàng từ tin nhắn chat
 */
function extractNhuCau(messages: string[]): {
  phone: string;
  dates: string;
  guests: string;
  notes: string;
} {
  const fullText = messages.join(" ");

  // Extract phone/zalo
  const phoneMatch = fullText.match(/(0[3|5|7|8|9]\d{8})\b/);
  const phone = phoneMatch ? phoneMatch[1] : "Chưa có";

  // Extract dates (e.g., date formats or words like "tháng 6", "tháng 7", etc.)
  const datesMatch = fullText.match(/(?:ngày|tháng|lịch|khởi hành)\s*([^\n,.;?!]*)/i);
  const dates = datesMatch ? datesMatch[0].trim() : "Khách chưa quyết định";

  // Extract guests
  const guestsMatch = fullText.match(/(?:đi|số|lượng|người lớn)\s*(\d+\s*(?:người|khách|pax|lớn))/i);
  const guests = guestsMatch ? guestsMatch[0].trim() : "Chưa rõ";

  // Summarize main message (last user message)
  const notes = messages.slice(-2).join(" | ").substring(0, 150);

  return { phone, dates, guests, notes };
}

/**
 * Tạo nội dung tóm tắt lead nóng gửi anh Nam
 */
export function formatLeadSummary(lead: LeadData): string {
  const nhuCau = extractNhuCau(lead.userMessages);
  
  return `🔥 BÁO CÁO LEAD NÓNG B2C — THANH NAM TRAVEL
----------------------------------------
📌 Sản phẩm: ${lead.productTitle || "Combo hôm nay / Chưa chỉ định"}
📈 Điểm số: ${lead.leadScore}/100 (${lead.leadLabel.toUpperCase()})
📞 Số liên hệ: ${lead.contactInfo || nhuCau.phone}

📋 Thông tin nhu cầu:
- Khởi hành: ${nhuCau.dates}
- Thành viên: ${nhuCau.guests}
- Ghi chú chat: "${nhuCau.notes}"

⚠️ Việc cần làm:
- Kiểm tra vé máy bay khứ hồi & phòng khách sạn trống.
- Chủ động liên hệ qua Zalo/SĐT để chốt báo giá cá nhân hóa.
----------------------------------------`;
}
