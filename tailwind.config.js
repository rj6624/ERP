/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f1f6f0',
          100: '#e2ece0',
          200: '#c4dac0',
          300: '#9cbe96',
          400: '#6f9c67',
          500: '#3f7336',
          600: '#1c4a14',
          700: '#0f3309',
          800: '#0b2607',
          900: '#081c05',
          950: '#040e02',
        },
        emerald: {
          50: '#f1f6f0',
          100: '#e2ece0',
          200: '#c4dac0',
          300: '#9cbe96',
          400: '#6f9c67',
          500: '#3f7336',
          600: '#081c05',
          700: '#081c05',
          800: '#0b2607',
          900: '#081c05',
          950: '#040e02',
        },
        slate: {
          850: '#151f32',
          900: '#0f172a',
          950: '#080d1a',
        },
        sidebar: {
          bg: '#0f172a',
          hover: '#1e293b',
          active: '#1e293b',
          border: '#334155',
          text: '#94a3b8',
          textActive: '#ffffff'
        }
      },
      fontFamily: {
        sans: ['"SF Pro Display"', '"SF Pro Text"', '"SF Pro"', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
        mono: ['"SF Pro Display"', '"SF Pro Text"', '"SF Pro"', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica', 'Arial', 'sans-serif'],
      },
      fontSize: {
        '2xs': '0.65rem',
      },
      boxShadow: {
        'subtle': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'card': '0 1px 3px 0 rgba(0, 0, 0, 0.08), 0 1px 2px -1px rgba(0, 0, 0, 0.08)',
        'modal': '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
      }
    },
  },
  plugins: [],
}
