import { useEffect, useState } from "react";
import API from "../services/api";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

function Admin() {
  const [users, setUsers] = useState([]);
  const [pending, setPending] = useState([]);
  const [reason, setReason] = useState({});
  const [stats, setStats] = useState(null);
  const [candidateVotes, setCandidateVotes] = useState([]);

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // ================= LOAD =================

  const loadAll = async () => {
    const res = await API.get("/admin/users");
    setUsers(res.data.users || []);
  };

  const loadPending = async () => {
    const res = await API.get("/admin/pending-users");
    setPending(res.data.users || []);
  };

  const loadStats = async () => {
    const res = await API.get("/admin/stats");
    setStats(res.data || null);
  };

  const loadVotes = async () => {
    const res = await API.get("/admin/candidate-votes");
    setCandidateVotes(res.data.votes || []);
  };

  // ✅ SINGLE CLEAN EFFECT (NO DUPLICATION)
  useEffect(() => {
    const loadData = async () => {
      await loadAll();
      await loadPending();
      await loadStats();
      await loadVotes();
    };

    loadData();

    const interval = setInterval(loadData, 5000);
    return () => clearInterval(interval);
  }, []);
  useEffect(() => {
  const handleBackButton = (event) => {
    event.preventDefault();

    const confirmLogout = window.confirm(
      "Do you want to logout?"
    );

    if (confirmLogout) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    } else {
      window.history.pushState(null, "", window.location.pathname);
    }
  };

  // push state to block back
  window.history.pushState(null, "", window.location.pathname);

  window.addEventListener("popstate", handleBackButton);

  return () => {
    window.removeEventListener("popstate", handleBackButton);
  };
}, []);

  // ================= ACTIONS =================

  const approve = async (aadhar) => {
    await API.put(`/admin/approve-user/${aadhar}`);
    loadAll();
    loadPending();
  };

  const reject = async (aadhar) => {
    await API.put(`/admin/reject-user/${aadhar}`, {
      reason: reason[aadhar] || "Invalid details",
    });
    loadAll();
    loadPending();
  };

  const deleteUser = async (aadhar) => {
    await API.delete(`/admin/user/${aadhar}`);
    loadAll();
  };

  const resetElection = async () => {
    if (!window.confirm("Are you sure? This will delete ALL votes!")) return;

    await API.delete("/admin/reset-election");

    alert("Election Reset Successfully 🔥");

    loadAll();
    loadVotes();
    loadStats();
  };

  // ================= FILTER =================

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.aadhar_id.includes(search) ||
      (u.voter_id_card || "").includes(search);

    const matchFilter =
      filter === "all" ? true : u.status === filter;

    return matchSearch && matchFilter;
  });

  // ================= EXPORT =================

  const exportCSV = () => {
    const csv =
      "Aadhaar,DOB,Status,Voted\n" +
      users
        .map(
          (u) =>
            `${u.aadhar_id},${u.date_of_birth || ""},${u.status},${u.has_voted}`
        )
        .join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
  };

  // ================= CHART =================

  const chartData = {
    labels: candidateVotes.map((c) => `Candidate ${c.candidate_id}`),
    datasets: [
      {
        label: "Votes",
        data: candidateVotes.map((c) => c.votes),
      },
    ],
  };

  return (
    <div
      className="min-h-screen text-white bg-cover bg-center p-6 relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1529107386315-e1a2ed48a620')",
      }}
    >
      {/* 🔥 LOWER OPACITY */}
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10">

        <h1 className="text-3xl font-bold mb-6 text-center">
          🚀 ADMIN PANEL
        </h1>

        {/* ================= STATS ================= */}
        {stats && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-700 p-4 rounded">
              Users: {stats.totalUsers}
            </div>
            <div className="bg-blue-700 p-4 rounded">
              Approved: {stats.approvedUsers}
            </div>
            <div className="bg-yellow-600 p-4 rounded">
              Pending: {stats.pendingUsers}
            </div>
            <div className="bg-purple-700 p-4 rounded">
              Votes: {stats.totalVotes}
            </div>
          </div>
        )}

        {/* RESET BUTTON */}
        <button
          onClick={resetElection}
          className="bg-red-700 px-4 py-2 rounded mb-4"
        >
          🔥 Reset Election
        </button>

        {/* ================= GRAPH ================= */}
        <div className="bg-black/60 p-4 rounded mb-6">
          <h2 className="mb-2">Vote Distribution</h2>
          <Bar data={chartData} />
        </div>

        {/* ================= SEARCH ================= */}
        <div className="flex gap-3 mb-4">
          <input
            placeholder="Search Aadhaar"
            className="p-2 text-black"
            onChange={(e) => setSearch(e.target.value)}
          />

          <select
            onChange={(e) => setFilter(e.target.value)}
            className="text-black p-2"
          >
            <option value="all">All</option>
            <option value="approved">Approved</option>
            <option value="pending">Pending</option>
            <option value="rejected">Rejected</option>
          </select>

          <button
            onClick={exportCSV}
            className="bg-cyan-600 px-3 rounded"
          >
            Export
          </button>
        </div>

        {/* ================= PENDING ================= */}
        <h2 className="text-xl mb-2 text-yellow-400">Pending Requests</h2>

        {pending.map((u, i) => (
          <div key={i} className="bg-black/60 p-3 mb-2 rounded">
            <p>Aadhaar: {u.aadhar_id}</p>
            <p>Voter ID: {u.voter_id_card}</p>
            <p>
              DOB:{" "}
              {u.date_of_birth
                ? new Date(u.date_of_birth).toLocaleDateString("en-IN")
                : "N/A"}
            </p>

            <input
              placeholder="Reason"
              onChange={(e) =>
                setReason({ ...reason, [u.aadhar_id]: e.target.value })
              }
              className="text-black p-1 mt-1"
            />

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => approve(u.aadhar_id)}
                className="bg-green-600 px-2"
              >
                Approve
              </button>

              <button
                onClick={() => reject(u.aadhar_id)}
                className="bg-red-600 px-2"
              >
                Reject
              </button>
            </div>
          </div>
        ))}

        {/* ================= USERS ================= */}
        <h2 className="text-xl mt-6 mb-2 text-blue-400">All Users</h2>

        {filteredUsers.map((u, i) => (
          <div key={i} className="bg-black/60 p-3 mb-2 rounded">
            <p>Aadhaar: {u.aadhar_id}</p>
            <p>
              DOB:{" "}
              {u.date_of_birth
                ? new Date(u.date_of_birth).toLocaleDateString("en-IN")
                : "N/A"}
            </p>
            <p>Status: {u.status}</p>
            <p>Voted: {u.has_voted ? "Yes" : "No"}</p>

            <button
              onClick={() => deleteUser(u.aadhar_id)}
              className="bg-red-600 px-2 mt-2"
            >
              Delete
            </button>
          </div>
        ))}

      </div>
    </div>
  );
}

export default Admin;