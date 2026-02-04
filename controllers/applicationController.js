const Application = require("../models/Application");
const nodemailer = require("nodemailer");

// ================= GET ALL =================
exports.getAllApplications = async (req, res) => {
  try {
    const apps = await Application.find().sort({ createdAt: -1 });
    res.json(apps);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// ================= CREATE APPLICATION =================
exports.createApplication = async (req, res) => {
  try {
    const {
      fullName,
      email,
      phone,
      course,

      campus,
      campusLocation,

      dob,
      gender,
      caste,
      aadhaar,

      address,
      city,
      pin,
      state,

      lastQualification,
      previousCourse,
      previousInstitute,
      passingYear,
      percentage,

      fatherName,
      fatherOccupation,
      fatherPhone,

      motherName,
      motherOccupation,
      motherPhone,

      guardianName,
      guardianRelation,
      guardianPhone,
    } = req.body;

    // ✅ Basic required validation
    if (!fullName || !email || !phone || !course) {
      return res.status(400).json({
        success: false,
        message: "Full name, email, phone and course are required",
      });
    }

    // ✅ Tracking ID
    const trackingId =
      "TRK-" + Date.now() + "-" + Math.floor(1000 + Math.random() * 9000);

    // ✅ Save everything
    const newApp = await Application.create({
      trackingId,

      campus,
      campusLocation,
      course,

      fullName,
      dob,
      gender,
      caste,
      aadhaar,

      address,
      city,
      state,
      pinCode: pin,

      lastQualification,
      previousCourse,
      previousInstitute,
      passingYear,
      percentage,

      phone,
      email,

      fatherName,
      fatherOccupation,
      fatherPhone,

      motherName,
      motherOccupation,
      motherPhone,

      guardianName,
      guardianRelation,
      guardianPhone,
    });

    // ================= EMAIL =================
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    // 📩 Admin email (FULL DATA)
    const adminMail = {
      from: `"Mindmine Academy" <${process.env.CONTACT_EMAIL}>`,
      to: process.env.CONTACT_EMAIL,
      subject: `New Application – ${trackingId}`,
      html: `
        <h3>🎓 New Student Application</h3>
        <p><strong>Tracking ID:</strong> ${trackingId}</p>

        <h4>Student Info</h4>
        <p>Name: ${fullName}</p>
        <p>Email: ${email}</p>
        <p>Phone: ${phone}</p>
        <p>DOB: ${dob}</p>
        <p>Gender: ${gender}</p>
        <p>Caste: ${caste}</p>
        <p>Aadhaar: ${aadhaar}</p>

        <h4>Course & Campus</h4>
        <p>Course: ${course}</p>
        <p>Campus: ${campus}</p>
        <p>Location: ${campusLocation}</p>

        <h4>Address</h4>
        <p>${address}, ${city}, ${state} - ${pin}</p>

        <h4>Education</h4>
        <p>Last Qualification: ${lastQualification}</p>
        <p>Previous Course: ${previousCourse}</p>
        <p>Institute: ${previousInstitute}</p>
        <p>Passing Year: ${passingYear}</p>
        <p>Percentage: ${percentage}</p>

        <h4>Parents</h4>
        <p>Father: ${fatherName} (${fatherPhone}) - ${fatherOccupation}</p>
        <p>Mother: ${motherName} (${motherPhone}) - ${motherOccupation}</p>

        <h4>Guardian</h4>
        <p>${guardianName} (${guardianRelation}) - ${guardianPhone}</p>
      `,
    };

    // 📧 Student email
    const studentMail = {
      from: `"Mindmine Academy" <${process.env.CONTACT_EMAIL}>`,
      to: email,
      subject: "Mindmine Academy – Application Received",
      html: `
        <p>Hello ${fullName},</p>
        <p>Your application has been received successfully.</p>
        <p><strong>Tracking ID:</strong> ${trackingId}</p>
        <p>Our team will contact you shortly.</p>
        <br/>
        <p>Regards,<br/>Mindmine Academy Team</p>
      `,
    };

    await Promise.all([
      transporter.sendMail(adminMail),
      transporter.sendMail(studentMail),
    ]);

    res.status(201).json({
      success: true,
      message: "Application submitted successfully",
      trackingId,
    });
  } catch (err) {
    console.error("Application submit error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to submit application",
    });
  }
};



// ================= APPROVE / REJECT =================
exports.updateStatus = async (req, res) => {
  try {
    const { id, action } = req.params;

    const app = await Application.findById(id);
    if (!app) return res.status(404).json({ message: "Application not found" });

    if (action === "approve") {
      app.status = "approved";
      app.applicationId =
        "MMA-" + Date.now() + "-" + Math.floor(Math.random() * 1000);
    } else if (action === "reject") {
      app.status = "rejected";
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    await app.save();
    res.json(app);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Public status check (student side)
exports.checkStatus = async (req, res) => {
  try {
    const { trackingId } = req.params;

    const app = await Application.findOne({ trackingId });

    if (!app) {
      return res.status(404).json({
        success: false,
        message: "Invalid tracking ID"
      });
    }

    res.json({
      success: true,
      status: app.status
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false });
  }
};
