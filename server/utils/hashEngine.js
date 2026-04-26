const crypto = require('crypto');

function generateHash(voter_id, candidate_id, previous_hash) {
    const data = `${voter_id}-${candidate_id}-${previous_hash}`;
    return crypto.createHash('sha256').update(data).digest('hex');
}

module.exports = { generateHash };