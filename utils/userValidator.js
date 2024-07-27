const REGEX = require("../config/regex");

const Ajv = require("ajv").default;
const ajv = new Ajv();

const userSchema = {
  type: "object",
  properties: {
    username: {
      type: "string",
      // pattern: REGEX.USERNAME.toString().slice(1, -3),
    },
    password: {
      type: "string",
      // pattern: REGEX.PASSWORD.toString().slice(1, -3),
    },
    fname: {
      type: "string",
      pattern: REGEX.NAME.toString().slice(1, -3),
    },
    lname: {
      type: "string",
      pattern: REGEX.NAME.toString().slice(1, -3),
    },
    age: {
      type: "number",
      minimum: 10,
      maximum: 120,
    },
    gender: {
      type: "string",
      enum: ["male", "female"],
    },
    metaData: {
      type: "object",
    },
  },
  required: ["username", "password", "fname", "lname", "age", "gender"],
};

module.exports = ajv.compile(userSchema);
