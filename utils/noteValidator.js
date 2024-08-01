const Ajv = require("ajv").default;
// const REGEX = require("../config/regex");

const ajv = new Ajv();

const noteSchmea = {
  type: "object",
  properties: {
    title: {
      type: "string",
      maxLength: 100,
    },
    content: {
      type: "string",
      minLength: 1,
      maxLength: 1000,
    },
    tags: {
      type: "array",
      items: { type: "string", minLength: 3, maxLength: 15 },
      uniqueItems: true,
      maxItems: 5,
      default: [],
    },
    created_at: {
      type: "string",
    },
    updated_at: {
      type: "string",
    },
    is_archived: {
      type: "boolean",
      default: false,
    },
  },
  required: ["content"],
};

module.exports = ajv.compile(noteSchmea);
