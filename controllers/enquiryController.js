const Enquiry = require("../models/Enquiry");
const nodemailer = require("nodemailer");

// Get all enquiries
exports.getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find().sort({ createdAt: -1 });
    res.json(enquiries);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Create enquiry and send email
exports.createEnquiry = async (req, res) => {
  console.log("REQ BODY:", req.body);

  const { name, email, phone, course, lastQualification, message } = req.body;

  const missingFields = [];
  if (!name) missingFields.push("name");
  if (!email) missingFields.push("email");
  if (!phone) missingFields.push("phone");
  if (!course) missingFields.push("course");
  if (!lastQualification) missingFields.push("lastQualification");
  if (!message) missingFields.push("message");

  if (missingFields.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Missing required fields",
      missingFields,
    });
  }

  try {
    // 1️⃣ Save enquiry
    const enquiry = await Enquiry.create({
      name,
      email,
      phone,
      course,
      lastQualification,
      message,
    });

    // 2️⃣ Create transporter (Render-safe)
    const transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 465,
      secure: true,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false,
      },
    });

    await transporter.verify();
    console.log("SMTP connected on Render");

    // 3️⃣ Mail to admin
    await transporter.sendMail({
      from: `"${name}" <${process.env.SMTP_USER}>`,
      to: process.env.CONTACT_EMAIL,
      subject: `New Enquiry: ${course}`,
      html: `
        <h3>📩 New Enquiry Received</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Last Qualification:</strong> ${lastQualification}</p>
        <p><strong>Course:</strong> ${course}</p>
        <hr/>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    // 4️⃣ Auto-reply to user
    await transporter.sendMail({
      from: `"Mindmine Academy" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "Mindmine Academy – Enquiry Received",
      html: `
        <p>Hello ${name},</p>
        <p>Thank you for contacting <strong>Mindmine Academy</strong>.</p>
        <p>We received your enquiry regarding <strong>${course}</strong>.</p>
        <p>Our team will contact you shortly.</p>
        <br/>
        <p>Regards,<br/>Mindmine Academy Team</p>
      `,
    });

    console.log("Emails sent successfully:", enquiry._id);

    // 5️⃣ Respond
    res.status(201).json({
      success: true,
      message: "Enquiry submitted successfully",
    });
  } catch (err) {
    console.error("ENQUIRY ERROR FULL:", err);

    res.status(500).json({
      success: false,
      message: err.message,
      stack: err.stack,
    });
  }
};
