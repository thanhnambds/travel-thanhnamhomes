import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          ink: "#17324d",
          teal: "#0f766e",
          coral: "#d85a3a",
          mist: "#eef6f4"
        }
      },
      boxShadow: {
        soft: "0 18px 45px rgba(15, 35, 52, 0.10)"
      }
    }
  },
  plugins: []
};

export default config;
