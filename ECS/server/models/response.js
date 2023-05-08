const mongoose = require("mongoose");

const responseSchema = new mongoose.Schema({
  student: {
    type: String,
    required: true,
  },
  form: {
    type: String,
    required: true,
  },
  priority1: {
    type: String,
    required: true,
  },
  priority2: {
    type: String,
    required: true,
  },
  priority3: {
    type: String,
    required: true,
  },
  allocated: {
    type: String,
  },
  created: {
    type: Number,
  },
});

module.exports = mongoose.model("Response", responseSchema);
