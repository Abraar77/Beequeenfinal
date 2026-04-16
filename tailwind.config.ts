import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    screens: {
      xs: "480px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
      "2xl": "1536px",
    },
    extend: {
      colors: {
        brand: {
          gold: "#D4AF37",
          "gold-light": "#F0D060",
          "gold-dark": "#B8970A",
          pink: "#E91E8C",
          "pink-hover": "#FF2D9B",
          "pink-light": "#FF6EC7",
        },
        dark: {
          950: "#050505",
          900: "#0A0A0A",
          800: "#111111",
          700: "#1A1A1A",
          600: "#222222",
          500: "#2A2A2A",
          400: "#3A3A3A",
          300: "#4A4A4A",
        },
      },
      fontFamily: {
        serif: ["var(--font-playfair)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #D4AF37 0%, #F0D060 50%, #B8970A 100%)",
        "pink-gradient": "linear-gradient(135deg, #E91E8C 0%, #FF2D9B 100%)",
        "dark-gradient": "linear-gradient(180deg, #0A0A0A 0%, #111111 100%)",
        "hero-gradient":
          "radial-gradient(ellipse at 50% 50%, rgba(212,175,55,0.08) 0%, rgba(233,30,140,0.04) 40%, transparent 70%)",
        "card-gradient": "linear-gradient(145deg, #1A1A1A 0%, #111111 100%)",
        "shimmer-gradient":
          "linear-gradient(90deg, transparent 0%, rgba(212,175,55,0.15) 50%, transparent 100%)",
      },
      boxShadow: {
        gold: "0 0 20px rgba(212,175,55,0.25), 0 4px 15px rgba(0,0,0,0.5)",
        "gold-lg": "0 0 40px rgba(212,175,55,0.3), 0 8px 30px rgba(0,0,0,0.6)",
        pink: "0 0 20px rgba(233,30,140,0.3), 0 4px 15px rgba(0,0,0,0.5)",
        "pink-lg": "0 0 40px rgba(233,30,140,0.4), 0 8px 30px rgba(0,0,0,0.6)",
        card: "0 4px 24px rgba(0,0,0,0.4), 0 1px 4px rgba(0,0,0,0.3)",
        "card-hover": "0 12px 48px rgba(0,0,0,0.6), 0 0 24px rgba(212,175,55,0.15)",
        luxury: "0 20px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(212,175,55,0.1)",
      },
      animation: {
        shimmer: "shimmer 2.5s infinite",
        float: "float 6s ease-in-out infinite",
        "float-delay": "float 6s ease-in-out 3s infinite",
        "pulse-glow": "pulseGlow 2s ease-in-out infinite",
        "slide-in-left": "slideInLeft 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        "slide-in-right": "slideInRight 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
        "fade-up": "fadeUp 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
        marquee: "marquee 20s linear infinite",
        "spin-slow": "spin 8s linear infinite",
        ticker: "ticker 25s linear infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-12px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 20px rgba(233,30,140,0.3)" },
          "50%": { boxShadow: "0 0 40px rgba(233,30,140,0.6), 0 0 60px rgba(233,30,140,0.3)" },
        },
        slideInLeft: {
          from: { transform: "translateX(-100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        slideInRight: {
          from: { transform: "translateX(100%)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        fadeUp: {
          from: { transform: "translateY(20px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
        ticker: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      transitionTimingFunction: {
        luxury: "cubic-bezier(0.4, 0, 0.2, 1)",
        bounce: "cubic-bezier(0.34, 1.56, 0.64, 1)",
      },
      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },
    },
  },
  plugins: [],
};

export default config;
