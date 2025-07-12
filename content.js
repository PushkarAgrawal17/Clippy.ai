let clippyIcon, bubble, expanded = false;

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

function removeClippy() {
  clippyIcon?.remove();
  bubble?.remove();
  clippyIcon = null;
  bubble = null;
}
