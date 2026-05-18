import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          black: "#000000",
          ink: "#212121",
          primary: "#17171c",
          green: "#003c33",
          navy: "#071829",
          blue: "#1863dc",
          coral: "#ff7759",
          softCoral: "#ffad9b",
          stone: "#eeece7",
          greenWash: "#edfce9",
          blueWash: "#f1f5ff",
          muted: "#93939f",
          slate: "#75758a",
          hairline: "#d9d9dd",
          border: "#e5e7eb",
          focus: "#4c6ee6",
          gold: "#f8bf2c",
          videoGray: "#b7b7b7"
        }
      },
      boxShadow: {
        soft: "0 18px 45px rgba(0, 0, 0, 0.06)"
      }
    }
  },
  plugins: []
};

export default config;
