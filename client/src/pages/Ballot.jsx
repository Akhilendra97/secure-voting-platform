import { useEffect, useState, useRef } from "react";
import API from "../services/api";
import { motion as Motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import Loader from "../components/Loader";

function Ballot() {
  const [candidates, setCandidates] = useState([]);
  const [selected, setSelected] = useState(null);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get("/candidate/all");
        setCandidates(res.data.candidates || res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const confirmVote = async () => {
    try {
      await API.post("/vote/cast", {
        candidate_id: selected.candidate_id,
      });

      toast.success("Vote Cast Successfully 🎉");
      setSelected(null);
      setProgress(0);
      navigate("/dashboard");

    } catch (err) {
      toast.error(err.response?.data?.message || "❌ Vote Failed");
      setSelected(null);
      setProgress(0);
    }
  };

  // 🔥 HOLD SYSTEM (DESKTOP + MOBILE)
  const handleHoldStart = () => {
    let value = 0;

    intervalRef.current = setInterval(() => {
      value += 5;
      setProgress(value);

      if (value >= 100) {
        clearInterval(intervalRef.current);
        confirmVote();
      }
    }, 100);
  };

  const handleHoldEnd = () => {
    clearInterval(intervalRef.current);
    setProgress(0);
  };

  if (loading) return <Loader />;

  return (
    <div
      className="min-h-screen pt-24 text-white bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://media.istockphoto.com/id/1710661883/photo/online-voting-in-the-ballot-box.jpg?s=612x612&w=0&k=20&c=D9y8w62Kd29fkvRX3E-xU6CGMqorB4RBWG0BIrmRUM8=')",
      }}
    >
      {/* 🔥 OVERLAY */}
      <div className="absolute inset-0 bg-black/60"></div>

      <div className="relative z-10 px-6 py-10">

        {/* 🔥 HEADER FIX */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold">
            🗳 Electronic Voting Machine
          </h1>
          <p className="text-gray-300 mt-2">
            Press and hold to securely cast your vote
          </p>
        </div>

        {/* 🔥 GRID FIX */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">

          {candidates.map((c) => (
            <Motion.div
              key={c.candidate_id}
              whileHover={{ scale: 1.05 }}
              className="bg-white/5 backdrop-blur-xl border border-white/10 
              p-6 rounded-2xl flex items-center justify-between 
              shadow-[0_0_25px_rgba(0,255,200,0.15)] 
              hover:shadow-[0_0_40px_rgba(34,197,94,0.6)] 
              transition duration-300"
            >

              <div className="flex items-center gap-4">

                {/* 🔥 IMAGE FIX */}
                <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-cyan-400 shadow-lg">
                  <img
                    src={c.candidate_image_url}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div>
                  <h2 className="font-bold text-lg">{c.name}</h2>

                  {/* 🔥 PARTY FIX */}
                  <p className="text-gray-400 text-sm">
                    {c.party || c.party_name || "Party"}
                  </p>
                </div>
              </div>

              {/* 🔥 BUTTON FIX */}
              <button
                onClick={() => setSelected(c)}
                className="bg-green-500 hover:bg-green-600 
                px-6 py-2 rounded-full text-sm font-semibold 
                shadow-[0_0_15px_rgba(34,197,94,0.7)] 
                hover:scale-105 transition"
              >
                Vote
              </button>

            </Motion.div>
          ))}

        </div>
      </div>

      {/* 🔥 MODAL */}
      {selected && (
        <div className="fixed inset-0 flex items-center justify-center bg-black/90 z-50">

          <div className="bg-white/5 backdrop-blur-xl border border-white/10 p-10 rounded-xl text-center">

            <h2 className="text-xl mb-4 text-cyan-300">
              Hold to Confirm Vote
            </h2>

            <p className="mb-6">
              Voting for <b>{selected.name}</b>
            </p>

            {/* 🔥 HOLD BUTTON (MOBILE FIX INCLUDED) */}
            <div
              onMouseDown={handleHoldStart}
              onMouseUp={handleHoldEnd}
              onMouseLeave={handleHoldEnd}
              onTouchStart={handleHoldStart}
              onTouchEnd={handleHoldEnd}
              className="w-40 h-40 mx-auto rounded-full border-4 border-green-500 flex items-center justify-center relative cursor-pointer"
            >

              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(#22c55e ${progress}%, transparent ${progress}%)`,
                }}
              />

              <span className="relative z-10 font-bold text-lg">
                {progress > 0 ? `${progress}%` : "Hold"}
              </span>

            </div>

            <button
              onClick={() => setSelected(null)}
              className="mt-6 text-gray-400 hover:text-white"
            >
              Cancel
            </button>

          </div>

        </div>
      )}
    </div>
  );
}

export default Ballot;