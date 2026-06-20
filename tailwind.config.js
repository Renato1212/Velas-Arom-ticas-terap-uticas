/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        display: ['"Archivo"', 'Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        relva: {
          900: '#0a3d1f',
          800: '#0e5128',
          700: '#147a3a',
        },
        noite: {
          950: '#070b16',
          900: '#0b1120',
          800: '#111a2e',
          700: '#1a2742',
          600: '#243456',
        },
      },
      keyframes: {
        'flash-golo': {
          '0%': { backgroundColor: 'rgba(250, 204, 21, 0)' },
          '30%': { backgroundColor: 'rgba(250, 204, 21, 0.45)' },
          '100%': { backgroundColor: 'rgba(250, 204, 21, 0)' },
        },
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'pop-in': {
          '0%': { opacity: '0', transform: 'scale(0.85)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'pulso': {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        },
        'subir-trofeu': {
          '0%': { opacity: '0', transform: 'translateY(40px) scale(0.7)' },
          '60%': { transform: 'translateY(-10px) scale(1.1)' },
          '100%': { opacity: '1', transform: 'translateY(0) scale(1)' },
        },
        confete: {
          '0%': { transform: 'translateY(-10vh) rotate(0deg)', opacity: '1' },
          '100%': { transform: 'translateY(110vh) rotate(720deg)', opacity: '0.2' },
        },
      },
      animation: {
        'flash-golo': 'flash-golo 1s ease-out',
        'fade-up': 'fade-up 0.4s ease-out',
        'pop-in': 'pop-in 0.3s ease-out',
        pulso: 'pulso 1.6s ease-in-out infinite',
        'subir-trofeu': 'subir-trofeu 1s ease-out',
        confete: 'confete linear infinite',
      },
    },
  },
  plugins: [],
};
