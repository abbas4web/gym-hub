// tailwind.config.js
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],

  theme: {
    extend: {
      colors: {
        // Dark mode colors (default)
        background: "#0D0F14",
        foreground: "#FCFCFC",
        card: "#18181B",
        'card-foreground': "#FCFCFC",
        primary: "#84CC16",
        'primary-foreground': "#18181B",
        muted: "#27272A",
        'muted-foreground': "#A1A1AA",
        border: "#27272A",
        destructive: "#EF4444",
        success: "#22C55E",
        warning: "#EAB308",
      },
      borderRadius: {
        DEFAULT: '12px',
      },
    },
  },
  plugins: [],
}
