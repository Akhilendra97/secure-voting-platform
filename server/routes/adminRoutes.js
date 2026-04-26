const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// ✅ ADMIN MIDDLEWARE
const { verifyAdmin } = require('../middleware/authMiddleware');

// ================= ROUTES =================

// 🔐 Blockchain validation
router.get('/validate-ledger', verifyAdmin, adminController.validateLedger);

// 👥 All users 
router.get('/users', verifyAdmin, adminController.getAllUsers);

// ❌ Delete user
router.delete('/user/:aadhar', verifyAdmin, adminController.deleteUser);

// 🟡 Pending users
router.get('/pending-users', verifyAdmin, adminController.getPendingUsers);

// ✅ Approve (AADHAR BASED)
router.put('/approve-user/:aadhar', verifyAdmin, adminController.approveUser);

// ❌ Reject (AADHAR BASED)
router.put('/reject-user/:aadhar', verifyAdmin, adminController.rejectUser);

// ================= NEW FEATURES =================

// 📊 Dashboard stats
router.get('/stats', verifyAdmin, adminController.getDashboardStats);

// 🗳 Candidate-wise votes (privacy safe)
router.get('/candidate-votes', verifyAdmin, adminController.getCandidateVotes);

// 👥 Voting status (who voted, not whom)
router.get('/voting-status', verifyAdmin, adminController.getVotingStatus);

router.delete('/reset-election', verifyAdmin, adminController.resetElection);
module.exports = router;