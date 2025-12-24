// tailwind.config.js
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        background: "#0d0f14",
        foreground: "#fcfcfc",
        card: "#1a1d24",
        "card-foreground": "#fcfcfc",
        primary: "#84cc16", // lime-500
        "primary-foreground": "#0d0f14",
        secondary: "#272a30",
        "secondary-foreground": "#fcfcfc",
        muted: "#272a30",
        "muted-foreground": "#a1a1aa",
        destructive: "#ef4444",
        "destructive-foreground": "#fcfcfc",
        border: "#272a30",
        input: "#272a30",
      },
    },
  },
  plugins: [],
}
