const express = require("express");
const serverless = require("serverless-http");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

let words = []; // In-memory storage

function validateWord(word) {
  // Remove accents using normalize() and then capitalize all letters
  return word
    .normalize("NFD") // Normalize to separate accented characters
    .replace(/[\u0300-\u036f]/g, "") // Remove accents
    .toUpperCase(); // Capitalize all letters
}

// Get all words
app.get("/api/words", (req, res) => {
  res.json(words);
});

// Add a word
app.post("/api/words", (req, res) => {
  const { word, clue } = req.body;
  if (!word || !clue) {
    return res.status(400).json({ message: "Word and clue are required" });
  }
  word = validateWord(word);
  const newWord = { id: words.length + 1, word, clue };
  words.push(newWord);
  res.json(newWord);
});

// Update a word
app.put("/api/words/:id", (req, res) => {
  const { id } = req.params;
  let { word, clue } = req.body; // Declare word as let
  const wordIndex = words.findIndex((w) => w.id === parseInt(id));
  if (wordIndex === -1) {
    return res.status(404).json({ message: "Word not found" });
  }
  word = validateWord(word);
  words[wordIndex] = { id: parseInt(id), word, clue };
  res.json(words[wordIndex]);
});

// Delete a word
app.delete("/api/words/:id", (req, res) => {
  const { id } = req.params;
  words = words.filter((w) => w.id !== parseInt(id));
  res.json({ message: "Word deleted" });
});

// Export handler for Netlify
module.exports.handler = serverless(app);
