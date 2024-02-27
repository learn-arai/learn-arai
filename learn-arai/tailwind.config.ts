import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './pages/**/*.{js,ts,jsx,tsx,mdx}',
        './components/**/*.{js,ts,jsx,tsx,mdx}',
        './app/**/*.{js,ts,jsx,tsx,mdx}',
    ],
    theme: {
        extend: {
            backgroundImage: {
                'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
                'gradient-conic':
                    'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
            },
            colors: {
                "red-logo": {
                    500: '#FD4444',
                },
                "blue-logo": {
                    500: '#1DA0EA',
                },
                "grey-main": {
                    100: '#FBFBFB',
                },
                "green-main": {
                    600: '#00A46C',
                },
            },
        },
    },

    plugins: [],
};
export default config;
