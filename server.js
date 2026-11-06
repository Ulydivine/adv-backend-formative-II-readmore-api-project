const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

// This lets Express read JSON sent in request bodies.
// We will need it later when we create and update authors and books.
app.use(express.json());

const PORT = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI;

// Health check. A simple way to see that the server is running.
app.get("/", (req, res) => {
  res.json({ message: "ReadMore API is running" });
});

async function startServer() {
  if (!MONGO_URI) {
    console.error("Missing MONGO_URI. Add it to your .env file.");
    process.exit(1);
  }

  try {
    // Wait for MongoDB before we open the server.
    // If the database is down, the API does not start.
    await mongoose.connect(MONGO_URI, {
      serverSelectionTimeoutMS: 5000,
    });
    console.log("Connected to MongoDB");

    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Could not connect to MongoDB:", error.message);
    process.exit(1);
  }
}

startServer();
