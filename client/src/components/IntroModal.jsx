import { useState, useEffect } from "react";

const CURRENT_VERSION = "2.1.0";

function IntroModal() {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("");

  useEffect(() => {
    const savedVersion = localStorage.getItem("app_version");

    if (!savedVersion) {
      setModalType("welcome");
      setShowModal(true);
    } else if (savedVersion !== CURRENT_VERSION) {
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
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[999] flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full max-h-[85vh] overflow-y-auto flex flex-col">
        {/* HEADER */}
        <div
          className={`p-6 text-white text-center shrink-0 ${
            modalType === "welcome" ? "bg-indigo-600" : "bg-emerald-600"
          }`}
        >
          <div className="text-5xl mb-2">
            {modalType === "welcome" ? "👋" : "🔒"}
          </div>
          <h2 className="text-xl md:text-2xl font-bold leading-tight">
            {modalType === "welcome"
              ? "Welcome to BJT — Baby Jesus Tools"
              : "MAJOR UPDATE: BJT 2.1.0"}
          </h2>
        </div>

        {/* CONTENT */}
        <div className="p-6 space-y-6 text-slate-700 text-sm leading-relaxed overflow-y-auto">
          {/* === WELCOME === */}
          {modalType === "welcome" && (
            <>
              <p className="italic font-medium border-l-4 border-indigo-400 pl-3 bg-indigo-50 py-2">
                Selamat datang di aplikasi yang bakal nyeret kalian keluar dari
                kubangan malas yang udah kalian pelihara dari SMA. Ini bukan
                aplikasi produktivitas sok bijak; ini lebih kayak mesin
                penghancur kelakukan kalian yang suka nunda, ngelamun, dan
                berharap nilai bagus turun dari langit.
              </p>

              <div className="space-y-4">
                {/* LOGIN + CLOUD */}
                <div className="bg-indigo-50 p-3 rounded border border-indigo-100">
                  <h3 className="font-bold text-indigo-700 text-base">
                    🔒 Login & Cloud Storage
                  </h3>
                  <p>
                    Sekarang BJT pakai sistem akun beneran. Data kalian nggak
                    lagi numpang di browser, tapi disimpen di Cloud biar
                    kegoblokan kalian bisa diakses dari HP, laptop, sampai
                    warnet depan kos.
                  </p>
                </div>

                {/* TODO + JADWAL */}
                <div>
                  <h3 className="font-bold text-indigo-600 text-base">
                    📝 To-Do List & Jadwal
                  </h3>
                  <p>
                    Catet tugas & jadwal kuliah. Bisa langsung masuk Google
                    Calendar biar kalian diingetin HP, bukan rasa panik seminggu
                    setelah deadline lewat.
                  </p>
                </div>

                {/* POMODORO */}
                <div>
                  <h3 className="font-bold text-indigo-600 text-base">
                    🍅 Custom Pomodoro
                  </h3>
                  <p>
                    Set timer. Jalanin. Rasain countdown-nya ngegerus rasa aman
                    palsu yang kalian banggakan itu. Alarmnya bisa kalian custom
                    semau kalian—suara kampus, suara deadline, atau audio yang
                    bikin kalian inget betapa seringnya kalian ngacir dari
                    tanggung jawab.
                  </p>
                  <p>
                    Bikin alarm yang cukup pedes buat nyariin harga diri kalian
                    yang hilang entah ke mana. Di sini kalian bukan cuma ngatur
                    waktu—kalian ngatur perang melawan versi diri kalian yang
                    useless.
                  </p>
                </div>

                {/* DISCLAIMER IPHONE */}
                <div className="bg-red-50 border border-red-100 p-3 rounded-lg text-red-800 text-xs">
                  <h4 className="font-bold mb-1">🔔 Notifikasi HP</h4>
                  <p>
                    Selama kalian masih buka browser, notif Pomodoro jalan aman.
                    Begitu kalian keluar dikit, pindah apps, apalagi kalau
                    kalian pake iPhone? Ya udah… notif telat.
                  </p>
                  <p className="mt-1 italic">
                    iPhone itu cantik doang—begitu soal background task,
                    mentalnya nyerah duluan. Dan kalian para mahasiswa sem 1
                    yang sok eksklusif cuma gara-gara megang iPhone? Tenang...
                    yang premium itu HP-nya. Konsistensi kalian masih kalah sama
                    Wi-Fi kosan.
                  </p>
                </div>
              </div>

              {/* QUOTE */}
              <p className="text-xs text-center text-slate-500 border-t pt-4 italic">
                “Orang yang tersesat bukan karena gelapnya dunia, tapi karena
                dia lebih nyaman memejamkan mata.”
                <br />— <strong>Bas</strong>
              </p>
            </>
          )}

          {/* === UPDATE === */}
          {modalType === "update" && (
            <>
              <p className="font-bold text-lg">
                Developer akhirnya sadar kalau privasi itu penting!
              </p>
              <p>
                Update kali ini update <strong>TERBESAR</strong>. Kita pindah
                dari kosan browser ke apartemen Cloud.
              </p>

              <div className="space-y-4 mt-4">
                <h3 className="font-bold text-lg border-b pb-2">
                  🔥 Apa yang baru di v2.1.0?
                </h3>

                <div className="bg-emerald-50 p-3 rounded border border-emerald-100">
                  <h4 className="font-bold text-emerald-800">
                    🔐 Login System
                  </h4>
                  <p>
                    Mulai sekarang wajib login. Biar jadwal berantakan kalian ga
                    bisa diintip sembarangan.
                  </p>
                </div>

                <div className="bg-emerald-50 p-3 rounded border border-emerald-100">
                  <h4 className="font-bold text-emerald-800">
                    ☁️ Cloud Database (MongoDB)
                  </h4>
                  <p>
                    Semua data disimpen aman di server. Ganti HP? Clear cache?
                    Santai. Data tetap hidup.
                  </p>
                </div>

                <div className="bg-orange-50 p-3 rounded border border-orange-100 text-orange-900">
                  <h4 className="font-bold">⚠️ “Kok data gue hilang?”</h4>
                  <p className="text-sm mt-1">
                    Bukan hilang. Sistem baru pakai akun pribadi, jadi kalian
                    perlu input ulang data untuk pertama kali.
                  </p>
                  <p className="text-sm mt-2 font-bold">
                    Anggap aja ini cleansing data—buang sampah-sampah akademik
                    kalian.
                  </p>
                </div>
              </div>

              <p className="text-xs text-slate-500 italic mt-4 text-center">
                Selamat menikmati fitur yang lebih stabil daripada niat kalian
                kuliah.
              </p>
            </>
          )}
        </div>

        {/* FOOTER */}
        <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end shrink-0">
          <button
            onClick={handleClose}
            className="bg-slate-800 hover:bg-slate-900 text-white px-6 py-3 rounded-xl font-bold transition active:scale-95 w-full md:w-auto"
          >
            Bacot, developer miskin!
          </button>
        </div>
      </div>
    </div>
  );
}

export default IntroModal;
