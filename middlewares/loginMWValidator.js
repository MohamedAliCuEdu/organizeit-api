const loginValidator = require("../utils/loginValidator");
const asyncFunction = require("./asyncFunction");

const loginMWValidator = asyncFunction(async (req, res, nxt) => {
  let valid = loginValidator(req.body);
  if (valid) {
    req.valid = 1;
    nxt();
  } else {
    res.status(403).json({ errMsg: "invalid inputs!" });
  }
});

module.exports = loginMWValidator;
