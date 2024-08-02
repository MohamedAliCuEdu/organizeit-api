const express = require("express");
const mongoose = require("mongoose");
const { default: helmet } = require("helmet");
const cookieParser = require("cookie-parser");
const cors = require("cors");
require("dotenv").config();
const path = require("path")

// const allowedOrigins = require("./config/allowedOrigins");
// const credentialsMW = require("./middlewares/credentialsMW");

const { conCompassDB } = require("./config/connectDB");
const taskRoute = require("./routes/taskRoute");
const userRoute = require("./routes/userRoutes");
const noteRoute = require("./routes/noteRoute");
const archiveRoute = require("./routes/archiveRoute");
const authRoute = require("./routes/authRoute");

const app = express();
// const corsOptions = {
//   origin: function (origin, callback) {
//     allowedOrigins.indexOf(origin) !== -1
//       ? callback(null, true)
//       : callback(new Error("Not allowed by CORS"));
//   },
//   optionsSuccessStatus: 200,
// };
const corsOptions = {
  origin: 'https://organizeit-ld911dt78-mohamedalicuedus-projects.vercel.app', // Allow this origin
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Specify the methods you want to allow
  allowedHeaders: ['Content-Type', 'Authorization', 'Authentication'], // Allow the Authentication header
  credentials: true // Allow credentials

};
// ________________middlewares:
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
// app.use(credentialsMW);
app.use(cors(corsOptions));
// ________________ main route:
app.all("/", (req, res) => {
  // res.send("hello from orgsnize-it api server!");
  res.sendFile(path.join(__dirname, "index.html"));
});
app.all("/g", (req, res) => {
  // res.send("hello from orgsnize-it api server!");
  res.sendFile(path.join(__dirname, "g.html"));
});
// ________________routes:
app.use("/api/tasks", taskRoute);
app.use("/api/users", userRoute);
app.use("/api/notes", noteRoute);
app.use("/api/archive", archiveRoute);
app.use("/api/auth", authRoute);

//_________________handling errors:
app.use((err, req, res, nxt) => {
  res.status(400).json(err);
});
// ________________unknown routes:
app.use("/*", (req, res) => {
  console.log("not found")
  res.status(403).send("not found!");
});

// ________________connect to database & run the server:
conCompassDB(process.env.DATABASE_URI)
mongoose.connection.once("open", () => {
  app.listen(process.env.PORT || 4000, () => {
    console.log("task-manager server: running...");
  });
});
