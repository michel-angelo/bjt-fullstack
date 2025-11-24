//src/pages/Pomodoro.jsx
import { useState, useEffect, useRef } from "react";

const DEFAULT_ALARM = "/alarm.mp3";

function Pomodoro() {
  const [waktu, setWaktu] = useState(25 * 60);
  const [aktif, setAktif] = useState(false);
  const [istirahat, setIstirahat] = useState(false);

  const [audioSrc, setAudioSrc] = useState(() => {
    return localStorage.getItem("customAlarm") || DEFAULT_ALARM;
  });

  const fileInputReff = useRef(null);

  useEffect(() => {
    if ("Notification" in window && Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);

  const handleUploadAudio = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      Alert(
        "File-nya kegedean, mas/mba... Max 2mb aja biar webnya lancar... Cihuyyy"
      );
      return;
    }

    if (!file.type.startsWith("audio/")) {
      alert(
        "File Audio dong mba/mas... Jangan yang lain2... Pastiin MP3 atau WAV"
      );
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const base64audio = reader.result;
      setAudioSrc(base64audio);
      localStorage.setItem("customAlarm", base64audio);
      alert("Suara berhasil diganti... Enjoy your study w new alarm...");
    };
    reader.readAsDataURL(file);
  };

  const resetAudio = () => {
    setAudioSrc(DEFAULT_ALARM);
    localStorage.removeItem("customAlarm");
    if (fileInputReff.current) fileInputReff.current.value = "";
    alert("Back to default Alarm");
  };

  const tesSuara = () => {
    const audio = new Audio(audioSrc);
    audio.play();
  };

  const mainkanAlarm = () => {
    const audio = new Audio(audioSrc);
    audio.play().catch((e) => console.log("Audio play failed", e));

    if (Notification.permission === "granted") {
      new Notification(
        istirahat ? "PUAS SCROLLINGNYA, NYET?" : "OTAK LO UDAH NGEBUL, KAN?",
        {
          body: istirahat
            ? "Simpen HP lo. Balik jadi budak tugas sebelum lo nyesel seumur hidup."
            : "Sana istirahat. Isi ulang dopamin lo pake konten sampah 5 menit.",
          icon: "/carti.svg",
          vibrate: [200, 100, 200],
        }
      );
    }
  };

  useEffect(() => {
    let interval = null;
    if (aktif && waktu > 0) {
      interval = setInterval(() => {
        setWaktu((prev) => prev - 1);
      }, 1000);
    } else if (waktu === 0 && aktif) {
      setAktif(false);
      mainkanAlarm();
    }
    return () => clearInterval(interval);
  }, [aktif, waktu, istirahat]);

  const formatWaktu = (detik) => {
    const menit = Math.floor(detik / 60);
    const sisaDetik = detik % 60;
    return `${menit < 10 ? "0" + menit : menit}:${
      sisaDetik < 10 ? "0" + sisaDetik : sisaDetik
    }`;
  };

  const gantiMode = (modeIstirahat) => {
    setIstirahat(modeIstirahat);
    setAktif(false);
    setWaktu(modeIstirahat ? 5 * 60 : 25 * 60);
  };

  const themeColor = istirahat
    ? aktif
      ? "text-green-500 border-green-500"
      : "text-teal-600 border-teal-100"
    : aktif
    ? "text-orange-500 border-orange-500"
    : "text-indigo-600 border-indigo-100";

  const bgTheme = istirahat
    ? aktif
      ? "bg-green-50"
      : "bg-white"
    : aktif
    ? "bg-orange-50"
    : "bg-white";

  return (
    <div className="max-w-xl mx-auto text-center pb-10">
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-slate-800 mb-4">
          {istirahat ? "☕ Mode Santuy" : "🍅 Mode Fokus"}
        </h1>

        <div
          className={`p-4 rounded-xl border ${
            istirahat
              ? "bg-teal-50 border-teal-200 text-teal-800"
              : "bg-orange-50 border-orange-200 text-orange-800"
          }`}
        >
          <p className="font-medium">
            {istirahat
              ? "Istirahat 'bentar' katanya. Padahal aslinya bakal 3 jam scrolling TikTok. Dasar lemah."
              : "Taruh HP lo. Tahan jari lo biar gak gatel buka IG. Pura-pura rajin 25 menit doang susah amat."}
          </p>
        </div>
      </div>

      <div className="flex justify-center gap-4 mb-6">
        <button
          onClick={() => gantiMode(false)}
          className={`px-4 py-2 rounded-full font-bold transition ${
            !istirahat
              ? "bg-indigo-600 text-white"
              : "bg-slate-200 text-slate-600"
          }`}
        >
          Fokus (25m)
        </button>
        <button
          onClick={() => gantiMode(true)}
          className={`px-4 py-2 rounded-full font-bold transition ${
            istirahat ? "bg-teal-500 text-white" : "bg-slate-200 text-slate-600"
          }`}
        >
          Istirahat (5m)
        </button>
      </div>

      <div
        className={`p-10 rounded-3xl shadow-xl border-4 transition-all duration-500 mb-8 ${themeColor} ${bgTheme}`}
      >
        <div className="text-6xl sm:text-7xl md:text-9xl font-mono font-bold tracking-wider mb-10 transition-all">
          {formatWaktu(waktu)}
        </div>
        <div className="flex justify-center gap-4">
          <button
            className={`px-8 py-4 rounded-xl font-bold text-xl text-white shadow-lg transform active:scale-95 transition-all hover:shadow-xl ${
              istirahat
                ? "bg-teal-500 hover:bg-teal-600"
                : aktif
                ? "bg-orange-500 hover:bg-orange-600"
                : "bg-indigo-600 hover:bg-indigo-700"
            }`}
            onClick={() => setAktif(!aktif)}
          >
            {aktif ? "⏸ PAUSE" : "▶ MULAI"}
          </button>
          <button
            className="px-8 py-4 rounded-xl font-bold text-xl bg-slate-200 text-slate-600 hover:bg-slate-300 shadow-md transform active:scale-95 transition-all"
            onClick={() => {
              setAktif(false);
              setWaktu(istirahat ? 5 * 60 : 25 * 60);
            }}
          >
            🔄 RESET
          </button>
        </div>
      </div>

      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm max-w-md mx-auto">
        <h3 className="text-sm font-bold text-slate-500 uppercase mb-3">
          🎵 Setting Alarm
        </h3>

        <div className="flex flex-col gap-3 justify-center items-center">
          <input
            type="file"
            accept="audio/*"
            ref={fileInputReff}
            onChange={handleUploadAudio}
            className="block w-full text-sm text-slate-500
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-full file:border-0
                  file:text-sm file:font-semibold
                  file:bg-indigo-50 file:text-indigo-700
                  hover:file:bg-indigo-100
                "
          />

          <div className="flex gap-2 justify-center">
            <button
              onClick={tesSuara}
              className="text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 px-3 py-1 rounded border border-slate-300"
            >
              🔊 Tes Suara
            </button>

            {audioSrc !== DEFAULT_ALARM && (
              <button
                onClick={resetAudio}
                className="text-xs bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1 rounded border border-red-200"
              >
                ❌ Pake Suara Default
              </button>
            )}
          </div>

          <p className="text-xs text-slate-400 mt-1">
            *Maksimal ukuran file 2MB (MP3/WAV). Suara disimpen di browser kamu.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Pomodoro;
