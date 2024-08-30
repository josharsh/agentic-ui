/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,jsx,tsx,ts}",
    "./components/**/*.{js,jsx,tsx,ts}",
    "./app/**/*.{js,jsx,tsx,ts}",
    "./src/**/*.{js,jsx,tsx,ts}",
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
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
          50: "hsl(33, 100%, 96%)",
          100: "hsl(36, 100%, 92%)",
          200: "hsl(34, 100%, 83%)",
          300: "hsl(33, 100%, 72%)",
          400: "hsl(29, 100%, 61%)",
          500: "hsl(26, 99%, 53%)",
          600: "hsl(22, 94%, 48%)",
          700: "hsl(19, 92%, 40%)",
          800: "hsl(17, 83%, 34%)",
          900: "hsl(17, 77%, 28%)",
          950: "hsl(15, 84%, 15%)",
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

        buttons: "var(--color-buttons)",
        typography: "var(--color-typography)",
        blue: {
          DEFAULT: "var(--blue2)",
          100: "hsl(var(--blue1))",
          200: "var(--blue2)",
          300: "var(--blue3)",
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
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      screens: {
        lg: "1600px",
      },
      minWidth: {
        "100px": "100px",
        "120px": "120px",
        "150px": "150px",
        "200px": "200px",
        "300px": "300px",
        "400px": "400px",
        "450px": "450px",
      },
      maxWidth: {
        "100px": "100px",
        "120px": "120px",
        "150px": "150px",
        "200px": "200px",
        "400px": "400px",
        "450px": "450px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
