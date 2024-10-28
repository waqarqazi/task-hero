const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  filename: String,
  fileType: String,
  url: String,
  tags: [String],
  shareId: { type: String, unique: true },
});

module.exports = mongoose.model("File", fileSchema);