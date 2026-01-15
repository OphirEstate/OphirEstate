import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors
        gold: {
          DEFAULT: "#aa864a",
          light: "#e5cb91",
          dark: "#8a6a3a",
        },
        dark: {
          DEFAULT: "#242635",
          lighter: "#2a2d3d",
          card: "#20222f",
          footer: "#1e202c",
        },
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "sans-serif"],
        serif: ["var(--font-playfair)", "serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(to right, #aa864a, #e5cb91)",
      },
    },
  },
  plugins: [],
};

export default config;
