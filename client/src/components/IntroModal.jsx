import { useState, useEffect } from "react";

const CURRENT_VERSION = "2.0.0";

function IntroModal() {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(""); // 'welcome' atau 'update'

  useEffect(() => {
    const savedVersion = localStorage.getItem("app_version");

    if (!savedVersion) {
      // LOGIC BENER: Pake kode pendek
      setModalType("welcome");
      setShowModal(true);
    } else if (savedVersion !== CURRENT_VERSION) {
      // LOGIC BENER: Pake kode pendek
      setModalType("update");
      setShowModal(true);
    }
  }, []);

  const handleClose = () => {
    localStorage.setItem("app_version", CURRENT_VERSION);
    setShowModal(false);
  };

  if (!showModal) return null;

  return (
    // OVERLAY
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-fadeIn">
      {/* KOTAK MODAL (Scrollable biar muat teks panjang lo) */}
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto flex flex-col">
        {/* HEADER */}
        <div
          className={`p-6 text-white text-center shrink-0 ${
            modalType === "welcome" ? "bg-indigo-600" : "bg-emerald-600"
          }`}
        >
          <div className="text-5xl mb-2">
            {modalType === "welcome" ? "👋" : "🚀"}
          </div>
          <h2 className="text-xl md:text-2xl font-bold leading-tight">
            {modalType === "welcome"
              ? "Welcome to BJT — Baby Jesus Tools"
              : "Update NEW! BJT 2.0.0"}
          </h2>
        </div>

        {/* ISI KONTEN */}
        <div className="p-6 space-y-6 text-slate-700 text-sm leading-relaxed overflow-y-auto">
          {/* === KONTEN WELCOME === */}
          {modalType === "welcome" && (
            <>
              <p className="italic font-medium border-l-4 border-indigo-400 pl-3 bg-indigo-50 py-2">
                Aplikasi untuk kalian para mahasiswa yang hidupnya udah chaos
                dari lahir, tapi masih sok yakin semuanya bakal “terkendali”.
              </p>

              <div className="space-y-4">
                <div>
                  <h3 className="font-bold text-indigo-600 text-base">
                    📝 To-Do List
                  </h3>
                  <p>
                    Catet tugas lu biar gak terus-terusan bilang{" "}
                    <em>“lah, ada tugas?”</em>.
                  </p>
                  <p className="text-xs bg-slate-100 p-2 rounded mt-1 border border-slate-200">
                    ➡️ Klik tugasnya, pencet ikon kalender, terus pasang
                    pengingat biar HP lu yang nge-bacot, bukan dosen.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-indigo-600 text-base">
                    📅 Jadwal Kuliah
                  </h3>
                  <p>
                    Biar lu gak pongo salah ruangan, salah gedung, atau salah
                    jurusan lagi.
                  </p>
                  <p className="text-xs bg-slate-100 p-2 rounded mt-1 border border-slate-200">
                    ➡️ Pilih jadwalnya, klik ikon kalender, set reminder — biar
                    lu inget kalo kuliah itu bukan mitos.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-indigo-600 text-base">
                    🍅 Custom Pomodoro
                  </h3>
                  <p>
                    Set timer, jalanin, dan biarin alarmnya menyadarkan mental
                    lu pas waktunya habis.
                  </p>
                  <p className="mt-1">
                    Alarmnya bisa lu custom sesuka hati—mau pake lagu favorit,
                    suara notif random, atau audio yang bikin lo langsung inget
                    tugas.<strong> Filenya gaboleh lebih dari 2MB </strong>
                  </p>
                </div>

                {/* DISCLAIMER IPHONE (Penting wkwk) */}
                <div className="bg-red-50 border border-red-100 p-3 rounded-lg text-red-800 text-xs">
                  <h4 className="font-bold mb-1">
                    🔔 Soal Notifikasi HP & iPhone:
                  </h4>
                  <p>
                    Selama lu masih di dalam browser, notif bakal muncul aman
                    tanpa drama.
                  </p>
                  <p className="mt-2 font-semibold">
                    Kalo hp lu Android terus keluar dari Browser dan timer
                    Pomodoro masih jalan. itu aman aman aja.
                  </p>
                  <p>
                    Kecuali lu pake <strong>iPhone yang sok eksklusif</strong>,
                    notifnya bisa telat atau bahkan ngilang kayak janji "AKU
                    AKAN PRODUKTIF". Karena sistem privacy Apple yang sok
                    protektif banget kayak tai.
                  </p>
                  <p className="mt-1 italic">
                    Jadi bukan salah gua, bukan salah websitenya… salah iPhone
                    lu yang sok ekskulif + gengsinya ketinggian.
                  </p>
                </div>

                <div>
                  <h3 className="font-bold text-indigo-600 text-base">
                    😎 Profil
                  </h3>
                  <p>
                    Cuma biar lo merasa hidup lo rapi, padahal file tugas di
                    laptop aja kayak Gunung Bantar Gebang.
                  </p>
                </div>
              </div>

              <p className="text-xs text-center text-slate-400 border-t pt-4">
                *Semua data disimpen lokal. Kalau hilang? Ya salah lo. Jangan
                salahin Tuhan, jangan salahin app. <br />
                <strong>
                  Langsung aja mulai hidup "Pretend to be Productive" dari sini.
                </strong>
              </p>
            </>
          )}

          {/* === KONTEN UPDATE === */}
          {modalType === "update" && (
            <>
              <p className="font-bold">
                Halo para mahasiswa yang hidupnya ditopang tugas dan deadline!
              </p>
              <p>
                BJT baru dapet upgrade biar hidup lu sedikit lebih waras… atau
                minimal lebih terjadwal.
              </p>

              <div className="space-y-4 mt-4">
                <h3 className="font-bold text-lg border-b pb-2">
                  🔥 Yang baru di versi 2.0.0:
                </h3>

                <div className="bg-emerald-50 p-3 rounded border border-emerald-100">
                  <h4 className="font-bold text-emerald-800">
                    😎 Profil di Navbar
                  </h4>
                  <p>
                    Lu bisa pasang foto & nama sekarang. Minimal ada satu hal di
                    hidup lo yang kelihatan beres.
                  </p>
                </div>

                <div className="bg-emerald-50 p-3 rounded border border-emerald-100">
                  <h4 className="font-bold text-emerald-800">
                    📅 Integrasi Google Calendar
                  </h4>
                  <p>
                    To-Do & Jadwal Kuliah sekarang bisa dikirim langsung ke
                    Calendar.
                  </p>
                  <p className="text-xs mt-1 bg-white/50 p-1 rounded">
                    Caranya: buka tugas/jadwalnya → klik tugas/jadwalnya dulu →
                    pencet ikon kalender → baru pasang reminder.
                  </p>
                  <p className="mt-1 text-xs italic">
                    Biar HP lu yang bacotin lu kalau lupa, bukan dosen.
                  </p>
                </div>

                <div className="bg-emerald-50 p-3 rounded border border-emerald-100">
                  <h4 className="font-bold text-emerald-800">
                    🍅 Custom Pomodoro
                  </h4>
                  <p>
                    Set timer, jalanin, dan biarin alarmnya nonjok menyadarkan
                    mental lu pas waktunya habis.
                  </p>
                  <p>
                    Alarmnya bisa lu custom sesuka hati. terserah lu mau make
                    suara apa intinya filenya jangan lebih dari 2MB aja.
                  </p>
                </div>

                {/* DISCLAIMER IPHONE (Diulang di update juga biar tau) */}
                <div className="bg-red-50 border border-red-100 p-3 rounded-lg text-red-800 text-xs">
                  <h4 className="font-bold mb-1">
                    🔔 Soal Notifikasi HP & iPhone:
                  </h4>
                  <p>
                    Selama lu masih di dalam browser, notif bakal muncul aman
                    tanpa drama.
                  </p>
                  <p className="mt-2 font-semibold">
                    Kalo hp lu Android terus keluar dari Browser dan timer
                    Pomodoro masih jalan. itu aman aman aja.
                  </p>
                  <p>
                    Kecuali lu pake <strong>iPhone yang sok eksklusif</strong>,
                    notifnya bisa telat atau bahkan ngilang kayak janji "aku mau
                    produktif". Karena sistem privacy Apple yang sok protektif
                    banget kayak tai.
                  </p>
                  <p className="mt-1 italic">
                    Jadi bukan salah gua, bukan salah websitenya… salah iPhone
                    lu yang sok ekskulif + gengsinya ketinggian.
                  </p>
                </div>
              </div>
            </>
          )}
        </div>

        {/* FOOTER TOMBOL */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0">
          <button
            onClick={handleClose}
            className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-xl font-bold transition transform active:scale-95 w-full md:w-auto"
          >
            Bacot, developer miskin!...
          </button>
        </div>
      </div>
    </div>
  );
}

export default IntroModal;
