require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

app.post('/ask', async (req, res) => {
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
