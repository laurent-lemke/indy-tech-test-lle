const SUPPORTED_PREFIX = [
  "ci",
  "chore",
  "docs",
  "feat",
  "fix",
  "refactor",
  "style",
  "test",
];

module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [2, "always", SUPPORTED_PREFIX],
  },
};
