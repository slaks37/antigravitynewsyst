import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./blocks/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0B1730",
          900: "#070F20",
          800: "#0B1730",
          700: "#132347",
          600: "#1D3261",
        },
        brand: {
          blue: "#005BFF",
          cyan: "#12C9F5",
          indigo: "#6366F1",
          light: "#EBF3FF",
        },
        slate: {
          50: "#F8FAFC",
          100: "#F1F5F9",
          200: "#E2E8F0",
          300: "#CBD5E1",
          400: "#94A3B8",
          500: "#64748B",
          600: "#475569",
          700: "#334155",
          800: "#1E293B",
          900: "#0F172A",
          950: "#0B1730",
        },
        surface: "#FFFFFF",
        primaryText: "#111827",
        secondaryText: "#64748B",
      },
      fontFamily: {
        sans: [
          "Inter",
          "-apple-system",
          "BlinkMacSystemFont",
          "'Segoe UI'",
          "Roboto",
          "sans-serif",
        ],
      },
      boxShadow: {
        premium: "0 10px 30px -5px rgba(11, 23, 48, 0.05), 0 4px 6px -2px rgba(11, 23, 48, 0.025)",
        card: "0 4px 20px -2px rgba(11, 23, 48, 0.06)",
        hover: "0 20px 35px -5px rgba(0, 91, 255, 0.12), 0 8px 10px -6px rgba(11, 23, 48, 0.04)",
      },
    },
  },
  plugins: [],
};

export default config;
