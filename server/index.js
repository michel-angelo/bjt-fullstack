//server/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ limit: "15mb", extended: true }));

const mongoURI =
  "mongodb+srv://basthatan_user:basthatan666@belajardb.q7w0mmw.mongodb.net/?appName=BelajarDB";

mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ BERHASIL KONEK KE MONGODB JAKARTA BOS!"))
  .catch((err) => console.log(err, "GAGAL KONEK KE MONGODB JAKARTA BOS!"));

const verifyToken = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token)
    return res.status(401).json({ message: "No token, authorization denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(400).json({ message: "Token is not valid" });
  }
};

//ALL SCHEMES AND MODELS HERE
//=== TODOS SCHEME ===
const TodoSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  nama: String,
  jam: String,
  tanggal: String,
  status: { type: Boolean, default: false },
});
const Todo = mongoose.model("Todo", TodoSchema);
//=== TODOS SCHEME ===

//=== JADWAL SCHEME ===
const JadwalSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  matkul: String,
  hari: String,
  jam: String,
});

const Jadwal = mongoose.model("Jadwal", JadwalSchema);
//=== JADWAL SCHEME ===

//=== USER SCHEME ===
const userScheme = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },

  name: { type: String, default: "User BJT" },
  role: { type: String, default: "Maba Stress" },
  bio: { type: String, default: "Hidup segan mati tak mau." },
  photo: { type: String, default: "" },
  customAlarm: { type: String, default: "" },
});

const User = mongoose.model("User", userScheme);
//=== USER SCHEME ===

// DEFAULT ROUTE
app.get("/", (req, res) => {
  res.send("Server BJT ON!");
});

app.get("/api/users", verifyToken, async (req, res) => {
  try {
    const users = await User.find().select("-password -username");
    res.json(user.reverse());
  } catch (error) {
    res.status(500).json({ error: "Gagal ambil data para domba" });
  }
});

//ROUTES TO API/TODOS
//====================================================================================
app.get("/api/todos", verifyToken, async (req, res) => {
  try {
    const todos = await Todo.find({ userId: req.user.id });
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: "Failed Accessed..." });
  }
});

app.post("/api/todos", verifyToken, async (req, res) => {
  try {
    const newTodo = await Todo.create({ ...req.body, userId: req.user.id });
    res.status(201).json(newTodo);
  } catch (error) {
    res.status(500).json({ error: "Failed save data..." });
  }
});

app.delete("/api/todos/:id", verifyToken, async (req, res) => {
  try {
    const todo = await Todo.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!todo) return res.status(404).json({ error: "Todo not found..." });
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted..." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete..." });
  }
});

app.put("/api/todos/:id", verifyToken, async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: "Failed to update..." });
  }
});
//ROUTES TO API/TODOS
//====================================================================================

//ROUTES TO API/JADWAL
//====================================================================================
app.get("/api/jadwal", verifyToken, async (req, res) => {
  try {
    const data = await Jadwal.find({ userId: req.user.id });
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: "Error ambil data", error });
  }
});

app.post("/api/jadwal", verifyToken, async (req, res) => {
  try {
    const dataBaru = await Jadwal.create({
      ...req.body,
      userId: req.user.id,
    });
    res.status(201).json({ dataBaru });
  } catch (error) {
    res.status(500).json({ message: "Gagal save data...", error });
  }
});

app.delete("/api/jadwal/:id", async (req, res) => {
  try {
    const jadwal1 = await Jadwal.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });
    if (!jadwal1) return res.status(404).json({ error: "Jadwal not found..." });
    await Jadwal.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted..." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete..." });
  }
});
//ROUTES TO API/JADWAL
//====================================================================================

//ROUTES TO API/AUTH/REGISTER
//====================================================================================
app.post("/api/auth/register", async (req, res) => {
  const { username, password } = req.body;
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  try {
    await User.create({ username, password: hashedPassword });
    res.status(201).json({ message: "User created" });
  } catch (e) {
    res.status(500).json({ error: "Gagal daftar" });
  }
});

app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await User.findOne({ username });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(400).json({ error: "Salah woy" });
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);
  res.json({ token, user: { id: user._id, username: user.username } });
});
//ROUTES TO API/AUTH/REGISTER
//====================================================================================

//ROUTES TO API/AUTH/PROFILE
//====================================================================================
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
//ROUTES TO API/AUTH/PROFILE
//====================================================================================

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
