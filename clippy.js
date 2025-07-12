// clippy.js
const askBtn = document.getElementById("askBtn");
const input = document.getElementById("userInput");
const responseBox = document.getElementById("chat-box");
const clippyImg = document.getElementById("clippy-avatar");

askBtn.addEventListener("click", async () => {
    const userInput = input.value.trim();
    if (!userInput) return;

    appendMessage(userInput, "user");
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
            body: JSON.stringify({ message: userInput })
        });

        const data = await res.json();
        typingEl.innerText = data.reply || "Hmm, couldn't get that.";
    } catch (err) {
        typingEl.innerText = "Oops! Something went wrong.";
    } finally {
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
