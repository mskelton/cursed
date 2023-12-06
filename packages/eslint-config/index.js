const rules = require("./rules")

module.exports = {
  extends: ["@mskelton/eslint-config"].map(require.resolve),
  rules,
}
