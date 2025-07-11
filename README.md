# 🧷 Clippy.ai — Your Retro Web Assistant with Modern AI

**Clippy.ai** brings back the nostalgic charm of the old Microsoft Office paperclip — but this time, powered by GPT and living right in your Chrome browser.

🧠 **AI-Powered**, 🎨 **Retro-Styled**, 🌐 **Runs on Any Website**

---

## 🚀 **Features**

- ✨ Floating Clippy on every webpage
- 🧠 Chat with GPT-based AI (using OpenAI, Groq, or Together API)
- 💬 Smart suggestions like:
  - “Fix grammar”
  - “Summarize selected text”
  - “Write a reply”
- 📎 Nostalgic Windows XP UI
- 🗣️ Optional voice input/output
- 🎭 Personality switching (funny, helpful, sarcastic)
- 🔓 Fully open source and free!

---

## 🖼️ **Demo**

> _“It looks like you’re browsing the web. Want some help?”_

![Clippy.ai Screenshot](assets/demo.png)

---

## 🛠️ **Tech Stack**

| Area                  | Tools Used                   |
|-----------------------|------------------------------|
| Extension Framework   | Chrome Manifest v3           |
| Assistant Logic       | OpenAI / Groq / Together API |
| UI & Animations       | HTML, CSS, JavaScript        |
| Voice Features (opt)  | Web Speech API               |
| Drag & UI Behavior    | Vanilla JS (or GSAP/Framer)  |

---

## 📦 **Installation**

1. **Clone this repository**
   ```bash
   git clone https://github.com/yourusername/clippy-ai
   cd clippy-ai
   ```

2. **Add your API key**
   - Open clippy.js
   - Replace YOUR_API_KEY_HERE with your OpenAI / Groq / Together API key

3. **Load the Extension in Chrome**
   - Go to chrome://extensions
   - Turn on Developer Mode
   - Click Load Unpacked
   - Select the clippy-ai/ folder

4. Done! Visit any site and Clippy will appear!

---

## 🔑 **API Configuration**

**Use one of the following APIs (edit clippy.js):**

**Option 1: OpenAI (paid)**
``` bash
    Authorization: Bearer YOUR_OPENAI_KEY
    Endpoint: https://api.openai.com/v1/chat/completions
    Model: gpt-3.5-turbo
```

**Option 2: Groq (free & fast!)**
``` bash
    Authorization: Bearer YOUR_GROQ_API_KEY
    Endpoint: https://api.groq.com/openai/v1/chat/completions
    Model: mixtral-8x7b-32768
```

**Option 3: Together.ai**
``` bash
    Authorization: Bearer YOUR_TOGETHER_API_KEY
    Endpoint: https://api.together.xyz/v1/chat/completions
    Model: mistralai/Mixtral-8x7B-Instruct-v0.1
```

---

## 📁 **Project Structure**
``` bash
    clippy-ai/
    ├── manifest.json         # Chrome extension config
    ├── content.js            # Injects Clippy into all pages
    ├── clippy.js             # GPT logic & chat handling
    ├── clippy.html           # Chat UI layout
    ├── clippy.css            # Styling (retro + draggable)
    ├── assets/               # Clippy images, sounds
    ├── README.md
    └── LICENSE
```

---

## 🧑‍💻 **Contributing**

This project is _open source_ under the **MIT license**. Contributions, forks, and memes are welcome!

- Want to add custom personalities? Voice features? More retro animations?
- Open a pull request or file an issue 🙌

---

## 🧾 **License**

This project is licensed under the _**MIT License**_.

---

## ✨ **Credits**

- Original Clippy inspiration: _Microsoft Office Assistant (1997–2003)_
- AI: _OpenAI, Groq, Together.ai_
- Retro style: _XP nostalgia, Comic Sans, pixel art_

---

## 💡**Built at a Hackathon**

_**Clippy.ai**_ was created by _ByteForge_ during _**OSDHack'25**_
Because everyone deserves a helpful paperclip again 🧷
