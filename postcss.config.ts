/**
 * PostCSS Configuration
 *
 * Processes Tailwind CSS and autoprefixes CSS for cross-browser compatibility
 */

import type { Config } from "postcss-load-config";

const config: Config = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};

export default config;
