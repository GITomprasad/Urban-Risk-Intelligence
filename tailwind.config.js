/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        urip: {
          navy: '#1A3C5E',
          darkest: '#070D18',
          dark: '#0B132B',
          card: '#101B36',
          panel: '#152347',
          border: '#1E3264',
          subtle: '#29437F',
          red: '#D32F2F',
          'red-bright': '#FF334B',
          amber: '#F57C00',
          'amber-bright': '#FF9800',
          green: '#388E3C',
          'green-bright': '#00E676',
          blue: '#0288D1',
          'blue-light': '#38BDF8',
          cyan: '#00E5FF',
          text: '#F1F5F9',
          muted: '#94A3B8',
        }
      },
      fontFamily: {
        sans: ['Inter', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace']
      },
      animation: {
        'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'radar': 'radar 3s linear infinite',
        'beacon': 'beacon 1.5s ease-out infinite',
        'scanline': 'scanline 6s linear infinite'
      },
      keyframes: {
        radar: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' }
        },
        beacon: {
          '0%': { transform: 'scale(1)', opacity: '1' },
          '100%': { transform: 'scale(2.4)', opacity: '0' }
        },
        scanline: {
          '0%': { transform: 'translateY(-100%)' },
          '100%': { transform: 'translateY(1000%)' }
        }
      }
    },
  },
  plugins: [],
}
