const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const loginMWValidator = require("../middlewares/loginMWValidator");
const asyncFunction = require("../middlewares/asyncFunction");
const User = require("../models/User");

const EXPIRES_LIST = require("../config/expires_list");
const genTokens = require("../utils/genTokens");

const router = express.Router();

router.post(
  "/",
  loginMWValidator,
  asyncFunction(async (req, res) => {
    // 1. check username & password:
    const { username, password } = req.body;
    if (!username || !password)
      return res
        .status(403)
        .json({ errMsg: "username & passwordare required!" });
    let foundUser = await User.findOne({ username }).exec();
    if (!foundUser)
      return res
        .status(401)
        .json({ errMsg: "username or password in invalid!!" });
    let checkPwd = bcrypt.compare(password, foundUser.password);
    if (!checkPwd)
      return res
        .status(401)
        .json({ errMsg: "username or password in invalid!!" });
    // 2. generate new access & refresh tokens:
    let payload = {
      userId: foundUser._id,
      username: foundUser.username,
      roles: Object.values(foundUser.roles),
    };
    const { accessToken, refreshToken: newRefreshToken } = genTokens(payload);
    // 4. check if there jwt cookie & remove it from user:
    let cookies = req.cookies;
    let newRefreshTokenArr = !cookies?.jwt
      ? foundUser.refreshToken
      : foundUser.refreshToken.filter((rf) => rf !== cookies.jwt);
    // . detect token reuse:
    if (cookies?.jwt) {
      const foundToken = User.findOne({ refreshToken: cookies.jwt }).exec();
      if (!foundToken) {
        newRefreshTokenArr = [];
      }
      res.clearCookie("jwt", {
        httpOnly: true,
        maxAge: EXPIRES_LIST.jwtCookie,
      });
    }
    // 5. update lastLoginDate:
    foundUser.lastLoginDate = new Date().toISOString();
    // 6. save refreshTokens in user & setHeaders:
    foundUser.refreshToken = [...newRefreshTokenArr, newRefreshToken];
    await foundUser.save();
    res.header("authentication", accessToken);
    res.cookie("jwt", newRefreshToken, {
      httpOnly: true,
      maxAge: EXPIRES_LIST.jwtCookie,
    });
    // 7. send accessToken:
    res.json({
      accessToken,
      userId: foundUser._id,
      roles: Object.values(foundUser.roles),
    });
  })
);
router.get(
  "/logout",
  asyncFunction(async (req, res) => {
    // 1. get refreshToken
    let refreshToken = req.cookies?.jwt;
    if (!refreshToken) return res.sendStatus(204);
    // 2. clear jwt cookie:
    res.clearCookie("jwt", { httpOnly: true, maxAge: EXPIRES_LIST.jwtCookie });
    // 3. find user:
    let foundUser = await User.findOne({ refreshToken }).exec();
    if (!foundUser) return res.status(204).json({ errMsg: "user not found!" });

    // 4. remove refreshToken from user:
    foundUser.refreshToken = foundUser.refreshToken.filter(
      (rf) => rf !== refreshToken
    );
    // 5. update lastLogoutDate:
    foundUser.lastLogoutDate = new Date().toISOString();
    await foundUser.save();
    res.json({ msg: "good bye!!", lastLogoutDate: foundUser.lastLoginDate });
  })
);
router.get(
  "/refresh",
  asyncFunction(async (req, res) => {
    // 1. check for refreshToken:
    let refreshToken = req.cookies?.jwt;
    if (!refreshToken) return res.status(401).json({ errMsg: "no tokens" });
    // 2. clear old token from cookies:
    res.clearCookie("jwt", {
      maxAge: EXPIRES_LIST.jwtCookie,
      httpOnly: true,
    });
    // 3. find user by token:
    let foundUser = await User.findOne({ refreshToken }).exec();
    // 4. detect token reuse:
    if (!foundUser) {
      jwt.verify(
        refreshToken,
        process.env.REFRESH_SECRET_TOKEN,
        async (err, decoded) => {
          if (err)
            return res.status(403).json({ errMsg: "expired reused token" });
          // remove all tokens from hacked user data:
          const hackedUser = await User.findOne({
            username: decoded.username,
          }).exec();
          if (!hackedUser)
            return res.status(403).json({ errMsg: "there is no hacked user!" });
          hackedUser.refreshToken = [];
          await hackedUser.save();
        }
      );
      return res.status(403).json({ msg: "token is reused!" });
    }
    // 5. foundUser && filter refresh tokens:
    const newRefreshTokenArr = foundUser?.refreshToken.filter(
      (rf) => rf !== refreshToken
    );
    // 6. verify token for generate tokens:
    jwt.verify(
      refreshToken,
      process.env.REFRESH_SECRET_TOKEN,
      async (err, decoded) => {
        if (err) {
          foundUser.refreshToken = [...newRefreshTokenArr];
          await foundUser.save();
        }
        if (err || foundUser.username !== decoded.username)
          return res.status(403).json({ errMsg: "invalid token" });
        // 7. generate new Tokens:
        const { accessToken, refreshToken: newRefreshToken } = genTokens({
          userId: decoded.userId,
          username: decoded.username,
          roles: decoded.roles,
        });
        // 8. save refreshToken in DB & set headers:
        foundUser.refreshToken = [...newRefreshTokenArr, newRefreshToken];
        await foundUser.save();
        res.header("authentication", accessToken);
        res.cookie("jwt", newRefreshToken, {
          httpOnly: true,
          maxAge: EXPIRES_LIST.jwtCookie,
        });
        // 9. send accessToken:
        res.json({
          userId: decoded.userId,
          accessToken,
          roles: decoded.roles,
        });
      }
    );
  })
);

module.exports = router;
