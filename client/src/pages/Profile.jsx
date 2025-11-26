// src/pages/Profile.jsx
import { useState, useRef, useEffect } from "react";
import Swal from "sweetalert2";

const API_PROFILE =
  "https://bjt-fullstack-production.up.railway.app/api/auth/profile";

function Profile({ user, setUser }) {
  const [formData, setFormData] = useState(user);
  const fileInputRef = useRef(null);

  useEffect(() => {
    setFormData(user);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUploadPhoto = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 2048 * 2048) {
      Swal.fire({
        icon: "error",
        title: "Dongo kali lu ya",
        text: "Kegedean itu file potonya, Max 4mb aja.",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setFormData((prev) => ({ ...prev, photo: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async () => {
    const token = localStorage.getItem("bjt_token");
    try {
      const res = await fetch(API_PROFILE, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: token },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        const updatedData = await res.json();
        setUser(updatedData);
        Swal.fire({
          title: "Profil berhasil di-update",
          text: "Hidup lu kapan?",
          icon: "success",
          timer: 1500,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Gagal Save",
          text: "Kegedean file-nya dongo. Kecilin dulu filenya...",
          timer: 1500,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gatau lagi error",
        text: "coba lagi",
        timer: 1500,
      });
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-extrabold text-slate-800 mb-2">
          😎 Profil <span className="text-indigo-600">Pengguna</span>
        </h1>
        <p className="text-slate-500">
          Biar aplikasi ini tau siapa yang ngisi hidupnya.
        </p>
      </div>

      <div className="bg-white p-8 rounded-2xl shadow-lg border border-slate-100 text-center">
        <div className="relative inline-block mb-6 group">
          <img
            src={
              formData.photo ||
              `https://ui-avatars.com/api/?name=${formData.name}&background=random`
            }
            alt="Profile"
            className="w-32 h-32 rounded-full object-cover border-4 border-indigo-100 shadow-md"
          />
          <button
            onClick={() => fileInputRef.current.click()}
            className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full hover:bg-indigo-700 transition shadow-lg"
            title="Ganti Photo"
          >
            📷
          </button>
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleUploadPhoto}
            className="hidden"
            accept="image/*"
          />
        </div>

        <div className="space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">
              Nama Panggilan
            </label>
            <input
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="Siapa nama lu? gw tau hidup lu palsu, tapi seenggaknya taro nama asli disini."
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">
              Role / Status
            </label>
            <input
              name="role"
              type="text"
              value={formData.role}
              onChange={handleChange}
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="Contoh: Calon Sultan / Veteran Overthinking"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase mb-1 ml-1">
              Motto Hidup
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleChange}
              rows="3"
              className="w-full bg-slate-50 border border-slate-200 p-3 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
              placeholder="Tulis apa kek disini, terserah lu lah. akun-akun lu."
            />
          </div>

          <button
            onClick={handleSave}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transform active:scale-95 transition-all mt-4"
          >
            💾 Simpan Profil
          </button>
        </div>
      </div>
    </div>
  );
}

export default Profile;
