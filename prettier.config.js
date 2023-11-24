const config = {
  plugins: [
    "./node_modules/prettier-plugin-jsdoc/dist/index.js",
    "prettier-plugin-tailwindcss",
  ],
  proseWrap: "always",
  semi: false,
  tailwindFunctions: ["clsx"],
}

export default config
