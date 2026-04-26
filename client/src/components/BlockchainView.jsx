import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import {
  PieChart, Pie, Cell, Tooltip,
  BarChart, Bar, XAxis, YAxis
} from "recharts";
import BlockchainView from "../components/BlockchainView";

const COLORS = ["#22c55e", "#06b6d4", "#f59e0b", "#ef4444"];

function AdminPanel() {
  const [votes, setVotes] = useState([]);
  const [totalVotes, setTotalVotes] = useState(0);
  const [winner, setWinner] = useState(null);
  const [ledgerValid, setLedgerValid] = useState(null);

  const ledgerRef = useRef();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/candidate/all");

        const candidates = res.data.candidates || res.data;

        setVotes(candidates);

        const total = candidates.reduce(
          (sum, c) => sum + (c.vote_count || 0),
          0
        );
        setTotalVotes(total);

        const top = candidates.reduce((a, b) =>
          a.vote_count > b.vote_count ? a : b
        );
        setWinner(top);

      } catch (err) {
        console.error(err);
      }
    };

    load();
  }, []);

  const validateLedger = async () => {
    const res = await API.get("/admin/validate-ledger");
    setLedgerValid(res.data.ledgerValid);
  };

  return (
    <div
      className="min-h-screen text-white bg-cover bg-center relative overflow-y-auto"
      style={{
        backgroundImage:
          "url('https://i0.wp.com/www.bailiwickexpress.com/wp-content/uploads/2026/03/election-vote-purple-1.jpg?fit=780%2C439&quality=89&ssl=1')",
      }}
    >

      <div className="absolute inset-0 bg-black/80"></div>

      <div className="relative z-10 p-8 max-w-7xl mx-auto">

        {/* HEADER */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold">
            ⚡ Election War Room
          </h1>
          <p className="text-gray-400 mt-2">
            Real-time analytics & control panel
          </p>
        </div>

        {/* STATS */}
        <div className="grid md:grid-cols-3 gap-6 mb-10">

          <div className="backdrop-blur-xl border border-white/10 p-6 rounded-xl text-center bg-white/5">
            <h2 className="text-gray-400">Total Votes</h2>
            <p className="text-3xl font-bold text-green-400">
              {totalVotes}
            </p>
          </div>

          <div className="backdrop-blur-xl border border-white/10 p-6 rounded-xl text-center bg-white/5">
            <h2 className="text-gray-400">Leading Candidate</h2>
            <p className="text-xl font-bold text-yellow-400">
              {winner?.name || "N/A"}
            </p>
          </div>

          <div className="backdrop-blur-xl border border-white/10 p-6 rounded-xl text-center bg-white/5">
            <h2 className="text-gray-400">Blockchain Status</h2>
            <p className="text-xl font-bold">
              {ledgerValid === null
                ? "Not Checked"
                : ledgerValid
                ? "✅ Secure"
                : "❌ Tampered"}
            </p>
          </div>

        </div>

        {/* CHARTS */}
        <div className="grid md:grid-cols-2 gap-10">

          <div className="backdrop-blur-xl border border-white/10 p-6 rounded-xl bg-white/5">
            <h3 className="text-center mb-4 text-gray-300">
              Vote Distribution
            </h3>

            <PieChart width={350} height={300}>
              <Pie data={votes} dataKey="vote_count" nameKey="name" outerRadius={100}>
                {votes.map((entry, index) => (
                  <Cell key={index} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </div>

          <div className="backdrop-blur-xl border border-white/10 p-6 rounded-xl bg-white/5">
            <h3 className="text-center mb-4 text-gray-300">
              Candidate Performance
            </h3>

            <BarChart width={400} height={300} data={votes}>
              <XAxis dataKey="name" tick={{ fill: "#fff", fontSize: 12 }} />
              <YAxis tick={{ fill: "#fff" }} />
              <Tooltip />
              <Bar dataKey="vote_count" fill="#22c55e" />
            </BarChart>
          </div>

        </div>

        {/* ACTION */}
        <div className="mt-10 text-center">
          <button
            onClick={validateLedger}
            className="bg-red-500 px-6 py-3 rounded-lg font-semibold hover:bg-red-600 transition"
          >
            Validate Blockchain
          </button>
        </div>

        {/* CLICKABLE */}
        <div className="mt-10 text-center">
          <button
            onClick={() =>
              ledgerRef.current?.scrollIntoView({
                behavior: "smooth"
              })
            }
            className="text-cyan-400 underline hover:text-cyan-300"
          >
            🔗 View Blockchain Ledger
          </button>
        </div>

        {/* LEDGER */}
        <div ref={ledgerRef} className="mt-16">
          <BlockchainView />
        </div>

      </div>
    </div>
  );
}

export default AdminPanel;