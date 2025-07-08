/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Custom D&D theme colors
        'dnd-red': '#922610',
        'dnd-gold': '#E5D49E',
        'dnd-dark': '#1B1B1B',
      },
      fontFamily: {
        'serif': ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
        'display': ['Cinzel', 'Georgia', 'serif'],
      },
      animation: {
        'dice-roll': 'roll 0.6s ease-in-out',
      },
      keyframes: {
        roll: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        }
      }
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
}