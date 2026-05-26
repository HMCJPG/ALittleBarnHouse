import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        night: {
          deep: "#0e0b2e",
          mid: "#1a1850",
          soft: "#2d2870",
        },
        cabin: {
          wood: "#a36a3e",
          wooddark: "#6b3f23",
          woodlight: "#c98b5a",
          floor: "#52311d",
          floordark: "#3a2113",
          warm: "#ffd9a8",
          glow: "#ffb066",
          fire: "#ff7b3a",
          firehot: "#ffe27a",
        },
        play: {
          sky: "#5fb9e8",
          cloud: "#fff9ec",
          accent: "#ffcf5c",
          accent2: "#f78ca0",
          frame: "#7b3f1a",
          framelight: "#a36a3e",
        },
      },
      fontFamily: {
        playful: ["var(--font-fredoka)", "system-ui", "sans-serif"],
      },
      animation: {
        flicker: "flicker 1.6s ease-in-out infinite",
        flicker2: "flicker 2.3s ease-in-out infinite",
        twinkle: "twinkle 3s ease-in-out infinite",
        twinkleSlow: "twinkle 5s ease-in-out infinite",
        firefly: "firefly 7s ease-in-out infinite",
        firefly2: "firefly 9s ease-in-out infinite",
        firefly3: "firefly 11s ease-in-out infinite",
        sway: "sway 4s ease-in-out infinite",
        breathe: "breathe 4s ease-in-out infinite",
        smoke: "smoke 5s linear infinite",
        record: "spin 3s linear infinite",
      },
      keyframes: {
        flicker: {
          "0%, 100%": { opacity: "0.95", transform: "scaleY(1)" },
          "50%": { opacity: "0.7", transform: "scaleY(0.9)" },
        },
        twinkle: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "1" },
        },
        firefly: {
          "0%, 100%": { transform: "translate(0,0)", opacity: "0.2" },
          "25%": { transform: "translate(8px, -10px)", opacity: "1" },
          "50%": { transform: "translate(16px, 4px)", opacity: "0.6" },
          "75%": { transform: "translate(4px, 12px)", opacity: "0.9" },
        },
        sway: {
          "0%, 100%": { transform: "rotate(-1deg)" },
          "50%": { transform: "rotate(1deg)" },
        },
        breathe: {
          "0%, 100%": { transform: "scaleY(1)" },
          "50%": { transform: "scaleY(1.06)" },
        },
        smoke: {
          "0%": { transform: "translateY(0) scale(1)", opacity: "0.7" },
          "100%": { transform: "translateY(-40px) scale(1.6)", opacity: "0" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
