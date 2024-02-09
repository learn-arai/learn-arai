import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
    colors : {
      redLogo : { 
        500 : "#FD4444"
      },
      blueLogo : {
        500 : "#1DA0EA"
      },
      greymain : {
        100 : "#FBFBFB"
      }
    }
  },
  
  plugins: [],
};
export default config;
