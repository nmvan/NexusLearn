/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: 'hsl(var(--background) / <alpha-value>)',
        primary: {
          DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
          foreground: 'hsl(var(--primary-foreground) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
          glow: 'hsl(var(--accent) / 0.5)',
        },
        slate: {
          950: 'hsl(var(--background) / <alpha-value>)', // Maps to Background (Dark: Slate 950, Light: White)
          900: 'hsl(var(--card) / <alpha-value>)',       // Maps to Card (Dark: Slate 900, Light: Slate 50)
          800: 'hsl(var(--border) / <alpha-value>)',     // Maps to Border (Dark: Slate 800, Light: Slate 200)
          400: 'hsl(var(--foreground-tertiary) / <alpha-value>)', // Maps to Tertiary Text
          200: 'hsl(var(--foreground-secondary) / <alpha-value>)', // Maps to Secondary Text
          50: 'hsl(var(--foreground) / <alpha-value>)',  // Maps to Main Text (Dark: Slate 50, Light: Slate 950)
        },
        indigo: {
          700: 'hsl(var(--primary) / <alpha-value>)',    // Maps to Primary
        },
        ai: {
          text: 'hsl(var(--ai-text) / <alpha-value>)',
          background: 'hsl(var(--ai-background) / <alpha-value>)',
          subtle: 'hsl(var(--ai-subtle) / <alpha-value>)',
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
      },
      keyframes: {
        glow: {
          '0%': { boxShadow: '0 0 5px hsl(var(--accent))' },
          '100%': { boxShadow: '0 0 20px hsl(var(--accent)), 0 0 10px hsl(var(--accent))' },
        }
      }
    },
  },
  plugins: [],
}
