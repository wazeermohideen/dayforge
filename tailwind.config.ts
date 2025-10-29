/**
 * Tailwind CSS Configuration
 *
 * Customizes Tailwind for the DayForge application
 */

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#2563eb",
        secondary: "#4f46e5",
      },
      animation: {
        fadeIn: "fadeIn 0.3s ease-out",
      },
      keyframes: {
        fadeIn: {
          "0%": {
            opacity: "0",
            transform: "translateY(-10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms"),
  ],
};

export default config;
