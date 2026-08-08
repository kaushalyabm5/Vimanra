/** @type {import('tailwindcss').Config} */

/**
 * Admin theme mirrors the public site (frontend/) design language:
 *  - Typography: Inter, tight tracking on headings, light weights on body/CTAs
 *  - Palette:    green brand accent on a neutral (not slate/navy) grey scale
 *  - Shape:      pill CTAs, 2xl/3xl cards, hairline neutral borders
 * Token names are semantic so both apps can drift in value without drifting in meaning.
 */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Neutral scale — matches Tailwind `neutral` used across the public site.
        ink: {
          DEFAULT: "#0A0A0A", // neutral-950 · dark surfaces (sidebar, drawer, footer)
          50: "#FAFAFA",
          100: "#F5F5F5",
          200: "#E5E5E5",
          300: "#D4D4D4",
          400: "#A3A3A3",
          500: "#737373",
          600: "#525252",
          700: "#404040",
          800: "#262626",
          900: "#171717",
          950: "#0A0A0A",
        },
        // Brand green — same values the site uses for CTAs and accents.
        brand: {
          DEFAULT: "#16A34A", // green-600 · primary buttons
          light: "#22C55E",   // green-500 · hover / on-dark fills
          dark: "#15803D",    // green-700 · navbar logo, pressed
          on: "#4ADE80",      // green-400 · accents on dark backgrounds
        },
        surface: "#FAFAFA",
        card: "#FFFFFF",
        success: "#16A34A",
        warning: "#F59E0B",
        danger: "#DC2626",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      boxShadow: {
        soft: "0 2px 10px rgba(10, 10, 10, 0.05)",
        card: "0 8px 30px rgba(10, 10, 10, 0.07)",
        pill: "0 1px 2px rgba(10, 10, 10, 0.08)",
      },
      borderRadius: {
        xl: "0.875rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
      },
    },
  },
  plugins: [],
}
