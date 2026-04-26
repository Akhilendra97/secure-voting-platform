import { motion as Motion } from "framer-motion";

function Loader() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/80 z-50">
      <Motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full"
      />
    </div>
  );
}

export default Loader;