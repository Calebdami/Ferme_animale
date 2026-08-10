import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    darkMode: 'class',
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/**/*.blade.php',
        './resources/**/*.jsx',
        './resources/**/*.js',
    ],
    theme: {
        extend: {
            fontFamily: {
                display: ['"Fraunces"', ...defaultTheme.fontFamily.serif],
                sans: ['"Inter"', ...defaultTheme.fontFamily.sans],
                mono: ['"JetBrains Mono"', ...defaultTheme.fontFamily.mono],
            },
            colors: {
                soil: {
                    950: '#14120F',
                    900: '#1E1B16',
                    800: '#282319',
                    700: '#3A3226',
                    600: '#544A38',
                },
                sand: {
                    100: '#F3EEE3',
                    300: '#D9D0BE',
                    500: '#A79E8E',
                },
                yolk: {
                    400: '#F0B24E',
                    500: '#E8A33D',
                    600: '#C77F1F',
                },
                pasture: {
                    400: '#84A971',
                    500: '#6B8F5C',
                    600: '#547246',
                },
                clay: {
                    500: '#C1653F',
                },
            },
            borderRadius: {
                xl: '0.875rem',
            },
        },
    },
    plugins: [forms],
};
