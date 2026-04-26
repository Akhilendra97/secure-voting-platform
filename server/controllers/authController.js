const pool = require("../config/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// ================= OTP STORE =================
let otpStore = {};

// ================= REGISTER =================
exports.register = async (req, res) => {
  try {
    const { aadhar_id, password, voter_id_card, date_of_birth } = req.body;

    if (!aadhar_id || !password || !voter_id_card || !date_of_birth) {
      return res.status(400).json({ message: "All fields required" });
    }

    const dob = new Date(date_of_birth);
    const today = new Date();

    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();

    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
      age--;
    }

    if (age < 18) {
      return res.status(403).json({
        message: "You must be 18+ to register"
      });
    }

    const [existing] = await pool.query(
      "SELECT * FROM Users WHERE aadhar_id = ?",
      [aadhar_id]
    );

    if (existing.length > 0) {

      if (existing[0].status === "rejected") {

        const hashedPassword = await bcrypt.hash(password, 10);

        await pool.query(
          `UPDATE Users 
           SET password_hash=?, status='pending', rejection_reason=NULL,
               voter_id_card=?, date_of_birth=?
           WHERE aadhar_id=?`,
          [hashedPassword, voter_id_card, date_of_birth, aadhar_id]
        );

        return res.json({
          message: "Re-registration submitted. Wait for admin approval."
        });
      }

      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashed = await bcrypt.hash(password, 10);

    await pool.query(
      `INSERT INTO Users 
       (aadhar_id, password_hash, voter_id_card, date_of_birth, role, status) 
       VALUES (?, ?, ?, ?, 'user', 'pending')`,
      [aadhar_id, hashed, voter_id_card, date_of_birth]
    );

    res.json({
      message: "Registration request sent to admin for verification."
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ================= USER LOGIN =================
exports.login = async (req, res) => {
  try {
    const { aadhar_id, password, otp } = req.body;

    if (!aadhar_id || !password || !otp) {
      return res.status(400).json({ message: "All fields required" });
    }

    const [user] = await pool.query(
      "SELECT * FROM Users WHERE aadhar_id = ?",
      [aadhar_id]
    );

    if (user.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    const match = await bcrypt.compare(password, user[0].password_hash);

    if (!match) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    if (user[0].status === "pending") {
      return res.status(403).json({
        message: "Your account is pending approval by admin"
      });
    }

    if (user[0].status === "rejected") {
      return res.status(403).json({
        message:
          user[0].rejection_reason ||
          "Your registration was rejected. Please register again."
      });
    }

   // 🔥 STRICT OTP CHECK
const storedOtpData = otpStore[aadhar_id];

if (!storedOtpData) {
  return res.status(400).json({ message: "OTP not sent" });
}

if (Date.now() > storedOtpData.expiresAt) {
  delete otpStore[aadhar_id];
  return res.status(400).json({ message: "OTP expired" });
}

if (String(storedOtpData.code) !== String(otp)) {
  return res.status(400).json({ message: "Invalid OTP" });
}

// ✅ ONLY SUCCESS HERE
delete otpStore[aadhar_id];

    const token = jwt.sign(
      { voter_id: user[0].voter_id, role: "user" },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    return res.json({ token, role: "user" });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
};

// ================= ADMIN LOGIN =================
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const [rows] = await pool.query(
      "SELECT * FROM admins WHERE email = ?",
      [email]
    );

    if (rows.length === 0) {
      return res.status(400).json({ message: "Admin not found" });
    }

    const admin = rows[0];

    const match = await bcrypt.compare(password, admin.password_hash);

    if (!match) {
      return res.status(400).json({ message: "Wrong password" });
    }

    const token = jwt.sign(
      { admin_id: admin.admin_id, role: "admin" },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.json({ token, role: "admin" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// ================= SEND OTP =================
exports.sendOTP = async (req, res) => {
  try {
    const { aadhar_id } = req.body;

    if (!aadhar_id || aadhar_id.length !== 12) {
      return res.status(400).json({
        message: "Invalid Aadhaar number"
      });
    }

    const otp = Math.floor(100000 + Math.random() * 900000);

    // 🔥 STORE WITH EXPIRY (60s)
    otpStore[aadhar_id] = {
      code: otp,
      expiresAt: Date.now() + 60 * 1000
    };

    console.log(`🔐 OTP for ${aadhar_id}: ${otp}`);

    res.json({
      message: "OTP sent successfully",
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};