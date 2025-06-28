import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./client/index.html", "./client/src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      colors: {
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        mainBrackground:{
          DEFAULT: "#F7FEFF",
          100: "#E2F4F1",
        },
        customBlack: {
          90: '#231F2090',
          100: '#231F20',
        },
        customPurple: {
          30: "#6B21A84D",
          100: "#6B21A8",
        },
        customCyan: {
          30: "#00A2B5",
          100: "#00A2B5",
        },
        customOrange: {
          15: '#EA580C26',
          30: "#EA580C4D",
          100: "#EA580C",
        },
        customGreen: {
          15: "#0B804326",
          100: "#0B8043",
          200: '#07AD94'
        },
        customYellow: {
          15: "#A1620726",
          100: "#A16207",
        },
        customRed: {
          15: "#DB1A1A26",
          100: "#DB1A1A",
        },
        customPrimery: {
          20: '#0B804333',
          100: '#07AD94',
        },
        customGray: {
          100: '#5B6664',
          200:'#CCDAD8'
        },
        customBlue: {
          100: '#1D4ED824',
        },
      },
      fontSize: {
        '10/12': ['10px', { lineHeight: '12px' }],
        '12/14': ['12px', { lineHeight: '14px' }],
        '12/16': ['12px', { lineHeight: '16px' }],
        '13/16': ['13px', { lineHeight: '16px' }],
        '14/16': ['14px', { lineHeight: '16px' }],
        '14/20': ['14px', { lineHeight: '20px' }],
        '14/24': ['14px', { lineHeight: '24px' }],
        '14/28': ['14px', { lineHeight: '28px' }],
        '16/18': ['16px', { lineHeight: '18px' }],
        '18/22': ['18px', { lineHeight: '22px' }],
        '20/24': ['20px', { lineHeight: '24px' }],
        '20/28': ['20px', { lineHeight: '28px' }],
        '24/28': ['24px', { lineHeight: '28px' }],
        '30/36': ['30px', { lineHeight: '36px' }],
        '36/44': ['36px', { lineHeight: '44px' }],
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate"), require("@tailwindcss/typography")],
} satisfies Config;