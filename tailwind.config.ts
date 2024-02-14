import {Config} from "tailwindcss";

export default  {
  darkMode: 'class',
  content: [
    './index.html',
    './src/**/*.vue'
  ],
  theme: {
    container: {
      screens: {
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
      }
    },
    extend: {
      fontFamily: {
        sans: ['Montserrat'],
      },
    },
  },
} satisfies Config;
