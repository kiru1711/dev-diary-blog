const express = require("express");
const cors = require("cors");
const fetch = require("node-fetch");

const app = express();
app.use(cors());
app.use(express.json());

app.post("/chat", async (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const { prompt } = req.body;
  if (!prompt) {
    res.status(400).send("Prompt is required");
    return;
  }

  try {
    const ollamaRes = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gemma:2b",
        prompt,
        stream: true,
      }),
    });

    ollamaRes.body.on("data", (chunk) => {
      const lines = chunk.toString().split("\n").filter((line) => line.trim());
      for (const line of lines) {
        try {
          const json = JSON.parse(line);
          if (json.response) {
            res.write(`data: ${json.response}\n\n`);
          }
        } catch (err) {
          console.error("Parsing error:", err);
        }
      }
    });

    ollamaRes.body.on("end", () => {
      res.write("data: [DONE]\n\n");
      res.end();
    });

    ollamaRes.body.on("error", (err) => {
      console.error("Ollama stream error:", err);
      res.end();
    });
  } catch (err) {
    console.error("Error communicating with Ollama:", err);
    res.status(500).send("Error communicating with Ollama");
  }
});

app.listen(3000, () => {
  console.log("🚀 Server running on http://localhost:3000");
});
