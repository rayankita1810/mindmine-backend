const express = require("express");
const router = express.Router();
const { parser } = require("../config/cloudinary"); // Cloudinary parser
const noticeController = require("../controllers/noticeController");
const auth = require("../middleware/auth"); // if you have authentication

// ---------------------------
// Routes
// ---------------------------

// Add a new notice with image upload to Cloudinary
router.post("/add", auth, parser.single("photo"), noticeController.createNotice);

// Update a notice (with optional new image)
router.put("/update/:id", auth, parser.single("photo"), noticeController.updateNotice);

// Delete a notice
router.delete("/delete/:id", auth, noticeController.deleteNotice);

// Get all notices
router.get("/all", noticeController.getAllNotices);

module.exports = router;
