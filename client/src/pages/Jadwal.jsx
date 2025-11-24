//src/pages/Jadwal.jsx
import { useState, useEffect } from "react";

function Jadwal() {
  const [jadwal, setJadwal] = useState(() => {
    const simpanan = localStorage.getItem("jadwalKuliah");
    return simpanan ? JSON.parse(simpanan) : [];
  });

  const [matkul, setMatkul] = useState("");
  const [hari, setHari] = useState("Senin");
  const [jam, setJam] = useState("");

  useEffect(() => {
    localStorage.setItem("jadwalKuliah", JSON.stringify(jadwal));
  }, [jadwal]);

  const tambahJadwal = () => {
    if (!matkul || !jam) return;
    const baru = { id: Date.now(), matkul, hari, jam };
    setJadwal([...jadwal, baru]);
    setMatkul("");
    setJam("");
  };

  const hapusJadwal = (id) => {
    setJadwal(jadwal.filter((j) => j.id !== id));
  };

  const addToCalender = (item) => {
    const dayIndexMap = {
      Minggu: 0,
      Senin: 1,
      Selasa: 2,
      Rabu: 3,
      Kamis: 4,
      Jumat: 5,
      Sabtu: 6,
    };

    const targetDayIndex = dayIndexMap[item.hari];
    const now = new Date();
    const currentDayIndex = now.getDay();

    let daysUntilTarget = targetDayIndex - currentDayIndex;
    if (daysUntilTarget < 0) {
      daysUntilTarget += 7;
    }

    const targetDate = new Date();
    targetDate.setDate(now.getDate() + daysUntilTarget);

    const yyyy = targetDate.getFullYear();
    const mm = String(targetDate.getMonth() + 1).padStart(2, "0");
    const dd = String(targetDate.getDate()).padStart(2, "0");

    const [hour, minute] = item.jam.split(":");
    const startTime = `${yyyy}${mm}${dd}T${hour}${minute}00`;
    const endTime = `${yyyy}${mm}${dd}T${String(Number(hour) + 2).padStart(
      2,
      "0"
    )}${minute}00`;

    const details = `Kuliah ${item.matkul} hari ${item.hari}`;
    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      item.matkul
    )}&dates=${startTime}/${endTime}&details=${details}&recur=RRULE:FREQ=WEEKLY`;

    window.open(googleUrl, "_blank");
  };

  const urutanHari = {
    Senin: 1,
    Selasa: 2,
    Rabu: 3,
    Kamis: 4,
    Jumat: 5,
    Sabtu: 6,
    Minggu: 7,
  };

  const jadwalUrut = [...jadwal].sort((a, b) => {
    const bedaHari = urutanHari[a.hari] - urutanHari[b.hari];
    if (bedaHari !== 0) return bedaHari;
    return a.jam.localeCompare(b.jam);
  });

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-extrabold text-slate-800 mb-6">
          📅 Jadwal <span className="text-indigo-600">Kuliah</span>
        </h1>
        <div className="bg-red-50 border-l-4 border-red-500 p-4 text-left mx-auto max-w-lg shadow-sm rounded-r-lg">
          <p className="font-bold text-red-800 text-lg mb-1">
            UKT Elit, Masuk Sulit.
          </p>
          <p className="text-sm text-red-700 italic leading-relaxed">
            Lo kira duit UKT turun dari langit? Kurang-kurangin titip absen,
            kasian ortu lo capek-capek kerja cuma buat biayain lo tidur di
            kelas.
          </p>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
          <div className="md:col-span-6">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">
              Mata Kuliah
            </label>
            <input
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="Pengantar Depresi Semester 1..."
              value={matkul}
              onChange={(e) => setMatkul(e.target.value)}
            />
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">
              Hari
            </label>
            <select
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              value={hari}
              onChange={(e) => setHari(e.target.value)}
            >
              {[
                "Senin",
                "Selasa",
                "Rabu",
                "Kamis",
                "Jumat",
                "Sabtu",
                "Minggu",
              ].map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <div className="md:col-span-3">
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">
              Jam
            </label>
            <input
              type="time"
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              value={jam}
              onChange={(e) => setJam(e.target.value)}
            />
          </div>
        </div>

        <button
          className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transform active:scale-95 transition-all"
          onClick={tambahJadwal}
        >
          Simpen Jadwal
        </button>
      </div>

      <div className="space-y-4">
        {jadwal.length === 0 ? (
          <div className="text-center py-12 bg-red-50 rounded-xl border-2 border-dashed border-red-200 flex flex-col items-center justify-center gap-2">
            <span className="text-4xl">💸</span>
            <p className="text-red-800 font-bold px-6">
              Jadwal kosong? UKT juta-jutaan cuma buat diem di kosan?
            </p>
            <p className="text-red-600 text-sm font-medium">Gece, Isi KOCAK!</p>
          </div>
        ) : (
          jadwalUrut.map((item) => (
            <div
              key={item.id}
              className="bg-white p-4 rounded-xl shadow-sm border-l-4 border-indigo-500 flex justify-between items-center hover:shadow-md transition"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded uppercase ${
                      item.hari === "Senin"
                        ? "bg-red-100 text-red-700"
                        : item.hari === "Selasa"
                        ? "bg-orange-100 text-orange-700"
                        : item.hari === "Jumat"
                        ? "bg-green-100 text-green-700"
                        : "bg-indigo-100 text-indigo-700"
                    }`}
                  >
                    {item.hari}
                  </span>
                  <span className="text-slate-400 text-sm flex items-center gap-1">
                    {item.jam}
                  </span>
                </div>
                <h3 className="font-bold text-lg text-slate-800">
                  {item.matkul}
                </h3>
              </div>

              <div className="flex gap-2">
                <button
                  className="w-10 h-10 rounded-full bg-blue-50 text-blue-500 hover:bg-blue-100 hover:text-blue-600 flex items-center justify-center transition"
                  onClick={() => addToCalender(item)}
                  title="Pasang Reminder Mingguan"
                >
                  📅
                </button>

                <button
                  className="w-10 h-10 rounded-full bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600 flex items-center justify-center transition"
                  onClick={() => hapusJadwal(item.id)}
                  title="Hapus Jadwal"
                >
                  🗑️
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default Jadwal;
