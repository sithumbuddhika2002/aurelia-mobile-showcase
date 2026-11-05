import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          beige: "#E6DAC8",
          sand: "#DFD2BE",
          cream: "#EFE6D8",
          border: "#D2C3AE",
          espresso: "#1C1917",
          taupe: "#6E655F",
          obsidian: "#141413",
        },
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Cormorant Garamond", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Inter", "system-ui", "sans-serif"],
      },
      letterSpacing: {
        editorial: "0.22em",
        luxury: "0.28em",
      },
    },
  },
  plugins: [],
};

export default config;
