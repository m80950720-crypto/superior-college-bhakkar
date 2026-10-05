# Superior College Bhakkar — Website + AI Chatbot

A single-page website for Superior College Bhakkar with a built-in AI admissions assistant, built as a sample project for learning how to embed a chatbot in a real site.

**Stack:** HTML5 + Tailwind CSS (CDN) + custom CSS, vanilla JS, Node.js/Express backend, [Groq](https://groq.com) (Llama 3.3 70B) for chat responses.

## ⚠️ About the API key — read this first

Groq API keys must **never** appear in frontend code or in anything committed to GitHub — anyone who finds it in your page source or repo history can use it on your account.

This project keeps the key safe by design:
- All chat requests go through **your own backend** (`/api/chat`) — the browser never talks to Groq directly, and the key is never sent to the browser.
- The real key lives only in `.env`, which is listed in `.gitignore` — it will **not** be pushed to GitHub.
- `.env.example` is a safe placeholder template you can commit instead.

**Because the key was shared in plain text during setup, it's good practice to rotate it** (generate a new one and revoke the old one) from the [Groq console](https://console.groq.com/keys) once you're done testing — especially before sharing this project with anyone else.

## 🚀 Getting Started (local)

**Requirements:** Node.js 18+

```bash
npm install
npm start
```

Open `http://localhost:3000`. The `.env` file already contains a working `GROQ_API_KEY` for local testing.

## ☁️ Deploying to Vercel

This project is structured to deploy cleanly on Vercel — `/public` is served as the static site, and `/api/chat.js` runs as a serverless function. `server.js` (Express) is only used for local development.

**Steps:**
1. Push this project to a GitHub repo (make sure `.env` is **not** included — check it's not in your repo after pushing).
2. Go to [vercel.com](https://vercel.com) → **Add New...** → **Project** → import your repo.
3. **Before clicking Deploy**, open **Environment Variables** and add:
   | Key | Value |
   |-----|-------|
   | `GROQ_API_KEY` | *(your Groq API key)* |
4. Click **Deploy**.

> **This step is the one people most often miss.** Since `.env` is never uploaded to GitHub (on purpose — see above), Vercel has no way to know your API key unless you add it manually in the dashboard. Skipping this step is the most common reason a chatbot works locally but fails ("couldn't connect") once deployed.

If you ever need to update the key later: **Project → Settings → Environment Variables**, then redeploy.

## 📂 Project Structure

```
college-site/
├── server.js              # Express server for local dev (npm start)
├── api/
│   └── chat.js             # Vercel serverless function — same endpoint, production
├── lib/
│   ├── groq.js              # Shared Groq API call + system prompt (the college's facts)
│   └── validateChat.js      # Shared request validation
├── public/
│   ├── index.html
│   ├── css/style.css
│   └── js/
│       ├── main.js          # Nav, faculty grid, footer year
│       └── chatbot.js        # Chat widget UI + /api/chat calls
├── .env                    # Local only — real API key (gitignored)
├── .env.example             # Safe template to commit
└── package.json
```

## 🤖 How the chatbot works

1. The widget (bottom-right) opens a small chat panel with a greeting and quick-reply suggestions.
2. Each message is sent to `/api/chat` along with the recent conversation history.
3. The backend attaches a system prompt containing the college's facts (fees, subjects, faculty, activities, admission criteria) and calls Groq's chat completion API.
4. The reply is returned to the widget and displayed.
5. If a visitor asks something unrelated to the college, the assistant is instructed to politely redirect: *"I'm here only to answer questions about Superior College Bhakkar..."*

To change the facts the bot knows, edit the `SYSTEM_PROMPT` in `lib/groq.js` — both the local server and the Vercel function read from this one file.

## 🎨 Design Notes

Deep forest green and warm gold on a soft cream background, paired with Fraunces (serif display) and Inter (body) — a classic academic identity rather than a generic tech-startup look. The hero uses a real campus photograph with a direct, specific headline. Faculty are shown as simple initials-avatars rather than stock photos; subjects and activities use icon-led rows instead of repeated card shadows, keeping each section visually distinct.

## 📄 License

MIT — built as a sample project for a web development course.
