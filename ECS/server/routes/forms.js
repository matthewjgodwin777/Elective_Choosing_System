const express = require("express");
const router = express.Router();
const Form = require("../models/form");

// Getting All
router.get("/", async (req, res) => {
  try {
    const forms = await Form.find();
    res.json(forms);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting One
router.get("/:id", getForm, (req, res) => {
  res.json(res.form);
});

// Creating One
router.post("/", async (req, res) => {
  const form = new Form({
    elective: req.body.elective,
    batch: req.body.batch,
    startTime: req.body.startTime,
    endTime: req.body.endTime,
    allocated: "false",
  });
  try {
    const newForm = await form.save();
    res.status(201).json(newForm);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Updating One
router.patch("/:id", getForm, async (req, res) => {
  if (req.body.elective != null) {
    res.form.elective = req.body.elective;
  }
  if (req.body.startTime != null) {
    res.form.startTime = req.body.startTime;
  }
  if (req.body.endTime != null) {
    res.form.endTime = req.body.endTime;
  }
  if (req.body.batch != null) {
    res.form.batch = req.body.batch;
  }
  if (req.body.allocated != null) {
    res.form.allocated = req.body.allocated;
  }

  try {
    const updatedForm = await res.form.save();
    console.log(updatedForm);
    res.json(updatedForm);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deleting One
router.delete("/:id", getForm, async (req, res) => {
  try {
    await res.form.remove();
    res.json({ message: "Deleted Form" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Custom Middleware
async function getForm(req, res, next) {
  let form;
  try {
    form = await Form.findById(req.params.id);
    if (form == null)
      return res.status(404).json({ message: "Cannot find form" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.form = form;
  next();
}

module.exports = router;
