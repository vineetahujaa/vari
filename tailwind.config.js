/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["'Fraunces'", "Georgia", "serif"],
        sans:  ["'Inter'", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in":   "fadeIn 0.25s ease forwards",
        "marquee":   "marquee 30s linear infinite",
        "pulse-dot": "pulseDot 1.6s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%":   { opacity: 0, transform: "translateY(12px)" },
          "100%": { opacity: 1, transform: "translateY(0)" },
        },
        marquee: {
          "0%":   { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        pulseDot: {
          "0%,100%": { opacity: 1, transform: "scale(1)" },
          "50%":     { opacity: 0.6, transform: "scale(0.9)" },
        },
      },
    },
  },
  plugins: [],
}
