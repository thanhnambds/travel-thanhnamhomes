import type { Metadata } from "next";
import { Suspense } from "react";
import { TourSearchBox } from "@/components/TourSearchBox";
import { TourSearchResults } from "@/components/TourSearchResults";
import { getPublicTours } from "@/lib/data";

export const metadata: Metadata = {
  title: "Tìm kiếm tour du lịch",
  description: "Tìm tour du lịch theo điểm đến, tháng khởi hành, giá và nơi khởi hành từ dữ liệu tour đã duyệt của Thanh Nam Travel."
};

export default function TourSearchPage() {
  const tours = getPublicTours();

  return (
    <>
      <section className="relative overflow-hidden bg-brand-primary py-16 text-white">
        <div className="absolute inset-0 travel-home-hero-bg opacity-35" />
        <div className="absolute inset-0 bg-black/55" />
        <div className="container-page relative">
          <p className="section-label-dark">Tìm tour đã duyệt</p>
          <h1 className="mt-4 max-w-4xl text-4xl font-semibold leading-tight tracking-[-0.02em] md:text-6xl">
            Tìm tour theo điểm đến, tháng đi và ngân sách
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-white/75">
            Dữ liệu tìm kiếm chỉ lấy từ danh sách tour đã được duyệt để hiển thị trên website. Thanh Nam Travel sẽ kiểm tra lại giá thật và tình trạng chỗ qua Zalo trước khi xác nhận.
          </p>
          <TourSearchBox tours={tours} className="mt-8" compact />
        </div>
      </section>

      <section className="container-page py-14">
        <Suspense fallback={<div className="rounded-2xl bg-white p-8 text-brand-slate">Đang tải bộ lọc tour...</div>}>
          <TourSearchResults tours={tours} />
        </Suspense>
      </section>
    </>
  );
}
