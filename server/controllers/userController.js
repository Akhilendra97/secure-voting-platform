const pool = require("../config/db");

// GET ALL USERS
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query("SELECT * FROM Users");
    res.json(users);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};