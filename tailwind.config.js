/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#020617', // Slate-950
        primary: {
          DEFAULT: '#4338ca', // Indigo-700
          foreground: '#ffffff',
        },
        accent: {
          DEFAULT: '#22d3ee', // Cyan-400
          glow: 'rgba(34, 211, 238, 0.5)',
        },
        slate: {
          950: '#020617',
        },
        indigo: {
          700: '#4338ca',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px #22d3ee' },
          '100%': { boxShadow: '0 0 20px #22d3ee, 0 0 10px #22d3ee' },
        }
      }
    },
  },
  plugins: [],
}
