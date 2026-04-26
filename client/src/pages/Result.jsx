import { useEffect, useState } from "react";
import API from "../services/api";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis
} from "recharts";

const COLORS = ["#22c55e", "#06b6d4", "#f59e0b", "#ef4444"];

function Result() {
  const [votes, setVotes] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [winner, setWinner] = useState(null);
  const [ledgerValid, setLedgerValid] = useState(null);
  const [loading, setLoading] = useState(true);
  const [turnout, setTurnout] = useState(0);

  useEffect(() => {
    let isFirstLoad = true;

    const load = async () => {
      try {
        const res = await API.get("/candidate/all");

        const candidates = res.data?.candidates || [];

        // ✅ FIX: ensure vote_count always valid
        const safeCandidates = candidates.map(c => ({
          ...c,
          vote_count: Number(c.vote_count) || 0
        }));

        setVotes(safeCandidates);

        const total = safeCandidates.reduce(
          (sum, c) => sum + c.vote_count,
          0
        );

        setTotalVotes(total);

        const totalUsers = res.data?.totalVoters || 0;

        const percent = totalUsers
          ? ((total / totalUsers) * 100).toFixed(1)
          : 0;

        setTurnout(percent);

        if (safeCandidates.length > 0) {
          const top = safeCandidates.reduce((a, b) =>
            a.vote_count > b.vote_count ? a : b
          );
          setWinner(top);
        } else {
          setWinner(null);
        }

      } catch (err) {
        console.error("❌ RESULT ERROR:", err);
      } finally {
        if (isFirstLoad) {
          setLoading(false);
          isFirstLoad = false;
        }
      }
    };

    load();
    const interval = setInterval(load, 4000);
    return () => clearInterval(interval);
  }, []);

  const validateLedger = async () => {
    try {
      const res = await API.get("/admin/validate-ledger");
      setLedgerValid(res.data.ledgerValid);
    } catch (err) {
      console.error(err);
    }
  };

  const sortedVotes = [...votes].sort(
    (a, b) => (b.vote_count || 0) - (a.vote_count || 0)
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white">
        Loading Results...
      </div>
    );
  }

  return (
    <div
      className="min-h-screen text-white bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://i0.wp.com/www.bailiwickexpress.com/wp-content/uploads/2026/03/election-vote-purple-1.jpg?fit=780%2C439&quality=89&ssl=1')",
      }}
    >
      <div className="absolute inset-0 bg-black/85"></div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 pt-16 py-8">

        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold">⚡ Election War Room</h1>
          <p className="text-gray-400 mt-2">
            Real-time analytics & control panel
          </p>
        </div>

        <div className="text-center mb-8 text-green-400 text-sm">
          🟢 Live Voting Active • Auto updating
        </div>

        {/* 🏆 WINNER */}
        <div className="flex justify-center mb-12">
          <div className="relative p-8 rounded-full bg-white/5 backdrop-blur-xl border border-white/10">
            <div className="absolute inset-0 rounded-full border-2 border-green-400 animate-ping opacity-30"></div>

            <div className="text-center relative z-10">
              <h2 className="text-gray-400 mb-2">🏆 Leading Now</h2>

              <h1 className="text-4xl font-bold text-green-400">
                {winner?.name || "N/A"}
              </h1>

              <p className="text-gray-400 mt-2">
                Votes: {winner?.vote_count || 0}
              </p>
            </div>
          </div>
        </div>

        {/* 📊 STATS */}
        <div className="grid md:grid-cols-4 gap-6 mb-12 max-w-6xl mx-auto">

          <Card title="Total Votes" value={totalVotes} color="text-green-400" />
          <Card title="Turnout %" value={`${turnout}%`} color="text-blue-400" />
          <Card
            title="Blockchain Status"
            value={
              ledgerValid === null
                ? "Not Checked"
                : ledgerValid
                ? "✅ Secure"
                : "❌ Tampered"
            }
            color="text-cyan-400"
          />
          <Card title="Candidates" value={votes.length} color="text-yellow-400" />

        </div>

        {/* 📊 CHARTS */}
        <div className="grid md:grid-cols-2 gap-10 mb-12 max-w-6xl mx-auto">

          <div className="glass-card p-6 rounded-xl">
            <h3 className="mb-4 text-center text-gray-300">Vote Distribution</h3>
            <div className="flex justify-center">
              <PieChart width={300} height={260}>
                <Pie
                  data={votes}
                  dataKey="vote_count"
                  nameKey="name"
                  outerRadius={90}
                >
                  {votes.map((entry, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </div>
          </div>

          <div className="glass-card p-6 rounded-xl">
            <h3 className="mb-4 text-center text-gray-300">Candidate Performance</h3>
            <BarChart width={400} height={260} data={votes}>
              <XAxis
                dataKey="name"
                interval={0}   // ✅ FIX: show all candidates
                tick={{ fill: "#fff", fontSize: 12 }}
              />
              <YAxis tick={{ fill: "#fff" }} />
              <Tooltip />
              <Bar dataKey="vote_count" fill="#22c55e" radius={[6,6,0,0]} />
            </BarChart>
          </div>

        </div>

        {/* 🏅 LEADERBOARD */}
        <div className="max-w-4xl mx-auto mb-12">
          <h3 className="text-center mb-4 text-gray-300">🏅 Leaderboard</h3>

          {sortedVotes.map((c, i) => (
            <div key={i} className="flex justify-between bg-white/5 p-3 mb-2 rounded">
              <span>{i + 1}. {c.name}</span>
              <span>{c.vote_count || 0} votes</span>
            </div>
          ))}
        </div>

        {/* SYSTEM STATUS */}
        <div className="grid md:grid-cols-3 gap-4 mb-10 text-center max-w-4xl mx-auto">
          <div className="glass-card p-4 rounded-lg">🔐 Blockchain Secure</div>
          <div className="glass-card p-4 rounded-lg">⚡ Server Running</div>
          <div className="glass-card p-4 rounded-lg">👥 Live Voters</div>
        </div>

        <div className="text-center">
          <button
            onClick={validateLedger}
            className="bg-red-500 px-6 py-3 rounded-lg font-semibold hover:bg-red-600 shadow-lg"
          >
            🔐 Validate Blockchain
          </button>
        </div>

      </div>
    </div>
  );
}

function Card({ title, value, color }) {
  return (
    <div className="glass-card p-6 rounded-xl text-center">
      <h2 className="text-gray-400 mb-1">{title}</h2>
      <p className={`text-2xl font-bold ${color}`}>
        {value}
      </p>
    </div>
  );
}

export default Result;