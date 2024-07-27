module.exports = (allowedRoles) => {
  return async (req, res, nxt) => {
    try {
      // 1. check roles:
      let roles = req?.roles;
      console.log(roles);
      // 2. check if user have permissions:
      let userPermission = roles
        .map((role) => allowedRoles.includes(role))
        .find((val) => val === true);
      if (!userPermission) return res.sendStatus(401);
      nxt();
    } catch (err) {
      res.status(500).json(`Error from verifyMWPermissions: ${err.message}`);
    }
  };
};
