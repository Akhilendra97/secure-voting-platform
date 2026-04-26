const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

// ================= USER ROUTES =================
router.post("/register", authController.register);
router.post("/login", authController.login);
router.post("/send-otp", authController.sendOTP);

// ================= ADMIN ROUTE =================
router.post("/admin-login", authController.adminLogin);

module.exports = router;