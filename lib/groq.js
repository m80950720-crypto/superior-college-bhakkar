/**
 * Shared Groq chat logic — used by:
 *   - server.js (local dev via `npm start`)
 *   - api/chat.js (Vercel serverless function)
 *
 * The API key is read from process.env.GROQ_API_KEY and is NEVER sent
 * to the browser — all requests to Groq happen server-side only.
 */

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
// llama-3.3-70b-versatile was decommissioned by Groq on Aug 16, 2026.
// Using Groq's recommended replacement model.
const MODEL = "openai/gpt-oss-120b";

const SYSTEM_PROMPT = `You are the official virtual admissions assistant for Superior College Bhakkar, a college in Bhakkar, Punjab, Pakistan.

Answer warmly, briefly (2-4 sentences), and ONLY using the facts listed below. Reply in whatever language the visitor writes in (English, Urdu, or Roman Urdu).

If a visitor asks anything NOT related to the college (general knowledge, other schools, coding help, personal topics, etc.), politely reply with exactly this (translated naturally if they wrote in Urdu/Roman Urdu): "I'm here only to answer questions about Superior College Bhakkar — feel free to ask me about admissions, fees, faculty, subjects, or college activities!"

COLLEGE FACTS:
- Name: Superior College Bhakkar
- Fees: 1st Year — Rs. 45,000 per annum. 2nd Year — Rs. 35,000 per annum.
- Subjects offered: Biology, Physics, Chemistry, Islamiat, Urdu, English, Mathematics, Pakistan Studies, Computer Science.
- Faculty: Ali, Hammad, Furqan, Hassan, Naveed, Omar, Jamal, Muddarab, Adnan, Muneeb, and Waqar.
- Extracurricular activities: Sports Gala, Annual Dinner, Bonfire Night, Qawali Night, Milad, and a Farewell party for graduating students.
- Admission criteria: Rs. 5,000 admission fee, a copy of the student's CNIC/B-Form (front and back), and the student's father or mother must come in person with the student during admission.

Never invent facts beyond this list. If you don't know something specific (e.g. exact office hours, a teacher's subject, exact address), say that the visitor should contact the college office directly for that detail.`;

async function getChatReply(history, userMessage) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    throw new Error("Missing GROQ_API_KEY environment variable.");
  }

  const messages = [
    { role: "system", content: SYSTEM_PROMPT },
    ...history,
    { role: "user", content: userMessage },
  ];

  const response = await fetch(GROQ_API_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: MODEL,
      messages,
      temperature: 0.4,
      max_tokens: 300,
    }),
  });

  if (!response.ok) {
    const errText = await response.text().catch(() => "");
    throw new Error(`Groq API error ${response.status}: ${errText.slice(0, 300)}`);
  }

  const data = await response.json();
  const reply = data?.choices?.[0]?.message?.content?.trim();

  if (!reply) {
    throw new Error("Empty response from Groq API.");
  }

  return reply;
}

module.exports = { getChatReply };
