import express from "express";
import fetch from "node-fetch"; // Node 18+ يحتوي fetch مسبقاً

const app = express();
app.use(express.json());

const GAS_URL = "https://script.google.com/macros/s/YOUR_GAS_ID/exec";

// Endpoint Proxy
app.post("/proxy", async (req, res) => {
  try {
    const response = await fetch(GAS_URL, {
      method: "POST",
      body: JSON.stringify(req.body),
      headers: { "Content-Type": "application/json" }
    });

    const data = await response.json();
    res.setHeader("Access-Control-Allow-Origin", "*"); // للسماح للمتصفح
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    res.json(data);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// دعم OPTIONS preflight (لحل مشاكل CORS)
app.options("/proxy", (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  res.sendStatus(204);
});

// استماع على المنفذ الذي توفره Render
app.listen(process.env.PORT || 3000, () => console.log("Proxy running"));
