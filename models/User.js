const mongoose = require("mongoose");
const REGEX = require("../config/regex");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: {
    type: String,
    unique: true,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
  fname: {
    type: String,

    require: true,
  },
  lname: {
    type: String,

    require: true,
  },
  pw: {
    type: String,
    match: REGEX.PASSWORD,
    require: true,
  },
  gender: {
    type: String,
    enum: ["male", "female"],
    require: true,
  },
  age: {
    type: Number,
    min: 10,
    max: 120,
    require: true,
  },
  joiningDate: {
    type: String,
    require: true,
  },
  lastLoginDate: {
    type: String,
    require: true,
  },
  lastLogoutDate: {
    type: String,
  },
  metaData: { Object },
  roles: {
    User: {
      type: Number,
      default: 2001,
    },
    Editor: Number,
    Admin: Number,
  },
  refreshToken: [String],
});

module.exports = mongoose.model("Users", userSchema);
