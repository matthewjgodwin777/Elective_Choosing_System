const express = require("express");
const router = express.Router();
const Subject = require("../models/subject");

// Getting All
router.get("/", async (req, res) => {
  try {
    const subjects = await Subject.find();
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/:shorthand/:dept", async (req, res) => {
  try {
    let subjects;
    if (req.params.shorthand == "OE1" || req.params.shorthand == "OE2") {
      subjects = await Subject.find({
        elective: req.params.shorthand,
        department: { $ne: req.params.dept }
      });
    }
    else {
      subjects = await Subject.find({
        elective: req.params.shorthand,
        department: req.params.dept,
      });
    }
    console.log(subjects)
    res.json(subjects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting One
router.get("/:id", getSubject, (req, res) => {
  res.json(res.subject);
});

// Creating One
router.post("/", async (req, res) => {
  const subject = new Subject({
    name: req.body.name,
    code: req.body.code,
    elective: req.body.elective,
    department: req.body.department,
  });
  try {
    const newSubject = await subject.save();
    res.status(201).json(newSubject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Updating One
router.patch("/:id", getSubject, async (req, res) => {
  if (req.body.name != null) {
    res.subject.name = req.body.name;
  }
  if (req.body.code != null) {
    res.subject.code = req.body.code;
  }
  if (req.body.elective != null) {
    res.subject.elective = req.body.elective;
  }
  if (req.body.department != null) {
    res.subject.department = req.body.department;
  }

  try {
    const updatedSubject = await res.subject.save();
    console.log(updatedSubject);
    res.json(updatedSubject);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deleting One
router.delete("/:id", getSubject, async (req, res) => {
  try {
    await res.subject.remove();
    res.json({ message: "Deleted Subject" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Custom Middleware
async function getSubject(req, res, next) {
  let subject;
  try {
    subject = await Subject.findById(req.params.id);
    if (subject == null)
      return res.status(404).json({ message: "Cannot find subject" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.subject = subject;
  next();
}

module.exports = router;
