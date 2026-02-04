require('dotenv').config();
const Enquiry = require("../models/Enquiry");

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
const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

exports.createEnquiry = async (req, res) => {
  const { name, email, phone, course, lastQualification, message } = req.body;

  const missingFields = [];
  if (!name) missingFields.push("name");
  if (!email) missingFields.push("email");
  if (!phone) missingFields.push("phone");
  if (!course) missingFields.push("course");
  if (!lastQualification) missingFields.push("lastQualification");
  if (!message) missingFields.push("message");

  if (missingFields.length > 0) {
    return res.status(400).json({ success: false, message: "Missing fields", missingFields });
  }

  try {
    // 1️⃣ Save enquiry in DB
    const enquiry = await Enquiry.create({ name, email, phone, course, lastQualification, message });

    // 2️⃣ Email to admin
    await sgMail.send({
      to: process.env.SENDGRID_VERIFIED_SENDER,
      from: process.env.SENDGRID_VERIFIED_SENDER,
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

    // 3️⃣ Auto-reply to user
    await sgMail.send({
      to: email,
      from: process.env.SENDGRID_VERIFIED_SENDER,
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

    res.status(201).json({ success: true, message: "Enquiry submitted successfully" });

  } catch (err) {
    console.error("ENQUIRY ERROR:", err);
    res.status(500).json({ success: false, message: err.message, stack: err.stack });
  }
};

