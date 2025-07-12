const clippyImg = document.getElementById("clippy");
const askBtn = document.getElementById("askBtn");
const input = document.getElementById("userInput");
const responseElement = document.getElementById("response");

askBtn.addEventListener("click", async () => {
  const userInput = input.value.trim();
  if (!userInput) return;

  responseElement.innerText = "Thinking... 🧠";
  clippyImg.src = "clippy-assets/clippy-idle.gif";

  try {
    const response = await fetch("http://localhost:3000/ask", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ message: userInput })
    });

    const data = await response.json();
    responseElement.innerText = data.reply;

  } catch (err) {
    responseElement.innerText = "Oops! Something went wrong.";
  } finally {
    clippyImg.src = "clippy-assets/clippy-idle.gif";
  }
});
