/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'party-red': '#CC0000',
        'party-gold': '#D4A017',
        'paper-white': '#F5F0E8',
        'ink-black': '#2C2C2C',
        'a-grade': '#4CAF50',
        'f-grade': '#B71C1C',
        'health-green': '#66BB6A',
        'danger-red': '#EF5350',
        'bureau-gray': '#9E9E9E',
        'sarcasm-purple': '#7B1FA2',
      },
      fontFamily: {
        game: ['"PingFang SC"', '"Microsoft YaHei"', '"Noto Sans SC"', 'sans-serif'],
        sarcasm: ['"Noto Serif SC"', 'serif'],
      },
    },
  },
  plugins: [],
}
