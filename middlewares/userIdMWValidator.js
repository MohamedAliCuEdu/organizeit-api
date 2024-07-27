const { OBJECT_ID } = require("../config/regex");

module.exports = async (req, res, nxt, val) => {
  try {
    // 1. check id value:
    if (!OBJECT_ID.test(val))
      return res.status(403).json({ errMsg: "userId invalid or not found" });
    // 2. set req.id to id:
    req.userId = val;
    nxt();
  } catch (err) {
    res
      .status(500)
      .json({ errMsg: `Error - from userIdMWValidator: ${err.message}` });
  }
};
