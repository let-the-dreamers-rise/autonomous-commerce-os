import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
        "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                background: "hsl(222, 47%, 6%)",
                foreground: "hsl(210, 40%, 98%)",
                card: {
                    DEFAULT: "hsl(222, 47%, 8%)",
                    foreground: "hsl(210, 40%, 98%)",
                },
                primary: {
                    DEFAULT: "hsl(263, 90%, 65%)",
                    foreground: "hsl(0, 0%, 100%)",
                },
                secondary: {
                    DEFAULT: "hsl(217, 91%, 60%)",
                    foreground: "hsl(0, 0%, 100%)",
                },
                accent: {
                    DEFAULT: "hsl(172, 66%, 50%)",
                    foreground: "hsl(222, 47%, 6%)",
                },
                muted: {
                    DEFAULT: "hsl(222, 20%, 20%)",
                    foreground: "hsl(215, 20%, 65%)",
                },
                border: "hsl(222, 20%, 18%)",
                success: "hsl(142, 76%, 50%)",
                warning: "hsl(38, 92%, 50%)",
                error: "hsl(0, 84%, 60%)",
            },
            fontFamily: {
                sans: ["Inter", "system-ui", "sans-serif"],
                mono: ["JetBrains Mono", "monospace"],
            },
            animation: {
                "pulse-glow": "pulse-glow 2s ease-in-out infinite",
                "thinking": "thinking 1.5s ease-in-out infinite",
                "flow": "flow 1s ease-in-out",
                "slide-up": "slide-up 0.3s ease-out",
                "fade-in": "fade-in 0.5s ease-out",
            },
            keyframes: {
                "pulse-glow": {
                    "0%, 100%": { boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)" },
                    "50%": { boxShadow: "0 0 40px rgba(139, 92, 246, 0.6)" },
                },
                "thinking": {
                    "0%, 100%": { opacity: "0.5" },
                    "50%": { opacity: "1" },
                },
                "flow": {
                    "0%": { strokeDashoffset: "100" },
                    "100%": { strokeDashoffset: "0" },
                },
                "slide-up": {
                    "0%": { transform: "translateY(10px)", opacity: "0" },
                    "100%": { transform: "translateY(0)", opacity: "1" },
                },
                "fade-in": {
                    "0%": { opacity: "0" },
                    "100%": { opacity: "1" },
                },
            },
            backgroundImage: {
                "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
                "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
                "glass": "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)",
            },
            backdropBlur: {
                xs: "2px",
            },
        },
    },
    plugins: [],
};

export default config;
