/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    fontFamily: {
      poppins: ["Poppins"],
    },
    extend: {
      colors: {
        "primary-blue": "#026CD2",
        "dark-blue": "#04444F",
        "light-green": "#85FE9D",
        green: "#62C471",
        danger: "#EE6055",
        "light-blue": "#F3F9FF",
        "dark-green": "#00783E"
      },
    },
  },
  plugins: [],
};
