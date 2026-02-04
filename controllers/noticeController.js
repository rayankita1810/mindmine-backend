const Notice = require("../models/Notice");
const fs = require("fs");
const path = require("path");

// Create a new notice
exports.createNotice = async (req, res) => {
  try {
    const { title } = req.body;

    if (!req.file) {
      return res.status(400).json({ success: false, message: "File is required" });
    }

    // Cloudinary URL
    const imageUrl = req.file.path;

    const notice = await Notice.create({ title, image: imageUrl });
    res.json({ success: true, notice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to upload notice" });
  }
};


// ---------------------------
// Get all notices
// ---------------------------
exports.getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 }); // newest first
    res.json({ success: true, notices });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ---------------------------
// Update a notice by ID
// ---------------------------
exports.updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const notice = await Notice.findById(id);
    if (!notice) return res.status(404).json({ success: false, message: "Notice not found" });

    // Update image if new file uploaded
    if (req.file) {
      // Delete old image from Cloudinary
      if (notice.image) {
        const publicId = notice.image.split("/").pop().split(".")[0]; // extract public ID
        cloudinary.uploader.destroy(`notice_photos/${publicId}`, (err, result) => {
          if (err) console.warn("Failed to delete old image:", err);
        });
      }
      notice.image = req.file.path; // new Cloudinary URL
    }

    if (title) notice.title = title;

    await notice.save();
    res.json({ success: true, notice });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to update notice" });
  }
};


// ---------------------------
// Delete a notice by ID
// ---------------------------
exports.deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const notice = await Notice.findById(id);
    if (!notice) return res.status(404).json({ success: false, message: "Notice not found" });

    // Delete image from Cloudinary
    if (notice.image) {
      const publicId = notice.image.split("/").pop().split(".")[0];
      cloudinary.uploader.destroy(`notice_photos/${publicId}`, (err, result) => {
        if (err) console.warn("Failed to delete image:", err);
      });
    }

    await notice.deleteOne();
    res.json({ success: true, message: "Notice deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to delete notice" });
  }
};

