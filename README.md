**🗳️ Secure Online Voting Platform**

A full-stack Secure Online Voting System built with modern web technologies, designed to ensure transparency, security, and real-time election monitoring using blockchain-inspired principles.

---
**🚀 Overview**

This project simulates a real-world digital voting system where users can:

- Register using Aadhaar-based verification
- Get approved by admin before voting
- Cast vote securely (only once)
- View real-time election results
- Ensure vote integrity using blockchain-style hashing

The system prevents:

- ❌ Double voting
- ❌ Data tampering
- ❌ Unauthorized access

---

**🧠 Key Features**

**👤 User Features**

- Secure Registration (Aadhaar-based)
- Login with authentication
- Vote casting (one vote per user)
- Real-time dashboard
- Live election statistics

**🛡️ Admin Features**

- Admin login panel
- Approve / Reject users
- Delete users safely
- Monitor voting activity
- Validate blockchain ledger
- Reset election system (Demo Mode)

**🔐 Security Features**

- JWT Authentication
- Password hashing
- Row-level locking ("FOR UPDATE")
- Blockchain-style vote hashing:
  - Each vote linked with previous vote
- Prevention of double voting

---

**🏗️ Tech Stack**

💻 Frontend

- React.js
- Tailwind CSS
- Framer Motion
- Recharts (for analytics)

⚙️ Backend

- Node.js
- Express.js
- MySQL (mysql2)

🔒 Security

- JWT (Authentication)
- Crypto (Hashing)
- Transaction locking (MySQL)

---

**📂 Project Structure**

secure-voting-platform/
│
├── client/                 # React Frontend
│   ├── src/
│   │   ├── pages/          # Home, Dashboard, Result, Ballot
│   │   ├── components/     # Loader, UI components
│   │   ├── services/       # API calls
│   │   └── App.jsx
│
├── server/                 # Node Backend
│   ├── controllers/        # Business logic
│   ├── routes/             # API routes
│   ├── config/             # DB config
│   ├── utils/              # Hash engine
│   └── server.js
│
└── README.md

---

**⚙️ Installation & Setup**

🔹 1. Clone the Repository

git clone <your-repo-link>
cd secure-voting-platform

---

🔹 2. Backend Setup

cd server
npm install

Create ".env" file:

PORT=5000
JWT_SECRET=your_secret_key
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=secure_voting

Run backend:

node server.js

---

🔹 3. Frontend Setup

Open new terminal:

cd client
npm install
npm run dev

Frontend runs on:

http://localhost:5173

---

🗄️ Database Setup

- Import the provided SQL file
- Creates tables:
  - Users
  - Candidates
  - Votes
  - Admins
  - Govt_Aadhar_DB

Important:

- Genesis block is inserted for blockchain chain start
- Foreign keys ensure data integrity

---

**🔁 Voting Flow**

1. User registers → status = "pending"
2. Admin approves user
3. User logs in
4. User casts vote:
   - DB transaction starts
   - User locked ("FOR UPDATE")
   - Previous vote hash fetched
   - New hash generated
   - Vote stored
   - User marked as voted
5. Results update in real-time

---

🔗 Blockchain Concept Used

Each vote contains:

- "vote_hash"
- "previous_vote_hash"

Hash formula:

hash = SHA256(voter_id + candidate_id + previous_hash)

This ensures:

- Any tampering breaks the chain
- Ledger validation detects corruption

---

**📊 Real-Time Features**

- Dashboard auto updates every few seconds
- Results show:
  - Total votes
  - Turnout %
  - Winner
  - Leaderboard
  - Graph analytics

---

**🧪 Admin Controls**

- Validate blockchain integrity
- View all users
- Approve / Reject requests
- Delete users (cascade safe)
- Reset election data

---

**⚠️ Known Limitations**

- Uses polling (not WebSockets)
- Admin login currently static (can be improved)
- No OTP/biometric real verification (simulated)

---

**🔮 Future Enhancements**

- Socket.io real-time updates
- Biometric/Aadhaar API integration
- Multi-election support
- Mobile app version
- Role-based dashboards
- Advanced analytics

---

**🎯 Use Cases**

- College voting systems
- Demo for blockchain-based systems
- Academic projects
- Secure polling simulation

---

**👨‍💻 Author**

Developed as a full-stack project demonstrating:

- Secure system design
- Database integrity
- Real-time analytics
- Blockchain-inspired logic

---

**⭐ Final Note**

This project demonstrates how modern technologies can be used to build a secure, transparent, and scalable voting system.

«“Your Vote. Your Power.”»

---