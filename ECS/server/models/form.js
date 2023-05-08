const mongoose = require("mongoose");

const formSchema = new mongoose.Schema({
  elective: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  allocated: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Form", formSchema);
