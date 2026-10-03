/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: {
          950: '#0c0c0d',
          900: '#121214',
          850: '#17171a',
          800: '#1f1f23',
          700: '#2a2a30',
          600: '#3c3c44',
          500: '#555560',
        },
        parchment: {
          50: '#faf9f5',
          100: '#f3f1ea',
          200: '#e5e2d7',
          300: '#c8c5b9',
          400: '#9b988c',
          500: '#6e6c62',
        },
        academic: {
          rule: '#26262b',
          'rule-light': '#36363d',
          brass: '#b89b4f',
        },
      },
      fontFamily: {
        serif: ['"EB Garamond"', 'Cormorant Garamond', 'Georgia', 'Cambria', 'Times New Roman', 'serif'],
        mono: ['"IBM Plex Mono"', 'Courier Prime', 'ui-monospace', 'Menlo', 'monospace'],
        sans: ['system-ui', '-apple-system', 'BlinkMacSystemFont', 'sans-serif'],
      },
      letterSpacing: {
        widest: '.2em',
        scholarly: '.08em',
      },
    },
  },
  plugins: [],
}
