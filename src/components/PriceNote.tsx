import { AlertTriangle } from "lucide-react";
import { getConfig } from "@/lib/data";

export function PriceNote({ text }: { text?: string }) {
  const config = getConfig();
  return (
    <div className="flex gap-3 rounded-lg border border-brand-hairline bg-white p-5 text-sm leading-6 text-brand-ink">
      <AlertTriangle className="mt-0.5 shrink-0 text-brand-coral" size={18} />
      <p>{text ?? config.priceNote}</p>
    </div>
  );
}
