// src/components/UserList.jsx
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ambilData = async () => {
      try {
        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );

        const data = await response.json();
        setUsers(data);
        setLoading(false);
      } catch (error) {
        console.log("Error, Gagal mengambil data", error);
        setLoading(false);
      }
    };
    ambilData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center h-64">
        Lagi Loading... Masih lebih cepet ini daripada otak lo pas ditanya
        dosen.
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-slate-800 mb-6 border-l-4 border-indigo-600 pl-4 text-center">
        Absensi Domba-Domba Tersesat yang Butuh Pertolongan.
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="bg-white p-6 rounded-xl shadow-sm hover:shadow-xl border border-slate-100 hover:border-indigo-100 transition-all duration-300 transform hover:-translate-y-1"
          >
            <div className="flex items-center gap-4 mb-4">
              {/* Avatar Placeholder pake inisial */}
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md">
                {user.name.charAt(0)}
              </div>
              <div>
                <h3 className="font-bold text-slate-800">{user.name}</h3>
                <p className="text-xs text-indigo-500 font-medium">
                  @{user.username}
                </p>
              </div>
            </div>

            <div className="space-y-2 text-sm text-slate-600">
              <p className="flex items-center gap-2">
                📧 <span className="truncate">{user.email}</span>
              </p>
              <p className="flex items-center gap-2">
                🏢 <span>{user.company.name}</span>
              </p>
              <p className="flex items-center gap-2">
                🌐{" "}
                <a
                  href={`http://${user.website}`}
                  target="_blank"
                  className="text-blue-500 hover:underline"
                >
                  {user.website}
                </a>
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 flex justify-between items-center">
                <span className="text-xs text-slate-400">ID: {user.id}</span>

                <Link
                  to={`/pengguna/${user.id}`}
                  className="bg-indigo-50 text-indigo-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-indigo-600 hover:text-white transition"
                >
                  Lihat Detail &rarr;
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserList;
