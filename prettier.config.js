const config = {
  plugins: [
    "./node_modules/prettier-plugin-jsdoc/dist/index.js",
    "prettier-plugin-tailwindcss",
    "prettier-plugin-svelte",
  ],
  proseWrap: "always",
  semi: false,
  tailwindFunctions: ["clsx"],
  overrides: [
    {
      files: "*.svelte",
      options: { parser: "svelte" },
    },
  ],
}

export default config
