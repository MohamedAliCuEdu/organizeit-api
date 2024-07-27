const userValidator = require("../utils/userValidator");
const asyncFunction = require("./asyncFunction");

const userMWValidator = asyncFunction(async (req, res, nxt) => {
    let valid = userValidator(req.body);
    if (!valid) {
      return res.status(403).json({ errMsg: "invalid user data!" });
    }
    req.valid = 1;
    nxt();
  
});
module.exports = userMWValidator;

