const asyncFunction = require("../middlewares/asyncFunction");
const Task = require("../models/Task");
const User = require("../models/User");

// 1) getging all tasks:
const getAllTasks = asyncFunction(async (req, res) => {
  // 1. check if userId exist in DB:
  let userId = req.params?.userId;
  let userExist = await User.findById(userId).exec();
  if (!userExist) return res.status(404).json({ errMsg: "user not found!" });
  // 2. get user`s tasks from DB:
  const allTasks = await Task.find({ userId }).select({ __v: 0 });

  const result = await Task.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
      },
    },
    {
      $project: {
        _id: 0,
        status: "$_id",
        count: "$count",
      },
    },
  ]);
  // Initialize the result object with default values
  const taskState = { completed: 0, pending: 0 };
  // Populate the result object with actual counts
  result.forEach(({ status, count }) => {
    taskState[status] = count;
  });
  res.json({ allTasks, taskState });
});

// 2) getting task by its id:
const getTask = asyncFunction(async (req, res) => {
  // 1. find task:
  let taskId = req.taskId;
  const foundTask = await Task.findById(taskId).select({ __v: 0 }).exec();
  if (!foundTask) return res.status(404).json({ errMsg: "task not found!" });
  // 2. send task:
  res.json(foundTask);
});
// 3) adding new task:
const addNewTask = asyncFunction(async (req, res) => {
  // 1. get userId:
  let userId = req.userId;
  // 1. create dateCreated;
  const created_at = new Date().toDateString();
  // 2. create task & save it in DB:
  const newTask = await Task.create({ ...req.body, userId, created_at });
  res.json(newTask);
});
// 4) editing task:
const updateTask = asyncFunction(async (req, res) => {
  // 1. find task:
  let taskId = req.taskId;
  const foundTask = await Task.findById(taskId).exec();
  if (!foundTask) return res.status(404).json({ errMsg: "task not found!" });
  // 3. modify task & save in DB:
  const result = await Task.findByIdAndUpdate(
    taskId,
    { ...req.body },
    {
      returnOriginal: false,
    }
  ).select({ __v: 0 });
  res.json(result);
});
// 4) update task completing:
const taskComplete = asyncFunction(async (req, res) => {
  // 1. find task:
  let taskId = req.taskId;
  let isCompleted = req.body.is_completed;
  const foundTask = await Task.findById(taskId).exec();
  if (!foundTask) return res.status(404).json({ errMsg: "task not found!" });
  // 3. modify task & save in DB:
  const result = await Task.findByIdAndUpdate(
    taskId,
    {
      is_completed: isCompleted,
      status: isCompleted ? "completed" : "pending",
    },
    {
      returnOriginal: false,
    }
  ).select({ __v: 0 });
  res.json(result);
});
// 6) deleting task:
const deleteTask = asyncFunction(async (req, res) => {
  // 1. find task:
  let taskId = req.taskId;
  const foundTask = await Task.findById({ _id: taskId }).exec();
  if (!foundTask) return res.sendStatus(204);
  // 2. remove Task from DB:
  let result = await Task.deleteOne({ _id: taskId });
  res.json(result);
});
// 7) deleting all tasks:
const deleteAllTasks = asyncFunction(async (req, res) => {
  // 1. check if user exist in DB:
  let userId = req.params?.userId;
  // 2. remove all user`s tasks from DB:
  let result = await Task.deleteMany({ userId });
  res.json(result);
});

module.exports = {
  getAllTasks,
  getTask,
  addNewTask,
  updateTask,
  taskComplete,
  deleteTask,
  deleteAllTasks,
};
