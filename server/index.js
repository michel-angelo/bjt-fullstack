//learn-backend/index.js
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cors());

const mongoURI =
  "mongodb+srv://basthatan_user:basthatan666@belajardb.q7w0mmw.mongodb.net/?appName=BelajarDB";

mongoose
  .connect(mongoURI)
  .then(() => console.log("✅ BERHASIL KONEK KE MONGODB JAKARTA BOS!"))
  .catch((err) => console.log(err, "GAGAL KONEK KE MONGODB JAKARTA BOS!"));

const BitchesSchema = new mongoose.Schema({
  name: String,
  role: String,
  city: String,
});
const Bitch = mongoose.model("Bitch", BitchesSchema);

const TodoSchema = new mongoose.Schema({
  nama: String,
  jam: String,
  tanggal: String,
  status: { type: Boolean, default: false },
});
const Todo = mongoose.model("Todo", TodoSchema);

app.get("/", (req, res) => {
  res.send("Server BJT ON!");
});

//ROUTE TO /BITCHES
//====================================================================================
app.get("/bitches", async (req, res) => {
  try {
    const data = await Bitch.find();
    res.json({
      message: "List of Bitches from DB",
      data: data,
    });
  } catch (error) {
    res.status(500).json({ message: "Error ambil data", error });
  }
});

app.post("/bitches", async (req, res) => {
  try {
    const newData = req.body;

    const savedBitch = await Bitch.create(newData);

    res.status(201).json({
      message: "New Bitches Added",
      data: savedBitch,
    });
  } catch (error) {
    res.status(500).json({ message: "GAGAL SAVE DATA", error });
  }
});

app.put("/bitches/:id", async (req, res) => {
  const { id } = req.params;
  const dataUpdate = req.body;

  try {
    const updatedBitch = await Bitch.findByIdAndUpdate(id, dataUpdate, {
      new: true,
    });

    if (updatedBitch) {
      res.json({ message: "Bitches Updated", data: updatedBitch });
    } else {
      res.status(404).json({ message: "Bitch Not Found!" });
    }
  } catch (error) {
    res.status(500).json({ message: "Update Failed", error });
  }
});

app.delete("/bitches/:id", async (req, res) => {
  const { id } = req.params;
  console.log("Mencoba menghapus ID:", id);

  try {
    const deletedBitch = await Bitch.findByIdAndDelete(id);

    if (deletedBitch) {
      res.json({ message: "Bitch Deleted from DB", data: deletedBitch });
    } else {
      res.status(404).json({ message: "Bitch Not Found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Gagal hapus", error });
  }
});
//====================================================================================

//ROUTES TO API/TODOS
app.get("/api/todos", async (req, res) => {
  try {
    const todos = await Todo.find();
    res.json(todos);
  } catch (error) {
    res.status(500).json({ error: "Failed Accessed..." });
  }
});

app.post("/api/todos", async (req, res) => {
  try {
    const newTodo = await Todo.create(req.body);
    res.status(201).json({ newTodo });
  } catch (error) {
    res.status(500).json({ error: "Failed save data..." });
  }
});

app.delete("/api/todos/:id", async (req, res) => {
  try {
    await Todo.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted..." });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete..." });
  }
});

app.put("/api/todos/:id", async (req, res) => {
  try {
    const updatedTodo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(updatedTodo);
  } catch (error) {
    res.status(500).json({ error: "Failed to update..." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
