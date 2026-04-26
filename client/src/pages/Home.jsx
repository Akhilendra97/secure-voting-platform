import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../services/api";

function Home() {
  const navigate = useNavigate();
  const [turnout, setTurnout] = useState(0);
  const [votes, setVotes] = useState(0);
  const [candidates, setCandidates] = useState([]);

  useEffect(() => {
  const loadData = async () => {
    try {
      // ✅ PUBLIC API ONLY
      const res = await API.get("/candidate/all");

      const data = res.data?.candidates || [];
      const totalUsers = res.data?.totalVoters || 0;

      console.log("🔥 HOME DATA:", res.data);

      setCandidates(data);

      // 🔥 TOTAL VOTES (FROM CANDIDATES)
      const totalVotes = data.reduce(
        (sum, c) => sum + (c.vote_count || 0),
        0
      );

      setVotes(totalVotes);

      // 🔥 TURNOUT
      const percent = totalUsers
        ? Math.floor((totalVotes / totalUsers) * 100)
        : 0;

      setTurnout(percent);

    } catch (err) {
      console.error("❌ HOME ERROR:", err);
    }
  };

  loadData();
  const interval = setInterval(loadData, 4000);
  return () => clearInterval(interval);
}, []);

  useEffect(() => {
    const handleBack = () => {
      window.history.pushState(null, "", window.location.pathname);
    };
    window.history.pushState(null, "", window.location.pathname);
    window.addEventListener("popstate", handleBack);
    return () => window.removeEventListener("popstate", handleBack);
  }, []);

  return (
    <div
      className="h-screen bg-cover bg-center text-white relative"
      style={{
        backgroundImage:
          "url('https://images.unsplash.com/photo-1529107386315-e1a2ed48a620')",
      }}
    >
      <div className="absolute inset-0 bg-black/70"></div>

      <div className="relative z-10 h-full flex flex-col px-12 py-6">

        {/* HEADER */}
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-medium tracking-wide">
             Election Commission of India
          </h1>

          <div className="flex gap-3">
            <button
              onClick={() => navigate("/login")}
              className="px-4 py-2 text-sm border border-white/30 rounded-md hover:bg-white/10"
            >
              Login
            </button>
            <button
              onClick={() => navigate("/register")}
              className="px-4 py-2 text-sm bg-orange-500 rounded-md"
            >
              Register
            </button>
          </div>
        </div>

        {/* MAIN */}
        <div className="flex flex-grow items-center justify-between">

          {/* LEFT */}
          <div className="max-w-lg space-y-6">
            <h2 className="text-5xl font-semibold leading-tight">
              Secure Digital Voting Platform
            </h2>

            <p className="text-gray-300 text-lg">
              Transparent, fast and secure elections powered by modern
              infrastructure.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="px-8 py-3 bg-green-600 rounded-md text-lg"
            >
              🗳 Cast Your Vote
            </button>

            {/* STATUS */}
            <div className="text-sm text-green-400">
              ● Elections are currently LIVE
            </div>
          </div>

          {/* CENTER STATS */}
          <div className="flex flex-col gap-10 items-center">

            <div className="text-center">
              <h2 className="text-5xl font-bold text-cyan-400">
                {turnout}%
              </h2>
              <p className="text-gray-400 text-sm">Voter Turnout</p>
            </div>

            <div className="text-center">
              <h2 className="text-5xl font-bold text-green-400">
                {votes}
              </h2>
              <p className="text-gray-400 text-sm">Votes Cast</p>
            </div>

          </div>

          {/* RIGHT PANEL */}
          <div className="w-[280px] space-y-5">

            {/* CANDIDATES */}
            <div>
              <h3 className="text-sm text-gray-400 mb-2">
                Leading Candidates
              </h3>

              {candidates.slice(0, 3).map((c, i) => (
                <div key={i} className="flex items-center gap-3 mb-3">
                  <img
                    src={c.candidate_image_url}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <p className="text-sm">{c.name}</p>
                    <div className="h-1 bg-gray-600 rounded mt-1">
                      <div
                        className="h-full bg-cyan-400"
                        style={{
                          width: `${
                            votes
                              ? (c.vote_count / votes) * 100
                              : 0
                          }%`,
                        }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* INFO */}
            <div className="text-xs text-gray-400 space-y-1">
              <p>🔒 End-to-End Encryption</p>
              <p>⚡ Real-time Counting</p>
              <p>🧾 Blockchain Verified</p>
            </div>

          </div>

        </div>

        {/* FOOTER */}
        <div className="text-center text-xs text-gray-400">
          © 2026 Election Commission of India
        </div>

      </div>
    </div>
  );
}

export default Home;