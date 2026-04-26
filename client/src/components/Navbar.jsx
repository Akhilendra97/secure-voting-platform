import { useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck } from "lucide-react";
import { motion as Motion } from "framer-motion";

function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // 🔐 GET ROLE
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

  const isActive = (path) => location.pathname === path;

  return (
    <div className="fixed top-0 left-0 w-full z-50">

      {/* 🔥 GLASS NAV */}
      <div className="backdrop-blur-xl bg-black/40 border-b border-white/10 shadow-[0_4px_30px_rgba(0,0,0,0.6)]">

        <div className="flex justify-between items-center px-6 py-3 max-w-7xl mx-auto">

          {/* 🔥 LOGO */}
          <Motion.div
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 cursor-pointer"
            onClick={() => {
              if (role === "admin") {
                navigate("/admin");
              } else {
                navigate("/dashboard");
              }
            }}
          >
            <ShieldCheck
              className="text-orange-400 drop-shadow-[0_0_10px_rgba(251,146,60,0.8)]"
              size={24}
            />

            <h1 className="font-semibold text-sm text-white tracking-wide">
              Bharat Voting System
            </h1>
          </Motion.div>

          {/* 🔥 MENU */}
          <div className="flex gap-6 text-sm items-center">

            {/* 👤 USER MENU */}
            {role === "user" && (
              <>
                <NavItem
                  label="Home"
                  active={isActive("/dashboard")}
                  onClick={() => navigate("/dashboard")}
                />

                <NavItem
                  label="History"
                  active={isActive("/history")}
                  onClick={() => navigate("/history")}
                />

                <NavItem
                  label="Result"
                  active={isActive("/result")}
                  onClick={() => navigate("/result")}
                />
              </>
            )}

            {/* 👑 ADMIN MENU */}
            {role === "admin" && (
              <NavItem
                label="Admin Panel"
                active={isActive("/admin")}
                onClick={() => navigate("/admin")}
              />
            )}

          </div>

        </div>
      </div>
    </div>
  );
}

/* 🔥 PREMIUM NAV ITEM */
function NavItem({ label, active, onClick }) {
  return (
    <div
      onClick={onClick}
      className="relative cursor-pointer px-3 py-1 group"
    >

      {/* TEXT */}
      <span
        className={`transition ${
          active
            ? "text-green-400"
            : "text-gray-300 group-hover:text-white"
        }`}
      >
        {label}
      </span>

      {/* 🔥 GLOW UNDERLINE */}
      <span
        className={`absolute left-0 -bottom-1 h-[2px] rounded-full bg-green-400 transition-all duration-300 ${
          active
            ? "w-full shadow-[0_0_10px_rgba(34,197,94,0.8)]"
            : "w-0 group-hover:w-full"
        }`}
      ></span>

      {/* 🔥 ACTIVE BG */}
      {active && (
        <div className="absolute inset-0 rounded-md bg-green-500/10 blur-sm -z-10"></div>
      )}
    </div>
  );
}

export default Navbar;