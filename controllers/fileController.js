const File = require("../models/Files.js");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const fileUpload = async (req, res) => {
  try {
    const { filename, fileType, fileData, tags } = req.body;
    const userId = req.body.user._id;
    if (!filename || !fileType || !fileData || !userId) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    const buffer = Buffer.from(fileData, "base64");
    const uploadDir = path.join(__dirname, "../uploads");

    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir);
    }

    const filePath = path.join(uploadDir, filename);
    fs.writeFileSync(filePath, buffer);

    // Generate a unique shareId
    const shareId = uuidv4();

    const file = new File({
      filename,
      fileType,
      url: `/uploads/${filename}`,
      tags: tags ? tags.split(",") : [],
      shareId,
      userId,
    });

    await file.save();

    res.status(200).json({
      success: true,
      file,
      shareableLink: `http://localhost:3000/api/files/share/${shareId}`,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const createShareableLink = async (req, res) => {
  try {
    const { shareId } = req.params;

    // Find the file by shareId
    const file = await File.findOne({ shareId });

    if (!file) {
      return res.status(404).json({ success: false, message: 'File not found.' });
    }

    // Increment the views count
    file.views += 1;
    await file.save();

    // Serve the file (you might want to adjust the path based on your setup)
    const filePath = path.join(__dirname, '../uploads', file.filename);

    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).json({ success: false, message: 'File not found on server' });
    }
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getAllFiles = async (req, res) => {
  try {
    const userId = req.body.user._id;
    const files = await File.find({ userId: userId });
    res.status(200).json({ success: true, files });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  fileUpload,
  createShareableLink,
  getAllFiles,
};
