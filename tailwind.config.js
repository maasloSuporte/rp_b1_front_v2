/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#5d87ff',
          100: '#ecf2ff',
          500: '#5d87ff',
          700: '#5d87ff',
        },
        accent: {
          DEFAULT: '#49beff',
          100: '#e8f7ff',
          500: '#49beff',
        },
        warning: {
          DEFAULT: '#ffae1f',
          100: '#fef5e5',
          500: '#ffae1f',
        },
        error: {
          DEFAULT: '#fa896b',
          100: '#fdede8',
          500: '#fa896b',
        },
        success: {
          DEFAULT: '#13deb9',
          100: '#e6fffa',
          500: '#13deb9',
        },
        orange: {
          DEFAULT: '#FB7F0D',
        },
               purple: {
                 DEFAULT: '#36263F',
                 dark: '#36263F',
               },
               orange: {
                 DEFAULT: '#FB7F0D',
               },
        sidebar: {
          bg: '#ffffff',
          dark: '#2a3447',
        },
        background: {
          DEFAULT: '#f8f9fc',
          dark: '#2a3447',
        },
        border: {
          DEFAULT: '#e5eaef',
          form: '#dfe5ef',
        },
        text: {
          primary: '#2a3547',
          secondary: '#7c8fac',
        },
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Arial', 'sans-serif'],
      },
      fontSize: {
        '10': '10px',
      },
      spacing: {
        'sidebar-desktop': '270px',
        'sidebar-mini': '80px',
        'header': '70px',
      },
      borderRadius: {
        'custom': '7px',
      },
      boxShadow: {
        'card': 'rgb(145 158 171 / 30%) 0px 0px 2px 0px, rgb(145 158 171 / 12%) 0px 12px 24px -4px',
        'card-dark': 'rgba(145, 158, 171, 0.3) 0px 0px 2px 0px, rgba(145, 158, 171, 0.02) 0px 12px 24px -4px',
      },
    },
  },
  plugins: [],
}
