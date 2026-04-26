/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: "#020617",
        saffron: "#f59e0b",
        emerald: "#10b981",
      },
      fontFamily: {
        sans: ["Inter", "Montserrat", "sans-serif"],
      },
      backdropBlur: {
        xl: "30px",
      },
      animation: {
        gradient: "gradientMove 15s ease infinite",
      },
      keyframes: {
        gradientMove: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
      },
    },
  },
  plugins: [],
};