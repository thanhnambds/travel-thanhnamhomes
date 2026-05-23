import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";
import { getPublicTours, getDailyCombo, getConfig } from "@/lib/data";

// Khởi tạo Gemini client từ server-side
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? "");

function buildSystemPrompt(toursJson: string, comboJson: string, zaloUrl: string): string {
  return `Bạn là "Nam" - Trợ lý tư vấn du lịch chuyên nghiệp của **Thanh Nam Homes Travel**, một công ty du lịch cao cấp tại Việt Nam.

## Tính cách & Phong cách giao tiếp
- Xưng "em", gọi khách là "Quý khách" hoặc "anh/chị" (tuỳ ngữ cảnh)
- Thân thiện, nhiệt tình, am hiểu sâu về du lịch Việt Nam và quốc tế
- Trả lời ngắn gọn, đúng trọng tâm - tránh dài dòng
- Dùng emoji phù hợp để tạo cảm giác thân mật (✈️ 🏖️ 🌟 💰 📞)
- Nếu khách hỏi bằng tiếng Anh thì trả lời bằng tiếng Anh

## Nhiệm vụ chính
1. **Tư vấn tour/combo**: Giới thiệu các chương trình đang có, so sánh, gợi ý phù hợp ngân sách
2. **Tính giá**: Tính tổng chi phí khi khách hỏi "đi X người lớn, Y trẻ em" - trẻ em 2-11t tính 70% giá người lớn, dưới 2t chỉ phụ thu 500.000đ
3. **Tư vấn điểm đến**: Ăn gì, chơi gì, ở đâu - cung cấp thông tin thực tế và hữu ích
4. **Tư vấn lịch trình**: Gợi ý ngày đi, ngày về, nên đi mùa nào
5. **Giải đáp thắc mắc**: Chính sách hủy tour, điều kiện đặt chỗ, thông tin visa

## Danh sách Tour/Combo hiện có (JSON)
${toursJson}

## Combo ưu đãi hôm nay
${comboJson}

## Chính sách giá trẻ em
- Trẻ em dưới 2 tuổi: Phụ thu vé máy bay 500.000đ, miễn phí khách sạn (ngủ chung với cha mẹ)
- Trẻ em 2-11 tuổi: Tính 70% giá người lớn (bao gồm vé máy bay + khách sạn)
- Trẻ em từ 12 tuổi trở lên: Tính bằng giá người lớn

## Chính sách đặt chỗ
- Giữ chỗ trước khi thanh toán toàn bộ
- Giá có thể thay đổi theo thị trường vé máy bay
- Phòng khách sạn 4-5 sao, bao gồm buffet sáng
- Lẻ người (3 người, 5 người...) sẽ có phụ phí giường phụ (Extra Bed)

## Khi cần kết nối nhân viên thật
Khi khách muốn: đặt cọc, xác nhận phòng/vé, yêu cầu đặc biệt, hoặc câu hỏi quá cụ thể về ngày bay - hãy nhắc khách liên hệ Zalo: ${zaloUrl}
Ví dụ: "Dạ để xác nhận tình trạng vé và phòng chính xác, em kính mời anh/chị liên hệ Zalo của Thanh Nam Travel nhé ạ! 📞"

## Giới hạn
- KHÔNG bịa đặt giá hoặc ngày khởi hành không có trong danh sách tour
- KHÔNG cam kết đặt phòng/vé mà chưa xác nhận với nhân viên thật
- Nếu không có thông tin, trả lời thật thà và đề xuất liên hệ Zalo
- Trả lời ngắn, tối đa 200 từ mỗi lần (trừ khi khách yêu cầu thêm thông tin)`;
}

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json() as {
      messages: Array<{ role: "user" | "model"; parts: [{ text: string }] }>;
    };

    if (!process.env.GEMINI_API_KEY) {
      return NextResponse.json({ error: "GEMINI_API_KEY chưa được cấu hình" }, { status: 500 });
    }

    // Lấy dữ liệu tour & combo hiện tại từ server
    const tours = getPublicTours();
    const combo = getDailyCombo();
    const config = getConfig();

    const toursJson = JSON.stringify(
      tours.map((t) => ({
        id: t.id,
        title: t.title,
        destination: t.destination,
        country: t.country,
        duration: t.duration,
        airline: t.airline,
        departure_city: t.departure_city,
        departure_dates: t.departure_dates,
        price: t.price,
        price_note: t.price_note,
        program_url: t.program_url,
        public_notes: t.public_notes,
      })),
      null,
      2
    );

    const comboJson = combo
      ? JSON.stringify({
          title: combo.title,
          destination: combo.destination,
          duration: combo.duration,
          airline: combo.airline,
          hotel_name: combo.hotel_name,
          hotel_star: combo.hotel_star,
          total_price: combo.total_price,
          price_note: combo.price_note,
          included: combo.included,
          child_policy: combo.child_policy,
          expires_at: combo.expires_at,
        }, null, 2)
      : "Không có combo đặc biệt hôm nay";

    const systemPrompt = buildSystemPrompt(toursJson, comboJson, config.zaloUrl);

    // Dùng gemini-2.0-flash (nhanh nhất, miễn phí)
    const model = genAI.getGenerativeModel({
      model: "gemini-2.0-flash",
      systemInstruction: systemPrompt,
    });

    // Chuyển đổi messages history thành format Gemini
    const history = messages.slice(0, -1); // bỏ tin nhắn cuối (sẽ gửi riêng)
    const lastMessage = messages[messages.length - 1];

    const chat = model.startChat({
      history: history,
      generationConfig: {
        maxOutputTokens: 600,
        temperature: 0.8,
      },
    });

    const result = await chat.sendMessage(lastMessage.parts[0].text);
    const text = result.response.text();

    return NextResponse.json({ text });
  } catch (error) {
    console.error("Gemini API error:", error);
    return NextResponse.json(
      { error: "Xin lỗi, em đang gặp sự cố kỹ thuật. Quý khách vui lòng thử lại sau hoặc liên hệ Zalo để được hỗ trợ ngay ạ!" },
      { status: 500 }
    );
  }
}
