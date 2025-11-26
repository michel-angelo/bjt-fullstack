// src/pages/Home.jsx
import { useState, useEffect } from "react";
import ToDoList from "../components/ToDoList.jsx";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const API_URL = "https://bjt-fullstack-production.up.railway.app/api/todos";

function Home() {
  const [listKegiatan, setListKegiatan] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inputKegiatan, setInputKegiatan] = useState("");
  const [inputJam, setInputJam] = useState("");
  const [inputTanggal, setInputTanggal] = useState("");
  const [showRant, setShowRant] = useState(false);

  const navigate = useNavigate();

  const token = localStorage.getItem("bjt_token");

  const fetchTodos = async () => {
    try {
      const response = await fetch(API_URL, {
        headers: {
          Authorization: token,
        },
      });

      if (response.status === 401) {
        localStorage.removeItem("bjt_token");
        navigate("/login");
        return;
      }

      const data = await response.json();
      setListKegiatan(data);
      setLoading(false);
    } catch (error) {
      console.error("Gagal ambil data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) fetchTodos();
  }, [token]);

  const handleTambahKegiatan = async () => {
    if (inputKegiatan.trim() === "") return;

    const kegiatanBaru = {
      nama: inputKegiatan,
      jam: inputJam,
      tanggal: inputTanggal,
      done: false,
    };

    try {
      const response = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify(kegiatanBaru),
      });

      const dataSaved = await response.json();
      setListKegiatan((prev) => [...prev, dataSaved]);

      setInputKegiatan("");
      setInputJam("");
      setInputTanggal("");
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error blog...",
        text: "gatau error pokoknya, coba cek lagi, keisi semua ga?",
        timer: 1000,
      });
    }
  };

  const hapusKegiatan = async (id) => {
    const result = await Swal.fire({
      title: "Yakin mau dihapus?",
      text: "Tugas ini bakal ilang selamanya loh!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus aja!",
      cancelButtonText: "Gak jadi",
    });

    if (result.isConfirmed) {
      const backup = [...listKegiatan];
      setListKegiatan((prev) => prev.filter((item) => item._id !== id));

      try {
        await fetch(`${API_URL}/${id}`, {
          method: "DELETE",
          headers: { Authorization: token },
        });

        Swal.fire({
          title: "Terhapus!",
          text: "Tugas berhasil dibuang ke tempat sampah.",
          icon: "success",
          timer: 1000,
          showConfirmButton: false,
        });
      } catch (error) {
        Swal.fire("Error", "Gagal hapus di server!", "error");
        setListKegiatan(backup);
      }
    }
  };

  const kegiatanSelesai = async (id, statusSekarang) => {
    setListKegiatan((prev) =>
      prev.map((item) =>
        item._id === id ? { ...item, done: !statusSekarang } : item
      )
    );

    try {
      await fetch(`${API_URL}/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: token,
        },
        body: JSON.stringify({ done: !statusSekarang }),
      });
    } catch (error) {
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
      });

      Toast.fire({
        icon: "error",
        title: "Gagal update status! Cek internet.",
      });

      setListKegiatan((prev) =>
        prev.map((item) =>
          item._id === id ? { ...item, done: statusSekarang } : item
        )
      );
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="text-center mb-12 space-y-4">
        <h1 className="text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent tracking-tight">
          BJT
        </h1>
        <p className="text-xl font-bold text-slate-700 tracking-widest uppercase">
          Baby Jesus Tools
        </p>

        <div className="bg-orange-50 p-6 rounded-2xl border border-orange-200 text-slate-700 text-sm leading-relaxed text-left shadow-inner">
          <div className="font-bold text-orange-800 mb-2 flex items-center gap-2">
            ⚠️ PERINGATAN: BACA DULU SEBELUM PAKE
          </div>

          <p className="mb-3">
            <strong>"All-in-One Productivity App"</strong> — Persembahan Spesial
            untuk Kalian:
            <span className="bg-orange-200 px-1 rounded ml-1 font-bold">
              Domba-Domba Semester 1 yang Tersesat.
            </span>
          </p>

          <div
            className={`transition-all duration-500 overflow-hidden ${
              showRant ? "max-h-[100000px] opacity-100" : "max-h-0 opacity-50"
            }`}
          >
            <div className="space-y-3 mt-4 border-t border-orange-200 pt-4 text-slate-600">
              <p>
                Aplikasi ini dibuat untuk kalian—spesies mahasiswa baru yang
                hidupnya baru nyobain satu bulan kuliah, tapi ngeluhnya udah
                kayak dosen 30 tahun ngajar tanpa kenaikan gaji.
              </p>
              <p>
                Masih bau kencur, gaya selangit, dateng ke kampus pake outfit
                heboh, padahal dompet megap-megap dan otak masih kosong
                melompong. Tugas baru dikasih dua, langsung nge-post story layar
                hitam pake caption font kecil:
                <em> "Capek banget jadi mahasiswa 😔"</em>
              </p>
              <p>
                Padahal yang capek itu dosen kalian. Ngajar kelas yang isinya
                masih bau OSPEK tapi sok kritis.Sibuk amat cari muka, padahal
                dosen lu aja lupa nama lu siapa lima detik abis lu keluar
                ruangan.
              </p>
              <p>
                Kalian dateng kuliah cuma biar keliatan ada tujuan hidup,
                padahal balik ke rumah langsung buka TikTok sampai lupa kalo
                sebenernya kalian punya otak yang harusnya dipake.
              </p>
              <p className="italic bg-orange-100 p-2 rounded border-l-4 border-orange-400">
                Organisasi baru kenal tiga hari udah update: "Family banget sih
                😭🙏🏻"
                <br />
                Family dari mana, kocak? Nama ketua bidang aja lo belum hafal,
                muka dua lu noh udah ke mana-mana.
              </p>
              <p>
                Sibuk amat nyari validasi di Himpunan, padahal cuman butiran
                debu di kampus ini.
              </p>

              <hr className="border-orange-200 my-4" />

              <p className="font-bold text-indigo-600">
                Dan developernya? Basthatan a.k.a Baby Jesus a.k.a Baß.
              </p>
              <p>
                Jujur aja... ini manusia tolol, dongo, bego dan idiot. Dia bikin
                ini dengan sisa-sisa kewarasan yang udah minus. Kelas dibuka
                cuma buat absen, tugas dikerjain kayak judi slot—kadang jadi,
                kadang ngadat, kadang hilang motivasi tengah jalan.
              </p>
              <p>
                Ngoding setengah sadar, sambil mikir keras kenapa dulu gak
                ternak lele aja di kampung.
                <br />
                Produktif? <strong>TAI KALI.</strong>
                <br />
                Tapi kalau lomba 'kelihatan sibuk padahal otak kosong'?{" "}
                <strong>Bilang Panitia-nya kasih aja piala-nya ke gw</strong>
              </p>
              <p>
                Jadi kalau hidup lu sekarang amburadul gara-gara kuliah yang
                baru mulai tapi rasanya udah mau menyerah, gak usah minder.Yang
                bikin aplikasi ini aja hidupnya udah kayak tulisan dokter di
                resep obat: ruwet, jelek, dan cuma dia sama Tuhan yang tau
                arahnya ke mana.
              </p>
              <p className="font-bold text-center mt-4 text-orange-800">
                Selamat menggunakan aplikasi yang jauh lebih stabil daripada
                mental kalian semua😊.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowRant(!showRant)}
            className="text-orange-600 font-bold hover:underline text-xs mt-2 flex items-center gap-1"
          >
            {showRant
              ? "Tutup Aib Ini (Collapse) ▲"
              : "Baca Kebenaran Pahit (Expand) ▼"}
          </button>
        </div>

        <div className="grid grid-cols-3 gap-2 text-xs md:text-sm mt-6">
          <div className="bg-indigo-50 p-2 rounded border border-indigo-100 text-indigo-700 font-bold">
            📝 Catat Tugas
          </div>
          <Link
            to="/jadwal"
            className="bg-white p-2 rounded border border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 transition text-slate-600 hover:text-indigo-600"
          >
            📅 Cek Jadwal
          </Link>
          <Link
            to="/fokus"
            className="bg-white p-2 rounded border border-slate-200 hover:bg-indigo-50 hover:border-indigo-200 transition text-slate-600 hover:text-indigo-600"
          >
            🍅 Mode Fokus
          </Link>
        </div>
      </div>
      <div className="bg-white p-6 rounded-2xl shadow-lg border border-slate-100 mb-8 transform transition-all hover:shadow-xl">
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">
              Kegiatan
            </label>
            <input
              type="text"
              className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent p-3 transition outline-none"
              placeholder="Contoh: Meratapi Salah Jurusan..."
              value={inputKegiatan}
              onChange={(e) => setInputKegiatan(e.target.value)}
            />
          </div>

          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">
                Tanggal
              </label>
              <input
                type="date"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent p-3 transition outline-none"
                value={inputTanggal}
                onChange={(e) => setInputTanggal(e.target.value)}
              />
            </div>

            <div className="md:w-1/3">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">
                Jam
              </label>
              <input
                type="time"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 text-sm rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent p-3 transition outline-none"
                value={inputJam}
                onChange={(e) => setInputJam(e.target.value)}
              />
            </div>
          </div>
        </div>

        <button
          className="w-full mt-4 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transform active:scale-95 transition-all duration-200"
          onClick={handleTambahKegiatan}
        >
          🚀 Tambah Kegiatan
        </button>
      </div>
      <div className="space-y-3">
        {listKegiatan.length === 0 ? (
          <div className="text-center py-16 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-300 hover:border-indigo-300 transition duration-300 group">
            <p className="text-5xl mb-4 grayscale group-hover:grayscale-0 transition">
              🪦
            </p>
            <p className="text-slate-600 font-bold text-lg px-6">
              "Masih kosong?"
            </p>
            <p className="text-slate-500 italic px-6 mt-1 group-hover:text-indigo-600 transition">
              Hidup lu isinya wacana doang apa gimana? Isi kocak...
            </p>
          </div>
        ) : (
          listKegiatan.map((kegiatan) => (
            <ToDoList
              key={kegiatan._id}
              kegiatan={kegiatan}
              onHapus={() => hapusKegiatan(kegiatan._id)}
              onSelesai={() => kegiatanSelesai(kegiatan._id, kegiatan.done)}
            />
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
