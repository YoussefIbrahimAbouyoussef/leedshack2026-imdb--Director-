import express from "express";
import multer from "multer";
import dotenv from "dotenv";
import cors from "cors";
import { MongoClient } from "mongodb";

dotenv.config();

const app = express();
app.use(cors({ origin: true }));
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const upload = multer({ dest: "uploads/" });

// ---------- ENV ----------
const MONGO_URI = process.env.MONGO_URI;
const DB_NAME = process.env.DB_NAME || "casting";
const COLLECTION_NAME = process.env.COLLECTION_NAME || "actor";

if (!MONGO_URI) {
  console.error("❌ Missing MONGO_URI in .env");
  process.exit(1);
}

let collection;

// ---------- Helpers ----------
function pickFirst(...vals) {
  for (const v of vals) {
    if (v !== undefined && v !== null && v !== "") return v;
  }
  return null;
}

function normalizeActor(doc) {
  // Your Mongo uses: Name, Age (2026), pictures
  const name = pickFirst(doc.name, doc.Name, doc.fullName, doc.actorName, doc.ActorName, "Unknown");

  const age = pickFirst(
    doc.age,
    doc.Age,
    doc["Age (2026)"],     // ✅ this matches your screenshot field
    doc.Age2026,
    doc.actorAge,
    "N/A"
  );

  const budget = pickFirst(
    doc.budget,
    doc.Budget,
    doc.salary,
    doc.Salary,
    doc.pay,
    "N/A"
  );

  // ✅ your field is pictures (sometimes data:image... sometimes URL)
  const photo = pickFirst(
    doc.photo,
    doc.image,
    doc.img,
    doc.pictures,          // ✅ key one
    doc.Pictures,
    doc.picture,
    doc.avatar,
    doc.profilePic,
    doc.profileUrl,
    null
  );

  // if pictures is an array, take the first one
  const finalPhoto = Array.isArray(photo) ? (photo[0] ?? null) : photo;

  return {
    name: String(name),
    age: age === undefined || age === null ? "N/A" : age,
    budget: budget === undefined || budget === null ? "N/A" : budget,
    photo: finalPhoto, // ✅ frontend will use this
  };
}

async function connectToMongo() {
  const client = new MongoClient(MONGO_URI);
  await client.connect();

  const db = client.db(DB_NAME);
  collection = db.collection(COLLECTION_NAME);

  console.log(`✅ MongoDB connected (DB: ${DB_NAME}, Collection: ${COLLECTION_NAME})`);
}

// ---------- Routes ----------
app.get("/", (req, res) => res.send("✅ Server is running"));

// optional: check what fields exist in your docs
app.get("/debug/sample", async (req, res) => {
  try {
    const sample = await collection.find({}).limit(1).toArray();
    res.json({ sample: sample[0] || null });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "debug failed" });
  }
});

app.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) return res.status(400).json({ error: "file not uploaded" });

  // return a usable URL for images if you want
  res.json({
    message: "file uploaded",
    fileName: req.file.originalname,
    storedAs: `/uploads/${req.file.filename}`,
  });
});

// Search
app.get("/search", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();
    if (!q) return res.json({ results: [] });

    const regex = new RegExp(q, "i");

    const docs = await collection
      .find({
        $or: [
          { name: regex },
          { Name: regex },            // ✅ your real field
          { fullName: regex },
          { actorName: regex },
          { ActorName: regex },
        ],
      })
      .limit(200) // keep fast; increase if you want
      .toArray();

    res.json({ results: docs.map(normalizeActor) });
  } catch (err) {
    console.error("Search error:", err);
    res.status(500).json({ results: [], error: "Server error" });
  }
});

// People
app.get("/people", async (req, res) => {
  try {
    const docs = await collection.find({}).limit(200).toArray();
    res.json({ results: docs.map(normalizeActor) });
  } catch (err) {
    console.error("People error:", err);
    res.status(500).json({ results: [], error: "Server error" });
  }
});

// ---------- Start ----------
const PORT = 3000;

connectToMongo()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`✅ Server listening on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Mongo connection failed:", err);
    process.exit(1);
  });


