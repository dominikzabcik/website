// @ts-check

const defaultTheme = require('tailwindcss/defaultTheme');
const {
    default: flattenColorPalette,
} = require('tailwindcss/lib/util/flattenColorPalette');

/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ['./{src,app}/**/*.{ts,tsx}'],
    darkMode: 'class',
    theme: {
        extend: {
            fontFamily: {
                sans: ['var(--font-body)', ...defaultTheme.fontFamily.sans],
                title: ['var(--font-title)', ...defaultTheme.fontFamily.serif],
                mono: ['var(--font-mono)', ...defaultTheme.fontFamily.mono],
            },
            colors: {
                blurple: '#5865F2',
                // Modern neutral scale
                neutral: {
                    50: '#fafafa',
                    100: '#f5f5f5',
                    200: '#e5e5e5',
                    300: '#d4d4d4',
                    400: '#a3a3a3',
                    500: '#737373',
                    600: '#525252',
                    700: '#404040',
                    800: '#262626',
                    900: '#171717',
                    950: '#0a0a0a',
                },
            },
            animation: {
                'fade-in': 'fadeIn 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'fade-in-up': 'fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'fade-in-scale': 'fadeInScale 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards',
                'float': 'float 6s ease-in-out infinite',
                'pulse-soft': 'pulseSoft 4s ease-in-out infinite',
                'shimmer': 'shimmer 2s infinite',
                'grain': 'grain 8s steps(10) infinite',
                'spin-slow': 'spin 8s linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                fadeInUp: {
                    '0%': { opacity: '0', transform: 'translateY(20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                fadeInScale: {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                pulseSoft: {
                    '0%, 100%': { opacity: '1' },
                    '50%': { opacity: '0.7' },
                },
                shimmer: {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
            },
            transitionTimingFunction: {
                'out-expo': 'cubic-bezier(0.16, 1, 0.3, 1)',
                'in-expo': 'cubic-bezier(0.7, 0, 0.84, 0)',
                'elastic': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
            },
            boxShadow: {
                'glow': '0 0 40px -10px rgba(99, 102, 241, 0.3)',
                'glow-lg': '0 0 60px -15px rgba(99, 102, 241, 0.4)',
                'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
                'glass-lg': '0 8px 32px rgba(0, 0, 0, 0.15)',
            },
            borderRadius: {
                '4xl': '2rem',
                '5xl': '2.5rem',
            },
            spacing: {
                '18': '4.5rem',
                '22': '5.5rem',
            },
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        {
            handler: (tw) => {
                // Grid Background
                tw.matchComponents(
                    {
                        'bg-grid': (value) => ({
                            backgroundSize: '40px 40px',
                            backgroundImage: `
                                linear-gradient(to right, ${value} 1px, transparent 1px),
                                linear-gradient(to bottom, ${value} 1px, transparent 1px)
                            `,
                        }),
                        'bg-grid-small': (value) => ({
                            backgroundSize: '24px 24px',
                            backgroundImage: `
                                linear-gradient(to right, ${value} 1px, transparent 1px),
                                linear-gradient(to bottom, ${value} 1px, transparent 1px)
                            `,
                        }),
                        'bg-dot': (value) => ({
                            backgroundSize: '24px 24px',
                            backgroundImage: `radial-gradient(circle, ${value} 1px, transparent 1px)`,
                        }),
                    },
                    {
                        values: flattenColorPalette(tw.theme('colors')),
                        type: 'color',
                    },
                );

                // Glow Effects
                tw.matchUtilities(
                    {
                        'text-glow': (value) => ({
                            'text-shadow': `0 0 20px ${value}, 0 0 40px ${value}`,
                        }),
                        'text-glow-sm': (value) => ({
                            'text-shadow': `0 0 10px ${value}`,
                        }),
                        'glow': (value) => ({
                            filter: `drop-shadow(0px 0px 8px ${value})`,
                        }),
                        'glow-lg': (value) => ({
                            filter: `drop-shadow(0px 0px 16px ${value})`,
                        }),
                        'box-glow': (value) => ({
                            'box-shadow': `0 0 30px -5px ${value}`,
                        }),
                    },
                    {
                        values: flattenColorPalette(tw.theme('colors')),
                        type: 'color',
                    },
                );
            },
        },
    ],
};
