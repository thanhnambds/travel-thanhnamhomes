import type { Metadata } from "next";
import { getConfig } from "./data";

export function pageMetadata(title: string, description: string, path = "/"): Metadata {
  const config = getConfig();
  return {
    title,
    description,
    alternates: {
      canonical: `${config.siteUrl}${path}`
    },
    openGraph: {
      title,
      description,
      url: `${config.siteUrl}${path}`,
      siteName: "Travel Thanh Nam Homes",
      locale: "vi_VN",
      type: "website"
    }
  };
}
