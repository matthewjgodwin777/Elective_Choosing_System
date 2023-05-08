// Import all required libraries
require("dotenv").config();
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");

// Database connection
mongoose.connect(process.env.DATABASE_URL);
const db = mongoose.connection;
db.on("error", (err) => console.error(err));
db.once("open", () => console.log("Connected to Database"));

// Middleware
app.use(cors());
app.use(express.json());

const adminUserRouter = require("./routes/adminUsers");
app.use("/adminUser", adminUserRouter);

const studentUserRouter = require("./routes/studentUsers");
app.use("/studentUser", studentUserRouter);

const subjectRouter = require("./routes/subjects");
app.use("/subject", subjectRouter);

const batchRouter = require("./routes/batches");
app.use("/batch", batchRouter);

const departmentRouter = require("./routes/departments");
app.use("/department", departmentRouter);

const electiveRouter = require("./routes/electives");
app.use("/elective", electiveRouter);

const formRouter = require("./routes/forms");
app.use("/form", formRouter);

const responseRouter = require("./routes/response");
app.use("/response", responseRouter);

const studentDashboardRouter = require("./routes/studentDashboard");
app.use("/studentDashboard", studentDashboardRouter);

// Server running on PORT
app.listen(process.env.PORT, () => {
  console.log(`Server started on http://localhost:${process.env.PORT}`);
});
