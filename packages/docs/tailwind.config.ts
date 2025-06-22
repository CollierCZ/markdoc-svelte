import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{html,js,svelte,ts}"],
  darkMode: "selector",

  plugins: [require("@tailwindcss/typography")],
  theme: {
    extend: {
      backgroundColor: {
        codeBlockNord: "#2e3440ff",
      },
      fontSize: {
        base: ["16px", "24px"],
      },
      screens: {
        "2xl": { min: "1900px" },
      },
    },
  },
};

export default config;
