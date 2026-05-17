import type { Combo } from "@/lib/types";

export function AdminLog({ combo }: { combo: Combo }) {
  return (
    <section className="rounded-[22px] border border-brand-hairline bg-white p-7">
      <h2 className="display-type text-4xl font-normal text-brand-primary">Admin log</h2>
      <dl className="mt-6 grid gap-3 text-sm md:grid-cols-2">
        <Item label="Combo tạo ngày" value={combo.generated_at} />
        <Item label="Cập nhật giá lúc" value={combo.source_log.price_updated_at} />
        <Item label="Nguồn vé" value={combo.source_log.flight_source} />
        <Item label="Dữ liệu vé cập nhật" value={combo.source_log.flight_updated_at} />
        <Item label="Nguồn khách sạn" value={combo.source_log.hotel_source} />
        <Item label="Trạng thái" value={combo.status} />
      </dl>
    </section>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg bg-brand-stone p-4">
      <dt className="font-medium text-brand-primary">{label}</dt>
      <dd className="mt-1 break-words text-brand-slate">{value}</dd>
    </div>
  );
}
