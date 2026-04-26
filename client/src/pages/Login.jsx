import { useState, useRef, useEffect, useCallback } from "react";
import API from "../services/api";
import { useNavigate } from "react-router-dom";

function Login() {
  const [a1, setA1] = useState("");
  const [a2, setA2] = useState("");
  const [a3, setA3] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const [isAdmin, setIsAdmin] = useState(false);

  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [resendCount, setResendCount] = useState(0);

  const [loading, setLoading] = useState(false);
  const [errorShown, setErrorShown] = useState(false);

  const input1 = useRef();
  const input2 = useRef();
  const input3 = useRef();

  const navigate = useNavigate();

  const getAadhar = useCallback(() => {
    return a1 + a2 + a3;
  }, [a1, a2, a3]);

  // ================= OTP =================
  const sendOTP = async () => {
    try {
      const aadhar = getAadhar();

      if (aadhar.length !== 12) {
        alert("Invalid Aadhaar");
        return;
      }

      if (resendCount >= 3) {
        alert("Maximum resend limit reached");
        return;
      }

      setLoading(true);

      await API.post("/auth/send-otp", {
        aadhar_id: aadhar,
      });

      alert("OTP sent successfully");

      setOtpSent(true);
      setTimer(60);
      setCanResend(false);
      setResendCount((prev) => prev + 1);

    } catch (err) {
      alert(err.response?.data?.message || "OTP failed");
    } finally {
      setLoading(false);
    }
  };

  // ================= TIMER =================
  useEffect(() => {
    if (!otpSent) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [otpSent]);

  // ================= LOGIN =================
  const handleLogin = useCallback(async () => {
    if (loading) return;

    try {
      setLoading(true);

      let res;

      if (isAdmin) {
        res = await API.post("/auth/admin-login", {
          email: a1,
          password,
        });
      } else {

        // 🔥 FIX: OTP must be sent first
        if (!otpSent) {
          alert("Please send OTP first");
          setLoading(false);
          return;
        }

        if (timer === 0) {
          alert("OTP expired. Please resend OTP");
          setLoading(false);
          return;
        }

        res = await API.post("/auth/login", {
          aadhar_id: getAadhar(),
          password,
          otp,
        });
      }

      // 🔥 FIX: strict response check
      if (!res || !res.data || !res.data.token) {
        return;
      }

      const token = res.data.token;

      // 🔥 FIX: reset old token
      localStorage.removeItem("token");

      localStorage.setItem("token", token);

      const payload = JSON.parse(atob(token.split(".")[1]));

      if (payload.role === "admin") {
        navigate("/admin", { replace: true });
      } else {
        navigate("/dashboard", { replace: true });
      }

    } catch (err) {

      // 🔥 FIX: prevent invalid login
      localStorage.removeItem("token");

      if (!errorShown) {
        alert(err.response?.data?.message || "Login failed");
        setErrorShown(true);
      }

    } finally {
      setLoading(false);
    }
  }, [isAdmin, a1, password, otp, timer, navigate, loading, getAadhar, errorShown, otpSent]);

  // ❌ AUTO LOGIN REMOVED (ROOT BUG)

  // ================= RESET ERROR =================
  useEffect(() => {
    if (otp.length > 0) {
      setErrorShown(false);
    }
  }, [otp]);

  return (
    <div
      className="min-h-screen flex text-white bg-cover bg-center relative"
      style={{
        backgroundImage:
          "url('https://kashmirobserver.net/wp-content/uploads/2024/12/One-Nation-One-Election.jpeg')",
      }}
    >
      <div className="absolute inset-0 bg-black/50"></div>

      <div className="relative z-10 min-h-screen flex w-full">

        {/* LEFT */}
        <div className="hidden md:flex w-1/2 flex-col justify-center px-16">
          <h1 className="text-4xl font-bold mb-4">
            Election Commission of India 🇮🇳
          </h1>

          <p className="text-gray-300 mb-6">
            Ensuring free and fair elections through secure digital infrastructure.
          </p>

          <div className="space-y-2 text-gray-200">
            <p>✔ Aadhaar Verified Voters</p>
            <p>✔ OTP Secured Authentication</p>
            <p>✔ Blockchain Based Voting</p>
            <p>✔ Tamper Proof System</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex w-full md:w-1/2 items-center justify-center">

          <div className="backdrop-blur-md border border-white/10 p-8 rounded-xl w-[380px]">

            {/* TOGGLE */}
            <div className="text-center mb-4">
              <button
                onClick={() => setIsAdmin(!isAdmin)}
                className="text-green-400 text-sm underline"
              >
                {isAdmin ? "Login as Voter" : "Login as Admin"}
              </button>
            </div>

            <h2 className="text-2xl font-bold text-center mb-2">
              {isAdmin ? "Admin Login" : "Voter Login"}
            </h2>

            <p className="text-gray-400 text-center mb-6 text-sm">
              {isAdmin ? "Admin Access Panel" : "Secure Aadhaar Authentication"}
            </p>

            {isAdmin ? (
              <>
                <input
                  placeholder="Admin Email"
                  onChange={(e) => setA1(e.target.value)}
                  className="w-full p-2 mb-3 bg-black/40 rounded"
                />

                <input
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 mb-3 bg-black/40 rounded"
                />

                <button
                  disabled={loading}
                  className="w-full bg-green-600 p-2 rounded"
                  onClick={handleLogin}
                >
                  {loading ? "Please wait..." : "Admin Login"}
                </button>
              </>
            ) : (
              <>
                <div className="flex gap-2 mb-3">
                  <input
                    ref={input1}
                    maxLength={4}
                    value={a1}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setA1(val);
                      if (val.length === 4) input2.current.focus();
                    }}
                    className="w-1/3 p-2 text-center bg-black/40 rounded"
                  />

                  <input
                    ref={input2}
                    maxLength={4}
                    value={a2}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setA2(val);
                      if (val.length === 4) input3.current.focus();
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && a2.length === 0) {
                        input1.current.focus();
                      }
                    }}
                    className="w-1/3 p-2 text-center bg-black/40 rounded"
                  />

                  <input
                    ref={input3}
                    maxLength={4}
                    value={a3}
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, "");
                      setA3(val);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Backspace" && a3.length === 0) {
                        input2.current.focus();
                      }
                    }}
                    className="w-1/3 p-2 text-center bg-black/40 rounded"
                  />
                </div>

                <input
                  type="password"
                  placeholder="Password"
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-2 mb-3 bg-black/40 rounded"
                />

                {!otpSent ? (
                  <button
                    disabled={loading}
                    className="w-full bg-orange-500 p-2 rounded mb-3"
                    onClick={sendOTP}
                  >
                    {loading ? "Sending..." : "Send OTP"}
                  </button>
                ) : (
                  <>
                    <input
                      placeholder="Enter OTP"
                      value={otp}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, "");
                        setOtp(val);
                      }}
                      className="w-full p-2 mb-2 bg-black/40 rounded"
                    />

                    <p className="text-center text-xs text-gray-400 mb-2">
                      OTP expires in {timer}s
                    </p>

                    {canResend && resendCount < 3 && (
                      <button
                        disabled={loading}
                        onClick={sendOTP}
                        className="w-full bg-yellow-500 p-2 rounded mb-2"
                      >
                        Resend OTP
                      </button>
                    )}

                    <button
                      disabled={loading}
                      className="w-full bg-green-600 p-2 rounded"
                      onClick={handleLogin}
                    >
                      {loading ? "Please wait..." : "Login"}
                    </button>
                  </>
                )}
              </>
            )}

            <p className="mt-3 text-center text-xs text-gray-400">
              New user?{" "}
              <span
                onClick={() => navigate("/register")}
                className="text-cyan-400 cursor-pointer"
              >
                Register
              </span>
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;