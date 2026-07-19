/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#2a1520',
        cream: '#fff5f9',
        blush: '#ffd6e8',
        rose: '#ff9ec8',
        hot: '#ff4d9a',
        berry: '#e8327a',
        night: '#1a0a12',
      },
      fontFamily: {
        editorial: ['"PP Editorial New Ultralight"', 'Georgia', 'serif'],
        inter: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'ui-monospace', 'monospace'],
      },
      letterSpacing: {
        brand: '0.15em',
      },
    },
  },
  plugins: [],
}
