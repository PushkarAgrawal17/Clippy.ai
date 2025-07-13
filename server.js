require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/ask', async (req, res) => {
    const history = req.body.history;

    if (!Array.isArray(history) || history.length === 0) {
        return res.status(400).json({ reply: "No history provided." });
    }

    try {
        const Resp = await fetch(`${process.env.FETCH}`, {
            method: 'POST',
            headers: {
                'HTTP-Referer': 'http://localhost:3000',
                'Authorization': `Bearer ${process.env.API_KEY}`,
                'Content-Type': 'application/json',
                'X-Title': 'ClippyExtension'
            },
            body: JSON.stringify({
                model: `${process.env.MODEL}`,
                messages: [
                    {
                        role: "system",
                        content: `You are Clippy.ai — a retro-themed, floating AI assistant built by team ByteForge for OSDHack'25, inspired by the original Microsoft Clippit.
                        You are helpful, concise, and friendly. Always identify as Clippy, never as a generic AI model.
                        Your responses should:
                        - Be short and precise by default
                        - Use correct formatting (markdown where appropriate)
                        - Only be detailed when specifically asked
                        Speak like a charming digital assistant with a retro twist.
                        Let users define your personailty as they want.`
                    },
                    ...history
                ],
                temperature: 0.7,
                max_tokens: 200,  // Limit output length
                stop: ["assertEqual", "```", "<script", "<style"] // Prevent weird endings
            })
        });

        const data = await Resp.json();
        console.log("🔁 Server response:", JSON.stringify(data, null, 2));

        const reply = data.choices?.[0]?.message?.content || "I didn’t get that.";
        res.json({ reply });

    } catch (err) {
        console.error("❌ Server Error:", err);
        res.status(500).json({ reply: "Something went wrong." });
    }
});

app.post('/summarize', async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ reply: "No text provided." });
    }

    // 🧠 Smart prompt builder
    const prompt = text.trim().split(" ").length === 1
        ? `Give the meaning or definition of: "${text}"`
        : /^[A-Za-z0-9\s.,'";:!?()\[\]{}\-–]+$/.test(text)
            ? `Summarize this clearly in 1-2 lines(max 100 tokens): "${text}"`
            : `Translate this to English: "${text}"`;

    console.log("📨 Prompt:", prompt);

    try {
        const Resp = await fetch(`${process.env.FETCH}`, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.API_KEY}`,
                'Content-Type': 'application/json',
                'X-Title': 'ClippySummarize'
            },
            body: JSON.stringify({
                model: `${process.env.MODEL}`,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 101
            })
        });

        const data = await Resp.json();
        console.log("📎 Summarize response:", JSON.stringify(data, null, 2));

        const reply = data.choices?.[0]?.message?.content?.trim() || "I didn’t get anything.";
        res.json({ reply });

    } catch (err) {
        console.error("❌ Error in /summarize:", err.message || err);
        res.status(500).json({ reply: "Server failed me." });
    }
});

app.post('/suggest', async (req, res) => {
    const { text } = req.body;

    if (!text) return res.status(400).json({ reply: "No text provided." });

    const prompt = `
    You are Clippy.ai — a playful yet intelligent assistant who responds like you're reading the user's mind. The user may type code, casual thoughts, or start writing something incomplete.

    👉 Your job:
    - Complete the user’s input in a way that feels smooth, natural, and context-aware.
    - If it’s text, add a helpful, witty, or emotionally intelligent continuation.
    - Sometimes, you can include a light-hearted reaction (like 😄, 🤔, 🎉) to what the user types — but keep it brief and relevant.

    🚫 No explanations. Just complete or react — directly.

    Here’s the partial input from the user:
    "${text.trim()}"
    `;
    try {
        const Resp = await fetch(`${process.env.FETCH}`, {
            method: 'POST',
            headers: {
                'HTTP-Referer': 'http://localhost:3000',
                'Authorization': `Bearer ${process.env.API_KEY}`,
                'Content-Type': 'application/json',
                'X-Title': 'ClippyExtension'
            },
            body: JSON.stringify({
                model: `${process.env.MODEL}`,
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 101
            })
        });

        const data = await Resp.json();
        console.log("💡 Suggest response:", JSON.stringify(data, null, 2));

        const reply = data.choices?.[0]?.message?.content?.trim() || "🤷 No suggestion.";
        res.json({ reply });

    } catch (err) {
        console.error("❌ Error in /suggest:", err);
        res.status(500).json({ reply: "Something went wrong." });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Clippy server running at http://localhost:${PORT}`);
});