import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#000000",
          ink: "#2B2621",
          primary: "#181512",
          green: "#1D1A18",
          navy: "#111111",
          blue: "#1863dc",
          coral: "#C7A15A",
          softCoral: "#D7B874",
          stone: "#F7F3EA",
          soft: "#F6EFE1",
          greenWash: "#F6EFE1",
          blueWash: "#f1f5ff",
          muted: "#DED3C1",
          slate: "#6F6A62",
          hairline: "#DED3C1",
          border: "#E9E0D2",
          focus: "#4c6ee6",
          gold: "#C7A15A",
          goldDark: "#8C6A2F",
          goldLight: "#D7B874",
          videoGray: "#F7F3EA"
        }
      },
      boxShadow: {
        soft: "0 18px 45px rgba(24, 21, 18, 0.06)"
      }
    }
  },
  plugins: []
};

export default config;
