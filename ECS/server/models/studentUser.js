const mongoose = require("mongoose");

const studentUserSchema = new mongoose.Schema({
  registrationNumber: {
    type: Number,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  batch: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("StudentUser", studentUserSchema);
