/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#050811',
          900: '#0a0f1d',
          850: '#0e162b',
          800: '#14203d',
          700: '#1d2d54',
          600: '#2a3e75',
          500: '#3b559e',
        },
        sih: {
          orange: '#f97316',
          amber: '#f59e0b',
          teal: '#06b6d4',
          cyan: '#22d3ee',
          emerald: '#10b981',
          red: '#ef4444',
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
        display: ['Rajdhani', 'sans-serif'],
      },
      boxShadow: {
        'glow-teal': '0 0 15px -3px rgba(6, 182, 212, 0.3)',
        'glow-orange': '0 0 15px -3px rgba(249, 115, 22, 0.3)',
        'glow-red': '0 0 15px -3px rgba(239, 68, 68, 0.35)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'scanline': 'scanline 8s linear infinite',
      }
    },
  },
  plugins: [],
}
