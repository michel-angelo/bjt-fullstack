// client/src/App.jsx
import { useEffect, useState } from "react";
import { Routes, Route, Link, useLocation } from "react-router-dom";
import Home from "./pages/Home.jsx";
import Jadwal from "./pages/Jadwal.jsx";
import Pomodoro from "./pages/Pomodoro.jsx";
import Pengguna from "./pages/Pengguna.jsx";
import Profile from "./pages/Profile.jsx";
import IntroModal from "./components/IntroModal.jsx";
import Login from "./pages/Login.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

const API_PROFILE =
  "https://bjt-fullstack-production.up.railway.app/api/auth/profile";

function App() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const loginPage = location.pathname === "/login";

  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("bjt_user");
    return saved
      ? JSON.parse(saved)
      : {
          name: "",
          role: "",
          bio: "",
          photo: null,
          customAlarm: null,
        };
  });

  const token = localStorage.getItem("bjt_token");

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!token) return;
      try {
        const res = await fetch(API_PROFILE, {
          headers: { Authorization: token },
        });
        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error("Gagal ambil profil cloud", err);
      }
    };
    fetchUserProfile();
  }, [token]);

  const MENU_ITEMS = [
    { path: "/", label: "ToDo" },
    { path: "/jadwal", label: "Jadwal" },
    { path: "/fokus", label: "Fokus" },
    { path: "/pengguna", label: "User" },
  ];

  const getLinkClass = (path, isMobile = false) => {
    const isActive = location.pathname === path;
    const baseClass =
      "font-semibold px-4 py-2 rounded-lg transition duration-300 ease-in-out block";

    if (isActive) {
      return `${baseClass} bg-indigo-600 text-white shadow-md ${
        isMobile ? "text-center" : ""
      }`;
    }
    return `${baseClass} text-slate-600 hover:bg-indigo-50 hover:text-indigo-600 ${
      isMobile ? "text-center bg-slate-50" : ""
    }`;
  };

  const handleLogout = () => {
    localStorage.removeItem("bjt_token");
    localStorage.removeItem("bjt_user");
    window.location.href = "/login";
  };

  const showNavbar = location.pathname !== "/login" && token;

  return (
    <div className="min-h-screen flex flex-col">
      {showNavbar && (
        <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200 shadow-sm">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              BJT
            </div>

            <div className="hidden md:flex items-center gap-2">
              {MENU_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={getLinkClass(item.path)}
                >
                  {item.label}
                </Link>
              ))}
              <button
                onClick={handleLogout}
                className="text-xs text-red-500 hover:underline ml-2"
              >
                Logout
              </button>
              <Link
                to="/profile"
                className="ml-4 flex items-center gap-2 pl-4 border-l border-slate-200 group"
              >
                <div className="text-right hidden lg:block">
                  <p className="text-xs font-bold text-slate-700 group-hover:text-indigo-600 transition">
                    {user.name}
                  </p>
                  <p className="text-[10px] text-slate-500">{user.role}</p>
                </div>
                <img
                  src={
                    user.photo ||
                    `https://ui-avatars.com/api/?name=${user.name}&background=random`
                  }
                  alt="User"
                  className="w-10 h-10 rounded-full object-cover border-2 border-indigo-100 group-hover:border-indigo-500 transition"
                />
              </Link>
            </div>

            <div className="flex items-center gap-3 md:hidden">
              <Link to="/profile">
                <img
                  src={
                    user.photo ||
                    `https://ui-avatars.com/api/?name=${user.name}&background=random`
                  }
                  alt="User"
                  className="w-8 h-8 rounded-full object-cover border border-slate-200"
                />
              </Link>
              <button
                className="text-slate-600 hover:text-indigo-600 focus:outline-none"
                onClick={() => setIsOpen(!isOpen)}
              >
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={
                      isOpen
                        ? "M6 18L18 6M6 6l12 12"
                        : "M4 6h16M4 12h16M4 18h16"
                    }
                  />
                </svg>
              </button>
            </div>
          </div>

          {isOpen && (
            <div className="md:hidden mt-4 flex flex-col gap-3 pb-4 animate-fadeIn px-4">
              {MENU_ITEMS.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={getLinkClass(item.path, true)}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
              <Link
                to="/profile"
                className={getLinkClass("/profile", true)}
                onClick={() => setIsOpen(false)}
              >
                😎 Edit Profil Saya
              </Link>
            </div>
          )}
        </nav>
      )}

      {/* MAIN CONTENT */}
      <main
        className={`flex-grow ${
          !loginPage ? "container mx-auto px-4 py-6" : ""
        }`}
      >
        <Routes>
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Home />
              </ProtectedRoute>
            }
          ></Route>
          <Route
            path="/jadwal"
            element={
              <ProtectedRoute>
                <Jadwal />
              </ProtectedRoute>
            }
          />
          <Route
            path="/fokus"
            element={
              <ProtectedRoute>
                <Pomodoro user={user} setUser={setUser} />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pengguna"
            element={
              <ProtectedRoute>
                <Pengguna />
              </ProtectedRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile user={user} setUser={setUser} />
              </ProtectedRoute>
            }
          />
          <Route path="/login" element={<Login />} />
        </Routes>
      </main>

      {showNavbar && (
        <footer className="bg-white py-6 text-center text-slate-400 text-sm border-t border-slate-200">
          <div className="flex flex-col sm:flex-row sm:justify-center sm:items-center gap-1">
            <span>&copy; {new Date().getFullYear()}</span>
            <span className="sm:mx-2">Made by Proud</span>
            <span className="hidden sm:inline">|</span>
            <span>Basthatan a.k.a Baby Jesus a.k.a Baß</span>
          </div>
        </footer>
      )}

      {showNavbar && <IntroModal />}
    </div>
  );
}

export default App;
