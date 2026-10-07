// ==========================================
// 🌴 JUNGLE HELPER AI TAB
// ==========================================

const aiTabButton = document.getElementById("aiTabButton");
const aiPanel = document.getElementById("aiPanel");
const aiInput = document.getElementById("aiInput");
const aiSendButton = document.getElementById("aiSendButton");
const aiMessages = document.getElementById("aiMessages");
const aiStatus = document.getElementById("aiStatus");

let aiRunning = false;
let aiSending = false;

// ==========================================
// OPEN / CLOSE AI
// ==========================================

if (aiTabButton) {
    aiTabButton.addEventListener("click", async () => {

        aiPanel.classList.toggle("aiOpen");

        if (aiPanel.classList.contains("aiOpen")) {

            if (aiInput) {
                aiInput.focus();
            }

            if (!aiRunning) {
                await startJungleHelper();
            }
        }
    });
}

// ==========================================
// START JUNGLE HELPER
// ==========================================

async function startJungleHelper() {

    if (aiRunning) {
        return true;
    }

    if (!window.jungleAI) {
        setAIStatus("Offline");

        addAIMessage(
            "system",
            "Jungle Helper bridge is not available."
        );

        return false;
    }

    setAIStatus("Starting...");

    try {

        const result =
            await window.jungleAI.start();

        if (!result || !result.success) {

            aiRunning = false;

            setAIStatus("Offline");

            addAIMessage(
                "system",
                "Could not start Jungle Helper: " +
                (result?.error || "Unknown error.")
            );

            return false;
        }

        aiRunning = true;

        setAIStatus("Online");

        return true;

    } catch (error) {

        aiRunning = false;

        setAIStatus("Offline");

        addAIMessage(
            "system",
            "Jungle Helper startup error: " +
            error.message
        );

        return false;
    }
}

// ==========================================
// SEND MESSAGE
// ==========================================

async function sendAIMessage() {

    if (aiSending) {
        return;
    }

    const message =
        aiInput.value.trim();

    if (!message) {
        return;
    }

    if (!aiRunning) {

        const started =
            await startJungleHelper();

        if (!started) {
            return;
        }
    }

    aiSending = true;

    addAIMessage(
        "user",
        message
    );

    aiInput.value = "";

    aiSendButton.disabled = true;
    aiInput.disabled = true;

    const thinkingMessage =
        addAIMessage(
            "assistant",
            "Thinking..."
        );

    try {

        const result =
            await window.jungleAI.send(message);

        thinkingMessage.remove();

        if (
            result &&
            result.success
        ) {

            addAIMessage(
                "assistant",
                result.response ||
                "Jungle Helper returned an empty response."
            );

        } else {

            addAIMessage(
                "system",
                "Jungle Helper error: " +
                (
                    result?.error ||
                    "Unknown error."
                )
            );
        }

    } catch (error) {

        thinkingMessage.remove();

        addAIMessage(
            "system",
            "AI connection error: " +
            error.message
        );
    }

    aiSending = false;

    aiSendButton.disabled = false;
    aiInput.disabled = false;

    aiInput.focus();
}

// ==========================================
// SEND BUTTON
// ==========================================

if (aiSendButton) {

    aiSendButton.addEventListener(
        "click",
        sendAIMessage
    );
}

// ==========================================
// ENTER TO SEND
// ==========================================

if (aiInput) {

    aiInput.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                sendAIMessage();
            }
        }
    );
}

// ==========================================
// STATUS
// ==========================================

function setAIStatus(status) {

    if (!aiStatus) {
        return;
    }

    if (status === "Online") {

        aiStatus.textContent = "Online";
        aiStatus.className =
            "aiStatus online";

        return;
    }

    if (status === "Starting...") {

        aiStatus.textContent = "Starting...";
        aiStatus.className =
            "aiStatus starting";

        return;
    }

    aiStatus.textContent = "Offline";
    aiStatus.className =
        "aiStatus offline";
}

// ==========================================
// DISPLAY MESSAGE
// ==========================================

function addAIMessage(type, text) {

    if (!aiMessages) {
        return null;
    }

    const message =
        document.createElement("div");

    message.className =
        "aiMessage aiMessage-" + type;

    const name =
        document.createElement("div");

    name.className =
        "aiMessageName";

    if (type === "user") {

        name.textContent = "You";

    } else if (type === "assistant") {

        name.textContent =
            "🌴 Jungle Helper";

    } else {

        name.textContent =
            "System";
    }

    const content =
        document.createElement("div");

    content.className =
        "aiMessageText";

    content.textContent =
        text;

    message.appendChild(name);
    message.appendChild(content);

    aiMessages.appendChild(message);

    aiMessages.scrollTop =
        aiMessages.scrollHeight;

    return message;
}

// ==========================================
// ELECTRON STATUS EVENTS
// ==========================================

if (window.jungleAI) {

    window.jungleAI.onStatus((status) => {

        if (status === "started") {

            aiRunning = true;

            setAIStatus("Online");
        }

        if (status === "stopped") {

            aiRunning = false;

            setAIStatus("Offline");
        }
    });

    window.jungleAI.onOutput((text) => {

        if (!text) {
            return;
        }

        console.log(
            "[Jungle Helper]",
            text
        );
    });
}