import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion as Motion } from "framer-motion";
import API from "../services/api";
import Loader from "../components/Loader";

function Dashboard() {
  const [timeLeft, setTimeLeft] = useState(3600);
  const [votes, setVotes] = useState(0);
  const [turnout, setTurnout] = useState(0);
  const [displayVotes, setDisplayVotes] = useState(0);
  const [displayTurnout, setDisplayTurnout] = useState(0);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  // 🔐 AUTH CHECK
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login");
  }, [navigate]);

  // 🔙 BACK BUTTON CONTROL
  useEffect(() => {
    const handleBack = () => {
      const confirmLogout = window.confirm("Do you want to logout?");

      if (confirmLogout) {
        localStorage.removeItem("token");
        navigate("/", { replace: true });
      } else {
        window.history.pushState(null, "", window.location.pathname);
      }
    };

    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", handleBack);

    return () => {
      window.removeEventListener("popstate", handleBack);
    };
  }, [navigate]);

  // ⏱ TIMER
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // 🔥 FIXED DATA FETCH (IMPORTANT)
useEffect(() => {
  const loadData = async () => {
    try {
      setLoading(true);

      // ✅ PUBLIC API (NO ADMIN TOKEN ISSUE)
      const res = await API.get("/candidate/all");

      const candidates = res.data?.candidates || [];

      console.log("🔥 DASHBOARD DATA:", res.data);

      // 🔥 TOTAL VOTES
      const totalVotes = candidates.reduce(
        (sum, c) => sum + (c.vote_count || 0),
        0
      );

      // 🔥 TOTAL USERS
      const totalUsers = res.data?.totalVoters || 0;

      const percent = totalUsers
        ? Math.floor((totalVotes / totalUsers) * 100)
        : 0;

      setVotes(totalVotes);
      setTurnout(percent);

    } catch (err) {
      console.error("❌ DASHBOARD ERROR:", err);
    } finally {
      setLoading(false);
    }
  };

  loadData();
  const interval = setInterval(loadData, 5000);
  return () => clearInterval(interval);
}, []);
  // 🔥 COUNT ANIMATION
  useEffect(() => {
    let v = 0;
    const interval = setInterval(() => {
      v += Math.ceil(votes / 10) || 1;
      if (v >= votes) {
        v = votes;
        clearInterval(interval);
      }
      setDisplayVotes(v);
    }, 40);
    return () => clearInterval(interval);
  }, [votes]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) return;

    const payload = JSON.parse(atob(token.split(".")[1]));

    if (payload.role === "admin") {
      navigate("/admin");
    }
  }, [navigate]);

  useEffect(() => {
    let t = 0;
    const interval = setInterval(() => {
      t += Math.ceil(turnout / 10) || 1;
      if (t >= turnout) {
        t = turnout;
        clearInterval(interval);
      }
      setDisplayTurnout(t);
    }, 40);
    return () => clearInterval(interval);
  }, [turnout]);

  const formatTime = () => {
    const h = Math.floor(timeLeft / 3600);
    const m = Math.floor((timeLeft % 3600) / 60);
    const s = timeLeft % 60;
    return `${h}h ${m}m ${s}s`;
  };

  if (loading) return <Loader />;

  return (
    <div
      className="min-h-screen pt-20 px-4 text-white relative bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://news.northeastern.edu/wp-content/uploads/2024/11/vote_AP_1400.jpg?w=1024')",
      }}
    >
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative z-10">

        <div className="overflow-hidden whitespace-nowrap text-center mb-10">
          <div className="animate-[scroll_18s_linear_infinite] text-green-400 text-sm font-semibold">
            🟢 General Elections 2026 LIVE • 🔐 Secure Blockchain Voting • 🗳️ Cast Your Vote Now • ⚡ Real-Time Results • 🌍 Digital Democracy • ⚡ Your Vote Matters
          </div>
        </div>

        <Motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-card max-w-3xl mx-auto text-center p-8 rounded-3xl mb-12"
        >
          <h2 className="text-gray-400 text-xs tracking-widest mb-2">
            ELECTION COMMISSION OF INDIA
          </h2>

          <h1 className="text-4xl font-bold text-green-400 mb-4">
            Your Vote. Your Power.
          </h1>

          <p className="text-gray-300 text-sm mb-6 leading-relaxed">
            Experience secure, transparent and real-time digital voting powered by modern technology.
          </p>

          <Motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/ballot")}
            className="bg-gradient-to-r from-green-500 to-emerald-600 px-10 py-3 rounded-full text-sm font-semibold shadow-[0_0_25px_rgba(16,185,129,0.6)]"
          >
            🗳️ Vote Now
          </Motion.button>
        </Motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-12">
          <div className="glass-card p-6 rounded-2xl hover:scale-[1.03] transition">
            <h3 className="text-green-400 text-sm font-semibold mb-2">
              Strengthening Democracy
            </h3>
            <p className="text-gray-300 text-sm">
               Every registered citizen plays a vital role in shaping the future of the nation.  
              Your participation ensures a stronger and more inclusive democracy.
            </p>
          </div>

          <div className="glass-card p-6 rounded-2xl hover:scale-[1.03] transition">
            <h3 className="text-cyan-400 text-sm font-semibold mb-2">
              Smart Digital Voting
            </h3>
            <p className="text-gray-300 text-sm">
               Experience lightning-fast vote processing, blockchain security,  
              and complete transparency with real-time election monitoring
            </p>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto text-center mb-12">
          <div className="glass-card p-6 rounded-2xl h-[120px] flex flex-col justify-center">
            <p className="text-gray-400 text-xs">Election Countdown</p>
            <p className="text-yellow-400 font-bold text-lg">{formatTime()}</p>
          </div>

          <div className="glass-card p-6 rounded-2xl h-[120px] flex flex-col justify-center">
            <p className="text-gray-400 text-xs">Total Votes</p>
            <p className="text-green-400 font-bold text-lg">{displayVotes}</p>
          </div>

          <div className="glass-card p-6 rounded-2xl h-[120px] flex flex-col justify-center">
            <p className="text-gray-400 text-xs">Voter Turnout</p>
            <p className="text-cyan-400 font-bold text-lg">{displayTurnout}%</p>
          </div>
        </div>

        <div className="flex justify-center pb-10">
          <button
            onClick={handleLogout}
            className="bg-red-500 hover:bg-red-600 px-6 py-2 rounded-lg text-sm shadow-lg"
          >
            🚪 Logout
          </button>
        </div>

      </div>
    </div>
  );
}

export default Dashboard;