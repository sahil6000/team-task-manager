/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: { sans: ["Inter", "ui-sans-serif", "system-ui"] },
      colors: {
        brand: { 500: "#6366F1", 600: "#4F46E5", 50: "#EEF2FF" },
        ink: "#0F172A"
      }
    }
  },
  plugins: []
};
