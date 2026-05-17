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
    <section className="container-page py-10">
      <h2 className="text-2xl font-semibold text-brand-ink">Câu hỏi thường gặp</h2>
      <div className="mt-5 grid gap-3">
        {faqs.map((faq) => (
          <details className="rounded-lg border border-slate-200 bg-white p-4" key={faq.q}>
            <summary className="cursor-pointer font-semibold text-brand-ink">{faq.q}</summary>
            <p className="mt-3 text-sm leading-6 text-slate-600">{faq.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
