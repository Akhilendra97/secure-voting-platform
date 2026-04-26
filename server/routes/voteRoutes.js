const express = require("express");
const router = express.Router();

const voteController = require("../controllers/voteController");
const auth = require("../middleware/auth");

// 🔐 PROTECTED ROUTE
router.post("/cast", auth, voteController.castVote);

module.exports = router;