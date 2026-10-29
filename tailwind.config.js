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
        midnight: {
          950: '#060814',
          900: '#0B0E1E',
          850: '#0F142A',
          800: '#141A38',
          700: '#1B234B',
          600: '#263168',
          500: '#344388',
        },
        lavender: {
          100: '#F2EEFC',
          200: '#E1D9F8',
          300: '#C7B7F2',
          400: '#AA90EC',
          500: '#8E6CE5',
          600: '#754ED0',
          700: '#5C38AD',
        },
        rosemoon: {
          100: '#FDF2F6',
          200: '#F9D6E4',
          300: '#F4ABC4',
          400: '#EC7EA5',
          500: '#DC5485',
        },
        moonlight: {
          silver: '#E8ECF8',
          cream: '#FFFDF9',
          glow: '#FFE8A3',
          shimmer: '#A5C9FF',
        },
        stargold: {
          100: '#FEF9C3',
          300: '#FDE047',
          400: '#FACC15',
          500: '#EAB308',
        }
      },
      fontFamily: {
        serif: ['Cinzel', 'Playfair Display', 'Georgia', 'serif'],
        sans: ['Plus Jakarta Sans', 'Quicksand', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'monospace'],
      },
      boxShadow: {
        'moon-glow': '0 0 25px -3px rgba(186, 171, 245, 0.4), 0 0 10px -2px rgba(254, 240, 138, 0.3)',
        'star-glow': '0 0 15px 2px rgba(253, 224, 71, 0.45)',
        'glass-card': '0 8px 32px 0 rgba(11, 14, 30, 0.45)',
        'purple-glow': '0 0 30px rgba(142, 108, 229, 0.35)',
      },
      animation: {
        'float-slow': 'float 7s ease-in-out infinite',
        'float-gentle': 'floatGentle 4s ease-in-out infinite',
        'twinkle': 'twinkle 3s ease-in-out infinite',
        'drift': 'driftCloud 35s linear infinite',
        'drift-reverse': 'driftCloudReverse 45s linear infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
        'book-open': 'bookOpen 0.8s ease-out forwards',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(1.5deg)' },
        },
        floatGentle: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        twinkle: {
          '0%, 100%': { opacity: 0.3, transform: 'scale(0.85)' },
          '50%': { opacity: 1, transform: 'scale(1.2)' },
        },
        driftCloud: {
          '0%': { transform: 'translateX(-10%)' },
          '100%': { transform: 'translateX(110%)' },
        },
        driftCloudReverse: {
          '0%': { transform: 'translateX(110%)' },
          '100%': { transform: 'translateX(-10%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.6, filter: 'drop-shadow(0 0 12px rgba(245, 210, 120, 0.4))' },
          '50%': { opacity: 1, filter: 'drop-shadow(0 0 25px rgba(245, 210, 120, 0.8))' },
        },
        bookOpen: {
          '0%': { transform: 'rotateY(-20deg) scale(0.95)', opacity: '0' },
          '100%': { transform: 'rotateY(0deg) scale(1)', opacity: '1' },
        }
      }
    },
  },
  plugins: [],
}
