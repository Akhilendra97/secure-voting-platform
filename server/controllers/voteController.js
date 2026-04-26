const pool = require('../config/db');
const { generateHash } = require('../utils/hashEngine');

exports.castVote = async (req, res) => {
    const { candidate_id } = req.body;
    const voter_id = req.user.voter_id;

    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        // 🔒 Lock user row
        const [user] = await connection.query(
            'SELECT * FROM Users WHERE voter_id = ? FOR UPDATE',
            [voter_id]
        );

        if (user.length === 0) {
            throw new Error('User not found');
        }

        if (user[0].has_voted) {
            return res.status(400).json({ message: 'User has already voted' });
        }

        // ✅ CHECK CANDIDATE EXISTS (🔥 IMPORTANT FIX)
        const [candidate] = await connection.query(
            'SELECT * FROM Candidates WHERE candidate_id = ?',
            [candidate_id]
        );

        if (candidate.length === 0) {
            throw new Error('Candidate not found');
        }

        // 🔗 Get previous hash (GENESIS SAFE)
        const [lastVote] = await connection.query(
            'SELECT vote_hash FROM Votes ORDER BY vote_id DESC LIMIT 1'
        );

        const previousHash =
            lastVote.length > 0
                ? lastVote[0].vote_hash
                : 'GENESIS_HASH';

        // 🔐 Generate new hash
        const voteHash = generateHash(
            voter_id,
            candidate_id,
            previousHash
        );

        // 🗳 Insert vote
        await connection.query(
            `INSERT INTO Votes 
            (candidate_id, voter_id, vote_hash, previous_vote_hash) 
            VALUES (?, ?, ?, ?)`,
            [candidate_id, voter_id, voteHash, previousHash]
        );

        // ⚠️ KEEP THIS (only if column exists)
        try {
            await connection.query(
                'UPDATE Candidates SET vote_count = vote_count + 1 WHERE candidate_id = ?',
                [candidate_id]
            );
        } catch (e) {
            // ignore if column not present
        }

        // 🚫 Mark user as voted
        await connection.query(
            'UPDATE Users SET has_voted = TRUE WHERE voter_id = ?',
            [voter_id]
        );

        await connection.commit();

        res.json({
            message: 'Vote cast successfully',
            voteHash
        });

    } catch (err) {
        await connection.rollback();

        console.error("❌ VOTE ERROR:", err.message);

        // 🔥 PROPER ERROR RESPONSE
        if (err.message === 'User has already voted') {
            return res.status(400).json({ message: err.message });
        }

        if (err.message === 'User not found') {
            return res.status(404).json({ message: err.message });
        }

        if (err.message === 'Candidate not found') {
            return res.status(404).json({ message: err.message });
        }

        res.status(500).json({ message: 'Vote failed' });
    } finally {
        connection.release();
    }
};