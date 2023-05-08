const express = require("express");
const router = express.Router();
const Batch = require("../models/batch");

// Getting All
router.get("/", async (req, res) => {
  try {
    const batches = await Batch.find();
    res.json(batches);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Getting One
router.get("/:id", getBatch, async (req, res) => {
  res.json(res.batch);
});

// Creating One
router.post("/", async (req, res) => {
  const batch = new Batch({
    department: req.body.department,
    start: req.body.start,
    end: req.body.end,
  });
  try {
    const newBatch = await batch.save();
    res.status(201).json(newBatch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Updating One
router.patch("/:id", getBatch, async (req, res) => {
  if (req.body.department != null) {
    res.batch.department = req.body.department;
  }
  if (req.body.start != null) {
    res.batch.start = req.body.start;
  }
  if (req.body.end != null) {
    res.batch.end = req.body.end;
  }

  try {
    const updatedBatch = await res.batch.save();
    console.log(updatedBatch);
    res.json(updatedBatch);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Deleting One
router.delete("/:id", getBatch, async (req, res) => {
  try {
    await res.batch.remove();
    res.json({ message: "Deleted Batch" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Custom Middleware
async function getBatch(req, res, next) {
  let batch;
  try {
    batch = await Batch.findById(req.params.id);
    if (batch == null)
      return res.status(404).json({ message: "Cannot find batch" });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
  res.batch = batch;
  next();
}

module.exports = router;
