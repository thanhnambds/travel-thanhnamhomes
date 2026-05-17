"use client";

import { useEffect, useState } from "react";

export function ExpiryNotice({ expiresAt }: { expiresAt: string }) {
  const [expired, setExpired] = useState(false);

  useEffect(() => {
    setExpired(new Date(expiresAt).getTime() < Date.now());
  }, [expiresAt]);

  if (!expired) return null;

  return (
    <div className="rounded-lg border border-brand-softCoral bg-white p-5 text-sm font-medium text-brand-primary">
      Combo đã hết hiệu lực, vui lòng liên hệ để kiểm tra giá mới.
    </div>
  );
}
