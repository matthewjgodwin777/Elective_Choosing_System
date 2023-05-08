const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  code: {
    type: String,
    required: true,
  },
  elective: {
    type: String,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Department", departmentSchema);
