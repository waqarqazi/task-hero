const File = require("../models/Files.js");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

const fileUpload = async (req, res) => {
  try {
    const { filename, fileType, fileData, tags } = req.body;

    if (!filename || !fileType || !fileData) {
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
      shareId, // Save the unique identifier
    });

    await file.save();

    // Return file details including the shareable link
    res.status(200).json({
      success: true,
      file,
      shareableLink: `http://localhost:3000/api/files/share/${shareId}`, // Example link format
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const createShareableLink = async (req, res) => {
  try {
    const { shareId } = req.params;

    // Find the file in the database using the shareId
    const file = await File.findOne({ shareId });

    if (!file) {
      return res.status(404).json({ success: false, message: "Fil not found" });
    }

    const filePath = path.join(__dirname, "..", file.url); 

   console.log("filePath",filePath);
    res.setHeader("Content-Type", file.fileType);
    res.sendFile(filePath);
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
const getAllFiles = async (req, res) => {
    try {
      const files = await File.find();
      res.status(200).json({ success: true, files });
    } catch (error) {
      res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
  fileUpload,
  createShareableLink,
  getAllFiles,
  getAllFiles
};
