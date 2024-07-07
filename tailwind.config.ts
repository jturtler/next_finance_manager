import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    // "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    // "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        'living-coral': '#FF6F61',
        'ultra-violet': '#6A0DAD',
        'pale-yellow': '#FFFACD',
        'bright-yellow': '#FFD700',
        'mint-green': '#98FF98',
        'sky-blue': '#87CEEB',
        'soft-pink': '#FFB6C1',
        'dark-teal': '#008080',
        'warm-gray': '#A9A9A9',
        'sunset-orange': '#FD5E53',
        'slate-blue': '#6A5ACD',
      },
    },
  },
  plugins: [],
};
export default config;
