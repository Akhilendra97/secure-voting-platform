const express = require("express");
const router = express.Router();
const { getAllUsers } = require("../controllers/userController");

// GET ALL USERS
router.get("/all", getAllUsers);

module.exports = router;