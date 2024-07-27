const mongoose = require("mongoose");
const { OBJECT_ID } = require("../config/regex");

const Schema = mongoose.Schema;

const taskSchema = new Schema({
  content: {
    type: String,
    minLength: 1,
    maxLength: 40,
    require: true,
  },
  status: {
    type: String,
    enum: ["pending", "completed"],
    default: "pending",
    require: true,
  },
  is_completed: {
    type: Boolean,
    default: false,
  },
  userId: {
    type: String,
    match: OBJECT_ID,
    require: true,
  },
  created_at: {
    type: String,
    require: true,
  }
});

module.exports = mongoose.model("Tasks", taskSchema);
