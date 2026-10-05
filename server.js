/**
 * Superior College Bhakkar — Server
 * ----------------------------------------------------
 * Serves the static site and provides the /api/chat endpoint used by
 * the chatbot widget, which proxies to Groq's chat completion API.
 *
 * This file is used for LOCAL development (`npm start`). On Vercel,
 * the equivalent logic runs as a serverless function at /api/chat.js —
 * both share the same code via ./lib/groq.js and ./lib/validateChat.js.
 */

require("dotenv").config();

const express = require("express");
const cors = require("cors");
const path = require("path");
const { getChatReply } = require("./lib/groq");
const { validateChatRequest } = require("./lib/validateChat");

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

app.post("/api/chat", async (req, res) => {
  const check = validateChatRequest(req.body);
  if (!check.ok) {
    return res.status(400).json({ error: check.error });
  }

  try {
    const reply = await getChatReply(check.history, check.message);
    res.json({ reply });
  } catch (err) {
    console.error("[/api/chat]", err.message);
    res.status(502).json({
      error: "Sorry, I couldn't connect right now. Please try again in a moment, or contact the college office directly.",
    });
  }
});

app.get("/api/health", (req, res) => res.json({ status: "ok" }));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🎓 Superior College Bhakkar site running at http://localhost:${PORT}`);
  });
}

module.exports = app;
