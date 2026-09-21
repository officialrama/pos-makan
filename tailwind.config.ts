import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#fdf3f3",
          100: "#fbe4e4",
          500: "#b0392f",
          600: "#9a2f26",
          700: "#7f261f",
        },
        go: {
          50: "#edf9f1",
          100: "#d3f0de",
          200: "#a9e2c0",
          500: "#12a150",
          600: "#0e8443",
          700: "#0b6836",
        },
        ink: {
          900: "#1c1c1b",
          700: "#3d3d3a",
          500: "#6b6b66",
          300: "#a8a8a2",
        },
        line: "#e5e3de",
        canvas: "#f7f6f3",
      },
      fontFamily: {
        sans: ["var(--font-sans)"],
      },
    },
  },
  plugins: [],
};

export default config;
