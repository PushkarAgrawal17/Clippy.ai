// clippy.js
const askBtn = document.getElementById("askBtn");
const input = document.getElementById("userInput");
const responseBox = document.getElementById("chat-box");
const clippyImg = document.getElementById("clippy-avatar");
// 1️⃣ Try to load previous session chat (if any)
// But we will NOT display it — just use it internally for context
let chatHistory = [];

chrome.storage.sync.get("clippyChat", (data) => {
    chatHistory = data.clippyChat || [];
});

// 2️⃣ Clear localStorage when popup is closed or reloaded
// This ensures each new popup session is fresh
// window.addEventListener("beforeunload", () => {
//     localStorage.removeItem("clippyChat");
//     chatHistory = [];
// });

askBtn.addEventListener("click", async () => {
    const userInput = input.value.trim();
    if (!userInput) return;

    appendMessage(userInput, "user");

    // ➕ Save user input to chat history
    chatHistory.push({ role: "user", content: userInput });
    chrome.storage.sync.set({ clippyChat: chatHistory });

    input.value = "";

    clippyImg.src = "clippy-assets/clippy-thinking.gif";

    const typingIndicatorHTML = `
        <div class="typing-indicator">
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
            <div class="typing-dot"></div>
        </div>
    `;
    const typingEl = appendMessage(typingIndicatorHTML, "bot", true, true);

    try {
        const res = await fetch("http://localhost:3000/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ history: chatHistory })  // ✅ send full history
        });

        const data = await res.json();
        const botReply = data.reply || "Hmm, couldn't get that.";
        typingEl.innerText = botReply;

        // ✅ Save assistant reply to chat history
        chatHistory.push({ role: "assistant", content: botReply });
        chrome.storage.sync.set({ clippyChat: chatHistory });
    } catch (err) {
        typingEl.innerText = "Oops! Something went wrong.";
    }finally {
        clippyImg.src = "clippy-assets/clippy-idle.gif";
    }
});

// Send on Enter key press
input.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault(); // prevent newline
        if (input.value.trim() !== "") {
            askBtn.click();
        }
    }
});

// function appendMessage(text, sender, returnEl = false) {
//     const msg = document.createElement("div");
//     msg.classList.add("chat-bubble", sender);
//     msg.innerText = text;
//     responseBox.appendChild(msg);
//     responseBox.scrollTop = responseBox.scrollHeight;
//     return returnEl ? msg : null;
// }

function appendMessage(text, sender, returnEl = false, isHTML = false) {
    const msg = document.createElement("div");
    msg.classList.add("chat-bubble", sender);

    if (isHTML) {
        msg.innerHTML = text;
    } else {
        msg.innerText = text;
    }

    responseBox.appendChild(msg);
    responseBox.scrollTop = responseBox.scrollHeight;
    return returnEl ? msg : null;
}


function replaceLastBotMessage(text) {
    const bubbles = responseBox.querySelectorAll(".chat-bubble.bot");
    if (bubbles.length) {
        bubbles[bubbles.length - 1].innerText = text;
    } else {
        appendMessage(text, "bot");
    }
}

const voiceBtn = document.getElementById("voiceBtn");

voiceBtn.addEventListener("click", () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
        alert("Speech Recognition not supported in this browser.");
        return;
    }

    navigator.mediaDevices.getUserMedia({ audio: true }).then(() => {
        const recognition = new SpeechRecognition();
        recognition.lang = "en-US";
        recognition.interimResults = false;
        recognition.maxAlternatives = 1;

        recognition.onstart = () => {
            voiceBtn.innerHTML = `<i class="fas fa-microphone-lines" style="color: white;"></i>`;
        };

        recognition.onresult = (event) => {
            const transcript = event.results[0][0].transcript;
            input.value = transcript;
            input.focus();
        };

        recognition.onerror = (e) => {
            alert("Speech error: " + e.error);
        };

        recognition.onend = () => {
            voiceBtn.innerHTML = `<i class="fas fa-microphone" style="color: white;"></i>`;
        };

        recognition.start();
    }).catch((err) => {
        alert("🎤 Microphone is blocked.\n\nTo fix this:\n1. Click on extensions icon\n2. Click on 3 dots beside Clippy.ai extension\n3. Go to View web permissions\n4. Set microphone permission to 'Allow'\n5. Reload the extension");
    });
});
