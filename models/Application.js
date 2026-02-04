const mongoose = require("mongoose");

const applicationSchema = new mongoose.Schema(
  {
    // ✅ IDs
    trackingId: { type: String, unique: true, required: true },
    applicationId: { type: String, unique: true, sparse: true },

    // Campus & Course
    campus: String,
    campusLocation: String,
    course: String,

    // Student info
    fullName: { type: String, required: true },
    dob: {
      type: Date,
      required: true,
      validate: {
        validator: function (value) {
          return value <= new Date(); // DOB cannot be in the future
        },
        message: "Date of birth cannot be in the future",
      },
    },
    gender: { type: String, enum: ["Male", "Female", "Other"], required: true },
    caste: String,
    aadhaar: {
      type: String,
      validate: {
        validator: function (v) {
          return /^\d{12}$/.test(v); // 12 digit Aadhaar
        },
        message: "Aadhaar must be 12 digits",
      },
    },
    nationality: { type: String, default: "Indian" },
    address: String,
    city: String,
    state: String,
    pinCode: {
      type: String,
      validate: {
        validator: function (v) {
          return /^\d{6}$/.test(v); // 6 digit PIN
        },
        message: "PIN code must be 6 digits",
      },
    },
    phone: {
      type: String,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v); // 10 digit phone
        },
        message: "Phone number must be 10 digits",
      },
    },
    email: { type: String, required: true, match: /.+\@.+\..+/ },

    // Father
    fatherName: String,
    fatherOccupation: String,
    fatherPhone: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || /^\d{10}$/.test(v); // optional, but if present must be 10 digits
        },
        message: "Father's phone must be 10 digits",
      },
    },

    // Mother
    motherName: String,
    motherOccupation: String,
    motherPhone: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || /^\d{10}$/.test(v); // optional, 10 digits
        },
        message: "Mother's phone must be 10 digits",
      },
    },

    // Guardian (optional)
    guardianName: String,
    guardianRelation: String,
    guardianPhone: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || /^\d{10}$/.test(v);
        },
        message: "Guardian phone must be 10 digits",
      },
    },

    // Education
    lastQualification: String,
    previousCourse: String,
    previousInstitute: String,
    passingYear: {
      type: String,
      validate: {
        validator: function (v) {
          return /^\d{4}$/.test(v) && v <= new Date().getFullYear();
        },
        message: "Passing year must be valid and not in the future",
      },
    },
    percentage: {
      type: String,
      validate: {
        validator: function (v) {
          return !v || (Number(v) >= 0 && Number(v) <= 100);
        },
        message: "Percentage must be between 0 and 100",
      },
    },

    // Status tracking
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Application", applicationSchema);
