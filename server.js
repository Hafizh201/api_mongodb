const express = require("express");
const mongoose = require("mongoose");

const app = express();
app.use(express.json());

// ===== MONGODB CONNECT =====
// ⚠️ password sudah di-encode (%21)
const MONGO_URI = "mongodb+srv://hafizharayanputra_db_user:Disain2012%21@hrayyan.ed0acqj.mongodb.net/smart_locker";

mongoose.connect(MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB CONNECTED");
    console.log("📂 DB NAME:", mongoose.connection.name);
  })
  .catch(err => {
    console.log("❌ ERROR CONNECT:");
    console.log(err);
  });

// ===== SCHEMA =====
const Log = mongoose.model("Log", {
  uid: String,
  nama: String,
  barang: String,
  mode: String,
  hari: Number,
  deadline: String
});

// ===== ROOT TEST =====
app.get("/", (req, res) => {
  res.send("🚀 API Smart Locker Jalan");
});

// ===== GET USERS =====
app.get("/users", async (req, res) => {
  try {
    const data = await mongoose.connection.db
      .collection("users")
      .find()
      .toArray();

    res.json(data);
  } catch (err) {
    console.log("ERROR GET USERS:", err);
    res.status(500).send("ERROR");
  }
});

// ===== GET BARANG =====
app.get("/barang", async (req, res) => {
  try {
    const data = await mongoose.connection.db
      .collection("barang")
      .find()
      .toArray();

    res.json(data);
  } catch (err) {
    console.log("ERROR GET BARANG:", err);
    res.status(500).send("ERROR");
  }
});

// ===== POST LOG =====
app.post("/logs", async (req, res) => {
  console.log("📥 DATA MASUK:", req.body);

  try {
    const result = await Log.create(req.body);

    console.log("✅ TERSIMPAN:", result);

    res.send("OK");
  } catch (err) {
    console.log("❌ ERROR SIMPAN:", err);
    res.status(500).send("ERROR");
  }
});

// ===== SERVER =====
app.listen(3000, () => {
  console.log("🌐 Server jalan di http://localhost:3000");
});