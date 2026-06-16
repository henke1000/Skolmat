import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        soft: "0 24px 60px rgba(31, 41, 55, 0.14)"
      }
    }
  },
  plugins: []
};

export default config;
