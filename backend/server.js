const express = require("express");
const fs = require("fs");
const cors = require("cors");
const app = express();

app.use(express.json());
app.use(cors());

const auctions = require("./data/auctions.json");
const surveyResponses = require("./data/surveyResponses.json");

// Get all auctions
app.get("/api/auctions", (req, res) => {
  res.json(auctions);
});

// Get all survey responses
app.get("/api/surveys", (req, res) => {
  res.json(surveyResponses);
});

// Submit a new survey response
app.post("/api/surveys", (req, res) => {
  const newResponse = req.body;

  if (!newResponse || Object.keys(newResponse).length === 0) {
    return res.status(400).json({ error: "Missing survey response data" });
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

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});