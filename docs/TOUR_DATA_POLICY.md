# Tour Data Policy

## Mục tiêu

Hệ thống tour của `travel.thanhnamhomes.vn` dùng để bán lead và tư vấn ban đầu. Google Sheet đối tác là nguồn dữ liệu thô, không phải dữ liệu public trực tiếp cho khách.

## Luồng dữ liệu

1. Google Sheet đối tác là nguồn thô.
2. `data/partner-links.txt` lưu các link sheet được phép kiểm tra/import.
3. Dữ liệu sau khi lọc được ghi vào `data/generated/tours-draft.json`.
4. Chỉ tour đã được duyệt mới được publish sang `data/generated/tours-public.json`.
5. Website và chatbot chỉ được đọc `tours-public.json`.

## Quy tắc chatbot

Chatbot được phép:

- Tìm tour theo điểm đến, quốc gia, tháng khởi hành, ngân sách và tiêu chí giá tốt.
- Gợi ý tour rẻ nhất trong danh sách public đã duyệt.
- Tóm tắt nhu cầu của khách để gửi qua Zalo.
- Gửi link lịch trình nếu tour public có `program_url`.

Chatbot không được:

- Đọc trực tiếp Google Sheet thô khi khách hỏi.
- Báo giá từ `tours-draft.json` hoặc sheet chưa duyệt.
- Cam kết còn chỗ, giữ giá, giữ vé hoặc giữ phòng.
- Hiển thị thông tin nội bộ như com, ghi chú đối tác, sale nội bộ hoặc dữ liệu nhạy cảm.
- Tự suy diễn tour không có trong `tours-public.json`.

## Cập nhật giá

Trong MVP static hosting, chatbot không cập nhật realtime theo Google Sheet.

Quy trình cập nhật:

1. Kiểm tra Google Sheet đối tác.
2. Cập nhật hoặc tạo lại `tours-draft.json`.
3. Duyệt thủ công tour muốn bán.
4. Publish sang `tours-public.json`.
5. Build/deploy lại site.

Sau này có thể dùng GitHub Actions để tạo `tours-draft.json` theo lịch, nhưng không tự publish nếu chưa duyệt.

## Cảnh báo giá bắt buộc

Mọi câu trả lời hoặc trang hiển thị giá tour phải có tinh thần cảnh báo:

> Giá tham khảo tại thời điểm cập nhật, có thể thay đổi theo tình trạng chỗ và chính sách đối tác. Vui lòng liên hệ để kiểm tra giá chính xác trước khi giữ dịch vụ.

