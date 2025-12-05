/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Base Dark Theme
                background: '#0f1419',
                surface: '#1a1f2e',
                'surface-elevated': '#252b3b',

                // Customer Theme (Billiard Green)
                customer: {
                    primary: '#00a859',
                    'primary-hover': '#00c466',
                    'primary-dark': '#008a47',
                    accent: '#4ade80',
                },

                // Admin Theme (Slate/Orange)
                admin: {
                    primary: '#64748b',
                    'primary-hover': '#94a3b8',
                    accent: '#f97316',
                },

                // Status Colors
                status: {
                    success: '#22c55e',
                    warning: '#f59e0b',
                    error: '#ef4444',
                    info: '#3b82f6',
                },

                // Text Colors
                text: {
                    primary: '#f8fafc',
                    secondary: '#cbd5e1',
                    muted: '#64748b',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
            },
        },
    },
    plugins: [],
};
