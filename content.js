let clippyIcon, bubble, expanded = false;
let typingTimer;
let backspaceCount = 0;

const PAUSE_TIME = 3000;
const BACKSPACE_LIMIT = 3;

// 🔠 Get text from current editable element
function getActiveText() {
  const el = document.activeElement;
  if (el && el.isContentEditable) return el.innerText.trim();
  if (el && (el.tagName === 'TEXTAREA' || el.tagName === 'INPUT')) return el.value.trim();
  return '';
}

document.addEventListener("mouseup", async () => {
    const selectedText = window.getSelection().toString().trim();

    if (!selectedText) {
        removeClippy();
        return;
    }

    showClippy("💭 Thinking...");

    try {
        const response = await fetch("http://localhost:3000/summarize", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ text: selectedText })
        });

        const data = await response.json();
        const aiReply = data.reply?.trim() || "🤷 I got nothing.";

        showClippy(aiReply);
    } catch (err) {
        console.error("❌ Clippy API error:", err);
        showClippy("😵 I couldn’t reach my brain!");
    }
});

// ✨ Show Clippy + bubble
function showClippy(text) {
    // Create or update Clippy emoji
    if (!clippyIcon) {
        clippyIcon = document.createElement("div");
        clippyIcon.className = "clippy-emoji";
        clippyIcon.textContent = "📎";
        document.body.appendChild(clippyIcon);
    }

    // Create or update the bubble
    if (!bubble) {
        bubble = document.createElement("div");
        bubble.className = "clippy-bubble";
        bubble.innerHTML = `<p class="bubble-text">${text}</p>`;
        document.body.appendChild(bubble);

        bubble.addEventListener("click", () => {
            expanded = !expanded;
            bubble.classList.toggle("expand");
        });
    } else {
        bubble.querySelector(".bubble-text").textContent = text;
    }
}

// ❌ Remove Clippy
function removeClippy() {
    clippyIcon?.remove();
    bubble?.remove();
    clippyIcon = null;
    bubble = null;
}

// ✍️ Typing-based trigger
document.addEventListener('keydown', (event) => {
  const text = getActiveText();
  if (!text || text.length < 3) return;

  clearTimeout(typingTimer);

  if (event.key === "Backspace") {
    backspaceCount++;
    if (backspaceCount >= BACKSPACE_LIMIT) {
      console.log("🔁 Triggered by backspaces");
      triggerTypingSuggestion(text);
      backspaceCount = 0;
    }
  } else {
    backspaceCount = 0;
  }

  typingTimer = setTimeout(() => {
    console.log("⏳ Triggered by pause");
    triggerTypingSuggestion(text);
  }, PAUSE_TIME);
});

// 🤖 Trigger sentence suggestion
async function triggerTypingSuggestion(text) {
  if (!text || text.length < 3) return;

  showClippy("💭 Thinking...");

  try {
    const response = await fetch("http://localhost:3000/suggest", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text })
    });

    const data = await response.json();
    const suggestion = data.reply?.trim() || "🤷 No suggestion.";
    showClippy(suggestion);
  } catch (err) {
    console.error("❌ Typing API error:", err);
    showClippy("😵 Couldn't fetch suggestion.");
  }
}

// 🖱️ Selection-based summarization
document.addEventListener("mouseup", async () => {
  const selectedText = window.getSelection().toString().trim();

  if (!selectedText) {
    removeClippy();
    return;
  }

  showClippy("💭 Thinking...");

  try {
    const response = await fetch("http://localhost:3000/summarize", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: selectedText })
    });

    const data = await response.json();
    const aiReply = data.reply?.trim() || "🤷 I got nothing.";
    showClippy(aiReply);
  } catch (err) {
    console.error("❌ Clippy API error:", err);
    showClippy("😵 I couldn’t reach my brain!");
  }
});
