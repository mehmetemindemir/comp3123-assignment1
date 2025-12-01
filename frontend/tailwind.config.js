/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif']
      },
      boxShadow: {
        glow: '0 25px 80px rgba(14, 165, 233, 0.28)'
      }
    }
  },
  plugins: []
};
