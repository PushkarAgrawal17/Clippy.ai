// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/ask', async (req, res) => {
    app.post('/summarize', async (req, res) => {
    const { text } = req.body;

    if (!text) return res.status(400).json({ reply: "No text provided." });

    const prompt = text.split(" ").length === 1
        ? `Give a short meaning or definition of the word: "${text}"`
        : /^[A-Za-z0-9\s.,'";:!?()\[\]{}\-–]+$/.test(text)
            ? `Summarize this in 1-2 lines: "${text}"`
            : `Translate this to English: "${text}"`;

    try {
        const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'HTTP-Referer': 'http://localhost:3000',
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'X-Title': 'ClippyExtension'
            },
            body: JSON.stringify({
                model: 'mistralai/mistral-7b-instruct',
                messages: [{ role: 'user', content: prompt }],
                temperature: 0.7,
                max_tokens: 100
            })
        });

        const data = await openRouterRes.json();
        console.log("📎 Summarize response:", JSON.stringify(data, null, 2));

        const reply = data.choices?.[0]?.message?.content?.trim() || "I didn’t get anything.";
        res.json({ reply });

    } catch (err) {
        console.error("❌ Error in /summarize:", err);
        res.status(500).json({ reply: "Something went wrong." });
    }
});

    const userInput = req.body.message;

    try {
        const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'HTTP-Referer': 'http://localhost:3000',
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'X-Title': 'ClippyExtension'
            },
            body: JSON.stringify({
                model: 'mistralai/mistral-7b-instruct',
                messages: [{ role: 'user', content: userInput }]
            })
        });

        const data = await openRouterRes.json();
        console.log("🔁 OpenRouter response:", JSON.stringify(data, null, 2));

        const reply = data.choices?.[0]?.message?.content || "I didn’t get that.";
        res.json({ reply });

    } catch (err) {
        console.error("❌ OpenRouter Error:", err);
        res.status(500).json({ reply: "Something went wrong." });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Clippy server (OpenRouter) running at http://localhost:${PORT}`);
});
