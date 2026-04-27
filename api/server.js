import mongoose from "mongoose";

const MONGO_URI = "mongodb+srv://hafizharayanputra_db_user:Disain2012%21@hrayyan.ed0acqj.mongodb.net/smart_locker";

let isConnected = false;

// CONNECT MONGO (biar nggak reconnect terus)
async function connectDB() {
  if (!isConnected) {
    await mongoose.connect(MONGO_URI);
    isConnected = true;
    console.log("✅ MongoDB CONNECTED");
  }
}

// ===== SCHEMA =====
const User = mongoose.models.User || mongoose.model("User", {
  uid: String,
  nama: String
});

const Barang = mongoose.models.Barang || mongoose.model("Barang", {
  kode: String,
  nama: String
});

const Log = mongoose.models.Log || mongoose.model("Log", {
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

// ===== HANDLER =====
export default async function handler(req, res) {
  await connectDB();

  const { url, method } = req;

  try {
    // ROOT
    if (url === "/api" || url === "/api/") {
      return res.status(200).send("🚀 API SMART LOCKER VERCEL");
    }

    // ===== USERS =====
    if (url.startsWith("/api/users")) {
      if (method === "GET") {
        const data = await User.find();
        return res.status(200).json(data);
      }
    }

    // ===== BARANG =====
    if (url.startsWith("/api/barang")) {
      if (method === "GET") {
        const data = await Barang.find();
        return res.status(200).json(data);
      }
    }

    // ===== LOGS =====
    if (url.startsWith("/api/logs")) {
      if (method === "GET") {
        const data = await Log.find().sort({ waktu: -1 });
        return res.status(200).json(data);
      }

      if (method === "POST") {
        const { uid, nama, barang, mode, hari } = req.body;

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

        return res.status(200).json(log);
      }
    }

    // ===== SEED USERS =====
    if (url.startsWith("/api/seed-users")) {
      await User.deleteMany();

      await User.insertMany([
        { uid: "4112233", nama: "Hafizh" },
        { uid: "9988776", nama: "Budi" }
      ]);

      return res.status(200).send("Users OK");
    }

    // ===== SEED BARANG =====
    if (url.startsWith("/api/seed-barang")) {
      await Barang.deleteMany();

      await Barang.insertMany([
        { kode: "B001", nama: "Laptop" },
        { kode: "B002", nama: "Proyektor" }
      ]);

      return res.status(200).send("Barang OK");
    }

    // DEFAULT
    return res.status(404).send("Not Found");

  } catch (err) {
    console.log("❌ ERROR:", err);
    return res.status(500).send(err.message);
  }
}