require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
require("dotenv").config();
const express = require("express");
const connectDB = require("./config/db");
const cors = require("cors");
const path = require("path");


const adminAuthRoutes = require("./routes/adminAuth");
const enquiryRoutes = require("./routes/enquiryRoutes");
const applicationRoutes = require("./routes/applicationRoutes");
const noticeRoutes = require("./routes/noticeRoutes");

const app = express();

// ✅ middleware (ORDER MATTERS)
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ routes
app.use("/api/admin", adminAuthRoutes);
app.use("/api/enquiry", enquiryRoutes);
app.use("/api/application", applicationRoutes);
app.use("/api/notice", noticeRoutes);
app.use("/api/payment", require("./routes/payment"));


// connect database
connectDB();

// test route
app.get("/", (req, res) => {
  res.send("MindMine API running...");
});

app.post("/test", (req, res) => {
  console.log("TEST BODY:", req.body);
  res.json(req.body);
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
