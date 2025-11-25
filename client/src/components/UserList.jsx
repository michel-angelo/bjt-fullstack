import { useState, useEffect } from "react";

// GANTI URL SESUAI PRODUCTION NANTI
const API_USERS = "https://bjt-fullstack-production.up.railway.app/api/users";
const DEFAULT_ALARM = "/alarm.mp3"; // Pastiin ada file ini di folder public

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [playingId, setPlayingId] = useState(null); // Biar tau siapa yg lagi bunyi

  // Ambil Token
  const token = localStorage.getItem("bjt_token");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await fetch(API_USERS, {
          headers: { Authorization: token },
        });
        const data = await res.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.error("Gagal load user:", error);
        setLoading(false);
      }
    };

    if (token) fetchUsers();
  }, [token]);

  // Fungsi Putar Alarm User Lain
  const playAlarm = (userAudio, userId) => {
    // Kalo lagi bunyi, stop dulu (reset)
    if (playingId) {
      // Opsional: Kalo mau stop audio sebelumnya bisa pake ref,
      // tapi biar simpel kita biarin numpuk atau user klik lagi.
      // Disini kita cuma ubah icon status aja.
      setPlayingId(null);
    }

    const audioSource = userAudio || DEFAULT_ALARM;
    const audio = new Audio(audioSource);

    setPlayingId(userId); // Set icon jadi "Playing"

    audio.play().catch((e) => alert("Gagal play audio. Format rusak kali?"));

    // Pas kelar, balikin icon
    audio.onended = () => setPlayingId(null);
  };

  if (loading)
    return (
      <div className="text-center py-20 animate-pulse">
        <p className="text-4xl">👥</p>
        <p className="text-slate-500 font-bold mt-2">
          Lagi ngabsen warga BJT...
        </p>
      </div>
    );

  return (
    <div className="max-w-6xl mx-auto pb-20">
      {/* HEADER */}
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-800 mb-2">
          🏆 Hall of <span className="text-indigo-600">Fame</span>
        </h1>
        <p className="text-slate-500 max-w-lg mx-auto">
          Daftar manusia-manusia kuat yang mencoba produktif di tengah gempuran
          tugas dan mental breakdown.
        </p>
      </div>

      {/* GRID USER */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user._id}
            className="bg-white rounded-2xl shadow-lg border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300 group hover:-translate-y-1"
          >
            {/* BACKGROUND HEADER CARD */}
            <div className="h-24 bg-gradient-to-r from-indigo-500 to-purple-600 relative">
              {/* Tombol Play Alarm (Absolute di pojok kanan atas) */}
              <button
                onClick={() => playAlarm(user.customAlarm, user._id)}
                className={`absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 text-white p-2 rounded-full hover:bg-white hover:text-indigo-600 transition shadow-lg ${
                  playingId === user._id
                    ? "animate-bounce bg-white text-indigo-600"
                    : ""
                }`}
                title="Cek Alarm Dia"
              >
                {playingId === user._id ? "🔊" : "▶️"}
              </button>
            </div>

            {/* ISI CARD */}
            <div className="px-6 pb-6 relative">
              {/* FOTO PROFIL (Nongol dikit ke atas) */}
              <div className="-mt-12 mb-4 flex justify-between items-end">
                <img
                  src={
                    user.photo ||
                    `https://ui-avatars.com/api/?name=${user.name}&background=random`
                  }
                  alt={user.name}
                  className="w-24 h-24 rounded-full object-cover border-4 border-white shadow-md bg-white"
                />

                {/* Badge Role Kecil */}
                <span className="text-[10px] font-bold bg-slate-100 text-slate-500 px-2 py-1 rounded-full uppercase tracking-wider mb-1">
                  {user.role || "NPC"}
                </span>
              </div>

              {/* INFO USER */}
              <div>
                <h3 className="font-bold text-xl text-slate-800 truncate">
                  {user.name || "Anonim"}
                </h3>
                <p className="text-indigo-500 text-xs font-semibold mb-3 truncate">
                  {user.customAlarm
                    ? "🎵 Punya Custom Alarm"
                    : "🔇 Alarm Standar"}
                </p>

                {/* BIO (Kutipan) */}
                <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 relative">
                  <span className="text-4xl text-slate-200 absolute -top-2 -left-1 font-serif">
                    “
                  </span>
                  <p className="text-sm text-slate-600 italic relative z-10 line-clamp-3">
                    {user.bio || "Orang ini terlalu malas buat ngisi bio."}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserList;
