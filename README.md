# 🧷 Clippy.ai — Your Retro Web Assistant with Modern AI

**Clippy.ai** brings back the nostalgic charm of the old Microsoft Office paperclip — but this time, powered by GPT and living right in your Chrome browser.

🧠 **AI-Powered**, 🎨 **Retro-Styled**, 🌐 **Runs on Any Website**

---

## 🚀 **Features**

- Floating Clippy on every webpage
- Chat with GPT-based AI (using OpenAI, Groq, or Together API)
- Smart and engaging features when text is selected like:
  - Summarizes/translates selected text
  - Gives quirky reactions
  - More such suggestions and reactions
- Modern UI but with nostalgic effect
- Optional voice input
- Cheerful and helpful personality
- Fully open source and free!

---

## 🖼️ **Demo**

> _“It looks like you’re browsing the web. Want some help?”_

![Clippy.ai Screenshot](clippy-assets/demo.png)

---

## 🛠️ **Tech Stack**

| Area                  | Tools Used                   |
|-----------------------|------------------------------|
| Extension Framework   | Chrome Manifest v3           |
| Assistant Logic       | OpenAI / Groq / Together API |
| UI & Animations       | HTML, CSS, JavaScript        |


---

## 📦 **Installation**

1. **Clone this repository**
   ```bash
   git clone https://github.com/yourusername/clippy-ai
   cd clippy-ai
   ```

2. **Install node modules in your root directory by this command:**
    ```bash
    npm install
    ```

3. **Create a `.env` file in the root folder.**

4. **Paste your API key, model and fetch url like this in the .env file:**
   ```bash
    API_KEY=your_actual_api_key_here
    MODEL=your_api_key_model_here
    FETCH=your_full_api_endpoint_here
    ```

5. **Turn the server on:**
    ```bash
    npm run dev
    ```

6. **Load the Extension in Chrome**
   - Go to chrome://extensions
   - Turn on Developer Mode
   - Click Load Unpacked
   - Select the Clippy.ai/ folder

Done! Visit any site and Clippy will appear!
(Do check the permissions for the extensions)

---

## 📁 **Project Structure**
``` bash
    Clippy.ai/
    ├── manifest.json         # Chrome extension config
    ├── content.js            # Injects Clippy into all pages
    ├── clippy.js             # Logic handling for chats
    ├── clippy.html           # Chat UI layout
    ├── clippy.css            # Styling
    ├── server.js             # Connection
    ├── clippy-assets/        # Clippy images
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

Original Clippy inspiration: _Microsoft Office Assistant (1997–2003)_

---

## 💡**Built at a Hackathon**

_**Clippy.ai**_ was created by _ByteForge_ during _**OSDHack'25**_ because everyone deserves a helpful paperclip again 🧷
