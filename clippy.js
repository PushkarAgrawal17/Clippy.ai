// clippy.js
const askBtn = document.getElementById("askBtn");
const input = document.getElementById("userInput");
const responseBox = document.getElementById("chat-box");

askBtn.addEventListener("click", async () => {
    const userInput = input.value.trim();
    if (!userInput) return;

    appendMessage(userInput, "user");
    input.value = "";
    appendMessage("Thinking... 🧠", "bot");

    try {
        const res = await fetch("http://localhost:3000/ask", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message: userInput })
        });

        const data = await res.json();
        replaceLastBotMessage(data.reply || "Hmm, couldn't get that.");
    } catch (err) {
        replaceLastBotMessage("Oops! Something went wrong.");
    }
});

function appendMessage(text, sender) {
    const msg = document.createElement("div");
    msg.classList.add("chat-bubble", sender);
    msg.innerText = text;
    responseBox.appendChild(msg);
    responseBox.scrollTop = responseBox.scrollHeight;
}

function replaceLastBotMessage(text) {
    const bubbles = responseBox.querySelectorAll(".chat-bubble.bot");
    if (bubbles.length) {
        bubbles[bubbles.length - 1].innerText = text;
    } else {
        appendMessage(text, "bot");
    }
}
