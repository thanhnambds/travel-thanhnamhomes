export interface LeadData {
  productId?: string;
  productTitle?: string;
  leadScore: number;
  leadLabel: "cold" | "warm" | "hot" | "urgent";
  userMessages: string[];
  contactInfo?: string;
  timestamp: string;
}

/**
 * Lưu trữ lead nóng.
 * ⚠️ QUY TẮC: Không ghi file trên runtime Vercel (bị chặn hoặc reset).
 * Phase 2 MVP: console.log server-side hoặc lưu tạm thời.
 * Phase 2.2: Tích hợp Google Sheets API hoặc Webhook (n8n/Zapier).
 */
export async function saveLead(lead: LeadData): Promise<boolean> {
  console.log("=========================================");
  console.log("🔥 [NEW HOT LEAD RECORDED]");
  console.log(`- Sản phẩm: ${lead.productTitle || "Tổng hợp"}`);
  console.log(`- Phân loại: ${lead.leadLabel.toUpperCase()} (Score: ${lead.leadScore})`);
  console.log(`- Liên hệ: ${lead.contactInfo || "Chưa cung cấp"}`);
  console.log(`- Thời gian: ${lead.timestamp}`);
  console.log("=========================================");

  // TODO: Phase 2.2 — Gửi lead qua Google Sheet Webhook hoặc Telegram notification.
  return true;
}
