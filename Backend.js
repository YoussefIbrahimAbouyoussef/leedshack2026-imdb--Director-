// backend javascript file
// this file handles backend logic for the project

import express from "express";
import multer from "multer";
import dotenv from "dotenv";

// load environment variables
dotenv.config();

// create express app
const app = express();

// allow json to be sent to backend
app.use(express.json());

// setup upload folder
const upload = multer({
  dest: "uploads/"
});


// upload button
// frontend: user clicks +
// backend: receive file
app.post("/upload", upload.single("file"), (req, res) => {
  // check if file exists
  if (req.file == null) {
    res.status(400).json({
      error: "file not uploaded"
    });
    return;
  }

  // file is now on the server
  // later this will be sent to gemini ai

  res.json({
    message: "file uploaded",
    fileName: req.file.originalname
  });
});


// ------ explore search ------
// fake data for now
const people = [
  { name: "Robert Downey Jr.", meta: "Budget · Age" },
  { name: "Scarlett Johansson", meta: "Budget · Age" },
  { name: "Tom Holland", meta: "Budget · Age" },
  { name: "Chris Evans", meta: "Budget · Age" }
];


// search people by name
app.get("/search", (req, res) => {
  const searchText = req.query.q;

  // if nothing typed, return everything
  if (!searchText) {
    res.json({
      results: people
    });
    return;
  }

  const lowerSearch = searchText.toLowerCase();

  const filteredPeople = [];

  // loop through people
  for (let i = 0; i < people.length; i++) {
    const personName = people[i].name.toLowerCase();

    if (personName.includes(lowerSearch)) {
      filteredPeople.push(people[i]);
    }
  }

  res.json({
    results: filteredPeople
  });
});


// ------ see all button ------
// return all people
app.get("/people", (req, res) => {
  res.json({
    results: people
  });
});

// ✅ test route
app.get("/", (req, res) => {
  res.send("✅ Server is running");
});

// ✅ search route (your website uses this)
app.get("/search", async (req, res) => {
  try {
    const q = (req.query.q || "").trim();

    if (!q) {
      const results = await collection.find({}).limit(20).toArray();
      return res.json({ results });
    }

    const results = await collection
      .find({ name: { $regex: q, $options: "i" } })
      .limit(30)
      .toArray();

    res.json({ results });
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// start backend server
app.listen(3000, () => {
  console.log("backend server running on port 3000");
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Server listening on http://localhost:${PORT}`);
});

