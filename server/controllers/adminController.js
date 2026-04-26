const pool = require('../config/db');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');


// ================= ADMIN LOGIN =================
exports.adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (email !== "admin@gmail.com" || password !== "admin123") {
      return res.status(401).json({ message: "Invalid admin credentials" });
    }

    const token = jwt.sign(
      {
        role: "admin",
        email: email
      },
      process.env.JWT_SECRET || "secret",
      { expiresIn: "1d" }
    );

    res.json({ token });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


// ================= VALIDATE LEDGER =================
exports.validateLedger = async (req, res) => {
  try {
    const [votes] = await pool.query(
      'SELECT * FROM Votes ORDER BY vote_id ASC'
    );

    let isValid = true;

    for (let i = 1; i < votes.length; i++) {
      const current = votes[i];
      const previous = votes[i - 1];

      if (!current.voter_id) continue;

      const recalculatedHash = crypto
        .createHash('sha256')
        .update(`${current.voter_id}-${current.candidate_id}-${previous.vote_hash}`)
        .digest('hex');

      if (
        current.previous_vote_hash !== previous.vote_hash ||
        current.vote_hash !== recalculatedHash
      ) {
        isValid = false;
        break;
      }
    }

    res.json({ ledgerValid: isValid });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};


// ================= ADMIN USER CONTROL =================

// 🔥 GET ALL USERS
exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query(
      `SELECT voter_id, aadhar_id, voter_id_card, date_of_birth,
              has_voted, status, rejection_reason, created_at 
       FROM Users 
       ORDER BY created_at DESC`
    );

    res.json({ users });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


// 🗑 DELETE USER (🔥 FIXED WITH CASCADE SAFE DELETE)
exports.deleteUser = async (req, res) => {
  try {
    const { aadhar } = req.params;

    await pool.query(
      "DELETE FROM Votes WHERE voter_id = (SELECT voter_id FROM Users WHERE aadhar_id=?)",
      [aadhar]
    );

    const [result] = await pool.query(
      "DELETE FROM Users WHERE aadhar_id = ?",
      [aadhar]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User deleted successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


// ================= STEP 1.4 =================

// GET PENDING USERS
exports.getPendingUsers = async (req, res) => {
  try {
    const [users] = await pool.query(
      `SELECT aadhar_id, voter_id_card, date_of_birth, created_at 
       FROM Users 
       WHERE status = 'pending'
       ORDER BY created_at DESC`
    );

    res.json({ users });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


// ================= STEP 1.5 =================

// ✅ APPROVE USER
exports.approveUser = async (req, res) => {
  try {
    const { aadhar } = req.params;

    const [result] = await pool.query(
      "UPDATE Users SET status = 'approved', rejection_reason = NULL WHERE aadhar_id = ?",
      [aadhar]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User approved successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


// ❌ REJECT USER WITH REASON
exports.rejectUser = async (req, res) => {
  try {
    const { aadhar } = req.params;
    const { reason } = req.body;

    if (!reason || reason.trim() === "") {
      return res.status(400).json({ message: "Rejection reason required" });
    }

    const [result] = await pool.query(
      `UPDATE Users 
       SET status = 'rejected', rejection_reason = ? 
       WHERE aadhar_id = ?`,
      [reason, aadhar]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ message: "User rejected with reason" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};


// ================= STEP 2 =================
// 📊 DASHBOARD STATS (🔥 FIXED GENESIS ISSUE)

exports.getDashboardStats = async (req, res) => {
  try {
    const [[totalUsers]] = await pool.query(
      "SELECT COUNT(*) as total FROM Users"
    );

    const [[approvedUsers]] = await pool.query(
      "SELECT COUNT(*) as total FROM Users WHERE status='approved'"
    );

    const [[pendingUsers]] = await pool.query(
      "SELECT COUNT(*) as total FROM Users WHERE status='pending'"
    );

    const [[rejectedUsers]] = await pool.query(
      "SELECT COUNT(*) as total FROM Users WHERE status='rejected'"
    );

    // 🔥 IGNORE GENESIS BLOCK
    const [[totalVotes]] = await pool.query(
      "SELECT COUNT(*) as total FROM Votes WHERE voter_id IS NOT NULL"
    );

    res.json({
      totalUsers: totalUsers.total,
      approvedUsers: approvedUsers.total,
      pendingUsers: pendingUsers.total,
      rejectedUsers: rejectedUsers.total,
      totalVotes: totalVotes.total
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================= STEP 3 =================
// 🗳 CANDIDATE WISE VOTES (GENESIS FIX)

exports.getCandidateVotes = async (req, res) => {
  try {
    const [votes] = await pool.query(`
      SELECT 
        c.candidate_id,
        c.name,
        COUNT(v.vote_id) as votes
      FROM Candidates c
      LEFT JOIN Votes v 
      ON c.candidate_id = v.candidate_id
      AND v.voter_id IS NOT NULL
      GROUP BY c.candidate_id
    `);

    res.json({ votes });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================= STEP 4 =================
// 👥 VOTING STATUS

exports.getVotingStatus = async (req, res) => {
  try {
    const [users] = await pool.query(
      `SELECT aadhar_id, voter_id, has_voted 
       FROM Users 
       WHERE status='approved'`
    );

    res.json({ users });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// ================= RESET ELECTION =================
// 🔥🔥🔥 FINAL FIX

exports.resetElection = async (req, res) => {
  try {
    console.log("🔥 RESET API HIT");

    // ❌ DO NOT DELETE GENESIS
    await pool.query("DELETE FROM Votes WHERE voter_id IS NOT NULL");

    // 🔥 RESET USERS
    await pool.query("UPDATE Users SET has_voted = 0");

    res.json({ message: "Election reset successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};