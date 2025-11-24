// src/components/QueenList.jsx
import { useState, useEffect } from "react";

function QueenList() {
  const [queens, setQueens] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ambilData = async () => {
      try {
        // PERHATIKAN URL-NYA: Ini nembak ke LOCALHOST lo sendiri!
        const response = await fetch(
          "https://bitches-backend-api-production.up.railway.app/bitches"
        );
        const result = await response.json();

        // Karena struktur lo: { message: "...", data: [...] }
        // Kita ambil bagian .data nya
        setQueens(result.data);
        setLoading(false);
      } catch (error) {
        console.log("Gagal konek ke backend sendiri:", error);
        setLoading(false);
      }
    };
    ambilData();
  }, []);

  if (loading) return <p>Lagi nungguin para Ratu...</p>;

  return (
    <div className="max-w-xl mx-auto mt-8 p-6 bg-pink-50 rounded-xl border border-pink-200 shadow-lg">
      <h2 className="text-2xl font-bold text-pink-600 mb-4 text-center">
        👑 The Queens (Dari Backend Sendiri)
      </h2>

      <ul className="space-y-3">
        {queens.map((item) => (
          <li
            key={item.id}
            className="flex justify-between items-center bg-white p-3 rounded-lg shadow-sm"
          >
            <div>
              <span className="font-bold text-slate-700">{item.name}</span>
              <span className="text-xs text-pink-400 block">{item.role}</span>
            </div>
            <span className="text-2xl">💅</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default QueenList;
