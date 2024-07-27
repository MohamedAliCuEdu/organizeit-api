const mongoose = require("mongoose");
const { OBJECT_ID } = require("../config/regex");

const Schema = mongoose.Schema;

const noteSchema = new Schema({
  title: {
    type: String,
    maxlength: 100,
  },
  content: {
    type: String,
    maxlength: 2000,
    require: true,
  },
  tags: {
    type: [String],
    maxlength: 5,
    validate: {
      validator: function (tags) {
        return new Set(tags).size === tags.length;
      },
      message: "tags must be unique!",
    },
    items: {
      type: String,
      minlength: 3,
      maxlength: 15,
    },
    default: [],
  },
  userId: {
    type: String,
    match: OBJECT_ID,
    require: true,
  },
  created_at: {
    type: String,
    require: true,
  },
  updated_at: {
    type: String,
  },
  is_archived: {
    type: Boolean,
    default: false,
  },
});
noteSchema.pre("save", (nxt) => {
  this.updated_at = Date.now();
  console.log("saved");
  nxt();
});

module.exports = mongoose.model("Note", noteSchema);
