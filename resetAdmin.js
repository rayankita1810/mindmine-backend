require("node:dns/promises").setServers(["1.1.1.1", "8.8.8.8"]);
// resetAdmin.js
require("dotenv").config();
const mongoose = require("mongoose");
const Admin = require("./models/Admin");
const bcrypt = require("bcryptjs");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const email = "admin200@mindmineacademy.com";
    const plainPassword = "admin123";

    // generate proper hash
    const hashed = await bcrypt.hash(plainPassword, 10);

    // find admin
    let admin = await Admin.findOne({ email });

    if (admin) {
      admin.password = hashed;
      await admin.save();
      console.log("✅ Password reset successfully!");
    } else {
      admin = await Admin.create({ email, password: hashed });
      console.log("✅ Admin created successfully!");
    }

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
