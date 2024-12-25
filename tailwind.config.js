import defaultTheme from "tailwindcss/defaultTheme";
import colors from "tailwindcss/colors";
import svgToDataUri from "mini-svg-data-uri";
import flattenColorPalette from "tailwindcss/lib/util/flattenColorPalette.js";

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"], // Merged content paths
  darkMode: ["class", "class"],
  theme: {
    extend: {
      animation: {
        spotlight: "spotlight 2s ease .75s 1 forwards",
        shimmer: "shimmer 2s linear infinite",
        "caret-blink": "caret-blink 1.25s ease-out infinite",
      },
      keyframes: {
        "caret-blink": {
          "0%,70%,100%": { opacity: "1" },
          "20%,50%": { opacity: "0" },
        },
        spotlight: {
          "0%": {
            opacity: "0",
            transform: "translate(-72%, -62%) scale(0.5)",
          },
          "100%": {
            opacity: "1",
            transform: "translate(-50%,-40%) scale(1)",
          },
        },
        shimmer: {
          from: {
            backgroundPosition: "0 0",
          },
          to: {
            backgroundPosition: "-200% 0",
          },
        },
      },
      colors: {
        greenishWhite: "#eff5ee",
        pastelGreen: "#d3e8c7",
        beige: "#f3e5c5",
        vibrantGreen: "#00c158",
        softGreen: "#7ad67f",
        offWhite: "#f8f9f8",
        gray: "#7a7a7d",
        orangeYellow: "#feaa26",
        mutedOlive: "#707f64",
        lightGreen: "#8cc98f",
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
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))",
        },
      },
      boxShadow: {
        100: "0px 4px 4px rgba(0, 0, 0, 0.25), 0px 16px 24px rgba(0, 0, 0, 0.25), inset 0px 3px 6px #00a93b",
        200: "0px 4px 4px rgba(0, 0, 0, 0.25), 0px 16px 24px rgba(0, 0, 0, 0.25), inset 0px 4px 10px #49d793",
        300: "0px 4px 4px rgba(0, 0, 0, 0.25), 0px 16px 24px rgba(0, 0, 0, 0.25), inset 0px 3px 6px #00a93b",
        400: "inset 0px 2px 4px 0 rgba(255, 255, 255, 0.05)",
        500: "0px 16px 24px rgba(0, 0, 0, 0.25), 0px -14px 48px rgba(40, 51, 111, 0.7)",
        spread: "rgba(100, 100, 111, 0.2) 0px 7px 29px 0px;",
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      transitionProperty: {
        borderColor: "border-color",
      },
      spacing: {
        22: "88px",
        100: "100px",
        330: "330px",
        388: "388px",
        400: "400px",
        440: "440px",
        512: "512px",
        640: "640px",
        960: "960px",
        1230: "1230px",
        "1/5": "20%",
        "2/5": "40%",
        "3/5": "60%",
        "4/5": "80%",
        "3/20": "15%",
        "7/20": "35%",
        "9/20": "45%",
        "11/20": "55%",
        "13/20": "65%",
        "15/20": "75%",
        "17/20": "85%",
        "19/20": "95%",
      },
      zIndex: {
        1: "1",
        2: "2",
        4: "4",
      },
      lineHeight: {
        12: "48px",
      },
      borderRadius: {
        14: "14px",
        20: "20px",
        40: "40px",
        half: "50%",
        "7xl": "40px",
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      flex: {
        50: "0 0 50%",
        100: "0 0 100%",
        256: "0 0 256px",
        280: "0 0 280px",
        300: "0 0 300px",
        320: "1px 0 320px",
        540: "0 0 540px",
      },
      width: {
        98: "98%",
      },
    },
  },
  plugins: [addVariablesForColors, require("tailwindcss-animate")], // Custom plugin
};

function addVariablesForColors({ addBase, theme }) {
  const allColors = flattenColorPalette(theme("colors"));
  const newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );

  addBase({
    ":root": newVars,
  });
}
