const jwt = require("jsonwebtoken");

exports.verifyAdmin = (req, res, next) => {
  try {
    let token = req.headers.authorization;

    // 🔥 FIX 1: Token existence check
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    // 🔥 FIX 2: Bearer format handle safely
    if (token.startsWith("Bearer ")) {
      token = token.split(" ")[1];
    }

    // 🔥 EXTRA SAFETY: empty token check
    if (!token || token === "null" || token === "undefined") {
      return res.status(401).json({ message: "Invalid token format" });
    }

    // 🔥 VERIFY TOKEN
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "secret"
    );

    // 🔥 ROLE CHECK
    if (!decoded || decoded.role !== "admin") {
      return res.status(403).json({ message: "Access denied (Not Admin)" });
    }

    // 🔥 attach admin data
    req.admin = decoded;

    next();

  } catch (err) {
    console.error("Admin Auth Error:", err.message);

    // 🔥 TOKEN EXPIRED HANDLE
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" });
    }

    return res.status(401).json({ message: "Invalid or expired token" });
  }
};