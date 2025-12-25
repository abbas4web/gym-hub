// tailwind.config.js
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Light mode colors
        light: {
          background: "hsl(0, 0%, 100%)",
          foreground: "hsl(220, 20%, 10%)",
          card: "hsl(0, 0%, 98%)",
          'card-foreground': "hsl(220, 20%, 10%)",
          primary: "hsl(82, 80%, 40%)",
          'primary-foreground': "hsl(0, 0%, 100%)",
          secondary: "hsl(220, 10%, 92%)",
          'secondary-foreground': "hsl(220, 20%, 10%)",
          muted: "hsl(220, 10%, 92%)",
          'muted-foreground': "hsl(220, 10%, 40%)",
          border: "hsl(220, 10%, 88%)",
          destructive: "hsl(0, 72%, 51%)",
          'destructive-foreground': "hsl(0, 0%, 100%)",
        },
        // Dark mode colors (default)
        background: "hsl(220, 20%, 6%)",
        foreground: "hsl(0, 0%, 98%)",
        card: "hsl(220, 18%, 10%)",
        'card-foreground': "hsl(0, 0%, 98%)",
        primary: "hsl(82, 100%, 50%)",
        'primary-foreground': "hsl(220, 20%, 6%)",
        secondary: "hsl(220, 15%, 16%)",
        'secondary-foreground': "hsl(0, 0%, 98%)",
        muted: "hsl(220, 15%, 16%)",
        'muted-foreground': "hsl(220, 10%, 60%)",
        border: "hsl(220, 15%, 18%)",
        destructive: "hsl(0, 72%, 51%)",
        'destructive-foreground': "hsl(0, 0%, 98%)",
      },
      borderRadius: {
        DEFAULT: '12px',
      },
    },
  },
  plugins: [],
}
