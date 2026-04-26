const pool = require("../config/db");

exports.getAllCandidates = async (req, res) => {
  try {

    const [candidates] = await pool.query(`
      SELECT 
        c.candidate_id,
        c.name,
        c.party,
        c.candidate_image_url,
        COUNT(v.vote_id) AS vote_count
      FROM Candidates c
      LEFT JOIN Votes v 
      ON c.candidate_id = v.candidate_id
      GROUP BY c.candidate_id
    `);

    const [users] = await pool.query(
      "SELECT COUNT(*) as total FROM Users WHERE status='approved'"
    );

    res.json({
      candidates,
      totalVoters: users[0].total
    });

  } catch (err) {
    console.error("❌ Candidate API Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};