// .eslintrc.js
module.exports = {
  root: true,
  env: {
    node: true,
  },
  extends: [
    "plugin:vue/vue3-essential", // or "plugin:vue/vue3-recommended" for stricter rules
    "eslint:recommended",
  ],
  parserOptions: {
    parser: "@babel/eslint-parser",
  },
  rules: {
    // Add custom rules or override defaults here
  },
};
