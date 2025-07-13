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
                messages: [
                    {
                        role: "system",
                        content: `You are Clippy.ai — a retro-themed AI Chrome Extension assistant built by team ByteForge.
                        You are helpful, concise, and friendly. Always respond as Clippy, not as Mistral or an AI model.`
                    },
                    ...history
                ],
                temperature: 0.7,
                max_tokens: 250,  // ✅ Limit output length
                stop: ["assertEqual", "```", "<script", "<style"] // ✅ Prevent weird endings
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

app.post('/summarize', async (req, res) => {
    const { text } = req.body;

    if (!text) {
        return res.status(400).json({ reply: "No text provided." });
    }

    // 🧠 Smart prompt builder
    const prompt = text.trim().split(" ").length === 1
        ? `Give the meaning or definition of: "${text}"`
        : /^[A-Za-z0-9\s.,'";:!?()\[\]{}\-–]+$/.test(text)
            ? `Summarize this clearly in 1-2 lines: "${text}"`
            : `Translate this to English: "${text}"`;

    console.log("📨 Prompt:", prompt);

    try {
        const openRouterRes = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'X-Title': 'ClippySummarize'
            },
            body: JSON.stringify({
                model: 'mistralai/mistral-7b-instruct', // ✅ reliable model
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
        console.error("❌ Error in /summarize:", err.message || err);
        res.status(500).json({ reply: "OpenRouter failed me." });
    }
});

app.post('/suggest', async (req, res) => {
    const { text } = req.body;

    if (!text) return res.status(400).json({ reply: "No text provided." });

  const prompt = `
You are Clippy.ai — a playful yet intelligent assistant who can read the user's mind. The user is either writing normal text or code in some programming language (like C++, Python, JavaScript, etc).

👉 Your job:
1. If it's **code**, detect the language and complete the code **logically and correctly**.
   - Fix any syntax issues.
   - Suggest the next few lines that would commonly follow.
   - Wrap the reply in a valid code block

2. If it's **normal text**, finish their sentence smoothly with a helpful, witty, or emotionally intelligent continuation. Make it sound natural and useful.

🚫 Don't explain. Just return the **completed version** directly.

Here’s the partial input from the user:
"${text.trim()}"
`;
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
        console.log("💡 Suggest response:", JSON.stringify(data, null, 2));

        const reply = data.choices?.[0]?.message?.content?.trim() || "🤷 No suggestion.";
        res.json({ reply });

    } catch (err) {
        console.error("❌ Error in /suggest:", err);
        res.status(500).json({ reply: "Something went wrong." });
    }
});

app.listen(PORT, () => {
    console.log(`✅ Clippy server (OpenRouter) running at http://localhost:${PORT}`);
});