import Link from "next/link";
import type { ReactNode } from "react";
import { Check, ClipboardCheck, Hotel, MessageCircle, Plane } from "lucide-react";
import { ComboCard } from "@/components/ComboCard";
import { DestinationCard } from "@/components/DestinationCard";
import { TourCard } from "@/components/TourCard";
import { PriceNote } from "@/components/PriceNote";
import { getConfig, getDailyCombo } from "@/lib/data";

export default function HomePage() {
  const config = getConfig();
  const combo = getDailyCombo();

  return (
    <>
      <section className="travel-home-hero relative min-h-[calc(100vh-68px)] overflow-hidden bg-brand-primary text-white">
        <div className="absolute inset-0 travel-home-hero-bg" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/30" />
        <div className="container-page relative flex min-h-[calc(100vh-68px)] flex-col items-center justify-center py-24 text-center">
          <p className="section-label-dark justify-center">Thanh Nam Homes Travel</p>
          <h1 className="mx-auto mt-4 max-w-5xl text-5xl font-medium leading-tight tracking-[-0.02em] text-white md:text-6xl lg:text-7xl">
            Kiến Tạo Kỳ Nghỉ Đẳng Cấp, Mang Dấu Ấn Của Riêng Bạn
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-base leading-8 text-white/80 md:text-lg">
            Trải nghiệm các gói combo du lịch linh hoạt kết hợp vé máy bay và không gian nghỉ dưỡng sang trọng. Đội ngũ Thanh Nam Travel hỗ trợ 1:1, giúp bạn tối ưu chi phí mà vẫn tận hưởng trọn vẹn từng khoảnh khắc.
          </p>
          <div className="mt-9 flex flex-wrap justify-center gap-4">
            <Link className="btn-brand-gold" href="/combo-hom-nay/">
              <Plane size={18} />
              Combo Hôm Nay
            </Link>
            <a className="btn-hero-outline" href={config.zaloUrl}>
              <MessageCircle size={18} />
              Tư vấn Zalo
            </a>
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <p className="section-label justify-center">
          Vì sao chọn chúng tôi
        </p>
        <h2 className="mx-auto mt-3 max-w-3xl text-center text-4xl font-medium leading-tight tracking-[-0.02em] text-brand-primary md:text-5xl">
          Trải nghiệm kỳ nghỉ đẳng cấp, thiết kế riêng cho bạn
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-center text-brand-slate">
          Chúng tôi không chỉ cung cấp những chuyến đi, mà còn kiến tạo những trải nghiệm tinh tế. Từng chi tiết nhỏ đều được thiết kế khắt khe để hành trình của bạn trở nên độc bản.
        </p>
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          <Info
            icon={<Plane size={22} />}
            title="Chủ Động Lịch Trình Bay"
            text="Tối ưu hóa thời gian với các chuyến bay đẹp nhất từ các hãng hàng không uy tín, hoàn toàn phù hợp với kế hoạch cá nhân của gia đình bạn."
          />
          <Info
            icon={<Hotel size={22} />}
            title="Nghỉ Dưỡng Hạng Sang"
            text="Hệ thống resort và khách sạn đối tác được tuyển chọn khắt khe, mang đến không gian lưu trú sang trọng, tầm nhìn tuyệt mỹ và tiện nghi bậc nhất."
          />
          <Info
            icon={<ClipboardCheck size={22} />}
            title="Chăm Sóc Đặc Quyền 1:1"
            text="Chuyên viên cá nhân hỗ trợ trực tiếp từ khâu lên ý tưởng, kiểm tra tình trạng chỗ đến khi kết thúc hành trình, đảm bảo mọi trải nghiệm đều hoàn hảo."
          />
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-page grid gap-10 lg:grid-cols-[0.78fr_1.22fr]">
          <div>
            <p className="section-label">Gợi ý hôm nay</p>
            <h2 className="mt-4 text-4xl font-medium leading-tight tracking-[-0.02em] text-brand-primary md:text-5xl">
              Combo ưu đãi đặc biệt
            </h2>
            <p className="mt-6 text-brand-slate">
              Tuyển tập những gói ưu đãi độc quyền được làm mới mỗi ngày. Số lượng có hạn - hãy kết nối với chuyên viên của chúng tôi ngay để nhận báo giá cá nhân hóa và giữ chỗ tốt nhất.
            </p>
          </div>
          <div className="rounded-2xl bg-brand-soft p-6">
            {combo ? <ComboCard combo={combo} compact /> : <EmptyCombo />}
          </div>
        </div>
      </section>

      <section className="bg-brand-soft py-20">
        <div className="container-page">
          <div className="mb-10 flex items-end justify-between gap-4">
            <div>
              <p className="section-label">Khám phá điểm đến</p>
              <h2 className="mt-4 text-4xl font-medium leading-tight tracking-[-0.02em] text-brand-primary md:text-5xl">
                Những thiên đường nghỉ dưỡng
              </h2>
              <p className="mt-5 max-w-xl text-brand-slate">
                Chạm đến những thiên đường du lịch hàng đầu Việt Nam. Mỗi điểm đến là một bản hòa ca của cảnh sắc thiên nhiên và dịch vụ nghỉ dưỡng đỉnh cao.
              </p>
            </div>
            <Link className="hidden text-sm font-semibold text-brand-goldDark underline underline-offset-4 md:inline" href="/combo-du-lich/">
              Xem tất cả điểm đến
            </Link>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DestinationCard
              href="/combo-phu-quoc/"
              title="Phú Quốc"
              description="Tuyệt tác đảo Ngọc xanh mát. Trải nghiệm không gian nghỉ dưỡng biệt lập, riêng tư dành riêng cho giới tinh hoa."
              image="/images/phu-quoc.png"
            />
            <DestinationCard
              href="/combo-da-nang/"
              title="Đà Nẵng"
              description="Thành phố của những nhịp sống hiện đại. Tận hưởng tầm nhìn panorama ôm trọn biển Mỹ Khê hay không gian an yên tại bán đảo Sơn Trà."
              image="/images/da-nang.png"
            />
            <DestinationCard
              href="/combo-nha-trang/"
              title="Nha Trang"
              description="Viên ngọc bích của biển Đông. Thư giãn tại các khách sạn sang trọng bậc nhất với tầm nhìn trực diện vịnh biển tuyệt đẹp."
              image="/images/nha-trang.png"
            />
            <DestinationCard
              href="/combo-ha-long/"
              title="Hạ Long"
              description="Kỳ quan thiên nhiên thế giới. Trải nghiệm hải trình đẳng cấp trên những du thuyền 5 sao ôm trọn vẻ đẹp di sản."
              image="/images/ha-long.png"
            />
          </div>
        </div>
      </section>

      <section className="bg-white py-20">
        <div className="container-page">
          <div className="mb-10">
            <h2 className="text-4xl font-medium leading-tight tracking-[-0.02em] text-brand-primary md:text-5xl">
              Các Tour Phổ Biến
            </h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            <TourCard
              href="#"
              image="/images/tours/china.png"
              location="Trung Quốc"
              title="Tour nhóm nhỏ: Vạn Lý Trường Thành Mutianyu, Cung điện mùa..."
              rating={5}
              reviews={0}
              tag="Tour 3 ngày 2 đêm"
              price="6.000.000 ₫"
              duration="2 Ngày"
            />
            <TourCard
              href="#"
              image="/images/tours/thailand.png"
              location="Thái Lan"
              title="Kỳ quan Tây Thái Lan: Phi Phi, Koh Phi Phi, Krabi & Xa hơn"
              rating={5}
              reviews={0}
              tag="Tour trọn gói"
              price="3.000.000 ₫"
              duration="2 Ngày"
            />
            <TourCard
              href="#"
              image="/images/tours/bali.png"
              location="Bali, Indonesia"
              title="Bali Highlights: Một chuyến đi thiên đường ven biển đến thành..."
              rating={5}
              reviews={0}
              tag="Nghỉ dưỡng"
              price="3.800.000 ₫"
              duration="2 Ngày"
            />
            <TourCard
              href="#"
              image="/images/tours/japan.png"
              location="Tokyo, Nhật Bản"
              title="Tokyo: Trải nghiệm hoa anh đào riêng tư - tuyệt vời nhất của..."
              rating={5}
              reviews={0}
              tag="Nhật Bản"
              price="1.000.000 ₫"
              duration="2 Ngày"
            />
          </div>
        </div>
      </section>

      <section className="container-page py-20">
        <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
          <div className="rounded-2xl border border-brand-hairline bg-white p-7">
            <p className="section-label">Cam kết dịch vụ</p>
            <h2 className="mt-4 text-3xl font-medium leading-tight text-brand-primary">Đồng hành cùng bạn trên mỗi chuyến đi</h2>
            <p className="mt-5 text-sm leading-7 text-brand-slate">
              Tính minh bạch và sự tận tâm là giá trị cốt lõi của Thanh Nam Travel. Mọi chi phí và lịch trình đều được kiểm chứng trực tiếp với hệ thống đối tác để đảm bảo quyền lợi tối đa cho bạn. Vui lòng kết nối qua Zalo để chúng tôi thiết kế chính xác hành trình bạn mong đợi.
            </p>
          </div>
          <PriceNote />
        </div>
      </section>
    </>
  );
}

function Proof({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-2 text-xs font-semibold text-white/78 backdrop-blur">
      <Check size={14} className="text-brand-gold" />
      {text}
    </span>
  );
}

function Info({ icon, title, text }: { icon: ReactNode; title: string; text: string }) {
  return (
    <div className="rounded-2xl border border-brand-hairline bg-white p-7 shadow-soft">
      <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-full bg-brand-soft text-brand-goldDark">{icon}</div>
      <h3 className="text-2xl font-medium text-brand-primary">{title}</h3>
      <p className="mt-4 text-sm leading-7 text-brand-slate">{text}</p>
    </div>
  );
}

function EmptyCombo() {
  return (
    <div className="rounded-2xl border border-dashed border-brand-hairline bg-white p-6 text-center text-brand-slate">
      Hệ thống đang cập nhật những ưu đãi phòng và chặng bay tốt nhất ngày hôm nay. Vui lòng nhắn tin qua Zalo để chuyên viên thiết kế combo gửi báo giá trực tiếp cho bạn!
    </div>
  );
}
