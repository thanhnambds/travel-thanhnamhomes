import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ChatbotWidget } from "@/components/ChatbotWidget";
import { getConfig, getDailyCombo } from "@/lib/data";

export const metadata: Metadata = {
  metadataBase: new URL("https://travel.thanhnamhomes.vn"),
  title: {
    default: "Travel Thanh Nam Homes",
    template: "%s | Travel Thanh Nam Homes"
  },
  description: "Combo du lịch vé máy bay và khách sạn, tư vấn qua Zalo Thanh Nam Homes."
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  const config = getConfig();
  const combo = getDailyCombo();

  return (
    <html lang="vi">
      <body>
        <Header zaloUrl={config.zaloUrl} />
        <main>{children}</main>
        <Footer />
        <ChatbotWidget combo={combo} zaloUrl={config.zaloUrl} />
      </body>
    </html>
  );
}
