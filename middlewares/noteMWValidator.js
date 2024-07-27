const noteValidator = require("../utils/noteValidator");
const asyncFunction = require("./asyncFunction");

const noteMWValidator = asyncFunction(async (req, res, nxt) => {
  // 1. validte req.body:
  let valid = noteValidator(req.body);
  if (!valid) {
    return res.status(403).json({ errMsg: "invalid note data!" });
  }
  // 2. set req.valid = 1:
  req.valid = 1;
  nxt();
});
module.exports = noteMWValidator;
