import type { Combo } from "@/lib/types";

export function AdminLog({ combo }: { combo: Combo }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5">
      <h2 className="text-xl font-semibold text-brand-ink">Admin log</h2>
      <dl className="mt-4 grid gap-3 text-sm md:grid-cols-2">
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
    <div className="rounded-md bg-slate-50 p-3">
      <dt className="font-semibold text-brand-ink">{label}</dt>
      <dd className="mt-1 break-words text-slate-600">{value}</dd>
    </div>
  );
}
