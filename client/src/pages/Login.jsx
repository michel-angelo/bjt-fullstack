// client/src/pages/Login.jsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const API_BASE_URL = "https://bjt-fullstack-production.up.railway.app/api/auth";

function Login() {
  const [register, setRegister] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);

    const endpoint = register ? "register" : "login";

    try {
      const response = await fetch(`${API_BASE_URL}/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        Swal.fire({
          icon: "error",
          title: "ERROOOOOR BLOOOGGGG....",
          text:
            data.error ||
            "Ada yang error pokoknyaa... coba ulang lagiii.......",
          confirmButtonColor: "#d33",
        });
        setLoading(false);
        return;
      }

      if (register) {
        Swal.fire({
          icon: "success",
          title: "Nice Tim!",
          text: "Akun lu udah ada, langsung login ae...",
          confirmButtonColor: "#4f46e5",
        });
        setRegister(false);
      } else {
        localStorage.setItem("bjt_token", data.token);
        localStorage.setItem("bjt_user", JSON.stringify(data.user));

        Swal.fire({
          icon: "success",
          title: "Welcome Back!",
          text: "Halo Domba-Domba tersesat...",
          showConfirmButton: false,
          timer: 1500,
        });
        navigate("/");
        window.location.reload();
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center relative overflow-hidden">
      {/* BACKGROUND IMAGE (Ganti URL ini kalo mau gambar lain) */}
      <img
        src="/goat.jpg"
        alt="Background"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* OVERLAY GRADIENT (Biar teks kebaca & estetik) */}
      <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-purple-900/40 backdrop-blur-[8px]"></div>

      {/* === GLASS CARD === */}
      <div className="relative z-10 bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl rounded-3xl p-8 max-w-md w-full mx-4 animate-fadeInUp">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-black text-white tracking-tight drop-shadow-lg">
            BaBy <span className="text-indigo-300">Jesus</span> Tools
          </h1>
          <p className="text-indigo-100 text-sm mt-2 font-medium">
            {register
              ? "Gabung sekte produktifitas."
              : "Login dulu biar ganteng."}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input Username */}
          <div className="group">
            <label className="block text-xs font-bold text-indigo-200 uppercase mb-2 tracking-wide">
              Username
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-indigo-300">
                {/* Icon User */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </span>
              <input
                type="text"
                className="w-full bg-black/20 border border-white/10 text-white placeholder-white/50 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:bg-black/30 transition-all duration-300"
                placeholder="Masukan username..."
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Input Password */}
          <div className="group">
            <label className="block text-xs font-bold text-indigo-200 uppercase mb-2 tracking-wide">
              Password
            </label>
            <div className="relative flex items-center">
              <span className="absolute left-4 text-indigo-300">
                {/* Icon Lock */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </span>
              <input
                type="password"
                className="w-full bg-black/20 border border-white/10 text-white placeholder-white/50 rounded-xl py-3 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-indigo-400/50 focus:bg-black/30 transition-all duration-300"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-indigo-500/30 transform active:scale-95 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Sabar...
              </span>
            ) : register ? (
              "Daftar Sekarang"
            ) : (
              "Masuk Aplikasi"
            )}
          </button>
        </form>

        {/* Footer Card */}
        <div className="mt-8 text-center">
          <p className="text-indigo-200 text-sm">
            {register ? "Udah punya akun?" : "Belum punya akun?"}
            <button
              onClick={() => setRegister(!register)}
              className="ml-2 font-bold text-white hover:text-indigo-300 hover:underline transition-all"
            >
              {register ? "Login di sini" : "Bikin dulu"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
