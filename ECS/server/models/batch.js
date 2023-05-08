const mongoose = require("mongoose");

const batchSchema = new mongoose.Schema({
  department: {
    type: String,
    required: true,
  },
  start: {
    type: Number,
    required: true,
  },
  end: {
    type: Number,
    required: true,
  },
});

module.exports = mongoose.model("Batch", batchSchema);
