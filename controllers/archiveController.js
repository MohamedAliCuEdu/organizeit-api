const asyncFunction = require("../middlewares/asyncFunction");
const Note = require("../models/Note");

// 5) archive note:
const archiveNote = asyncFunction(async (req, res) => {
  // 1. find note:
  let noteId = req.noteId;
  const foundNote = await Note.findById(noteId).select({ __v: 0 }).exec();
  if (!foundNote) return res.status(404).json({ errMsg: "note not found!" });
  // 3. modify note & save in DB:
  foundNote.is_archived = req.body.is_archived;
  let result = await foundNote.save();
  res.json(result);
});
// 5) archive note:
const unArchiveAllNotes = asyncFunction(async (req, res) => {
  // 1. find note:
  let userId = req.userId;
  // 2. un archive all & save:
  const result = await Note.updateMany({userId, is_archived: true}, {is_archived: false});
  res.json(result);
});
// 7) deleting all notes:
const deleteNotesArchive = asyncFunction(async (req, res) => {
  // 1. check if user exist in DB:
  let userId = req.userId;
  // 2. remove all user`s notes from DB:
  let result = await Note.deleteMany({ userId, is_archived: true });
  res.json(result);
});

module.exports = {
  archiveNote,
  unArchiveAllNotes,
  deleteNotesArchive
};
