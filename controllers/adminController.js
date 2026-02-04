// controllers/adminController.js
const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ---------------- Register Admin ----------------
exports.registerAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password required" });
  }

  try {
    const existing = await Admin.findOne({ email });
    if (existing)
      return res.status(400).json({ message: "Admin already exists" });

    const admin = await Admin.create({ email, password });

    res.status(201).json({ message: "Admin created", admin });
  } catch (err) {
    console.error("Register error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- Login Admin ----------------
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  console.log("Login attempt:", email);
  console.log("Password received:", password);

  try {
    const admin = await Admin.findOne({ email });
    console.log("Admin found in DB:", admin);

    if (!admin) {
      console.log("No admin found with this email");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const match = await bcrypt.compare(password, admin.password);
    console.log("Password match result:", match);

    if (!match) {
      console.log("Password does not match");
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    console.log("Login successful, token generated");
    res.json({ token });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------- Debug: List all admins ----------------
// exports.getAllAdmins = async (req, res) => {
//   try {
//     const admins = await Admin.find({});
//     console.log("Admins in DB:", admins);
//     res.json(admins);
//   } catch (err) {
//     console.error("Error fetching admins:", err);
//     res.status(500).json({ message: "Server error" });
//   }
// };
