import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{ts,tsx}",
    "./src/components/**/*.{ts,tsx}",
    "./src/app/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: "1.5rem",
        sm: "2rem",
        lg: "4rem",
        xl: "5rem",
        "2xl": "6rem",
      },
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        cream: {
          DEFAULT: "#EDE8E1",
          50: "#FBFAF8",
          100: "#F5F2ED",
          200: "#EDE8E1",
          300: "#E2D9CC",
        },
        sand: {
          DEFAULT: "#D9CBB8",
          dark: "#C9B89F",
        },
        ink: {
          DEFAULT: "#4A4036",
          soft: "#6B5F50",
        },
        accent: {
          DEFAULT: "#7B7354",
          dark: "#665E43",
        },
        espresso: {
          DEFAULT: "#2C2925",
          light: "#3A352F",
        },
      },
      fontFamily: {
        serif: ["var(--font-cormorant)", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        luxe: "0.2em",
        wide: "0.05em",
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.25rem",
      },
      boxShadow: {
        soft: "0 4px 24px -8px rgba(44, 41, 37, 0.12)",
        premium: "0 24px 64px -24px rgba(44, 41, 37, 0.22)",
        glow: "0 0 80px -20px rgba(123, 115, 84, 0.45)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(24px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-16px)" },
        },
        "float-slow": {
          "0%, 100%": { transform: "translateY(0px) translateX(0px)" },
          "50%": { transform: "translateY(-24px) translateX(10px)" },
        },
        flicker: {
          "0%, 100%": { opacity: "0.9", transform: "scale(1)" },
          "25%": { opacity: "0.75", transform: "scale(0.98)" },
          "50%": { opacity: "1", transform: "scale(1.02)" },
          "75%": { opacity: "0.85", transform: "scale(0.99)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s ease-out forwards",
        float: "float 6s ease-in-out infinite",
        "float-slow": "float-slow 9s ease-in-out infinite",
        flicker: "flicker 4s ease-in-out infinite",
        shimmer: "shimmer 8s linear infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
