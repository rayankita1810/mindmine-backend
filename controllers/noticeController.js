const Notice = require("../models/Notice");


// ===========================
// Create a new notice (TEXT)
// ===========================
exports.createNotice = async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    const notice = await Notice.create({
      title,
      description,
    });

    res.json({ success: true, notice });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to create notice",
    });
  }
};


// ===========================
// Get all notices
// ===========================
exports.getAllNotices = async (req, res) => {
  try {
    const notices = await Notice.find().sort({ createdAt: -1 });
    res.json({ success: true, notices });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};


// ===========================
// Update notice
// ===========================
exports.updateNotice = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;

    const notice = await Notice.findById(id);
    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    if (title) notice.title = title;
    if (description) notice.description = description;

    await notice.save();

    res.json({ success: true, notice });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to update notice",
    });
  }
};


// ===========================
// Delete notice
// ===========================
exports.deleteNotice = async (req, res) => {
  try {
    const { id } = req.params;

    const notice = await Notice.findById(id);
    if (!notice) {
      return res.status(404).json({
        success: false,
        message: "Notice not found",
      });
    }

    await notice.deleteOne();

    res.json({
      success: true,
      message: "Notice deleted successfully",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Failed to delete notice",
    });
  }
};
