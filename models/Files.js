const mongoose = require("mongoose");

const fileSchema = new mongoose.Schema({
  filename: { type: String, required: true },
  fileType: { type: String, required: true },
  url: { type: String, required: true },
  tags: { type: [String], default: [] },
  shareId: { type: String, unique: true, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to the User model
  views: { type: Number, default: 0 } // Field to track the number of views
});

module.exports = mongoose.model("File", fileSchema);