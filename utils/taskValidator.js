const Ajv = require("ajv").default;
const REGEX = require("../config/regex");

const ajv = new Ajv();

const taskSchmea = {
  type: "object",
  properties: {
    content: {
      type: "string",
      minLength: 1,
      maxLength: 40,
    },
    status: {
      type: "string",
      enum: ["pending", "in progress", "completed"],
    },
    is_completed: {
      type: "boolean",
    },
    userId: {
      type: "string",
      pattern: REGEX.OBJECT_ID.toString().slice(1, -1),
    },
  },
};

module.exports = ajv.compile(taskSchmea);
