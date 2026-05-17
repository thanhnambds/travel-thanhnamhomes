const faqs = [
  {
    q: "Giá trên web có phải giá chốt cuối không?",
    a: "Không. Đây là giá tham khảo tại thời điểm cập nhật. Thanh Nam sẽ kiểm tra lại tình trạng vé và phòng trước khi báo giá chính xác."
  },
  {
    q: "Có giữ chỗ trực tiếp trên website không?",
    a: "MVP chưa có booking online. Khách gửi nhu cầu qua Zalo để được kiểm tra và chốt thủ công."
  },
  {
    q: "Chatbot có tự xác nhận còn phòng không?",
    a: "Không. Chatbot chỉ lọc nhu cầu dựa trên dữ liệu có sẵn và chuyển thông tin sang Zalo."
  }
];

export function Faq() {
  return (
    <section className="container-page py-16">
      <h2 className="display-type text-5xl font-normal leading-none text-brand-primary">Câu hỏi thường gặp</h2>
      <div className="mt-8 border-y border-brand-hairline">
        {faqs.map((faq) => (
          <details className="border-b border-brand-hairline bg-white py-5 last:border-b-0" key={faq.q}>
            <summary className="cursor-pointer text-2xl font-normal text-brand-primary">{faq.q}</summary>
            <p className="mt-4 max-w-3xl text-sm leading-6 text-brand-slate">{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
