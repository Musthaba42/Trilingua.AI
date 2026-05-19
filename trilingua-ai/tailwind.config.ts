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
        primary: {
          50: "#f3f0ff",
          100: "#e9e3ff",
          200: "#d4c9ff",
          300: "#b49fff",
          400: "#9370ff",
          500: "#6D28D9",
          600: "#5b21b6",
          700: "#4c1d95",
          800: "#3b1578",
          900: "#2e1065",
          950: "#1a0a3e",
        },
        accent: {
          50: "#effefa",
          100: "#c7fff1",
          200: "#90ffe3",
          300: "#51f7d2",
          400: "#14B8A6",
          500: "#0d9488",
          600: "#0a7c72",
          700: "#0c655c",
          800: "#0e514b",
          900: "#11433f",
        },
        dark: {
          bg: "#0F0D1A",
          card: "#1A1726",
          surface: "#242033",
          border: "#302C3D",
          hover: "#2D2840",
        },
        light: {
          bg: "#F8F7FC",
          card: "#FFFFFF",
          surface: "#F0EEF7",
          border: "#E2E0EB",
          hover: "#EBE9F4",
        },
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      borderRadius: {
        sm: "8px",
        md: "12px",
        lg: "16px",
        xl: "24px",
      },
      boxShadow: {
        glow: "0 0 20px rgba(109, 40, 217, 0.3)",
        "glow-lg": "0 0 40px rgba(109, 40, 217, 0.4)",
        "glow-accent": "0 0 20px rgba(20, 184, 166, 0.3)",
        card: "0 4px 12px rgba(0, 0, 0, 0.4)",
        "card-hover": "0 8px 24px rgba(0, 0, 0, 0.5)",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-in-right": "slideInRight 0.3s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        shimmer: "shimmer 2s linear infinite",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-primary":
          "linear-gradient(135deg, #6D28D9 0%, #4c1d95 50%, #14B8A6 100%)",
        "gradient-card":
          "linear-gradient(135deg, rgba(109,40,217,0.1) 0%, rgba(20,184,166,0.05) 100%)",
        "gradient-hero":
          "linear-gradient(135deg, #0F0D1A 0%, #1a0a3e 50%, #0F0D1A 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
