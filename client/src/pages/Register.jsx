import { useState, useRef } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Register() {
  const [a1, setA1] = useState("");
  const [a2, setA2] = useState("");
  const [a3, setA3] = useState("");
  const [password, setPassword] = useState("");

  // 🔥 NEW STATES
  const [voterId, setVoterId] = useState("");
  const [dob, setDob] = useState("");

  const input1 = useRef();
  const input2 = useRef();
  const input3 = useRef();
  const dateRef = useRef(); // 🔥 NEW (for icon click)

  const navigate = useNavigate();

  const handleRegister = async () => {
    const aadhar = a1 + a2 + a3;

    if (aadhar.length !== 12) {
      alert("Enter valid Aadhaar");
      return;
    }

    if (!voterId || !dob || !password) {
      alert("All fields required");
      return;
    }

    try {
      const res = await API.post("/auth/register", {
        aadhar_id: aadhar,
        password,
        voter_id_card: voterId,
        date_of_birth: dob,
      });

      alert(res.data.message);
      navigate("/login");

    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div
      className="min-h-screen flex text-white bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://media.assettype.com/theleaflet%2Fimport%2Fwp-content%2Fuploads%2F2022%2F05%2FParliament-8.png?w=1024&auto=format%2Ccompress&fit=max')"
      }}
    >
      <div className="absolute inset-0 bg-black/40"></div>

      <div className="relative z-10 min-h-screen flex w-full">

        {/* LEFT */}
        <div className="hidden md:flex w-1/2 flex-col justify-center px-16">
          <h1 className="text-4xl font-bold mb-4">
            Join the Democratic Process
          </h1>
          <p className="text-gray-300 mb-6">
            Register securely and participate in India's digital voting system.
          </p>
          <div className="space-y-2 text-gray-200">
            <p>✔ Secure Aadhaar Verification</p>
            <p>✔ Fast Registration Process</p>
            <p>✔ Trusted Digital Infrastructure</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex w-full md:w-1/2 items-center justify-center">

          <div
            className="backdrop-blur-mud border border-white/5 p-8 rounded-xl w-[380px]"
            style={{ background: "rgba(255,255,255,0.02)" }}
          >

            <h2 className="text-2xl font-bold text-center mb-2">
              Voter Registration
            </h2>

            <p className="text-gray-400 text-center mb-6 text-sm">
              Aadhaar Based Registration
            </p>

            {/* Aadhaar */}
            <div className="flex gap-2 mb-4">
              <input
                ref={input1}
                maxLength={4}
                onChange={(e)=>{
                  setA1(e.target.value);
                  if(e.target.value.length===4) input2.current.focus();
                }}
                className="w-1/3 p-3 text-center bg-black/40 rounded"
              />

              <input
                ref={input2}
                maxLength={4}
                onChange={(e)=>{
                  setA2(e.target.value);
                  if(e.target.value.length===4) input3.current.focus();
                }}
                onKeyDown={(e)=>{
                  if(e.key==="Backspace" && a2.length===0) input1.current.focus();
                }}
                className="w-1/3 p-3 text-center bg-black/40 rounded"
              />

              <input
                ref={input3}
                maxLength={4}
                onChange={(e)=>setA3(e.target.value)}
                onKeyDown={(e)=>{
                  if(e.key==="Backspace" && a3.length===0) input2.current.focus();
                }}
                className="w-1/3 p-3 text-center bg-black/40 rounded"
              />
            </div>

            {/* 🔥 VOTER ID */}
            <input
              placeholder="Enter Voter ID"
              onChange={(e)=>setVoterId(e.target.value)}
              className="w-full p-3 mb-3 bg-black/40 rounded"
            />

            {/* 🔥 DOB WITH FULL CLICK FIX */}
            <div className="relative mb-4">
              <input
                ref={dateRef}
                type="date"
                max={new Date().toISOString().split("T")[0]}
                onChange={(e)=>setDob(e.target.value)}
                className="w-full p-3 bg-black/40 rounded pr-10"
              />

              {/* ✅ CLICKABLE ICON */}
              <span
                onClick={() => dateRef.current.showPicker()} // 🔥 MAGIC
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer"
              >
                📅
              </span>
            </div>

            {/* Password */}
            <input
              type="password"
              placeholder="Create Password"
              onChange={(e)=>setPassword(e.target.value)}
              className="w-full p-3 mb-4 bg-black/40 rounded"
            />

            <button
              onClick={handleRegister}
              className="w-full bg-orange-500 p-3 rounded font-semibold hover:bg-orange-600 transition"
            >
              Register
            </button>

            <p className="mt-4 text-center text-sm text-gray-400">
              Already registered?{" "}
              <span
                onClick={()=>navigate("/login")}
                className="text-cyan-400 cursor-pointer"
              >
                Login
              </span>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Register;