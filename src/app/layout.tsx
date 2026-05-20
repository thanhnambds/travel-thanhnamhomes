import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { ChatbotWidget } from "@/components/ChatbotWidget";
import { getConfig, getDailyCombo, getPublicTours } from "@/lib/data";

const playfair = Playfair_Display({
  subsets: ["vietnamese"],
  variable: "--font-playfair",
  display: "swap",
});

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["vietnamese"],
  variable: "--font-jakarta",
  display: "swap",
});

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
  const tours = getPublicTours();

  return (
    <html lang="vi" className="scroll-smooth">
      <body className={`${playfair.variable} ${plusJakarta.variable} antialiased`}>
        <Header zaloUrl={config.zaloUrl} />
        <main>{children}</main>
        <Footer />
        <ChatbotWidget combo={combo} tours={tours} zaloUrl={config.zaloUrl} />
      </body>
    </html>
  );
}
