require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
// PORT: Railway otomatis ngasih port di process.env.PORT (biasanya 8080)
const PORT = process.env.PORT || 3000;

// === 1. SETTING SATPAM (CORS) - WAJIB DI PALING ATAS ===
// origin: "*" artinya bolehin siapa aja (Netlify, Vercel, Localhost) masuk.
app.use(
  cors({
    origin: "*",
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    preflightContinue: false,
    optionsSuccessStatus: 204,
  })
);

// === 2. SETTING PARSER (PEMBACA DATA) ===
// Cukup sekali aja, langsung set limit gede buat foto/mp3
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

// === 3. KONEKSI DATABASE ===
const mongoURI =
  "mongodb+srv://basthatan_user:basthatan666@belajardb.q7w0mmw.mongodb.net/?appName=BelajarDB";

mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ BERHASIL KONEK KE MONGODB JAKARTA BOS!"))
  .catch((err) => console.log("❌ GAGAL KONEK:", err));

// === 4. MIDDLEWARE VERIFIKASI TOKEN ===
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token)
    return res.status(401).json({ message: "Akses ditolak, mana tiketnya?" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: "Tiket palsu!" });
  }
};

// ==========================
// SCHEMA & MODELS
// ==========================

const TodoSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  nama: String,
  jam: String,
  tanggal: String,
  done: { type: Boolean, default: false }, // Gw benerin jadi 'done' biar konsisten sama frontend lo yg lama, atau lo pake 'status'? Cek frontend lo.
});
const Todo = mongoose.model("Todo", TodoSchema);

const JadwalSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  matkul: String,
  hari: String,
  jam: String,
});
const Jadwal = mongoose.model("Jadwal", JadwalSchema);

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, default: "User BJT" },
  role: { type: String, default: "Maba Stress" },
  bio: { type: String, default: "Hidup segan mati tak mau." },
  photo: { type: String, default: "" },
  customAlarm: { type: String, default: "" },
});
const User = mongoose.model("User", UserSchema);

// ==========================
// ROUTES
// ==========================

// Cek Server Nyala
app.get("/", (req, res) => {
  res.send("Server BJT Menyala 🔥 Siap menerima hujatan.");
});

// --- AUTH ROUTES ---
app.post("/api/auth/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    // Cek user ada ga
    const existingUser = await User.findOne({ username });
    if (existingUser)
      return res.status(400).json({ error: "Username udah dipake!" });

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.create({ username, password: hashedPassword });
    res.status(201).json({ message: "User created" });
  } catch (e) {
    console.error(e); // Liat error di log server kalo gagal
    res.status(500).json({ error: "Gagal daftar, server pusing." });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(400).json({ error: "User gak ketemu" });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ error: "Password salah" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user._id, username: user.username } });
  } catch (e) {
    res.status(500).json({ error: "Login error" });
  }
});

// --- PROFILE ROUTES ---
app.get("/api/auth/profile", verifyToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: "Gagal ambil profil" });
  }
});

app.put("/api/auth/profile", verifyToken, async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.user.id,
      { $set: req.body },
      { new: true }
    ).select("-password");
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: "Gagal update profil" });
  }
});

// --- HALL OF FAME (USERS) ---
app.get("/api/users", verifyToken, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users.reverse());
  } catch (error) {
    res.status(500).json({ error: "Gagal ambil data warga." });
  }
});

// --- TODO ROUTES ---
app.get("/api/todos", verifyToken, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.id });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: "Gagal ambil todos" });
  }
});

app.post("/api/todos", verifyToken, async (req, res) => {
  try {
    const newTodo = await Todo.create({ ...req.body, userId: req.user.id });
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: "Gagal save todos" });
  }
});

app.delete("/api/todos/:id", verifyToken, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!todo) return res.status(404).json({ error: "Todo not found" });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: "Gagal delete" });
  }
});

app.put("/api/todos/:id", verifyToken, async (req, res) => {
  try {
    const updatedTodo = await Todo.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: "Gagal update" });
  }
});

// --- JADWAL ROUTES ---
app.get("/api/jadwal", verifyToken, async (req, res) => {
  try {
    const data = await Jadwal.find({ userId: req.user.id });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error ambil jadwal" });
  }
});

app.post("/api/jadwal", verifyToken, async (req, res) => {
  try {
    const dataBaru = await Jadwal.create({ ...req.body, userId: req.user.id });
    res.status(201).json(dataBaru); // Gw ilangin kurung kurawal biar langsung dapet object
  } catch (error) {
    res.status(500).json({ message: "Gagal save jadwal" });
  }
});

app.delete("/api/jadwal/:id", verifyToken, async (req, res) => {
  try {
    const jadwal = await Jadwal.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!jadwal) return res.status(404).json({ error: "Jadwal not found" });
    res.json({ message: "Deleted" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete" });
  }
});

// === JALANIN SERVER ===
app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
