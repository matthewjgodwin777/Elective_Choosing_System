const mongoose = require("mongoose");

const electiveSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  short: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Elective", electiveSchema);
