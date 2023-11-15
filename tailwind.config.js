/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/flowbite-react/**/*.js",
    "./node_modules/tw-elements/dist/js/**/*.js",
  ],
  theme: {
    fontFamily: {
      "ITC-bold": ["ITCAvantGardeStd-Bold", "sans-serif"],
      "ITC-lite": ["TCAvantGardeStd-XLt", "sans-serif"],
      "ITC-BK": ["ITCAvantGardeStd-Bk", "sans-serif"],
    },
    extend: {
      colors: {
        secondry: ["#b11f23"],
        faded: ["#8C8C8C"],
      },
    },
  },
  plugins: [require("flowbite/plugin")],
};
