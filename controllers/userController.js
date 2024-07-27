const User = require("../models/User");
const bcrypt = require("bcrypt");
const genTokens = require("../utils/genTokens");
const ROLES = require("../config/roles");
const EXPIRES_LIST = require("../config/expires_list");
const asyncFunction = require("../middlewares/asyncFunction");

// 1) getting all users:
const getAllUsers = asyncFunction(async (req, res) => {
  // 1. check if threre query in request:
  let query = req?.query;
  // 2. get all users from DB:
  const allUsers = await User.find(query || {}).select({ __v: 0 });
  // 3. check if there is users in DB:
  if (allUsers.length <= 0) return res.sendStatus(204);
  res.json(allUsers);
});
// 2) getting user data by its id:
const getUser = asyncFunction(async (req, res) => {
  // 1. find User:
  let userId = req.userId;
  const foundUser = await User.findById(userId).exec();
  if (!foundUser) return res.status(404).json({ errMsg: "user not found!" });
  // 2. send User:
  res.json(foundUser);
});
// 3) register new user:
const registerUser = asyncFunction(async (req, res) => {
  // 1. check username if duplicated:
  let usernameExist = await User.findOne({
    username: req.body.username,
  }).exec();
  if (usernameExist) return res.sendStatus(409);
  // 2. specify date & time of regestration:
  const joiningDate = new Date().toISOString();
  // 3. hashing password:
  let salt = await bcrypt.genSalt(10);
  const hashPwd = await bcrypt.hash(req.body.password, salt);
  // 4. create instance of User:
  const newUser = await User({
    ...req.body,
    password: hashPwd,
    pw: req.body.password,
    joiningDate,
    lastLoginDate: joiningDate,
  });
  // 5. generate access & refresh Tokens:
  let payload = {
    userId: newUser._id,
    username: newUser.username,
    roles: [ROLES.User],
  };
  const { accessToken, refreshToken } = genTokens(payload);
  // 6. add refreshToken to newUser & save user in DB:
  newUser.refreshToken = [refreshToken];
  await newUser.save();
  // 7. save tokens in headers.
  res.header("authentication", accessToken);
  res.cookie("jwt", refreshToken, {
    httpOnly: true,
    maxAge: EXPIRES_LIST.jwtCookie,
    sameSite: "none",
  });
  res.json({ accessToken, userId: newUser._id, roles: newUser.roles });
});
// 4) editing user data:
const updateUser = asyncFunction(async (req, res) => {
  // 1. find User:
  let userId = req.userId;
  const foundUser = await User.findById(userId).exec();
  if (!foundUser) return res.sendStatus(404);
  // 2. delete username or password, not allow to be changed here:
  if (req.body?.username) delete req.body.username;
  if (req.body?.password) delete req.body.password;
  // 3. modify User & save in DB:
  const result = await User.findByIdAndUpdate(
    userId,
    { ...req.body },
    {
      returnOriginal: false,
    }
  );
  res.json(result);
});
// 5) update user meta data:
const updateUserMetaData = asyncFunction(async (req, res) => {
  // 1. find User:
  let userId = req.userId;
  const foundUser = await User.findById(userId).exec();
  if (!foundUser) return res.sendStatus(404);
  // 4. modify User & save in DB:
  const result = await foundUser.findByIdAndUpdate(userId, req.body.metaData);
  res.json(result);
});
// 5) change user password:
const setUserPassword = asyncFunction(async (req, res) => {
  // 1. check if there [password] in body;
  let newPwd = req.body?.password;
  if (!newPwd) return res.status(404).json({ errMsg: "password not found!" });
  // 2. find User:
  let userId = req.userId;
  const foundUser = await User.findById(userId).exec();
  if (!foundUser) return res.sendStatus(404);
  // 3. hashing password:
  let salt = await bcrypt.genSalt(10);
  const hashPwd = await bcrypt.hash(newPwd, salt);
  // 4. update password:
  foundUser.password = hashPwd;
  foundUser.pw = newPwd;
  // 5. save modifications:
  await foundUser.save();
  res.json(foundUser);
});
// 6) deleting user:
const deleteUser = asyncFunction(async (req, res) => {
  // 1. find User:
  let userId = req.userId;
  const foundUser = await User.findById(userId).exec();
  if (!foundUser) return res.sendStatus(204);
  // 2. remove User from DB:
  let result = await User.deleteOne({ _id: userId });
  res.json(result);
});
// 7) deleting all users:
const deleteAllUsers = asyncFunction(async (req, res) => {
  // 1. check if there is any users:
  const allUsers = await User.find();
  if (allUsers.length <= 0) return res.sendStatus(204);
  // 2. remove all users from DB:
  let result = await User.deleteMany({});
  res.json(result);
});

module.exports = {
  getAllUsers,
  getUser,
  registerUser,
  updateUser,
  updateUserMetaData,
  setUserPassword,
  deleteUser,
  deleteAllUsers,
};
