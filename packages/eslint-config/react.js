const rules = require("./rules")

module.exports = {
  extends: ["@mskelton/eslint-config", "@mskelton/eslint-config/react"].map(
    require.resolve,
  ),
  rules,
}
