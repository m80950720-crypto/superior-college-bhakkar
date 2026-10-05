const MAX_MESSAGE_LENGTH = 600;
const MAX_HISTORY_TURNS = 8;

/**
 * Validates and sanitizes an incoming chat request body.
 * Returns { ok: true, message, history } or { ok: false, error }.
 */
function validateChatRequest(body) {
  const { message, history } = body || {};

  if (!message || typeof message !== "string" || !message.trim()) {
    return { ok: false, error: "Message is required." };
  }

  if (message.length > MAX_MESSAGE_LENGTH) {
    return { ok: false, error: "Message is too long. Please keep it under 600 characters." };
  }

  const safeHistory = Array.isArray(history)
    ? history
        .filter(
          (m) =>
            m &&
            typeof m.content === "string" &&
            m.content.length <= MAX_MESSAGE_LENGTH &&
            (m.role === "user" || m.role === "assistant")
        )
        .slice(-MAX_HISTORY_TURNS)
    : [];

  return { ok: true, message: message.trim(), history: safeHistory };
}

module.exports = { validateChatRequest };
