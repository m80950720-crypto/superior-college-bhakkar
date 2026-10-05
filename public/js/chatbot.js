(() => {
  "use strict";

  const GREETING = "Assalam-o-Alaikum! 👋 I'm the Superior College Bhakkar assistant. Ask me about admissions, fees, subjects, faculty, or college activities.";

  const QUICK_REPLIES = [
    "What are the fees?",
    "Admission criteria?",
    "What subjects are offered?",
    "Who are the teachers?",
  ];

  const state = {
    open: false,
    sending: false,
    history: [], // [{role: 'user'|'assistant', content: string}]
    hasGreeted: false,
  };

  const el = {};

  function cacheEls() {
    el.toggle = document.getElementById("chat-toggle");
    el.panel = document.getElementById("chat-panel");
    el.close = document.getElementById("chat-close");
    el.iconOpen = document.getElementById("chat-icon-open");
    el.iconClose = document.getElementById("chat-icon-close");
    el.messages = document.getElementById("chat-messages");
    el.quickReplies = document.getElementById("chat-quick-replies");
    el.form = document.getElementById("chat-form");
    el.input = document.getElementById("chat-input");
    el.send = document.getElementById("chat-send");
  }

  function openChat() {
    state.open = true;
    el.panel.classList.remove("hidden");
    el.toggle.setAttribute("aria-expanded", "true");
    el.iconOpen.classList.add("hidden");
    el.iconClose.classList.remove("hidden");
    document.getElementById("chatbot-root").classList.remove("chat-attention");

    if (!state.hasGreeted) {
      state.hasGreeted = true;
      addMessage("assistant", GREETING);
      renderQuickReplies();
    }

    setTimeout(() => el.input.focus(), 150);
  }

  function closeChat() {
    state.open = false;
    el.panel.classList.add("hidden");
    el.toggle.setAttribute("aria-expanded", "false");
    el.iconOpen.classList.remove("hidden");
    el.iconClose.classList.add("hidden");
  }

  function toggleChat() {
    state.open ? closeChat() : openChat();
  }

  function addMessage(role, text) {
    const bubble = document.createElement("div");
    bubble.className = `chat-bubble ${role === "user" ? "chat-bubble-user" : "chat-bubble-bot"}`;
    bubble.textContent = text;
    el.messages.appendChild(bubble);
    el.messages.scrollTop = el.messages.scrollHeight;
  }

  function showTyping() {
    const indicator = document.createElement("div");
    indicator.id = "chat-typing";
    indicator.className = "chat-bubble chat-bubble-bot chat-typing";
    indicator.innerHTML = "<span></span><span></span><span></span>";
    el.messages.appendChild(indicator);
    el.messages.scrollTop = el.messages.scrollHeight;
  }

  function hideTyping() {
    const indicator = document.getElementById("chat-typing");
    if (indicator) indicator.remove();
  }

  function renderQuickReplies() {
    el.quickReplies.innerHTML = QUICK_REPLIES.map(
      (q) => `<button type="button" class="quick-reply-chip" data-quick="${escapeHtml(q)}">${escapeHtml(q)}</button>`
    ).join("");

    el.quickReplies.querySelectorAll("[data-quick]").forEach((btn) => {
      btn.addEventListener("click", () => {
        sendMessage(btn.dataset.quick);
        el.quickReplies.innerHTML = "";
      });
    });
  }

  function escapeHtml(str) {
    const d = document.createElement("div");
    d.textContent = str;
    return d.innerHTML;
  }

  async function sendMessage(text) {
    const trimmed = text.trim();
    if (!trimmed || state.sending) return;

    el.quickReplies.innerHTML = "";
    addMessage("user", trimmed);
    el.input.value = "";
    state.sending = true;
    el.send.disabled = true;
    showTyping();

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed, history: state.history }),
      });

      const data = await res.json();
      hideTyping();

      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      addMessage("assistant", data.reply);
      state.history.push({ role: "user", content: trimmed });
      state.history.push({ role: "assistant", content: data.reply });
    } catch (err) {
      hideTyping();
      addMessage(
        "assistant",
        "Sorry, I'm having trouble connecting right now. Please try again in a moment, or reach out to the college office directly."
      );
      console.error("[chatbot]", err.message);
    } finally {
      state.sending = false;
      el.send.disabled = false;
      el.input.focus();
    }
  }

  function initAttentionPulse() {
    // One deliberate, one-time moment to invite interaction — not repeated.
    setTimeout(() => {
      if (!state.open) {
        document.getElementById("chatbot-root").classList.add("chat-attention");
      }
    }, 2500);
  }

  function bindEvents() {
    el.toggle.addEventListener("click", toggleChat);
    el.close.addEventListener("click", closeChat);
    el.form.addEventListener("submit", (e) => {
      e.preventDefault();
      sendMessage(el.input.value);
    });

    document.querySelectorAll("[data-open-chat]").forEach((btn) => {
      btn.addEventListener("click", openChat);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && state.open) closeChat();
    });
  }

  document.addEventListener("DOMContentLoaded", () => {
    cacheEls();
    bindEvents();
    initAttentionPulse();
  });
})();
