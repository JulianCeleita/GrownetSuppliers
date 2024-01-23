module.exports = {
  testEnvironment: "jest-environment-jsdom",
  transform: {
    "^.+\\.jsx?$": "babel-jest",
  },
  "moduleNameMapper": {
    "^@/(.*)$": "<rootDir>/app/$1"
  },
  moduleFileExtensions: ["js", "jsx"],
  testPathIgnorePatterns: ["/node_modules/"],
};
