/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: 'var(--color-primary)',
        'primary-light': 'var(--color-primary-light)',
        'primary-dark': 'var(--color-primary-dark)',
      },
      borderRadius: {
        DEFAULT: 'var(--border-radius)',
      },
      transitionDuration: {
        DEFAULT: 'var(--transition-duration)',
      },
    },
  },
  plugins: [],
};