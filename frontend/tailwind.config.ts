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
        lab: {
          bg: "#0a0a0e", // Deep void dark
          panel: "#13131a", // Slightly lighter for cards
          accent: "#00f0ff", // Cyan Neon
          danger: "#ff003c", // Red Neon
          success: "#00ff9d", // Green Neon
          text: "#e0e0e0",
          muted: "#6b7280"
        }
      },
      fontFamily: {
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', "Liberation Mono", "Courier New", 'monospace'],
      },
    },
  },
  plugins: [],
};
export default config;
