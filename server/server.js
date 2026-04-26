const candidateRoutes = require("./routes/candidateRoutes");
const express = require('express');
const cors = require('cors');
require('dotenv').config();

const authRoutes = require('./routes/authRoutes');
const voteRoutes = require('./routes/voteRoutes');
const adminRoutes = require('./routes/adminRoutes');
const userRoutes = require("./routes/userRoutes");
const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/vote', voteRoutes);
app.use('/api/admin', adminRoutes);
app.use("/api/candidate", candidateRoutes);
app.use("/user",userRoutes);
app.use("/admin", adminRoutes);

app.get('/', (req, res) => {
    res.send('Secure Voting Backend Running 🚀');
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});