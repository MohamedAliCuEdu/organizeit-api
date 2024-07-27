const taskValidator = require("../utils/taskValidator");
const asyncFunction = require("./asyncFunction");

const taskMWValidator = asyncFunction(async (req, res, nxt) => {
  // 1. validte req.body:
  let valid = taskValidator(req.body);
  if (!valid) {
    return res.status(403).json({ errMsg: "invalid task data!" });
  }
  // 2. set req.valid = 1:
  req.valid = 1;
  nxt();
});
module.exports = taskMWValidator;
