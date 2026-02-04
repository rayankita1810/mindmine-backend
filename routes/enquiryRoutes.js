const express = require("express");
const router = express.Router();
const { getAllEnquiries, createEnquiry } = require("../controllers/enquiryController");
const auth = require("../middleware/auth");

// Get all enquiries (admin)
router.get("/", auth, getAllEnquiries);

// Create enquiry (public)
router.post("/", createEnquiry);

module.exports = router;
