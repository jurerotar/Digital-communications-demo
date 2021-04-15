const defaultTheme = require('tailwindcss/defaultTheme');


module.exports = {
    purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
    darkMode: 'class', // or 'media' or 'class'
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
                sans: ['Montserrat', ...defaultTheme.fontFamily.sans],
            },
            maxWidth: {
                'sidebar-mobile': '16rem',
                'sidebar': '18rem',
                'top-bar': 'calc(100% - 18rem)',
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
}
