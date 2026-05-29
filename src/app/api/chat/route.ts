import { NextRequest, NextResponse } from "next/server";
import fs from "node:fs";
import path from "node:path";
import { getConfig } from "@/lib/data";
import { getSafeTourContext, getSafeHotelContext, getSafeComboContext, getAllSafeProductsContext } from "@/lib/ai-product-context";
import { scoreLead } from "@/lib/lead-scoring";
import { saveLead } from "@/lib/lead-store";

const rootDir = process.cwd();
const GEMINI_API_URL =
  "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent";

const FORBIDDEN_WORDS = [
  /Hoàng\s*Việt/i,
  /Viettrend/i,
  /Cattour/i,
  /\bF1\b/,
  /\bCOM\b/,
  /hoa\s*hồng/i,
  /commission/i,
  /supplier/i,
  /source_sheet_url/i,
  /docs\.google\.com/i,
  /google\.com\/spreadsheets/i,
  /giá\s*net/i
];

function sanitizeOutput(text: string): string {
  const hasLeak = FORBIDDEN_WORDS.some(regex => regex.test(text));
  if (hasLeak) {
    return "Thông tin này cần chuyên viên kiểm tra thêm. Anh/chị để lại số điện thoại/Zalo, bên em sẽ hỗ trợ chính xác hơn ạ.";
  }
  return text;
}

export async function POST(req: NextRequest) {
  try {
    const { messages, productId, productType } = (await req.json()) as {
      messages: Array<{ role: "user" | "model"; parts: [{ text: string }] }>;
      productId?: string;
      productType?: "tour" | "hotel" | "combo";
    };

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "GEMINI_API_KEY chưa được cấu hình" }, { status: 500 });
    }

    const config = getConfig();

    // 1. Load System Prompt from prompts/ai-sales-agent.md
    const promptPath = path.join(rootDir, "prompts/ai-sales-agent.md");
    let systemPromptBase = "";
    if (fs.existsSync(promptPath)) {
      systemPromptBase = fs.readFileSync(promptPath, "utf8");
    } else {
      systemPromptBase = "Bạn là trợ lý du lịch của Thanh Nam Homes Travel.";
    }

    // 2. Fetch public whitelisted context
    let productContextText = "";
    let productTitle = "";

    if (productId) {
      if (productType === "tour") {
        const tour = getSafeTourContext(productId);
        if (tour) {
          productContextText = `Tour hiện tại Quý khách đang xem:\n${JSON.stringify(tour, null, 2)}`;
          productTitle = tour.title || "";
        }
      } else if (productType === "hotel") {
        const hotel = getSafeHotelContext(productId);
        if (hotel) {
          productContextText = `Khách sạn hiện tại Quý khách đang xem:\n${JSON.stringify(hotel, null, 2)}`;
          productTitle = hotel.hotel_name || "";
        }
      } else if (productType === "combo") {
        const combo = getSafeComboContext();
        if (combo) {
          productContextText = `Combo hiện tại Quý khách đang xem:\n${JSON.stringify(combo, null, 2)}`;
          productTitle = combo.title || "";
        }
      }
    }

    // Fallback or general products count
    if (!productContextText) {
      const allSafe = getAllSafeProductsContext();
      productContextText = `Tổng quan sản phẩm:\n- Combo hôm nay: ${JSON.stringify(allSafe.dailyCombo, null, 2)}\n- Số lượng tour khác: ${allSafe.toursCount}\n- Số lượng khách sạn khác: ${allSafe.hotelsCount}`;
      productTitle = allSafe.dailyCombo?.title || "Tổng hợp";
    }

    // 3. Build Full System Prompt
    const systemPrompt = `${systemPromptBase}
    
---
## NGỮ CẢNH SẢN PHẨM KHÁCH ĐANG XEM (CHỈ DÙNG THÔNG TIN NÀY)
${productContextText}

---
## THÔNG TIN HỖ TRỢ
- Đường link liên hệ Zalo khi khách muốn trao đổi trực tiếp với chuyên viên thật: ${config.zaloUrl}
`;

    // 4. Call Gemini REST API
    const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: systemPrompt }],
        },
        contents: messages,
        generationConfig: {
          maxOutputTokens: 600,
          temperature: 0.7,
        },
      }),
    });

    if (!response.ok) {
      const errText = await response.text();
      throw new Error(`Gemini API Error: ${errText}`);
    }

    const data = await response.json() as {
      candidates: Array<{
        content: { parts: Array<{ text: string }> };
      }>;
    };

    let text = data.candidates?.[0]?.content?.parts?.[0]?.text ?? 
      "Dạ, thông tin này cần chuyên viên kiểm tra thêm. Anh/chị vui lòng liên hệ Zalo bên em hỗ trợ trực tiếp nhé ạ!";

    // 5. Sanitize Output (Security Check)
    text = sanitizeOutput(text);

    // 6. Score Lead Potency
    const leadAnalysis = scoreLead(messages, !!productId);
    const handoff_required = leadAnalysis.score >= 60;

    // 7. Save Lead if hot/urgent
    if (handoff_required) {
      // Find contact info (phone/zalo) from user messages
      const userTexts = messages
        .filter((msg) => msg.role === "user")
        .map((msg) => msg.parts.map((p) => p.text).join(" "))
        .join(" ");
      const phoneMatch = userTexts.match(/(0[3|5|7|8|9]\d{8})\b/);
      const contactInfo = phoneMatch ? phoneMatch[1] : undefined;

      await saveLead({
        productId,
        productTitle,
        leadScore: leadAnalysis.score,
        leadLabel: leadAnalysis.label,
        userMessages: messages.filter((msg) => msg.role === "user").map((msg) => msg.parts.map((p) => p.text).join(" ")),
        contactInfo,
        timestamp: new Date().toISOString()
      });
    }

    return NextResponse.json({
      text,
      lead_score: leadAnalysis.score,
      lead_label: leadAnalysis.label,
      handoff_required
    });
  } catch (error) {
    const msg = error instanceof Error ? error.message : String(error);
    console.error("Gemini API error:", msg);
    return NextResponse.json(
      { error: "Thông tin này cần chuyên viên kiểm tra thêm. Anh/chị liên hệ Zalo để được hỗ trợ nhé ạ!" },
      { status: 500 }
    );
  }
}
