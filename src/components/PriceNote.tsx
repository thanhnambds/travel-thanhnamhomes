import { AlertTriangle } from "lucide-react";
import { getConfig } from "@/lib/data";

export function PriceNote({ text }: { text?: string }) {
  const config = getConfig();
  return (
    <div className="flex gap-3 rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm leading-6 text-amber-950">
      <AlertTriangle className="mt-0.5 shrink-0" size={18} />
      <p>{text ?? config.priceNote}</p>
    </div>
  );
}
