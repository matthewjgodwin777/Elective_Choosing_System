const express = require("express");
const router = express.Router();
const StudentUser = require("../models/studentUser");
const jwt = require("jsonwebtoken");

router.post("/register", async (req, res) => {
  const studentUser = new StudentUser({
    name: req.body.name,
    email: req.body.email,
    batch: req.body.batch,
    password: req.body.password,
    registrationNumber: req.body.registrationNumber,
  });
  try {
    const newStudentUser = await studentUser.save();
    res.status(201).json({ status: "ok", user: newStudentUser });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  const studentUser = await StudentUser.findOne({
    email: req.body.email,
    password: req.body.password,
  });
  if (studentUser) {
    const token = jwt.sign(
      {
        registrationNumber: studentUser.registrationNumber,
        name: studentUser.name,
        email: studentUser.email,
        id: studentUser.id,
      },
      "secret123"
    );
    res.json({ user: token });
  } else {
    res.json({ user: false });
  }
});

router.get("/", async (req, res) => {
  const token = req.headers["x-access-token"];

  try {
    const decoded = jwt.verify(token, "secret123");
    const email = decoded.email;
    const user = await StudentUser.findOne({ email: email });

    return res.json({ status: "ok", user: user });
  } catch (err) {
    console.log(err);
    res.status(400).json({ status: "error", error: "invalid token" });
  }
});

router.get("/:id", getStudent, async (req, res) => {
  res.json(res.student);
});

// Custom Middleware
async function getStudent(req, res, next) {
  let student;
  try {
    student = await StudentUser.findById(req.params.id);
    if (student == null)
      return res.status(404).json({ message: "Cannot find student" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.student = student;
  next();
}

module.exports = router;
