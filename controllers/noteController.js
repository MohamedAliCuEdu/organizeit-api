const asyncFunction = require("../middlewares/asyncFunction");
const Note = require("../models/Note");
const User = require("../models/User");

// 1) getging all notes:
const getAllNotes = asyncFunction(async (req, res) => {
  // 1. check if userId exist in DB:
  let userId = req.params?.userId;
  let userExist = await User.findById(userId).exec();
  if (!userExist) return res.status(404).json({ errMsg: "user not found!" });
  // 2. get user`s notes from DB:
  const currentNotes = await Note.find({ userId, is_archived: false }).select({
    userId: 0,
    __v: 0,
  });
  const archiveNotes = await Note.find({ userId, is_archived: true }).select({
    userId: 0,
    __v: 0,
  });
  res.json({ currentNotes, archiveNotes });
});
// 1) getging all notes:
const getAllTags = asyncFunction(async (req, res) => {
  // 1. check if userId exist in DB:
  let userId = req.params?.userId;
  let userExist = await User.findById(userId).exec();
  if (!userExist) return res.status(404).json({ errMsg: "user not found!" });

  const allTags = await Note.aggregate([
    { $match: { userId, is_archived: false } },
    { $unwind: "$tags" }, // Deconstruct the tags array field
    { $group: { _id: "$tags", count: { $sum: 1 } } }, // Group by each tag and count
    {
      $project: {
        _id: 0,
        tagName: "$_id",
        count: "$count",
      },
    },
    { $sort: { _id: 1 } }, // Optional: Sort by tag name
  ]);
  res.json(allTags);
});
// 2) getting note by its id:
const getNote = asyncFunction(async (req, res) => {
  // 1. find note:
  let noteId = req.noteId;
  const foundNote = await Note.findById(noteId).select({ __v: 0 }).exec();
  if (!foundNote) return res.status(404).json({ errMsg: "note not found!" });
  // 2. send note:
  res.json(foundNote);
});
// 3) adding new note:
const addNewNote = asyncFunction(async (req, res) => {
  // 1. find user:
  let userId = req.userId;
  const foundUser = await User.findById(userId);
  if (!foundUser) return res.status(404).json({ errMsg: "user not found" });
  // 2. create created_at;
  const created_at = new Date().toISOString();
  // 3. create note & save it in DB:
  const newNote = await Note.create({ ...req.body, userId, created_at });
  res.json(newNote);
});
// 4) editing note:
const updateNote = asyncFunction(async (req, res) => {
  // 1. find note document:
  let noteId = req.noteId;
  const foundNote = await Note.findById(noteId).exec();
  if (!foundNote) return res.status(404).json({ errMsg: "note not found!" });
  const updated_at = new Date().toISOString();
  // 2. modify note & save in DB:
  const result = await Note.findByIdAndUpdate(
    noteId,
    { ...req.body, updated_at },
    {
      returnOriginal: false,
    }
  ).select({ __v: 0 });
  res.json(result);
});
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
// 6) deleting note:
const deleteNote = asyncFunction(async (req, res) => {
  // 1. find note:
  let noteId = req.noteId;
  const foundNote = await Note.findById({ _id: noteId }).exec();
  if (!foundNote) return res.sendStatus(204);
  // 2. remove note from DB:
  let result = await Note.deleteOne({ _id: noteId });
  res.json(result);
});
// 7) deleting all notes:
const deleteAllNotes = asyncFunction(async (req, res) => {
  // 1. check if user exist in DB:
  let userId = req.userId;
  // 2. remove all user`s notes from DB:
  let result = await Note.deleteMany({ userId, is_archived: false });
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
  getAllNotes,
  getAllTags,
  getNote,
  addNewNote,
  updateNote,
  archiveNote,
  deleteNote,
  deleteAllNotes,
  deleteNotesArchive,
};
