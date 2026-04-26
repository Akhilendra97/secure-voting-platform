import { Routes, Route, useLocation, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Ballot from "./pages/Ballot";
import Result from "./pages/Result";
import Navbar from "./components/Navbar";
import HistoryTimeline from "./components/HistoryTimeline";
import BlockchainPage from "./pages/BlockchainView";
import Admin from "./pages/Admin";

function App() {
  const location = useLocation();

  // 🔐 GET ROLE FROM TOKEN
  const getRole = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload.role;
    } catch {
      return null;
    }
  };

  const role = getRole();

  // ❌ Hide navbar on auth pages
  const hideNavbar =
    location.pathname === "/" ||
    location.pathname === "/login" ||
    location.pathname === "/register";

  return (
    <>
      {!hideNavbar && <Navbar />}

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* ✅ USER ROUTES */}
        <Route
          path="/dashboard"
          element={role === "user" ? <Dashboard /> : <Navigate to="/" />}
        />
        <Route
          path="/ballot"
          element={role === "user" ? <Ballot /> : <Navigate to="/" />}
        />
        <Route
          path="/result"
          element={role === "user" ? <Result /> : <Navigate to="/" />}
        />
        <Route
          path="/history"
          element={role === "user" ? <HistoryTimeline /> : <Navigate to="/" />}
        />
        <Route
          path="/blockchain"
          element={role === "user" ? <BlockchainPage /> : <Navigate to="/" />}
        />

        {/* ✅ ADMIN ROUTE */}
        <Route
          path="/admin"
          element={role === "admin" ? <Admin /> : <Navigate to="/" />}
        />
      </Routes>
    </>
  );
}

export default App;