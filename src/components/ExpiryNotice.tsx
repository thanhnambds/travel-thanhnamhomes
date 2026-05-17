"use client";

import { useEffect, useState } from "react";

export function ExpiryNotice({ expiresAt }: { expiresAt: string }) {
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    setExpired(new Date(expiresAt).getTime() < Date.now());
  }, [expiresAt]);

  if (!expired) return null;

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50 p-4 text-sm font-medium text-amber-950">
      Combo đã hết hiệu lực, vui lòng liên hệ để kiểm tra giá mới.
    </div>
  );
}
