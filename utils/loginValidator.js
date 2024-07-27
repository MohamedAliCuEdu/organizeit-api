const { default: Ajv } = require("ajv");
const REGEX = require("../config/regex");

const ajv = new Ajv();

const schema = {
  type: "object",
  properties: {
    username: {
      type: "string",
      pattern: REGEX.USERNAME.toString().slice(1, -3),
    },
    password: {
      type: "string",
      pattern: REGEX.PASSWORD.toString().slice(1, -3),
    },
  },
  required: ["username", "password"]
};

module.exports = ajv.compile(schema);
