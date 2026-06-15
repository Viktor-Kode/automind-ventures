import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          DEFAULT: "#0A0F1E",
          800: "#111827",
          700: "#1a2235",
          600: "#243047",
          500: "#2e3d5a"
        },
        amber: {
          DEFAULT: "#F5A623",
          hover: "#e8961a",
          light: "#fef3d7",
          dark: "#c47c0e"
        }
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"]
      },
      backgroundImage: {
        "hero-gradient":
          "linear-gradient(135deg, #0A0F1E 0%, #1a2235 50%, #0d1525 100%)",
        "amber-gradient":
          "linear-gradient(135deg, #F5A623 0%, #e8961a 100%)"
      },
      animation: {
        "fade-in": "fadeIn 0.4s ease-in-out",
        "slide-up": "slideUp 0.5s ease-out"
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" }
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" }
        }
      }
    }
  },
  plugins: []
};

export default config;
