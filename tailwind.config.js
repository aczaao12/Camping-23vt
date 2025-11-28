/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                blue: {
                    50: '#E3F2FD',
                    100: '#BBDEFB',
                    400: '#42A5F5',
                    500: '#2196F3',
                    600: '#1E88E5',
                    700: '#1976D2',
                    800: '#1565C0',
                    900: '#0D47A1',
                },
                yellow: {
                    400: '#FFEE58',
                    500: '#FFEB3B', // Main text color
                    600: '#FDD835',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', 'sans-serif'],
                display: ['Outfit', 'Inter', 'sans-serif'],
            },
            backgroundImage: {
                'theme-gradient': 'linear-gradient(180deg, #87CEEB 0%, #E0F7FA 60%, #FFFFFF 100%)',
            },
        },
    },
    plugins: [],
}
