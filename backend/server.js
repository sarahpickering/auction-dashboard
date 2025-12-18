const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000"
}));

app.get("/", (req, res) => {
  res.send("Auction Dashboard API is running");
});

// Dummy data used for local development and testing
const auctions = require("./data/auctions.json");
const surveyResponses = require("./data/surveyResponses.json");

// Get all auctions
app.get("/api/auctions", (req, res) => {
  res.json(auctions.sort((a, b) => a.id - b.id));
});

// Get all survey responses
app.get("/api/surveys", (req, res) => {
  res.json(surveyResponses);
});

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Submit a new survey response
app.post("/api/surveys", (req, res) => {
  const { auctionId, didBid, reason, overallExperience } = req.body;

  if (!auctionId || overallExperience == null) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  surveyResponses.push(newResponse);

  // Write updated data back to file
  fs.writeFileSync(
    "./data/surveyResponses.json",
    JSON.stringify(surveyResponses, null, 2)
  );

  res.status(201).json({
    message: "Survey response submitted",
    response: newResponse,
  });
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Server error" });
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});