const express = require("express");
const router = express.Router();
const { getAllApplications, createApplication, updateStatus, checkStatus } = require("../controllers/applicationController");
const auth = require("../middleware/auth");

router.get("/", auth, getAllApplications);
router.post("/", createApplication); 
router.patch("/:id/:action", auth, updateStatus);
router.get("/status/:trackingId", checkStatus);

module.exports = router;
