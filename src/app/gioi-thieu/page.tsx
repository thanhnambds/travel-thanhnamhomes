import { PageHero } from "@/components/PageHero";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata(
  "Giới thiệu Thanh Nam Travel",
  "Câu chuyện thương hiệu và định hướng dịch vụ du lịch cao cấp của Thanh Nam Travel.",
  "/gioi-thieu/"
);

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Về chúng tôi"
        title="Định chuẩn mới cho du lịch cá nhân hoá"
        description="Thanh Nam Travel ra đời với sứ mệnh mang đến những trải nghiệm du lịch tinh tế, sang trọng và hoàn toàn tự do cho khách hàng."
      />
      <section className="container-page py-16">
        <div className="max-w-3xl space-y-6 text-brand-slate leading-7">
          <p>
            Chúng tôi hiểu rằng thời gian của bạn là vô giá. Vì vậy, Thanh Nam Travel không chỉ bán một tour du lịch hay một combo vé máy bay. Chúng tôi thiết kế <strong className="text-brand-primary font-medium">những kỳ nghỉ độc bản</strong>.
          </p>
          <p>
            Với mạng lưới đối tác chiến lược gồm các hãng hàng không hàng đầu và hệ thống resort 5 sao sang trọng nhất, chúng tôi tự tin đáp ứng mọi yêu cầu khắt khe của bạn. Dù là một kỳ nghỉ dưỡng biệt lập tại Phú Quốc, hay một hải trình riêng tư trên vịnh Hạ Long, mọi thứ đều được chuẩn bị với sự tận tâm tuyệt đối.
          </p>
          <h2 className="text-2xl font-medium text-brand-primary mt-8 mb-4">Giá trị cốt lõi</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong className="text-brand-primary font-medium">Tính cá nhân hoá cao:</strong> Mọi lịch trình đều được may đo theo sở thích và nhịp điệu của riêng bạn.</li>
            <li><strong className="text-brand-primary font-medium">Chăm sóc 1:1:</strong> Trợ lý du lịch cá nhân hỗ trợ 24/7 trước, trong và sau chuyến đi.</li>
            <li><strong className="text-brand-primary font-medium">Minh bạch & Đẳng cấp:</strong> Cam kết chất lượng dịch vụ chuẩn quốc tế.</li>
          </ul>
        </div>
      </section>
    </>
  );
}
