const { getChatReply } = require("../lib/groq");
const { validateChatRequest } = require("../lib/validateChat");

module.exports = async (req, res) => {
  if (req.method !== "POST") {
    res.status(405).json({ error: "Method not allowed." });
    return;
  }

  const check = validateChatRequest(req.body);
  if (!check.ok) {
    res.status(400).json({ error: check.error });
    return;
  }

  try {
    const reply = await getChatReply(check.history, check.message);
    res.status(200).json({ reply });
  } catch (err) {
    console.error("[/api/chat]", err.message);
    res.status(502).json({
      error: "Sorry, I couldn't connect right now. Please try again in a moment, or contact the college office directly.",
    });
  }
};
