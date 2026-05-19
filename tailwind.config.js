/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["'Playfair Display'", "serif"],
        body: ["'DM Sans'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      colors: {
        brand: {
          50: "#fdf8ee",
          100: "#f9edcc",
          200: "#f2d88b",
          300: "#ebbd4a",
          400: "#e4a224",
          500: "#d4841a",
          600: "#b96414",
          700: "#984815",
          800: "#7d3917",
          900: "#683016",
        },
        surface: {
          DEFAULT: "#0f0e0c",
          50: "#1a1916",
          100: "#252320",
          200: "#2f2d29",
          300: "#3a3834",
          400: "#4a4844",
          500: "#6b6966",
          600: "#8f8d8a",
          700: "#b3b1ae",
          800: "#d7d5d2",
          900: "#f0eeeb",
        },
      },
      backgroundImage: {
        "noise": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.05'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
