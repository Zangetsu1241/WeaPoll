/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                // Original Slate/Cyan Palette (Restored)
                navy: {
                    main: '#0f172a',      // Slate-900
                    surface: '#1e293b',   // Slate-800
                    border: '#334155',    // Slate-700
                },
                brand: {
                    primary: '#06b6d4',   // Cyan-500
                    hover: '#0891b2',     // Cyan-600
                    accent: '#22d3ee',    // Cyan-400
                },
                text: {
                    primary: '#f8fafc',   // Slate-50
                    secondary: '#cbd5e1', // Slate-300
                    muted: '#94a3b8',     // Slate-400
                },
                status: {
                    info: '#3b82f6',      // Blue-500
                    warning: '#f59e0b',   // Amber-500
                    danger: '#ef4444',    // Red-500
                    success: '#22c55e',   // Green-500
                },
                // Semantic Intensity Scale
                aqi: {
                    good: '#00E400',          // Green
                    moderate: '#FFFF00',      // Yellow
                    sensitive: '#FF7E00',     // Orange
                    unhealthy: '#FF0000',     // Red
                    very_unhealthy: '#8F3F97',// Purple
                    hazardous: '#7E0023',     // Maroon
                },
                // Retain some glass util for minor effects if needed, but mapped to navy
                glass: {
                    100: 'rgba(28, 37, 65, 0.4)', // Surface low opacity
                    200: 'rgba(28, 37, 65, 0.7)', // Surface med opacity
                }
            },
            backdropBlur: {
                xs: '2px',
            },
            boxShadow: {
                'navy': '0 4px 6px -1px rgba(0, 0, 0, 0.5), 0 2px 4px -1px rgba(0, 0, 0, 0.3)',
                'navy-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.6), 0 4px 6px -2px rgba(0, 0, 0, 0.4)',
                'glow': '0 0 15px rgba(111, 255, 233, 0.3)', // Accent glow
            }
        },
    },
    plugins: [],
}
