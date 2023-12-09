const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./components/**/*.js",
    "./components/**/*.tsx",
    "./nextra-theme-docs/**/*.js",
    "./nextra-theme-docs/**/*.tsx",
    "./nextra-theme-docs/**/*.css",
    "./pages/**/*.md",
    "./pages/**/*.mdx",
    "./pages/**/*.tsx",
    "./theme.config.js",
    "./styles.css",
  ],
  plugins: [
    require("tailwindcss-animate"),
    // ...
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", "sans-serif"],
        mono: [
          "var(--font-geist-mono)",
          "Menlo",
          "Monaco",
          "Lucida Console",
          "monospace",
        ],
      },
      colors: {
        dark: "#000",
        gray: colors.neutral,
        blue: colors.blue,
        orange: colors.orange,
        green: colors.green,
        red: colors.red,
        yellow: colors.yellow,
      },
      screens: {
        sm: "640px",
        md: "768px",
        lg: "1024px",
        betterhover: { raw: "(hover: hover)" },
      },
    },
  },
  darkMode: "class",
};
