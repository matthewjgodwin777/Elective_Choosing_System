const express = require("express");
const router = express.Router();
const Department = require("../models/department");

// Getting All
router.get("/", async (req, res) => {
  try {
    const departments = await Department.find();
    res.json(departments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
