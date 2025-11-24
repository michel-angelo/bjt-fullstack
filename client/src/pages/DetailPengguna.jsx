import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";

function DetailPengguna() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ambilDetail = async () => {
      try {
        const response = await fetch(
          `https://jsonplaceholder.typicode.com/users/${id}`
        );
        const data = await response.json();
        setUser(data);
        setLoading(false);
      } catch (error) {
        console.log("Error:", error);
        setLoading(false);
      }
    };
    ambilDetail();
  }, [id]);

  if (loading)
    return (
      <div className="text-center mt-10">
        Sabar nyet, gw make server gratisan, lu aja make app ini gratis...
      </div>
    );

  if (!user)
    return (
      <div className="text-center mt-10">
        Lu nyari siapa kocak? salah id nya, kocak lu...
      </div>
    );

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <Link
        to="/pengguna"
        className="text-indigo-600 hover:underline mb-4 inline-block"
      >
        &larr; Kembali ke Daftar
      </Link>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100">
        <div className="flex items-center gap-6 mb-6">
          <div className="w-20 h-20 rounded-full bg-indigo-100 flex items-center justify-center text-3xl font-bold text-indigo-600">
            {user.name.charAt(0)}
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-800">{user.name}</h1>
            <p className="text-slate-500">@{user.username}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
          <div className="p-4 bg-slate-50 rounded-xl">
            <h3 className="font-bold text-indigo-600 mb-2">📞 Kontak</h3>
            <p>Email: {user.email}</p>
            <p>Phone: {user.phone}</p>
            <p>Web: {user.website}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl">
            <h3 className="font-bold text-indigo-600 mb-2">🏠 Alamat</h3>
            <p>
              {user.address.street}, {user.address.suite}
            </p>
            <p>{user.address.city}</p>
            <p>{user.address.zipcode}</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl md:col-span-2">
            <h3 className="font-bold text-indigo-600 mb-2">💼 Pekerjaan</h3>
            <p className="font-bold">{user.company.name}</p>
            <p className="italic text-slate-500">
              "{user.company.catchPhrase}"
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default DetailPengguna;
