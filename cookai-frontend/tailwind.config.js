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
        primary: {
          50: '#fbf2eb',
          100: '#f4d8c6',
          200: '#e8ba9f',
          300: '#d99470',
          400: '#c96f4b',
          500: '#b85c38',
          600: '#9f4729',
          700: '#83371f',
          800: '#692b18',
          900: '#4f2012',
        },
        secondary: {
          50: '#eef4ed',
          100: '#d8e5d6',
          200: '#b9d0b7',
          300: '#94b192',
          400: '#759173',
          500: '#5d7b5d',
          600: '#496149',
          700: '#384a38',
          800: '#2b392b',
          900: '#202b20',
        },
        accent: {
          50: '#fff6e8',
          100: '#f8e2b4',
          200: '#f2cc86',
          300: '#e9b35d',
          400: '#df9e41',
          500: '#d98f2b',
          600: '#bb7420',
          700: '#955817',
          800: '#754412',
          900: '#59330d',
        },
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          dark: 'rgba(0, 0, 0, 0.1)',
        }
      },
      fontFamily: {
        sans: ['Avenir Next', 'Segoe UI', 'Helvetica Neue', 'sans-serif'],
        display: ['Iowan Old Style', 'Palatino Linotype', 'Book Antiqua', 'Georgia', 'serif'],
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'bounce-gentle': 'bounceGentle 2s infinite',
        'gradient': 'gradient 6s ease infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' }
        },
        scaleIn: {
          '0%': { transform: 'scale(0.95)', opacity: '0' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        },
        bounceGentle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-10px)' }
        },
        gradient: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' }
        }
      },
      backgroundSize: {
        '300%': '300%'
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 28px 80px -38px rgba(74, 39, 18, 0.35)',
        'glass-inset': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.45)',
      }
    },
  },
  plugins: [
    // Custom plugin for glassmorphism utilities
    function({ addUtilities }) {
      const newUtilities = {
        '.glass': {
          background: 'rgba(255, 255, 255, 0.1)',
          'backdrop-filter': 'blur(10px)',
          '-webkit-backdrop-filter': 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.2)',
        },
        '.glass-dark': {
          background: 'rgba(0, 0, 0, 0.1)',
          'backdrop-filter': 'blur(10px)',
          '-webkit-backdrop-filter': 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
        },
        '.text-gradient': {
          'background-image': 'linear-gradient(120deg, #8f3f23, #d98f2b, #9d4b5a)',
          'background-size': '300%',
          'background-clip': 'text',
          '-webkit-background-clip': 'text',
          '-webkit-text-fill-color': 'transparent',
          'animation': 'gradient 6s ease infinite'
        }
      }
      addUtilities(newUtilities)
    }
  ],
}
