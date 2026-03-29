import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./src/**/*.{ts,tsx,js,jsx,mdx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        display: ["var(--font-space-grotesk)", "Space Grotesk", "sans-serif"],
        body: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      colors: {
        'brand-blue': '#0050EF',
        'inverse-on-surface': '#f0f1f1',
        'primary-fixed-dim': '#474746',
        'on-secondary-fixed': '#1b1c1c',
        'surface-container': '#eeeeee',
        'on-primary-container': '#ffffff',
        'on-tertiary-fixed-variant': '#e2e2e2',
        'surface-container-highest': '#e2e2e2',
        'tertiary-fixed': '#5d5f5f',
        'surface-variant': '#e2e2e2',
        'on-error-container': '#410002',
        'surface-bright': '#f9f9f9',
        'on-tertiary': '#e2e2e2',
        'on-tertiary-container': '#ffffff',
        'on-surface-variant': '#474747',
        'on-secondary-fixed-variant': '#3b3b3c',
        'surface-dim': '#dadada',
        'on-background': '#1a1c1c',
        'primary-fixed': '#5f5e5e',
        'on-surface': '#1a1c1c',
        'on-primary-fixed-variant': '#e5e2e1',
        'inverse-primary': '#c8c6c5',
        'secondary-fixed-dim': '#acabab',
        'on-primary-fixed': '#ffffff',
        'surface-container-lowest': '#ffffff',
        'on-tertiary-fixed': '#ffffff',
        'on-secondary-container': '#1b1c1c',
        'tertiary-fixed-dim': '#454747',
        'primary-container': '#3c3b3b',
        'on-primary': '#e5e2e1',
        'outline-variant': '#c6c6c6',
        'surface-container-low': '#f3f3f4',
        'surface-container-high': '#e8e8e8',
        'secondary-fixed': '#c7c6c6',
        'secondary-container': '#d5d4d4',
        'tertiary-container': '#737575',
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-bg))",
          foreground: "hsl(var(--sidebar-fg))",
          border: "hsl(var(--sidebar-border))",
          hover: "hsl(var(--sidebar-hover))",
          active: "hsl(var(--sidebar-active))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
        shimmer: {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        shimmer: "shimmer 2s infinite linear",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"),
    require("@tailwindcss/typography"),
  ],

} satisfies Config;
