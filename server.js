const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// ===== CONFIG =====
const MONGO_URI = "mongodb+srv://hafizharayanputra_db_user:Disain2012%21@hrayyan.ed0acqj.mongodb.net/smart_locker";

// ===== CONNECT =====
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB CONNECTED");
    console.log("📂 DB:", mongoose.connection.name);
  })
  .catch(err => {
    console.log("❌ ERROR CONNECT:", err);
  });

// ===== SCHEMA =====
const User = mongoose.model("User", {
  uid: String,
  nama: String
});

const Barang = mongoose.model("Barang", {
  kode: String,
  nama: String
});

const Log = mongoose.model("Log", {
  uid: String,
  nama: String,
  barang: String,
  mode: String,
  hari: Number,
  deadline: String,
  waktu: {
    type: Date,
    default: Date.now
  }
});

// ===== ROOT =====
app.get("/", (req, res) => {
  res.send("🚀 API SMART LOCKER AKTIF");
});

// ===== SEED USERS =====
app.get("/seed-users", async (req, res) => {
  await User.deleteMany();

  await User.insertMany([
    { uid: "4112233", nama: "Hafizh" },
    { uid: "9988776", nama: "Budi" },
    { uid: "1122334", nama: "Andi" }
  ]);

  res.send("✅ Users masuk");
});

// ===== SEED BARANG =====
app.get("/seed-barang", async (req, res) => {
  await Barang.deleteMany();

  await Barang.insertMany([
    { kode: "B001", nama: "Laptop" },
    { kode: "B002", nama: "Proyektor" },
    { kode: "B003", nama: "Buku" }
  ]);

  res.send("✅ Barang masuk");
});

// ===== GET USERS =====
app.get("/users", async (req, res) => {
  try {
    const data = await User.find();
    res.json(data);
  } catch (err) {
    console.log("ERROR USERS:", err);
    res.status(500).send("ERROR");
  }
});

// ===== GET BARANG =====
app.get("/barang", async (req, res) => {
  try {
    const data = await Barang.find();
    res.json(data);
  } catch (err) {
    console.log("ERROR BARANG:", err);
    res.status(500).send("ERROR");
  }
});

// ===== GET LOGS =====
app.get("/logs", async (req, res) => {
  try {
    const data = await Log.find().sort({ waktu: -1 });
    res.json(data);
  } catch (err) {
    console.log("ERROR LOGS:", err);
    res.status(500).send("ERROR");
  }
});

// ===== POST LOG (PINJAM / BALIK) =====
app.post("/logs", async (req, res) => {
  try {
    const { uid, nama, barang, mode, hari } = req.body;

    // validasi max 3 hari
    const durasi = Math.min(hari || 1, 3);

    const now = new Date();
    const deadline = new Date();
    deadline.setDate(now.getDate() + durasi);

    const log = await Log.create({
      uid,
      nama,
      barang,
      mode,
      hari: durasi,
      deadline: deadline.toISOString()
    });

    res.json(log);
  } catch (err) {
    console.log("ERROR POST:", err);
    res.status(500).send("ERROR");
  }
});

// ===== PORT (WAJIB BUAT RENDER) =====
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log("🌐 Server jalan di port", PORT);
});
