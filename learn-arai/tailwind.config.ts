import type { Config } from 'tailwindcss';

const config = {
    darkMode: ['class'],
    content: [
        './pages/**/*.{ts,tsx}',
        './components/**/*.{ts,tsx}',
        './app/**/*.{ts,tsx}',
        './src/**/*.{ts,tsx}',
    ],
    prefix: '',
    theme: {
        container: {
            center: true,
            padding: '2rem',
            screens: {
                '2xl': '1400px',
            },
        },
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
                'landing-hero':
                    'linear-gradient(135deg, #ffd788, #ffbfbf 50%, #c5c3ff 101%)',
                'gradient-blue': 'linear-gradient(135deg, #dff3ff, #ddcdff)',
            },
            colors: {
                border: 'hsl(var(--border))',
                input: 'hsl(var(--input))',
                ring: 'hsl(var(--ring))',
                background: 'hsl(var(--background))',
                foreground: 'hsl(var(--foreground))',
                primary: {
                    DEFAULT: 'hsl(var(--primary))',
                    foreground: 'hsl(var(--primary-foreground))',
                },
                secondary: {
                    DEFAULT: 'hsl(var(--secondary))',
                    foreground: 'hsl(var(--secondary-foreground))',
                },
                destructive: {
                    DEFAULT: 'hsl(var(--destructive))',
                    foreground: 'hsl(var(--destructive-foreground))',
                },
                muted: {
                    DEFAULT: 'hsl(var(--muted))',
                    foreground: 'hsl(var(--muted-foreground))',
                },
                accent: {
                    DEFAULT: 'hsl(var(--accent))',
                    foreground: 'hsl(var(--accent-foreground))',
                },
                popover: {
                    DEFAULT: 'hsl(var(--popover))',
                    foreground: 'hsl(var(--popover-foreground))',
                },
                card: {
                    DEFAULT: 'hsl(var(--card))',
                    foreground: 'hsl(var(--card-foreground))',
                },
                'red-logo': {
                    500: '#FD4444',
                },
                'blue-logo': {
                    500: '#1DA0EA',
                },
                'grey-main': {
                    100: '#FBFBFB',
                },
                'green-main': {
                    600: '#00A46C',
                },
                'ds-amber': {
                    100: 'hsl(var(--ds-amber-100))',
                    200: 'hsl(var(--ds-amber-200))',
                    300: 'hsl(var(--ds-amber-300))',
                    400: 'hsl(var(--ds-amber-400))',
                    500: 'hsl(var(--ds-amber-500))',
                    600: 'hsl(var(--ds-amber-600))',
                    700: 'hsl(var(--ds-amber-700))',
                    800: 'hsl(var(--ds-amber-800))',
                    900: 'hsl(var(--ds-amber-900))',
                },
                'landing-blue': '#7e79ff',
            },
            borderRadius: {
                lg: 'var(--radius)',
                md: 'calc(var(--radius) - 2px)',
                sm: 'calc(var(--radius) - 4px)',
            },
            keyframes: {
                'accordion-down': {
                    from: { height: '0' },
                    to: { height: 'var(--radix-accordion-content-height)' },
                },
                'accordion-up': {
                    from: { height: 'var(--radix-accordion-content-height)' },
                    to: { height: '0' },
                },
                'caret-blink': {
                    '0%,70%,100%': { opacity: '1' },
                    '20%,50%': { opacity: '0' },
                },
            },
            animation: {
                'accordion-down': 'accordion-down 0.2s ease-out',
                'accordion-up': 'accordion-up 0.2s ease-out',
                'caret-blink': 'caret-blink 1.25s ease-out infinite',
            },
        },
    },
    plugins: [
        require('tailwindcss-animate'),
        require('daisyui'),
        require('@tailwindcss/typography'),
    ],
    daisyui: {
        themes: false,
        prefix: 'ds-',
    },
} satisfies Config;

export default config;
