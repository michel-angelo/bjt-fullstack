// src/components/ToDoList.jsx
function ToDoList({ kegiatan, onHapus, onSelesai }) {
  const containerClass = `group flex justify-between items-center p-4 bg-white rounded-xl border transition-all duration-300 hover:shadow-md ${
    kegiatan.status
      ? "border-emerald-200 bg-emerald-50/50"
      : "border-slate-200 hover:border-indigo-300"
  }`;

  const username = "Basthatan a.k.a Baby Jesus a.k.a Baß";

  const addToCalendar = () => {
    if (!kegiatan.jam || !kegiatan.tanggal) {
      alert("Isi tanggal dan jam dulu dong kalo mau pasang reminder!");
      return;
    }

    const [year, month, day] = kegiatan.tanggal.split("-");

    const [hour, minute] = kegiatan.jam.split(":");

    const startTime = `${year}${month}${day}T${hour}${minute}00`;

    const endTime = startTime;

    const googleUrl = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(
      kegiatan.nama
    )}&dates=${startTime}/${endTime}&details=Reminder dari MadingApp`;

    window.open(googleUrl, "_blank");
  };

  return (
    <div className={containerClass}>
      <div className="flex items-center gap-4 flex-grow overflow-hidden">
        <button
          onClick={onSelesai}
          className={`flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
            kegiatan.status
              ? "bg-emerald-500 border-emerald-500"
              : "border-slate-300 group-hover:border-indigo-400"
          }`}
        >
          {kegiatan.status && <span className="text-white text-xs">✓</span>}
        </button>

        <div className="min-w-0">
          <h3
            className={`font-semibold text-lg truncate transition-all ${
              kegiatan.status
                ? "text-slate-400 line-through decoration-2"
                : "text-slate-700"
            }`}
          >
            {kegiatan.nama}
          </h3>
          <div
            className={`text-xs font-medium flex gap-2 ${
              kegiatan.status ? "text-emerald-600/70" : "text-indigo-500"
            }`}
          >
            {kegiatan.tanggal && <span>📅 {kegiatan.tanggal}</span>}
            {kegiatan.jam && <span>⏰ {kegiatan.jam}</span>}
            {!kegiatan.tanggal && !kegiatan.jam && <span>--:--</span>}
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {/* Tombol Reminder hanya muncul kalo belum selesai */}
        {!kegiatan.status && (
          <button
            onClick={addToCalendar}
            className="w-8 h-8 rounded-lg bg-blue-50 text-blue-500 hover:bg-blue-100 flex items-center justify-center transition opacity-0 group-hover:opacity-100 focus:opacity-100"
            title="Pasang Reminder di Google Calendar"
          >
            📅
          </button>
        )}

        <button
          onClick={onHapus}
          className="w-8 h-8 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg flex items-center justify-center transition opacity-0 group-hover:opacity-100 focus:opacity-100"
          title="Hapus"
        >
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
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}

export default ToDoList;
